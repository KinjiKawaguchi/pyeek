import { describe, expect, it } from "vitest";
import { buildTokenStageView } from "@/pages/lab/model/token-stage/token-view";
import type { Token } from "@/shared/api";

/**
 * テスト用トークン配列を生成する補助関数。
 * print(x) + y のようなシンプルな式に相当するトークンを構築する。
 */
function createTestTokens(): Token[] {
  return [
    // 1行目: print(x)
    {
      type: "NAME",
      exactType: "NAME",
      string: "print",
      start: [1, 0],
      end: [1, 5],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "OP",
      exactType: "LPAR",
      string: "(",
      start: [1, 5],
      end: [1, 6],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NAME",
      exactType: "NAME",
      string: "x",
      start: [1, 6],
      end: [1, 7],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "OP",
      exactType: "RPAR",
      string: ")",
      start: [1, 7],
      end: [1, 8],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NEWLINE",
      exactType: "NEWLINE",
      string: "",
      start: [1, 8],
      end: [1, 9],
      isKeyword: false,
      isSoftKeyword: false,
    },
    // 2行目: + y
    {
      type: "OP",
      exactType: "PLUS",
      string: "+",
      start: [2, 0],
      end: [2, 1],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NAME",
      exactType: "NAME",
      string: "y",
      start: [2, 2],
      end: [2, 3],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NEWLINE",
      exactType: "NEWLINE",
      string: "",
      start: [2, 3],
      end: [2, 4],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "ENDMARKER",
      exactType: "ENDMARKER",
      string: "",
      start: [3, 0],
      end: [3, 0],
      isKeyword: false,
      isSoftKeyword: false,
    },
  ];
}

/**
 * インデント・デデント・NLトークンを含むテスト配列を生成する。
 */
function createTestTokensWithStruct(): Token[] {
  return [
    {
      type: "NAME",
      exactType: "NAME",
      string: "if",
      start: [1, 0],
      end: [1, 2],
      isKeyword: true,
      isSoftKeyword: false,
    },
    {
      type: "NAME",
      exactType: "NAME",
      string: "True",
      start: [1, 3],
      end: [1, 7],
      isKeyword: true,
      isSoftKeyword: false,
    },
    {
      type: "OP",
      exactType: "COLON",
      string: ":",
      start: [1, 7],
      end: [1, 8],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NEWLINE",
      exactType: "NEWLINE",
      string: "",
      start: [1, 8],
      end: [1, 9],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "INDENT",
      exactType: "INDENT",
      string: "    ",
      start: [2, 0],
      end: [2, 4],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NAME",
      exactType: "NAME",
      string: "pass",
      start: [2, 4],
      end: [2, 8],
      isKeyword: true,
      isSoftKeyword: false,
    },
    {
      type: "NEWLINE",
      exactType: "NEWLINE",
      string: "",
      start: [2, 8],
      end: [2, 9],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "DEDENT",
      exactType: "DEDENT",
      string: "",
      start: [3, 0],
      end: [3, 0],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "ENDMARKER",
      exactType: "ENDMARKER",
      string: "",
      start: [3, 0],
      end: [3, 0],
      isKeyword: false,
      isSoftKeyword: false,
    },
  ];
}

/**
 * f-stringを含むトークン列を生成する。
 */
function createTestTokensWithFString(): Token[] {
  return [
    {
      type: "NAME",
      exactType: "NAME",
      string: "x",
      start: [1, 0],
      end: [1, 1],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "OP",
      exactType: "EQUAL",
      string: "=",
      start: [1, 2],
      end: [1, 3],
      isKeyword: false,
      isSoftKeyword: false,
    },
    // FSTRING 連鎖（これは実際のCPython 3.12+ の出力）
    {
      type: "FSTRING_START",
      exactType: "FSTRING_START",
      string: 'f"',
      start: [1, 4],
      end: [1, 6],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "FSTRING_MIDDLE",
      exactType: "FSTRING_MIDDLE",
      string: "hello ",
      start: [1, 6],
      end: [1, 12],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NAME",
      exactType: "NAME",
      string: "name",
      start: [1, 12],
      end: [1, 16],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "FSTRING_END",
      exactType: "FSTRING_END",
      string: '"',
      start: [1, 16],
      end: [1, 17],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "NEWLINE",
      exactType: "NEWLINE",
      string: "",
      start: [1, 17],
      end: [1, 18],
      isKeyword: false,
      isSoftKeyword: false,
    },
    {
      type: "ENDMARKER",
      exactType: "ENDMARKER",
      string: "",
      start: [2, 0],
      end: [2, 0],
      isKeyword: false,
      isSoftKeyword: false,
    },
  ];
}

