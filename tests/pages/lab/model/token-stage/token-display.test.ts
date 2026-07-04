import { describe, expect, it } from "vitest";
import {
  chipTypeLabel,
  formatPos,
  isBracket,
  isStructToken,
  showValue,
  visualClass,
} from "@/pages/lab/model/token-stage/token-display";
import type { Token } from "@/shared/api";

/**
 * トークンを生成する補助関数。
 */
function makeToken(overrides: Partial<Token>): Token {
  return {
    type: "NAME",
    exactType: "NAME",
    string: "x",
    start: [1, 0],
    end: [1, 1],
    isKeyword: false,
    isSoftKeyword: false,
    ...overrides,
  };
}

describe("isStructToken", () => {
  it("NEWLINE は構造トークン", () => {
    expect(isStructToken(makeToken({ type: "NEWLINE" }))).toBe(true);
  });

  it("NL は構造トークン", () => {
    expect(isStructToken(makeToken({ type: "NL" }))).toBe(true);
  });

  it("INDENT は構造トークン", () => {
    expect(isStructToken(makeToken({ type: "INDENT" }))).toBe(true);
  });

  it("DEDENT は構造トークン", () => {
    expect(isStructToken(makeToken({ type: "DEDENT" }))).toBe(true);
  });

  it("ENDMARKER は構造トークン", () => {
    expect(isStructToken(makeToken({ type: "ENDMARKER" }))).toBe(true);
  });

  it("NAME は構造トークンではない", () => {
    expect(isStructToken(makeToken({ type: "NAME" }))).toBe(false);
  });

  it("OP は構造トークンではない", () => {
    expect(isStructToken(makeToken({ type: "OP" }))).toBe(false);
  });

  it("NUMBER は構造トークンではない", () => {
    expect(isStructToken(makeToken({ type: "NUMBER" }))).toBe(false);
  });

  it("STRING は構造トークンではない", () => {
    expect(isStructToken(makeToken({ type: "STRING" }))).toBe(false);
  });
});

describe("isBracket", () => {
  it("( はかっこ", () => {
    expect(isBracket("(")).toBe(true);
  });

  it(") はかっこ", () => {
    expect(isBracket(")")).toBe(true);
  });

  it("[ はかっこ", () => {
    expect(isBracket("[")).toBe(true);
  });

  it("] はかっこ", () => {
    expect(isBracket("]")).toBe(true);
  });

  it("{ はかっこ", () => {
    expect(isBracket("{")).toBe(true);
  });

  it("} はかっこ", () => {
    expect(isBracket("}")).toBe(true);
  });

  it("+ はかっこではない", () => {
    expect(isBracket("+")).toBe(false);
  });

  it("= はかっこではない", () => {
    expect(isBracket("=")).toBe(false);
  });

  it(": はかっこではない", () => {
    expect(isBracket(":")).toBe(false);
  });
});

describe("visualClass", () => {
  it("OP+括弧文字列は 'BRACKET'", () => {
    expect(visualClass(makeToken({ type: "OP", string: "(" }), "strict")).toBe("BRACKET");
    expect(visualClass(makeToken({ type: "OP", string: ")" }), "strict")).toBe("BRACKET");
    expect(visualClass(makeToken({ type: "OP", string: "[" }), "easy")).toBe("BRACKET");
    expect(visualClass(makeToken({ type: "OP", string: "{" }), "easy")).toBe("BRACKET");
  });

  it("OP+非括弧は 'OP'", () => {
    expect(visualClass(makeToken({ type: "OP", string: "+" }), "strict")).toBe("OP");
    expect(visualClass(makeToken({ type: "OP", string: "=" }), "strict")).toBe("OP");
    expect(visualClass(makeToken({ type: "OP", string: ":" }), "easy")).toBe("OP");
  });

  it("mode='easy' かつ isKeyword=true の NAME は 'KEYWORD'", () => {
    expect(visualClass(makeToken({ type: "NAME", isKeyword: true }), "easy")).toBe("KEYWORD");
  });

  it("mode='strict' かつ isKeyword=true の NAME は 'NAME'（キーワード判定がない）", () => {
    expect(visualClass(makeToken({ type: "NAME", isKeyword: true }), "strict")).toBe("NAME");
  });

  it("構造トークンは 'STRUCT'", () => {
    expect(visualClass(makeToken({ type: "NEWLINE" }), "strict")).toBe("STRUCT");
    expect(visualClass(makeToken({ type: "INDENT" }), "easy")).toBe("STRUCT");
    expect(visualClass(makeToken({ type: "DEDENT" }), "strict")).toBe("STRUCT");
  });

  it("それ以外は token.type そのもの", () => {
    expect(visualClass(makeToken({ type: "NUMBER" }), "strict")).toBe("NUMBER");
    expect(visualClass(makeToken({ type: "STRING" }), "easy")).toBe("STRING");
    expect(visualClass(makeToken({ type: "COMMENT" }), "strict")).toBe("COMMENT");
  });
});

