/**
 * バイトコード逆アセンブルのパターンマッチング命令リファレンス
 * MATCH_* 系命令（Python 3.10で導入）
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * パターンマッチング（Python 3.10 match-case）
 */
export const OPCODE_REFERENCE_PATTERN_MATCHING: OpcodeReference[] = [
  {
    name: "MATCH_CLASS",
    detail:
      "クラスパターンマッチングを実行します。スタック最上部の値とクラスパターンを比較し、値がそのクラスのインスタンスであり、位置引数・キーワード引数のパターンが一致するかを判定。match 文で class(pattern) の形式で使用。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MATCH_CLASS",
    easy: "値がクラスパターンに一致するかマッチングします。match 文の class() パターンで使われます。",
  },
  {
    name: "MATCH_SEQUENCE",
    detail:
      "シーケンスパターンマッチングを実行します。スタック最上部の値とシーケンスパターンを比較し、値がシーケンス型であり、要素数・各要素のパターンが一致するかを判定。match 文で [pattern, ...] や (pattern, ...) の形式で使用。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MATCH_SEQUENCE",
    easy: "値がシーケンスパターンに一致するかマッチングします。match 文の [p1, p2] パターンで使われます。",
  },
  {
    name: "MATCH_MAPPING",
    detail:
      "マッピング（辞書）パターンマッチングを実行します。スタック最上部の値とマッピングパターンを比較し、値がマッピング型であり、キー・値のパターンが一致するかを判定。match 文で {key: pattern, ...} の形式で使用。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MATCH_MAPPING",
    easy: "値がマッピング（辞書）パターンに一致するかマッチングします。match 文の {k: p} パターンで使われます。",
  },
  {
    name: "MATCH_KEYS",
    detail:
      "マッピング内の複数のキーが存在するかを確認します。スタック最上部のマッピングオブジェクトと、指定されたキーのシーケンスから、それらのキーがマッピングに存在するかを判定。MATCH_MAPPING の補助として使用。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MATCH_KEYS",
    easy: "マッピング内に複数のキーが存在するか確認します。MATCH_MAPPING と組み合わせて使われます。",
  },
  {
    name: "CHECK_EG_MATCH",
    detail:
      "グループマッチングの例外チェック。特殊なパターンマッチングの検証処理。match 文で複合的なマッピング・シーケンスパターンを処理する際の内部チェック。Python 3.10で導入。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CHECK_EG_MATCH",
    easy: "グループマッチングの例外チェックを実行します。複雑なパターンマッチングで使われます。",
  },
];
