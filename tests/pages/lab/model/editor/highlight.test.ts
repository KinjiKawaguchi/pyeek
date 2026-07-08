import { describe, expect, it } from "vitest";
import { buildHighlightSegments } from "@/pages/lab/model/editor/highlight";
import type { Token } from "@/shared/api";

function token(
  overrides: Partial<Token> & Pick<Token, "type" | "string" | "start" | "end">,
): Token {
  return {
    exactType: overrides.type,
    isKeyword: false,
    isSoftKeyword: false,
    ...overrides,
  };
}

describe("buildHighlightSegments", () => {
  it("空文字列はセグメントなし", () => {
    expect(buildHighlightSegments("", [])).toEqual([]);
  });

  it("トークンをカテゴリ別のセグメントに分割する", () => {
    const source = 'print("hi")';
    const tokens: Token[] = [
      token({ type: "NAME", string: "print", start: [1, 0], end: [1, 5] }),
      token({ type: "OP", exactType: "LPAR", string: "(", start: [1, 5], end: [1, 6] }),
      token({ type: "STRING", string: '"hi"', start: [1, 6], end: [1, 10] }),
      token({ type: "OP", exactType: "RPAR", string: ")", start: [1, 10], end: [1, 11] }),
    ];

    const segments = buildHighlightSegments(source, tokens);

    expect(segments).toEqual([
      { text: "print", category: "name" },
      { text: "(", category: "bracket" },
      { text: '"hi"', category: "string" },
      { text: ")", category: "bracket" },
    ]);
  });

  it("キーワードは isKeyword を優先してkeywordに分類する", () => {
    const tokens: Token[] = [
      token({ type: "NAME", string: "if", start: [1, 0], end: [1, 2], isKeyword: true }),
    ];
    expect(buildHighlightSegments("if", tokens)).toEqual([{ text: "if", category: "keyword" }]);
  });

  it("トークンに覆われない区間（空白等）はcategory: nullのまま残す", () => {
    const tokens: Token[] = [
      token({ type: "NAME", string: "a", start: [1, 0], end: [1, 1] }),
      token({ type: "NAME", string: "b", start: [1, 4], end: [1, 5] }),
    ];
    expect(buildHighlightSegments("a   b", tokens)).toEqual([
      { text: "a", category: "name" },
      { text: "   ", category: null },
      { text: "b", category: "name" },
    ]);
  });

  it("複数行にまたがる位置(row, col)を正しくオフセットに変換する", () => {
    const source = "a = 1\nb = 2";
    const tokens: Token[] = [
      token({ type: "NAME", string: "a", start: [1, 0], end: [1, 1] }),
      token({ type: "NUMBER", string: "1", start: [1, 4], end: [1, 5] }),
      token({ type: "NAME", string: "b", start: [2, 0], end: [2, 1] }),
      token({ type: "NUMBER", string: "2", start: [2, 4], end: [2, 5] }),
    ];
    const segments = buildHighlightSegments(source, tokens);
    expect(segments.map((s) => s.text).join("")).toBe(source);
    expect(segments.find((s) => s.text === "b")?.category).toBe("name");
    expect(segments.find((s) => s.text === "2")?.category).toBe("number");
  });

  it("ゼロ幅トークン(DEDENT等)は無視する", () => {
    const tokens: Token[] = [
      token({ type: "DEDENT", string: "", start: [1, 0], end: [1, 0] }),
      token({ type: "NAME", string: "a", start: [1, 0], end: [1, 1] }),
    ];
    expect(buildHighlightSegments("a", tokens)).toEqual([{ text: "a", category: "name" }]);
  });

  it("コメント・OP・NUMBERも正しく分類する", () => {
    const source = "x = 1 + 2  # add";
    const tokens: Token[] = [
      token({ type: "NAME", string: "x", start: [1, 0], end: [1, 1] }),
      token({ type: "OP", exactType: "EQUAL", string: "=", start: [1, 2], end: [1, 3] }),
      token({ type: "NUMBER", string: "1", start: [1, 4], end: [1, 5] }),
      token({ type: "OP", exactType: "PLUS", string: "+", start: [1, 6], end: [1, 7] }),
      token({ type: "NUMBER", string: "2", start: [1, 8], end: [1, 9] }),
      token({ type: "COMMENT", string: "# add", start: [1, 11], end: [1, 16] }),
    ];
    const segments = buildHighlightSegments(source, tokens);
    expect(segments.find((s) => s.text === "=")?.category).toBe("op");
    expect(segments.find((s) => s.text === "+")?.category).toBe("op");
    expect(segments.find((s) => s.text === "# add")?.category).toBe("comment");
  });
});