describe("chipTypeLabel", () => {
  describe("easy モード", () => {
    it("OP+括弧は 'かっこ'", () => {
      expect(chipTypeLabel(makeToken({ type: "OP", string: "(" }), "easy")).toBe("かっこ");
      expect(chipTypeLabel(makeToken({ type: "OP", string: ")" }), "easy")).toBe("かっこ");
      expect(chipTypeLabel(makeToken({ type: "OP", string: "[" }), "easy")).toBe("かっこ");
    });

    it("OP+非括弧は 'きごう'", () => {
      expect(chipTypeLabel(makeToken({ type: "OP", string: "+" }), "easy")).toBe("きごう");
      expect(chipTypeLabel(makeToken({ type: "OP", string: "=" }), "easy")).toBe("きごう");
      expect(chipTypeLabel(makeToken({ type: "OP", string: ":" }), "easy")).toBe("きごう");
    });

    it("NAME は 'なまえ'", () => {
      expect(
        chipTypeLabel(makeToken({ type: "NAME", string: "x", isKeyword: false }), "easy"),
      ).toBe("なまえ");
    });

    it("NUMBER は 'すうじ'", () => {
      expect(chipTypeLabel(makeToken({ type: "NUMBER" }), "easy")).toBe("すうじ");
    });

    it("STRING は 'もじれつ'", () => {
      expect(chipTypeLabel(makeToken({ type: "STRING" }), "easy")).toBe("もじれつ");
    });

    it("COMMENT は 'コメント'", () => {
      expect(chipTypeLabel(makeToken({ type: "COMMENT" }), "easy")).toBe("コメント");
    });

    it("isKeyword=true の NAME は 'キーワード'", () => {
      expect(chipTypeLabel(makeToken({ type: "NAME", isKeyword: true }), "easy")).toBe(
        "キーワード",
      );
    });

    it("未知の型は token.type そのまま", () => {
      expect(chipTypeLabel(makeToken({ type: "UNKNOWN_TYPE" }), "easy")).toBe("UNKNOWN_TYPE");
    });
  });

  describe("strict モード", () => {
    it("OP は exactType を返す", () => {
      expect(
        chipTypeLabel(makeToken({ type: "OP", exactType: "LPAR", string: "(" }), "strict"),
      ).toBe("LPAR");
      expect(
        chipTypeLabel(makeToken({ type: "OP", exactType: "PLUS", string: "+" }), "strict"),
      ).toBe("PLUS");
      expect(
        chipTypeLabel(makeToken({ type: "OP", exactType: "EQUAL", string: "=" }), "strict"),
      ).toBe("EQUAL");
    });

    it("それ以外は type を返す", () => {
      expect(chipTypeLabel(makeToken({ type: "NAME" }), "strict")).toBe("NAME");
      expect(chipTypeLabel(makeToken({ type: "NUMBER" }), "strict")).toBe("NUMBER");
      expect(chipTypeLabel(makeToken({ type: "STRING" }), "strict")).toBe("STRING");
      expect(chipTypeLabel(makeToken({ type: "NEWLINE" }), "strict")).toBe("NEWLINE");
    });
  });
});

describe("showValue", () => {
  it("INDENT: タブは → に置換", () => {
    expect(showValue(makeToken({ type: "INDENT", string: "\t\t" }))).toBe("→→");
  });

  it("INDENT: スペースは · に置換", () => {
    expect(showValue(makeToken({ type: "INDENT", string: "    " }))).toBe("····");
  });

  it("INDENT: 空文字列は · になる", () => {
    expect(showValue(makeToken({ type: "INDENT", string: "" }))).toBe("·");
  });

  it("INDENT: タブとスペースの混在", () => {
    expect(showValue(makeToken({ type: "INDENT", string: "\t  " }))).toBe("→··");
  });

  it("NEWLINE: 空文字列は ∅", () => {
    expect(showValue(makeToken({ type: "NEWLINE", string: "" }))).toBe("∅");
  });

  it("NEWLINE: 空でなければ ⏎", () => {
    expect(showValue(makeToken({ type: "NEWLINE", string: "\n" }))).toBe("⏎");
  });

  it("NL: 常に ⏎", () => {
    expect(showValue(makeToken({ type: "NL", string: "\n" }))).toBe("⏎");
    expect(showValue(makeToken({ type: "NL", string: "" }))).toBe("⏎");
  });

  it("DEDENT: 常に ∅", () => {
    expect(showValue(makeToken({ type: "DEDENT", string: "" }))).toBe("∅");
    expect(showValue(makeToken({ type: "DEDENT", string: "x" }))).toBe("∅");
  });

  it("ENDMARKER: 常に ∅", () => {
    expect(showValue(makeToken({ type: "ENDMARKER", string: "" }))).toBe("∅");
    expect(showValue(makeToken({ type: "ENDMARKER", string: "x" }))).toBe("∅");
  });

  it("それ以外: 改行文字を変換（\\n → ⏎, \\r は削除, \\t → →）", () => {
    expect(showValue(makeToken({ type: "NAME", string: "hello" }))).toBe("hello");
    expect(showValue(makeToken({ type: "STRING", string: "line1\nline2" }))).toBe("line1⏎line2");
    expect(showValue(makeToken({ type: "STRING", string: "text\r\n" }))).toBe("text⏎");
    expect(showValue(makeToken({ type: "NAME", string: "tab\there" }))).toBe("tab→here");
  });
});

describe("formatPos", () => {
  it("基本形式: 'row:col–row:col'", () => {
    expect(formatPos(makeToken({ start: [1, 0], end: [1, 5] }))).toBe("1:0–1:5");
  });

  it("複数行の場合も同じ形式", () => {
    expect(formatPos(makeToken({ start: [1, 0], end: [3, 10] }))).toBe("1:0–3:10");
  });

  it("同じ位置の場合", () => {
    expect(formatPos(makeToken({ start: [2, 5], end: [2, 5] }))).toBe("2:5–2:5");
  });

  it("大きい行番号・列番号", () => {
    expect(formatPos(makeToken({ start: [100, 50], end: [101, 30] }))).toBe("100:50–101:30");
  });
});
