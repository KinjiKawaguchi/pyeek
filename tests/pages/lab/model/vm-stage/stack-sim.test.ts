import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { simulateStack } from "@/pages/lab/model/vm-stage/stack-sim";
import type { CodeObj, Instr } from "@/shared/api";

const SNAPSHOT_DIR = path.resolve(__dirname, "../../../../python/snapshots");

function loadBytecode(name: string): CodeObj {
  const raw = readFileSync(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
  const bytecode = (JSON.parse(raw) as { bytecode: CodeObj | null }).bytecode;
  if (!bytecode) {
    throw new Error(`${name} の bytecode が null`);
  }
  return bytecode;
}

function labelsOf(stack: { label: string }[]): string[] {
  return stack.map((item) => item.label);
}

// n = 4 / total = 2 + 3 * n の期待ステップ列。
// 受け入れ基準: 2 → 3 → 4(nの値) → 12(3*n) → 14(2+12) と再生されること。
describe("simulateStack", () => {
  const bytecode = loadBytecode("vm_demo");
  const result = simulateStack(bytecode.instructions);

  it("ジャンプの無いコードは ok:true を返す", () => {
    expect(result.ok).toBe(true);
  });

  it("命令ごとのスタック内容が期待どおりに推移する", () => {
    if (!result.ok) {
      throw new Error("simulateStack が失敗した");
    }
    const stacksAfter = result.steps.map((step) => labelsOf(step.stackAfter));
    expect(stacksAfter).toEqual([
      [], // RESUME
      ["4"], // LOAD_CONST 4
      [], // STORE_NAME n (n=4を記録)
      ["2"], // LOAD_CONST 2
      ["2", "3"], // LOAD_CONST 3
      ["2", "3", "4"], // LOAD_NAME n → 記録済みの値 4 を積む
      ["2", "12"], // BINARY_OP * → 3 * 4 をその場で畳む
      ["14"], // BINARY_OP + → 2 + 12 をその場で畳む
      [], // STORE_NAME total
      [], // RETURN_CONST
    ]);
  });

  it("STORE_NAME で記録した値は後続の LOAD_NAME で解決される", () => {
    if (!result.ok) {
      throw new Error("simulateStack が失敗した");
    }
    const loadNStep = result.steps.find(
      (step) => step.instr.opname === "LOAD_NAME" && step.instr.argrepr === "n",
    );
    expect(loadNStep && labelsOf(loadNStep.stackAfter)).toEqual(["2", "3", "4"]);
  });
});

describe("simulateStack の for ループ再生", () => {
  const bytecode = loadBytecode("for_loop"); // for i in range(3): print(i)
  const result = simulateStack(bytecode.instructions);

  it("最後まで再生できる(ok:true)", () => {
    expect(result.ok).toBe(true);
  });

  it("FOR_ITER が3回値を取り出し、4回目で尽きてジャンプする", () => {
    if (!result.ok) throw new Error("simulateStack が失敗した");
    const forIterSteps = result.steps.filter((step) => step.instr.opname === "FOR_ITER");
    expect(forIterSteps).toHaveLength(4);
    expect(forIterSteps.slice(0, 3).map((step) => step.jump?.taken)).toEqual([false, false, false]);
    expect(forIterSteps[3]?.jump?.taken).toBe(true);
    // 取り出された値は 0, 1, 2(range(3))。
    const yieldedLabels = forIterSteps.slice(0, 3).map((step) => {
      const pushed = step.stackAfter.at(-1);
      return pushed?.label;
    });
    expect(yieldedLabels).toEqual(["0", "1", "2"]);
  });

  it("JUMP_BACKWARD が周回数を1→2→3と進める", () => {
    if (!result.ok) throw new Error("simulateStack が失敗した");
    const iterations = result.steps
      .filter((step) => step.instr.opname === "JUMP_BACKWARD")
      .map((step) => step.iteration);
    expect(iterations).toEqual([1, 2, 3]);
  });

  it("最終的にスタックが空になり、途中で打ち切られない", () => {
    if (!result.ok) throw new Error("simulateStack が失敗した");
    expect(result.truncated).toBe(false);
    expect(result.steps.at(-1)?.stackAfter).toEqual([]);
  });
});

describe("simulateStack の while ループ再生", () => {
  it("i < 3 が偽になるまで実行し、最後まで再生できる", () => {
    const bytecode = loadBytecode("while_loop"); // i=0; while i<3: i=i+1
    const result = simulateStack(bytecode.instructions);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const iterations = result.steps
      .filter((step) => step.instr.opname === "JUMP_BACKWARD")
      .map((step) => step.iteration);
    expect(iterations).toEqual([1, 2]);
    expect(result.truncated).toBe(false);
  });
});

describe("simulateStack の不明な分岐/イテラブル", () => {
  it("walrus(len(data)の真偽が不明)は opaque-branch で拒否する", () => {
    const bytecode = loadBytecode("walrus"); // if x := len(data): print(x)
    const result = simulateStack(bytecode.instructions);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("opaque-branch");
  });
});

describe("simulateStack のステップ上限", () => {
  function buildInfiniteLoop(): Instr[] {
    const base = {
      arg: null,
      positions: null,
      stackEffect: 0,
    };
    return [
      {
        ...base,
        offset: 0,
        opname: "RESUME",
        argrepr: "",
        isJumpTarget: false,
        isJump: false,
        jumpTarget: null,
      },
      {
        ...base,
        offset: 2,
        opname: "JUMP_BACKWARD",
        argrepr: "to 2",
        isJumpTarget: true,
        isJump: true,
        jumpTarget: 2,
      },
    ];
  }

  it("while True: pass のような無限ループは既定256ステップで打ち切る", () => {
    const result = simulateStack(buildInfiniteLoop());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.truncated).toBe(true);
    expect(result.steps).toHaveLength(256);
  });

  it("maxSteps を指定すればその件数で打ち切る", () => {
    const result = simulateStack(buildInfiniteLoop(), { maxSteps: 10 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.truncated).toBe(true);
    expect(result.steps).toHaveLength(10);
  });
});
