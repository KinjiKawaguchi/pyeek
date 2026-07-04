/**
 * リファレンスインデックス全種別の回帰テスト
 * トークン・AST・オペコードそれぞれの完全性と一貫性を検証
 */

import { describe, expect, it } from "vitest";
import {
  AST_REFERENCE_ALL,
  type AstReference,
  findAstReference,
  getAllAstNodesFlat,
} from "@/pages/lab/config/ast-stage/ast-reference-index";
import {
  findOpcodeReference,
  getAllOpcodesFlat,
  OPCODE_REFERENCE_ALL,
  type OpcodeReference,
} from "@/pages/lab/config/bytecode-stage/opcode-reference-index";
import {
  findTokenReference,
  getAllTokensFlat,
  TOKEN_REFERENCE_ALL,
  type TokenReference,
} from "@/pages/lab/config/token-stage/token-reference-index";

/**
 * トークンリファレンスの完全性と一貫性を検証
 */
describe("Token Reference Coverage", () => {
  let allTokens: TokenReference[];

  // テスト前の準備
  describe("Setup", () => {
    it("getAllTokensFlat() から全トークンを取得", () => {
      allTokens = getAllTokensFlat();
      expect(allTokens).toBeDefined();
      expect(allTokens.length).toBeGreaterThan(0);
    });
  });

  /**
   * 検証1: 全トークン件数が正確に68件であること
   */
  describe("Count verification", () => {
    it("全トークンが正確に68件である", () => {
      expect(getAllTokensFlat().length).toBe(68);
    });

    it("TOKEN_REFERENCE_ALL の全カテゴリの合計が68件", () => {
      const totalCount = TOKEN_REFERENCE_ALL.reduce((sum, cat) => sum + cat.tokens.length, 0);
      expect(totalCount).toBe(68);
    });
  });

  /**
   * 検証2: name フィールドに重複がないこと
   */
  describe("Uniqueness verification", () => {
    it("トークン名に重複がない（Set でサイズが変わらない）", () => {
      const names = allTokens.map((t) => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
      expect(uniqueNames.size).toBe(68);
    });
  });

  /**
   * 検証3: detail・easy・docUrl が空文字列でないこと
   */
  describe("Field presence verification", () => {
    it("全トークンが detail フィールドを持ち、空でない", () => {
      allTokens.forEach((token) => {
        expect(token.detail).toBeDefined();
        expect(token.detail).not.toBe("");
        expect(typeof token.detail).toBe("string");
      });
    });

    it("全トークンが easy フィールドを持ち、空でない", () => {
      allTokens.forEach((token) => {
        expect(token.easy).toBeDefined();
        expect(token.easy).not.toBe("");
        expect(typeof token.easy).toBe("string");
      });
    });

    it("全トークンが docUrl フィールドを持ち、空でない", () => {
      allTokens.forEach((token) => {
        expect(token.docUrl).toBeDefined();
        expect(token.docUrl).not.toBe("");
        expect(typeof token.docUrl).toBe("string");
      });
    });
  });

  /**
   * 検証4: docUrl の形式が正しいこと
   * 形式: "https://docs.python.org/3.12/library/token.html#token.{NAME}"
   */
  describe("docUrl format verification", () => {
    it("全トークンの docUrl が正しいドメイン・パスで始まる", () => {
      allTokens.forEach((token) => {
        expect(token.docUrl).toMatch(
          /^https:\/\/docs\.python\.org\/3\.12\/library\/token\.html#token\./,
        );
      });
    });

    it("全トークンの docUrl の末尾が name と一致する", () => {
      allTokens.forEach((token) => {
        const expectedUrl = `https://docs.python.org/3.12/library/token.html#token.${token.name}`;
        expect(token.docUrl).toBe(expectedUrl);
      });
    });
  });

  /**
   * 検証5: 存在しないトークン名で undefined を返す
   */
  describe("Non-existent token lookup", () => {
    it('存在しないトークン名 "NONEXISTENT" で undefined を返す', () => {
      const result = findTokenReference("NONEXISTENT");
      expect(result).toBeUndefined();
    });

    it("空文字列で undefined を返す", () => {
      const result = findTokenReference("");
      expect(result).toBeUndefined();
    });

    it("大文字小文字が正確に一致する必要がある", () => {
      const result = findTokenReference("name");
      expect(result).toBeUndefined();
    });
  });

  /**
   * 検証6: 既知のトークン名が正しく返される
   */
  describe("Known token lookup", () => {
    it("既知の NAME トークンが正しく返される", () => {
      const token = findTokenReference("NAME");
      expect(token).toBeDefined();
      expect(token?.name).toBe("NAME");
      expect(token?.docUrl).toContain("token.NAME");
      expect(token?.detail).toContain("識別子");
    });

    it("既知の NUMBER トークンが正しく返される", () => {
      const token = findTokenReference("NUMBER");
      expect(token).toBeDefined();
      expect(token?.name).toBe("NUMBER");
      expect(token?.docUrl).toContain("token.NUMBER");
    });

    it("既知の STRING トークンが正しく返される", () => {
      const token = findTokenReference("STRING");
      expect(token).toBeDefined();
      expect(token?.name).toBe("STRING");
      expect(token?.docUrl).toContain("token.STRING");
    });

    it("既知の INDENT トークンが正しく返される", () => {
      const token = findTokenReference("INDENT");
      expect(token).toBeDefined();
      expect(token?.name).toBe("INDENT");
      expect(token?.docUrl).toContain("token.INDENT");
    });

    it("既知の DEDENT トークンが正しく返される", () => {
      const token = findTokenReference("DEDENT");
      expect(token).toBeDefined();
      expect(token?.name).toBe("DEDENT");
      expect(token?.docUrl).toContain("token.DEDENT");
    });
  });
});

/**
 * ASTリファレンスの完全性と一貫性を検証
 */
describe("AST Reference Coverage", () => {
  let allAstNodes: AstReference[];

  describe("Setup", () => {
    it("getAllAstNodesFlat() から全ノードを取得", () => {
      allAstNodes = getAllAstNodesFlat();
      expect(allAstNodes).toBeDefined();
      expect(allAstNodes.length).toBeGreaterThan(0);
    });
  });

  /**
   * 検証1: 全ノード件数が正確に111件であること
   */
  describe("Count verification", () => {
    it("全ASTノードが正確に111件である", () => {
      expect(getAllAstNodesFlat().length).toBe(111);
    });

    it("AST_REFERENCE_ALL の全カテゴリの合計が111件", () => {
      const totalCount = AST_REFERENCE_ALL.reduce((sum, cat) => sum + cat.nodes.length, 0);
      expect(totalCount).toBe(111);
    });
  });

  /**
   * 検証2: name フィールドに重複がないこと
   */
  describe("Uniqueness verification", () => {
    it("ノード名に重複がない（Set でサイズが変わらない）", () => {
      const names = allAstNodes.map((n) => n.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
      expect(uniqueNames.size).toBe(111);
    });
  });

  /**
   * 検証3: detail・easy・docUrl が空文字列でないこと
   */
  describe("Field presence verification", () => {
    it("全ノードが detail フィールドを持ち、空でない", () => {
      allAstNodes.forEach((node) => {
        expect(node.detail).toBeDefined();
        expect(node.detail).not.toBe("");
        expect(typeof node.detail).toBe("string");
      });
    });

    it("全ノードが easy フィールドを持ち、空でない", () => {
      allAstNodes.forEach((node) => {
        expect(node.easy).toBeDefined();
        expect(node.easy).not.toBe("");
        expect(typeof node.easy).toBe("string");
      });
    });

    it("全ノードが docUrl フィールドを持ち、空でない", () => {
      allAstNodes.forEach((node) => {
        expect(node.docUrl).toBeDefined();
        expect(node.docUrl).not.toBe("");
        expect(typeof node.docUrl).toBe("string");
      });
    });
  });

  /**
   * 検証4: docUrl の形式が正しいこと
   * 形式: "https://docs.python.org/3.12/library/ast.html#ast.{NAME}"
   */
  describe("docUrl format verification", () => {
    it("全ノードの docUrl が正しいドメイン・パスで始まる", () => {
      allAstNodes.forEach((node) => {
        expect(node.docUrl).toMatch(
          /^https:\/\/docs\.python\.org\/3\.12\/library\/ast\.html#ast\./,
        );
      });
    });

    it("全ノードの docUrl の末尾が name と一致する", () => {
      allAstNodes.forEach((node) => {
        const expectedUrl = `https://docs.python.org/3.12/library/ast.html#ast.${node.name}`;
        expect(node.docUrl).toBe(expectedUrl);
      });
    });
  });

  /**
   * 検証5: 存在しないノード名で undefined を返す
   */
  describe("Non-existent node lookup", () => {
    it('存在しないノード名 "NonExistent" で undefined を返す', () => {
      const result = findAstReference("NonExistent");
      expect(result).toBeUndefined();
    });

    it("空文字列で undefined を返す", () => {
      const result = findAstReference("");
      expect(result).toBeUndefined();
    });

    it("大文字小文字が正確に一致する必要がある", () => {
      const result = findAstReference("module");
      expect(result).toBeUndefined();
    });
  });

  /**
   * 検証6: 既知のノード名が正しく返される
   */
  describe("Known node lookup", () => {
    it("既知の Module ノードが正しく返される", () => {
      const node = findAstReference("Module");
      expect(node).toBeDefined();
      expect(node?.name).toBe("Module");
      expect(node?.docUrl).toContain("ast.Module");
      expect(node?.detail).toBeDefined();
    });

    it("既知の FunctionDef ノードが正しく返される", () => {
      const node = findAstReference("FunctionDef");
      expect(node).toBeDefined();
      expect(node?.name).toBe("FunctionDef");
      expect(node?.docUrl).toContain("ast.FunctionDef");
    });

    it("既知の ClassDef ノードが正しく返される", () => {
      const node = findAstReference("ClassDef");
      expect(node).toBeDefined();
      expect(node?.name).toBe("ClassDef");
      expect(node?.docUrl).toContain("ast.ClassDef");
    });

    it("既知の Constant ノードが正しく返される", () => {
      const node = findAstReference("Constant");
      expect(node).toBeDefined();
      expect(node?.name).toBe("Constant");
      expect(node?.docUrl).toContain("ast.Constant");
    });

    it("既知の Name ノードが正しく返される", () => {
      const node = findAstReference("Name");
      expect(node).toBeDefined();
      expect(node?.name).toBe("Name");
      expect(node?.docUrl).toContain("ast.Name");
    });

    it("既知の If ノードが正しく返される", () => {
      const node = findAstReference("If");
      expect(node).toBeDefined();
      expect(node?.name).toBe("If");
      expect(node?.docUrl).toContain("ast.If");
    });
  });
});

/**
 * オペコードリファレンスの完全性と一貫性を検証
 */
describe("Opcode Reference Coverage", () => {
  let allOpcodes: OpcodeReference[];

  describe("Setup", () => {
    it("getAllOpcodesFlat() から全オペコードを取得", () => {
      allOpcodes = getAllOpcodesFlat();
      expect(allOpcodes).toBeDefined();
      expect(allOpcodes.length).toBeGreaterThan(0);
    });
  });

  /**
   * 検証1: 全オペコード件数が正確に108件であること
   */
  describe("Count verification", () => {
    it("全オペコードが正確に108件である", () => {
      expect(getAllOpcodesFlat().length).toBe(108);
    });

    it("OPCODE_REFERENCE_ALL の全カテゴリの合計が108件", () => {
      const totalCount = OPCODE_REFERENCE_ALL.reduce((sum, cat) => sum + cat.opcodes.length, 0);
      expect(totalCount).toBe(108);
    });
  });

  /**
   * 検証2: name フィールドに重複がないこと
   */
  describe("Uniqueness verification", () => {
    it("オペコード名に重複がない（Set でサイズが変わらない）", () => {
      const names = allOpcodes.map((o) => o.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
      expect(uniqueNames.size).toBe(108);
    });
  });

  /**
   * 検証3: detail・easy・docUrl が空文字列でないこと
   */
  describe("Field presence verification", () => {
    it("全オペコードが detail フィールドを持ち、空でない", () => {
      allOpcodes.forEach((opcode) => {
        expect(opcode.detail).toBeDefined();
        expect(opcode.detail).not.toBe("");
        expect(typeof opcode.detail).toBe("string");
      });
    });

    it("全オペコードが easy フィールドを持ち、空でない", () => {
      allOpcodes.forEach((opcode) => {
        expect(opcode.easy).toBeDefined();
        expect(opcode.easy).not.toBe("");
        expect(typeof opcode.easy).toBe("string");
      });
    });

    it("全オペコードが docUrl フィールドを持ち、空でない", () => {
      allOpcodes.forEach((opcode) => {
        expect(opcode.docUrl).toBeDefined();
        expect(opcode.docUrl).not.toBe("");
        expect(typeof opcode.docUrl).toBe("string");
      });
    });
  });

  /**
   * 検証4: docUrl の形式が正しいこと
   * 形式: "https://docs.python.org/3.12/library/dis.html#opcode-{NAME}"
   * 注意: opcode は ドット(.) ではなくハイフン(-) を区切り文字として使用
   */
  describe("docUrl format verification", () => {
    it("全オペコードの docUrl が正しいドメイン・パスで始まる", () => {
      allOpcodes.forEach((opcode) => {
        expect(opcode.docUrl).toMatch(
          /^https:\/\/docs\.python\.org\/3\.12\/library\/dis\.html#opcode-/,
        );
      });
    });

    it("全オペコードの docUrl の末尾が name と一致する", () => {
      allOpcodes.forEach((opcode) => {
        const expectedUrl = `https://docs.python.org/3.12/library/dis.html#opcode-${opcode.name}`;
        expect(opcode.docUrl).toBe(expectedUrl);
      });
    });

    it("オペコード URL にドット(.) ではなくハイフン(-) を使用", () => {
      allOpcodes.forEach((opcode) => {
        expect(opcode.docUrl).not.toMatch(/#dis\./);
        expect(opcode.docUrl).toMatch(/#opcode-/);
      });
    });
  });

  /**
   * 検証5: 存在しないオペコード名で undefined を返す
   */
  describe("Non-existent opcode lookup", () => {
    it('存在しないオペコード名 "NONEXISTENT_OP" で undefined を返す', () => {
      const result = findOpcodeReference("NONEXISTENT_OP");
      expect(result).toBeUndefined();
    });

    it("空文字列で undefined を返す", () => {
      const result = findOpcodeReference("");
      expect(result).toBeUndefined();
    });

    it("大文字小文字が正確に一致する必要がある", () => {
      const result = findOpcodeReference("load_fast");
      expect(result).toBeUndefined();
    });
  });

  /**
   * 検証6: 既知のオペコード名が正しく返される
   */
  describe("Known opcode lookup", () => {
    it("既知の LOAD_FAST オペコードが正しく返される", () => {
      const opcode = findOpcodeReference("LOAD_FAST");
      expect(opcode).toBeDefined();
      expect(opcode?.name).toBe("LOAD_FAST");
      expect(opcode?.docUrl).toContain("opcode-LOAD_FAST");
      expect(opcode?.detail).toBeDefined();
    });

    it("既知の RESUME オペコードが正しく返される", () => {
      const opcode = findOpcodeReference("RESUME");
      expect(opcode).toBeDefined();
      expect(opcode?.name).toBe("RESUME");
      expect(opcode?.docUrl).toContain("opcode-RESUME");
    });

    it("既知の RETURN_VALUE オペコードが正しく返される", () => {
      const opcode = findOpcodeReference("RETURN_VALUE");
      expect(opcode).toBeDefined();
      expect(opcode?.name).toBe("RETURN_VALUE");
      expect(opcode?.docUrl).toContain("opcode-RETURN_VALUE");
    });

    it("既知の POP_TOP オペコードが正しく返される", () => {
      const opcode = findOpcodeReference("POP_TOP");
      expect(opcode).toBeDefined();
      expect(opcode?.name).toBe("POP_TOP");
      expect(opcode?.docUrl).toContain("opcode-POP_TOP");
    });

    it("既知の JUMP_FORWARD オペコードが正しく返される", () => {
      const opcode = findOpcodeReference("JUMP_FORWARD");
      expect(opcode).toBeDefined();
      expect(opcode?.name).toBe("JUMP_FORWARD");
      expect(opcode?.docUrl).toContain("opcode-JUMP_FORWARD");
    });
  });
});
