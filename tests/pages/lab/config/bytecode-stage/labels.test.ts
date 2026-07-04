import { describe, expect, it } from "vitest";
import { easyOpLabel } from "@/pages/lab/config/bytecode-stage/labels";

describe("easyOpLabel", () => {
  describe("登録済みの opname に対して正しい日本語ラベルを返すこと", () => {
    it("LOAD_FAST → '変数を読む'", () => {
      expect(easyOpLabel("LOAD_FAST")).toBe("変数を読む");
    });

    it("CALL → '呼び出す'", () => {
      expect(easyOpLabel("CALL")).toBe("呼び出す");
    });

    it("RETURN_VALUE → '値をかえす'", () => {
      expect(easyOpLabel("RETURN_VALUE")).toBe("値をかえす");
    });

    it("LOAD_CONST → '値を積む'", () => {
      expect(easyOpLabel("LOAD_CONST")).toBe("値を積む");
    });

    it("STORE_FAST → '変数に代入'", () => {
      expect(easyOpLabel("STORE_FAST")).toBe("変数に代入");
    });

    it("FOR_ITER → '次の値を取り出す'", () => {
      expect(easyOpLabel("FOR_ITER")).toBe("次の値を取り出す");
    });

    it("JUMP_FORWARD → '先へ進む'", () => {
      expect(easyOpLabel("JUMP_FORWARD")).toBe("先へ進む");
    });

    it("BUILD_LIST → 'リストを作る'", () => {
      expect(easyOpLabel("BUILD_LIST")).toBe("リストを作る");
    });

    it("COMPARE_OP → '比較する'", () => {
      expect(easyOpLabel("COMPARE_OP")).toBe("比較する");
    });

    it("MAKE_FUNCTION → '関数を作る'", () => {
      expect(easyOpLabel("MAKE_FUNCTION")).toBe("関数を作る");
    });
  });

  describe("未登録の opname に対してフォールバック（元の opname）を返すこと", () => {
    it("存在しないダミー opname → そのまま返す", () => {
      expect(easyOpLabel("UNKNOWN_OPCODE")).toBe("UNKNOWN_OPCODE");
    });

    it("別のダミー opname → そのまま返す", () => {
      expect(easyOpLabel("FAKE_INSTRUCTION")).toBe("FAKE_INSTRUCTION");
    });

    it("小文字の opname → そのまま返す", () => {
      expect(easyOpLabel("load_const")).toBe("load_const");
    });

    it("空文字列 → 空文字列をそのまま返す", () => {
      expect(easyOpLabel("")).toBe("");
    });
  });
});
