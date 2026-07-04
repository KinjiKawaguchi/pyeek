import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { groupInstructionsByLine } from "@/pages/lab/model/bytecode-stage/instr-view";
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

describe("groupInstructionsByLine", () => {
  it("for ループのように同じ行番号が非連続に現れる場合、別グループにする", () => {
    // for_loop.json: L1(for文の準備) → L2(print(i)) → L1(END_FOR/RETURN_CONST) の3グループ
    const bytecode = loadBytecode("for_loop");
    const groups = groupInstructionsByLine(bytecode.instructions);

    const lines = groups.map((g) => g.line);
    expect(lines).toEqual([0, 1, 2, 1]);
    // 4番目のグループ(L1再出現)は最初のL1グループと別オブジェクト
    expect(groups[1]).not.toBe(groups[3]);
  });

  it("連続する同じ行番号は1グループにまとめる", () => {
    const bytecode = loadBytecode("call"); // print("hi")
    const groups = groupInstructionsByLine(bytecode.instructions);
    const line1Groups = groups.filter((g) => g.line === 1);
    expect(line1Groups).toHaveLength(1);
    expect(line1Groups[0]?.items.length).toBeGreaterThan(1);
  });

  it("positions が無い命令は line=null としてグループ化する", () => {
    const groups = groupInstructionsByLine([
      {
        offset: 0,
        opname: "RESUME",
        arg: 0,
        argrepr: "",
        positions: null,
        isJumpTarget: false,
        isJump: false,
        stackEffect: 0,
      },
    ]);
    expect(groups).toEqual([
      {
        line: null,
        items: [
          {
            instr: expect.objectContaining({ opname: "RESUME" }),
            index: 0,
          },
        ],
      },
    ]);
  });
});