describe("buildTokenStageView", () => {
  describe("構造トークンのフィルタリング", () => {
    it("mode='strict', showStruct=true のときすべてのトークンが表示される", () => {
      const tokens = createTestTokensWithStruct();
      const result = buildTokenStageView(tokens, "strict", true);

      // 構造トークン（INDENT, DEDENT）も含まれていることを確認
      const tokenTypes = result.rows.flatMap((row) => row.items.map((item) => item.token.type));
      expect(tokenTypes).toContain("INDENT");
      expect(tokenTypes).toContain("DEDENT");
    });

    it("mode='strict', showStruct=false のとき構造トークンが除外される", () => {
      const tokens = createTestTokensWithStruct();
      const result = buildTokenStageView(tokens, "strict", false);

      // 構造トークンが除外されていることを確認
      const tokenTypes = result.rows.flatMap((row) => row.items.map((item) => item.token.type));
      expect(tokenTypes).not.toContain("INDENT");
      expect(tokenTypes).not.toContain("DEDENT");
      expect(tokenTypes).toContain("NAME");
    });

    it("mode='easy' のときは showStruct の値に関わらず構造トークンが常に除外される", () => {
      const tokens = createTestTokensWithStruct();

      const resultShowTrue = buildTokenStageView(tokens, "easy", true);
      const resultShowFalse = buildTokenStageView(tokens, "easy", false);

      const typesShowTrue = resultShowTrue.rows.flatMap((row) =>
        row.items.map((item) => item.token.type),
      );
      const typesShowFalse = resultShowFalse.rows.flatMap((row) =>
        row.items.map((item) => item.token.type),
      );

      expect(typesShowTrue).not.toContain("INDENT");
      expect(typesShowTrue).not.toContain("DEDENT");
      expect(typesShowFalse).not.toContain("INDENT");
      expect(typesShowFalse).not.toContain("DEDENT");
      // 同じ結果になることを確認
      expect(typesShowTrue).toEqual(typesShowFalse);
    });
  });

  describe("行グループ化", () => {
    it("複数行にまたがるトークン列が token.start[0] 基準に正しく行ごとにグループ化される", () => {
      const tokens = createTestTokens();
      const result = buildTokenStageView(tokens, "strict", false);

      // rows は token.start[0]（行番号）でグループ化される
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]?.row).toBe(1);
      expect(result.rows[1]?.row).toBe(2);

      // 1行目: print, (, x, ), NEWLINE が含まれるはず
      const row1Types = result.rows[0]?.items.map((item) => item.token.type);
      expect(row1Types).toContain("NAME");
      expect(row1Types).toContain("OP");

      // 2行目: +, y, NEWLINE
      const row2Types = result.rows[1]?.items.map((item) => item.token.type);
      expect(row2Types).toContain("OP");
      expect(row2Types).toContain("NAME");
    });

    it("同じ行に複数のトークンがある場合、すべてが1つの TokenRow に含まれる", () => {
      const tokens = createTestTokens();
      const result = buildTokenStageView(tokens, "strict", false);

      // 1行目の items は複数である（print, (, x, ), NEWLINE）
      expect((result.rows[0]?.items.length ?? 0) > 1).toBe(true);
    });
  });

  describe("hint文字列", () => {
    it("strict モードでは「実際の tokenize 出力」という文言とトークン数を含む", () => {
      const tokens = createTestTokens();
      const result = buildTokenStageView(tokens, "strict", false);

      expect(result.hint).toContain("実際の tokenize 出力");
      expect(result.hint).toContain(`${tokens.length}`);
    });

    it("easy モードでは可視トークン数を含む文言になる", () => {
      const tokens = createTestTokens();
      const result = buildTokenStageView(tokens, "easy", false);

      // easy モードではNEWLINEやENDMARKERが除外されるため、可視トークン数は 9 以下
      const visibleCount = result.rows.flatMap((row) => row.items).length;
      expect(result.hint).toContain(`${visibleCount}個のかたまり`);
    });
  });

  describe("f-stringトークンの扱い", () => {
    it("mode='easy' でも FSTRING_* トークンは畳まれず、strict とトークン数が一致する", () => {
      const tokens = createTestTokensWithFString();

      const strictResult = buildTokenStageView(tokens, "strict", false);
      const easyResult = buildTokenStageView(tokens, "easy", false);

      // モードはラベル・表示上の違いのみを生み、実際のトークン構造は変えない
      expect(easyResult.tokens.length).toBe(strictResult.tokens.length);
      const easyHasFString = easyResult.tokens.some((t) => t.type.startsWith("FSTRING_"));
      expect(easyHasFString).toBe(true);
    });
  });

  describe("呼び出しハイライト対象", () => {
    it("関数呼び出しの呼び出し名+開き括弧に相当するインデックスが callHighlightIndexes に含まれる", () => {
      const tokens = createTestTokens();
      const result = buildTokenStageView(tokens, "strict", false);

      // print は index 0、( は index 1 なので、0 と 1 が callHighlightIndexes に含まれるはず
      expect(result.callHighlightIndexes.has(0)).toBe(true);
      expect(result.callHighlightIndexes.has(1)).toBe(true);
    });

    it("呼び出しがない入力では callHighlightIndexes は空集合になる", () => {
      const tokensNoCall: Token[] = [
        {
          type: "NAME",
          exactType: "NAME",
          string: "x",
          start: [1, 0],
          end: [1, 1],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "NEWLINE",
          exactType: "NEWLINE",
          string: "",
          start: [1, 1],
          end: [1, 2],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "ENDMARKER",
          exactType: "ENDMARKER",
          string: "",
          start: [2, 0],
          end: [2, 0],
          isKeyword: false,
          isSoftKeyword: false,
        },
      ];
      const result = buildTokenStageView(tokensNoCall, "strict", false);

      expect(result.callHighlightIndexes.size).toBe(0);
    });

    it("複数の関数呼び出しがある場合、すべてがハイライト対象に含まれる", () => {
      // print(...) と len(...) の2つの呼び出しを含むトークン列
      const tokensMultiCall: Token[] = [
        {
          type: "NAME",
          exactType: "NAME",
          string: "print",
          start: [1, 0],
          end: [1, 5],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "OP",
          exactType: "LPAR",
          string: "(",
          start: [1, 5],
          end: [1, 6],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "NAME",
          exactType: "NAME",
          string: "len",
          start: [1, 6],
          end: [1, 9],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "OP",
          exactType: "LPAR",
          string: "(",
          start: [1, 9],
          end: [1, 10],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "NAME",
          exactType: "NAME",
          string: "x",
          start: [1, 10],
          end: [1, 11],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "OP",
          exactType: "RPAR",
          string: ")",
          start: [1, 11],
          end: [1, 12],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "OP",
          exactType: "RPAR",
          string: ")",
          start: [1, 12],
          end: [1, 13],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "NEWLINE",
          exactType: "NEWLINE",
          string: "",
          start: [1, 13],
          end: [1, 14],
          isKeyword: false,
          isSoftKeyword: false,
        },
        {
          type: "ENDMARKER",
          exactType: "ENDMARKER",
          string: "",
          start: [2, 0],
          end: [2, 0],
          isKeyword: false,
          isSoftKeyword: false,
        },
      ];
      const result = buildTokenStageView(tokensMultiCall, "strict", false);

      // print (index 0) と ( (index 1)
      expect(result.callHighlightIndexes.has(0)).toBe(true);
      expect(result.callHighlightIndexes.has(1)).toBe(true);
      // len (index 2) と ( (index 3)
      expect(result.callHighlightIndexes.has(2)).toBe(true);
      expect(result.callHighlightIndexes.has(3)).toBe(true);
    });
  });
});
