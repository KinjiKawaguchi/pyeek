import { describe, expect, it } from "vitest";
import { astEasyLabel } from "@/pages/lab/config/ast-stage/labels";
import type { AstNode } from "@/shared/api";

// テスト用のダミー AstNode を生成するヘルパー関数
function createNode(type: string): AstNode {
  return {
    id: 1,
    type,
    label: "",
    fields: {},
    lineno: null,
    colOffset: null,
    endLineno: null,
    endColOffset: null,
    children: [],
  };
}

describe("astEasyLabel", () => {
  describe("登録済みの型に対して正しい日本語ラベルを返すこと", () => {
    it("Module → 'プログラム全体'", () => {
      const node = createNode("Module");
      expect(astEasyLabel(node)).toBe("プログラム全体");
    });

    it("If → 'もし〜なら'", () => {
      const node = createNode("If");
      expect(astEasyLabel(node)).toBe("もし〜なら");
    });

    it("FunctionDef → '関数の定義'", () => {
      const node = createNode("FunctionDef");
      expect(astEasyLabel(node)).toBe("関数の定義");
    });

    it("For → 'くり返し(for)'", () => {
      const node = createNode("For");
      expect(astEasyLabel(node)).toBe("くり返し(for)");
    });

    it("Call → '呼び出し'", () => {
      const node = createNode("Call");
      expect(astEasyLabel(node)).toBe("呼び出し");
    });

    it("Return → 'かえす'", () => {
      const node = createNode("Return");
      expect(astEasyLabel(node)).toBe("かえす");
    });

    it("Assign → '代入'", () => {
      const node = createNode("Assign");
      expect(astEasyLabel(node)).toBe("代入");
    });

    it("ClassDef → 'クラスの定義'", () => {
      const node = createNode("ClassDef");
      expect(astEasyLabel(node)).toBe("クラスの定義");
    });

    it("BinOp → '計算'", () => {
      const node = createNode("BinOp");
      expect(astEasyLabel(node)).toBe("計算");
    });

    it("Name → 'なまえ'", () => {
      const node = createNode("Name");
      expect(astEasyLabel(node)).toBe("なまえ");
    });
  });

  describe("未登録の型に対してフォールバック（元の型名）を返すこと", () => {
    it("存在しないダミー型 → そのまま返す", () => {
      const node = createNode("DummyUnknownType");
      expect(astEasyLabel(node)).toBe("DummyUnknownType");
    });

    it("別のダミー型 → そのまま返す", () => {
      const node = createNode("FakeCustomNode");
      expect(astEasyLabel(node)).toBe("FakeCustomNode");
    });

    it("空文字列型 → 空文字列をそのまま返す", () => {
      const node = createNode("");
      expect(astEasyLabel(node)).toBe("");
    });
  });
});
