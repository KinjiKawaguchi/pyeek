import { describe, expect, it } from "vitest";
import { moveCaret } from "@/pages/lab/model/editor/move-caret";

describe("moveCaret", () => {
  it("選択なしのカーソルを右に1つ進める", () => {
    const result = moveCaret("print(x)", { start: 2, end: 2 }, "right");
    expect(result).toEqual({ start: 3, end: 3 });
  });

  it("選択なしのカーソルを左に1つ戻す", () => {
    const result = moveCaret("print(x)", { start: 2, end: 2 }, "left");
    expect(result).toEqual({ start: 1, end: 1 });
  });

  it("先頭より左には進めない", () => {
    const result = moveCaret("print(x)", { start: 0, end: 0 }, "left");
    expect(result).toEqual({ start: 0, end: 0 });
  });

  it("末尾より右には進めない", () => {
    const value = "print(x)";
    const result = moveCaret(value, { start: value.length, end: value.length }, "right");
    expect(result).toEqual({ start: value.length, end: value.length });
  });

  it("選択がある状態で左を押すと選択の左端に潰す", () => {
    const result = moveCaret("foobar", { start: 1, end: 4 }, "left");
    expect(result).toEqual({ start: 1, end: 1 });
  });

  it("選択がある状態で右を押すと選択の右端に潰す", () => {
    const result = moveCaret("foobar", { start: 1, end: 4 }, "right");
    expect(result).toEqual({ start: 4, end: 4 });
  });
});
