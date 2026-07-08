import { describe, expect, it } from "vitest";
import { decodeSharedSource, encodeSharedSource } from "@/pages/lab/model/share/code-param";

describe("encodeSharedSource / decodeSharedSource", () => {
  it("往復させると元の文字列に戻る", () => {
    const source = "def add(a, b):\n    return a + b  # sum\n\nprint(add(1, 2))";
    expect(decodeSharedSource(encodeSharedSource(source))).toBe(source);
  });

  it("圧縮後の文字列は元よりURLに安全な文字だけで構成される", () => {
    const source = "x".repeat(200);
    const encoded = encodeSharedSource(source);
    expect(encoded).toMatch(/^[A-Za-z0-9+/=$-]*$/);
    expect(encoded.length).toBeLessThan(source.length);
  });

  it("空文字列も往復できる", () => {
    expect(decodeSharedSource(encodeSharedSource(""))).toBe("");
  });

  it("壊れた入力はnullを返す(例外を投げない)", () => {
    expect(decodeSharedSource("this is not valid lz-string data!!")).toBeNull();
    expect(decodeSharedSource("")).toBeNull();
  });

  it("マルチバイト文字(日本語)も正しく往復する", () => {
    const source = 'print("こんにちは!")';
    expect(decodeSharedSource(encodeSharedSource(source))).toBe(source);
  });
});
