/**
 * バイトコード逆アセンブル全オペコード種別リファレンス インデックス
 * 全カテゴリのオペコードを統合し、検索・表示用に整理したデータ
 */

import { OPCODE_REFERENCE_CALLS } from "./opcode-reference-calls";
import { OPCODE_REFERENCE_COLLECTIONS } from "./opcode-reference-collections";
import { OPCODE_REFERENCE_CONTROL_FLOW } from "./opcode-reference-control-flow";
import { OPCODE_REFERENCE_EXCEPTIONS_ASYNC } from "./opcode-reference-exceptions-async";
import type { OpcodeReference } from "./opcode-reference-general";
import { OPCODE_REFERENCE_GENERAL } from "./opcode-reference-general";
import { OPCODE_REFERENCE_PATTERN_MATCHING } from "./opcode-reference-pattern-matching";
import { OPCODE_REFERENCE_UNARY_BINARY } from "./opcode-reference-unary-binary";
import { OPCODE_REFERENCE_VARIABLES } from "./opcode-reference-variables";

export type { OpcodeReference };

export interface OpcodeReferenceCategory {
  category: string;
  description: string;
  opcodes: OpcodeReference[];
}

/**
 * 全オペコード種別をカテゴリ別に整理したリスト
 */
export const OPCODE_REFERENCE_ALL: OpcodeReferenceCategory[] = [
  {
    category: "一般的な命令",
    description: "スタック操作、スキップ、拡張引数、初期化処理",
    opcodes: OPCODE_REFERENCE_GENERAL,
  },
  {
    category: "単項・二項演算",
    description: "論理・算術・比較演算、ビット演算",
    opcodes: OPCODE_REFERENCE_UNARY_BINARY,
  },
  {
    category: "変数・属性アクセス",
    description: "ロード・ストア・削除、様々なスコープでの変数操作",
    opcodes: OPCODE_REFERENCE_VARIABLES,
  },
  {
    category: "制御フロー",
    description: "条件分岐、無条件ジャンプ、ループ制御",
    opcodes: OPCODE_REFERENCE_CONTROL_FLOW,
  },
  {
    category: "関数・メソッド呼び出し",
    description: "関数呼び出しと戻り値処理、関数定義",
    opcodes: OPCODE_REFERENCE_CALLS,
  },
  {
    category: "コレクション構築",
    description: "リスト・辞書・集合・タプル・スライス構築と操作",
    opcodes: OPCODE_REFERENCE_COLLECTIONS,
  },
  {
    category: "例外処理・async・コルーチン",
    description: "例外処理、with ブロック、async/await、ジェネレータ、イテレータ",
    opcodes: OPCODE_REFERENCE_EXCEPTIONS_ASYNC,
  },
  {
    category: "パターンマッチング",
    description: "Python 3.10 match-case 文の実装",
    opcodes: OPCODE_REFERENCE_PATTERN_MATCHING,
  },
];

/**
 * オペコード名から詳細情報を検索
 */
export function findOpcodeReference(name: string): OpcodeReference | undefined {
  for (const category of OPCODE_REFERENCE_ALL) {
    const found = category.opcodes.find((op) => op.name === name);
    if (found) return found;
  }
  return undefined;
}

/**
 * 全オペコードをフラット配列で取得（検索などに便利）
 */
export function getAllOpcodesFlat(): OpcodeReference[] {
  return OPCODE_REFERENCE_ALL.flatMap((cat) => cat.opcodes);
}
