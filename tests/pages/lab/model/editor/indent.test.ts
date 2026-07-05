import { describe, expect, it } from "vitest";
import { insertNewlineWithIndent, insertTab, outdentLines } from "@/pages/lab/model/editor/indent";

describe("insertTab", () => {
  it("選択なしのカーソル位置に4スペースを挿入する", () => {
    const result = insertTab("print(x)", { start: 0, end: 0 });
    expect(result.value).toBe("    print(x)");
    expect(result.selection).toEqual({ start: 4, end: 4 });
  });

  it("1行内の選択（複数行にまたがらない）はインデントで置き換える", () => {
    const result = insertTab("foobar", { start: 0, end: 3 });
    expect(result.value).toBe("    bar");
    expect(result.selection).toEqual({ start: 4, end: 4 });
  });

  it("複数行にまたがる選択は各行の先頭にインデントを追加する", () => {
    const value = "if x:\n    a\n    b";
    // "if x:" の途中(index2)から2行目の"a"の手前(index9)までの選択。
    // 3行目には選択が及ばないので3行目は変化しない。
    const result = insertTab(value, { start: 2, end: 9 });
    expect(result.value).toBe("    if x:\n        a\n    b");
  });

  it("複数行選択後のselectionは追加された分だけ伸びる", () => {
    const value = "a\nb\nc";
    const result = insertTab(value, { start: 0, end: value.length });
    expect(result.value).toBe("    a\n    b\n    c");
    expect(result.selection).toEqual({ start: 4, end: value.length + 4 * 3 });
  });
});

describe("outdentLines", () => {
  it("先頭に4スペースある行から4スペース分を除去する", () => {
    const result = outdentLines("    print(x)", { start: 4, end: 4 });
    expect(result.value).toBe("print(x)");
  });

  it("先頭のスペースが4未満ならある分だけ除去する", () => {
    const result = outdentLines("  print(x)", { start: 2, end: 2 });
    expect(result.value).toBe("print(x)");
  });

  it("先頭にタブがあれば1文字だけ除去する", () => {
    const result = outdentLines("\tprint(x)", { start: 1, end: 1 });
    expect(result.value).toBe("print(x)");
  });

  it("インデントが無い行は変化しない", () => {
    const result = outdentLines("print(x)", { start: 0, end: 0 });
    expect(result.value).toBe("print(x)");
    expect(result.selection).toEqual({ start: 0, end: 0 });
  });

  it("複数行の選択はそれぞれの行から除去する", () => {
    const value = "    a\n    b\n    c";
    const result = outdentLines(value, { start: 0, end: value.length });
    expect(result.value).toBe("a\nb\nc");
  });

  it("selectionは除去した幅だけ手前に詰める（行頭より手前にはしない）", () => {
    const result = outdentLines("    x", { start: 4, end: 5 });
    expect(result.selection).toEqual({ start: 0, end: 1 });
  });
});

describe("insertNewlineWithIndent", () => {
  it("インデントのない行の後は同じインデント（なし）で改行する", () => {
    const result = insertNewlineWithIndent("print(x)", { start: 8, end: 8 });
    expect(result.value).toBe("print(x)\n");
    expect(result.selection).toEqual({ start: 9, end: 9 });
  });

  it("インデントのある行の後は同じインデントを引き継ぐ", () => {
    const value = "if True:\n    a";
    const result = insertNewlineWithIndent(value, { start: value.length, end: value.length });
    expect(result.value).toBe("if True:\n    a\n    ");
  });

  it("行末が':'で終わるときは1段深いインデントを追加する", () => {
    const result = insertNewlineWithIndent("if True:", { start: 8, end: 8 });
    expect(result.value).toBe("if True:\n    ");
    expect(result.selection).toEqual({ start: 13, end: 13 });
  });

  it("ネストしたブロックでは既存インデント+1段になる", () => {
    const value = "if True:\n    if False:";
    const result = insertNewlineWithIndent(value, { start: value.length, end: value.length });
    expect(result.value).toBe("if True:\n    if False:\n        ");
  });

  it("選択範囲があるときはその範囲を改行+インデントで置き換える", () => {
    const value = "if x:\n    old";
    const start = value.indexOf("old");
    const result = insertNewlineWithIndent(value, { start, end: value.length });
    expect(result.value).toBe("if x:\n    \n    ");
  });

  it("カーソルが行の途中にあるとき、末尾ではなくカーソル位置までの内容で判定する", () => {
    // カーソル直前が ':' でなければブロック開始とは判定しない
    const value = "x = 1:extra";
    const result = insertNewlineWithIndent(value, { start: 5, end: 5 });
    expect(result.value).toBe("x = 1\n:extra");
  });
});
