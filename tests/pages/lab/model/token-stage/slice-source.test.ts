import { describe, expect, it } from "vitest";
import { sliceSource } from "@/pages/lab/model/token-stage/slice-source";
import type { Pos } from "@/shared/api";

describe("sliceSource", () => {
  // テスト1: 同一行内の範囲切り出し
  describe("単一行内の抽出", () => {
    it("同一行内の部分文字列を正しく抽出する", () => {
      const source = "x = 1\ny = 2";
      const result = sliceSource(source, [1, 0] as Pos, [1, 5] as Pos);
      expect(result).toBe("x = 1");
    });

    it("同一行内で列の中間から抽出", () => {
      const source = "hello world";
      const result = sliceSource(source, [1, 6] as Pos, [1, 11] as Pos);
      expect(result).toBe("world");
    });

    it("同一行内で列の先頭から抽出", () => {
      const source = "hello";
      const result = sliceSource(source, [1, 0] as Pos, [1, 5] as Pos);
      expect(result).toBe("hello");
    });
  });

  // テスト2: 複数行にまたがる範囲切り出し
  describe("複数行にまたがる抽出", () => {
    it("開始行の途中から終了行の途中までを抽出", () => {
      const source = "line1 start\nmiddle line\nend line3";
      // 行1の列6から行3の列4まで
      const result = sliceSource(source, [1, 6] as Pos, [3, 4] as Pos);
      // 期待値: "start\nmiddle line\nend " (改行で結合)
      expect(result).toBe("start\nmiddle line\nend ");
    });

    it("中間行が複数ある場合、丸ごと含める", () => {
      const source = "a\nb\nc\nd\ne";
      // 行1列0から行5列1まで
      const result = sliceSource(source, [1, 0] as Pos, [5, 1] as Pos);
      // 期待値: "a\nb\nc\nd\ne"
      expect(result).toBe("a\nb\nc\nd\ne");
    });

    it("開始行の末尾から開始する場合", () => {
      const source = "abc\ndef\nghi";
      // 行1の列3(末尾)から行2の列3まで
      const result = sliceSource(source, [1, 3] as Pos, [2, 3] as Pos);
      // 期待値: "\ndef" (行1の末尾(空) + 改行 + 行2の先頭3文字)
      expect(result).toBe("\ndef");
    });
  });

  // テスト3: 行末と行頭のケース
  describe("行末・行頭の境界条件", () => {
    it("開始が行頭(col=0)の場合", () => {
      const source = "hello\nworld";
      const result = sliceSource(source, [1, 0] as Pos, [1, 5] as Pos);
      expect(result).toBe("hello");
    });

    it("終了が行末(col=長さ)の場合", () => {
      const source = "hello\nworld";
      const result = sliceSource(source, [1, 2] as Pos, [1, 5] as Pos);
      expect(result).toBe("llo");
    });

    it("複数行で開始行を行頭から、終了行を行末までスライス", () => {
      const source = "first\nsecond\nthird";
      const result = sliceSource(source, [1, 0] as Pos, [3, 5] as Pos);
      expect(result).toBe("first\nsecond\nthird");
    });
  });

  // テスト4: 存在しない行番号を指定した場合のフォールバック
  describe("範囲外アクセス時のフォールバック", () => {
    it("開始行が存在しない場合、空文字列で扱われる", () => {
      const source = "line1\nline2";
      // 存在しない行99からアクセス
      const result = sliceSource(source, [99, 0] as Pos, [99, 5] as Pos);
      expect(result).toBe("");
    });

    it("終了行が存在しない場合、ループで空行が追加される", () => {
      const source = "line1\nline2";
      // 行1から存在しない行99までアクセス
      // 行3-99は全て存在しないので、各ループで空文字が追加される
      const result = sliceSource(source, [1, 0] as Pos, [99, 5] as Pos);
      // 期待値: "line1\nline2\n" + 行3-98の空行分（97行） + 行99の先頭5文字（空文字）
      expect(result).toContain("line1\nline2");
      // 改行の数は 1 + 97 = 98個
      const newlineCount = (result.match(/\n/g) || []).length;
      expect(newlineCount).toBe(98);
    });

    it("開始・終了の中間行が存在しない場合、その部分は空文字", () => {
      const source = "a\nb\nc";
      // 行1から行5までアクセス（行4,5は存在しない）
      const result = sliceSource(source, [1, 0] as Pos, [5, 1] as Pos);
      // 期待値: "a\nb\nc\n\n" (行1, 行2, 行3, 行4(空), 行5の先頭1文字で構成)
      expect(result).toBe("a\nb\nc\n\n");
    });
  });

  // テスト5: 改行文字の厳密な扱い
  describe("改行文字の取り扱い", () => {
    it("複数行抽出で各セグメントに改行が含まれない", () => {
      const source = "abc\ndef\nghi";
      const result = sliceSource(source, [1, 1] as Pos, [3, 2] as Pos);
      // 行1列1-末尾: "bc"
      // 行2全体: "def" (中間行として挿入)
      // 行3列0-2: "gh"
      // 期待値: "bc\ndef\ngh" (各行内の改行は除外、join時に\nで接続)
      expect(result).toBe("bc\ndef\ngh");
      // 改行のみは2箇所（行2への遷移、行3への遷移）
      const newlineCount = (result.match(/\n/g) || []).length;
      expect(newlineCount).toBe(2);
    });

    it("単一行ではニューラインが含まれない", () => {
      const source = "hello\nworld";
      const result = sliceSource(source, [1, 0] as Pos, [1, 5] as Pos);
      expect(result).not.toContain("\n");
      expect(result).toBe("hello");
    });

    it("複数行の結合で改行の位置が正確", () => {
      const source = "12345\n67890\nabcde";
      const result = sliceSource(source, [1, 2] as Pos, [3, 3] as Pos);
      // 期待値: "345\n67890\nabc"
      // - 行1:列2-5 = "345"
      // - 改行
      // - 行2:全体 = "67890"
      // - 改行
      // - 行3:列0-3 = "abc"
      expect(result).toBe("345\n67890\nabc");
      // 改行は正確に2個
      expect((result.match(/\n/g) || []).length).toBe(2);
    });
  });

  // 追加: 空行を含む複数行テスト
  describe("空行を含むケース", () => {
    it("空行を含むソースから正しく抽出", () => {
      const source = "line1\n\nline3";
      // 行1から行3へのスライス
      const result = sliceSource(source, [1, 0] as Pos, [3, 5] as Pos);
      expect(result).toBe("line1\n\nline3");
    });

    it("開始行が空行の場合", () => {
      const source = "line1\n\nline3";
      // 行2(空行)から行2の末尾まで
      const result = sliceSource(source, [2, 0] as Pos, [2, 0] as Pos);
      expect(result).toBe("");
    });
  });
});
