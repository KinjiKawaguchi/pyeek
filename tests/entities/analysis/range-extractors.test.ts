import { describe, expect, it } from "vitest";
import { astNodeRange, instrRange, tokenRange } from "@/entities/analysis/model/range-extractors";
import type { AstNode, Instr, Token } from "@/shared/api";

const TOKEN: Token = {
  type: "NUMBER",
  exactType: "NUMBER",
  string: "4",
  start: [1, 8],
  end: [1, 9],
  isKeyword: false,
  isSoftKeyword: false,
};

const AST_NODE: AstNode = {
  id: 1,
  type: "Constant",
  label: "Constant(value=4)",
  fields: { value: "4" },
  lineno: 1,
  colOffset: 8,
  endLineno: 1,
  endColOffset: 9,
  children: [],
};

const AST_NODE_NO_POS: AstNode = { ...AST_NODE, lineno: null };

function buildInstr(overrides: Partial<Instr>): Instr {
  return {
    offset: 0,
    opname: "LOAD_CONST",
    arg: 0,
    argrepr: "4",
    positions: { lineno: 1, endLineno: 1, colOffset: 8, endColOffset: 9 },
    isJumpTarget: false,
    isJump: false,
    stackEffect: 1,
    ...overrides,
  };
}

describe("tokenRange", () => {
  it("トークンの start/end をそのまま範囲にする", () => {
    expect(tokenRange(TOKEN)).toEqual({ start: [1, 8], end: [1, 9] });
  });
});

describe("astNodeRange", () => {
  it("位置情報が揃っていれば範囲を返す", () => {
    expect(astNodeRange(AST_NODE)).toEqual({ start: [1, 8], end: [1, 9] });
  });

  it("位置情報が欠けていれば null（Store/Add 等の合成ノード）", () => {
    expect(astNodeRange(AST_NODE_NO_POS)).toBeNull();
  });
});

describe("instrRange", () => {
  it("positions があれば範囲を返す", () => {
    expect(instrRange(buildInstr({}))).toEqual({ start: [1, 8], end: [1, 9] });
  });

  it("positions が null なら null", () => {
    expect(instrRange(buildInstr({ positions: null }))).toBeNull();
  });

  it("lineno=0 は合成命令（RESUME 等）としてリンク対象外", () => {
    expect(
      instrRange(
        buildInstr({ positions: { lineno: 0, endLineno: 0, colOffset: 0, endColOffset: 0 } }),
      ),
    ).toBeNull();
  });
});
