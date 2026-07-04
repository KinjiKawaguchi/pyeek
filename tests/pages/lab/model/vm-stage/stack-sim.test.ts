import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { simulateStack } from "@/pages/lab/model/vm-stage/stack-sim";
import type { CodeObj } from "@/shared/api";

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

describe("simulateStack のジャンプガード", () => {
  it("for ループのように isJump/isJumpTarget を含む場合は ok:false", () => {
    const bytecode = loadBytecode("for_loop");
    const result = simulateStack(bytecode.instructions);
    expect(result).toEqual({ ok: false, reason: "jump" });
  });
});
