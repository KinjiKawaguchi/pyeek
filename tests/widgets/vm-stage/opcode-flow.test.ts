import { describe, expect, it } from "vitest";
import type { Instr } from "@/shared/api";
import { decomposeInstr } from "@/widgets/vm-stage/model/opcode-flow";

function buildInstr(overrides: Partial<Instr>): Instr {
  return {
    offset: 0,
    opname: "NOP",
    arg: null,
    argrepr: "",
    positions: null,
    isJumpTarget: false,
    isJump: false,
    stackEffect: 0,
    ...overrides,
  };
}

const identity = (name: string) => name;

describe("decomposeInstr", () => {
  it("LOAD_CONST は値をそのまま積む", () => {
    const op = decomposeInstr(buildInstr({ opname: "LOAD_CONST", argrepr: "4" }), identity);
    expect(op.pop).toBe(0);
    expect(op.push([])).toEqual(["4"]);
  });

  it("BINARY_OP は数値同士ならその場で畳んで1つ積む", () => {
    const op = decomposeInstr(buildInstr({ opname: "BINARY_OP", argrepr: "*" }), identity);
    expect(op.pop).toBe(2);
    expect(op.push(["3", "4"])).toEqual(["12"]);
  });

  it("BINARY_OP は片方が変数名なら式のまま表示する", () => {
    const op = decomposeInstr(buildInstr({ opname: "BINARY_OP", argrepr: "+" }), identity);
    expect(op.push(["2", "x"])).toEqual(["2 + x"]);
  });

  it("STORE_NAME は1つpopし、代入先の名前を storesTo に記録する", () => {
    const op = decomposeInstr(buildInstr({ opname: "STORE_NAME", argrepr: "total" }), identity);
    expect(op.pop).toBe(1);
    expect(op.push(["14"])).toEqual([]);
    expect(op.storesTo).toBe("total");
  });

  it("LOAD_NAME は resolveName を経由して値を積む", () => {
    const op = decomposeInstr(buildInstr({ opname: "LOAD_NAME", argrepr: "n" }), (name) =>
      name === "n" ? "4" : name,
    );
    expect(op.push([])).toEqual(["4"]);
  });

  it("LOAD_GLOBAL は arg の最下位ビットが立っていると空き皿も積む", () => {
    const op = decomposeInstr(
      buildInstr({ opname: "LOAD_GLOBAL", argrepr: "print", arg: 1 }),
      identity,
    );
    expect(op.push([])).toEqual(["（空き皿）", "print"]);
  });

  it("CALL は引数の数+2(空き皿・呼び出し対象)をpopする", () => {
    const op = decomposeInstr(buildInstr({ opname: "CALL", arg: 1 }), identity);
    expect(op.pop).toBe(3);
  });

  it("未知の opname は stackEffect にフォールバックする", () => {
    const op = decomposeInstr(buildInstr({ opname: "SOME_FUTURE_OP", stackEffect: 1 }), identity);
    expect(op.pop).toBe(0);
    expect(op.push([])).toEqual(["？"]);
  });
});
