import { describe, expect, it } from "vitest";
import { insertSnippet } from "@/pages/lab/model/editor/insert-snippet";

describe("insertSnippet", () => {
  it("カーソル位置にテキストを挿入し、カーソルを挿入直後に進める", () => {
    const result = insertSnippet("print()", { start: 6, end: 6 }, ":");
    expect(result.value).toBe("print(:)");
    expect(result.selection).toEqual({ start: 7, end: 7 });
  });

  it("選択範囲がある場合はその範囲を挿入テキストで置き換える", () => {
    const result = insertSnippet("foobar", { start: 0, end: 3 }, "(");
    expect(result.value).toBe("(bar");
    expect(result.selection).toEqual({ start: 1, end: 1 });
  });

  it("先頭への挿入を扱える", () => {
    const result = insertSnippet("x = 1", { start: 0, end: 0 }, "#");
    expect(result.value).toBe("#x = 1");
    expect(result.selection).toEqual({ start: 1, end: 1 });
  });

  it("末尾への挿入を扱える", () => {
    const result = insertSnippet("x = 1", { start: 5, end: 5 }, ",");
    expect(result.value).toBe("x = 1,");
    expect(result.selection).toEqual({ start: 6, end: 6 });
  });

  it("マルチバイト文字を含むソースでも文字コード単位のオフセットで正しく挿入する", () => {
    const value = 'x = "あ"';
    const insertAt = value.indexOf("あ");
    const result = insertSnippet(value, { start: insertAt, end: insertAt }, "_");
    expect(result.value).toBe('x = "_あ"');
    expect(result.selection).toEqual({ start: insertAt + 1, end: insertAt + 1 });
  });
});
