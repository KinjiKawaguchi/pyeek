/**
 * Python tokenize モジュール全トークン種別リファレンス インデックス
 * 全カテゴリのトークンを統合し、検索・表示用に整理したデータ
 */

import { TOKEN_REFERENCE_ADVANCED } from "./token-reference-advanced";
import type { TokenReference } from "./token-reference-basic";
import { TOKEN_REFERENCE_BASIC } from "./token-reference-basic";
import { TOKEN_REFERENCE_FSTRING } from "./token-reference-fstring";
import { TOKEN_REFERENCE_OPERATORS } from "./token-reference-operators";
import { TOKEN_REFERENCE_STRUCTURE } from "./token-reference-structure";

export type { TokenReference };

export interface TokenReferenceCategory {
  category: string;
  description: string;
  tokens: TokenReference[];
}

/**
 * 全トークン種別をカテゴリ別に整理したリスト
 */
export const TOKEN_REFERENCE_ALL: TokenReferenceCategory[] = [
  {
    category: "基本トークン",
    description: "識別子、数値・文字列リテラル、コメント",
    tokens: TOKEN_REFERENCE_BASIC,
  },
  {
    category: "構造トークン",
    description: "ブロック構造、行終了、ファイル開始/終了",
    tokens: TOKEN_REFERENCE_STRUCTURE,
  },
  {
    category: "演算子・記号",
    description: "算術・比較・論理・ビット演算、括弧、拡張代入",
    tokens: TOKEN_REFERENCE_OPERATORS,
  },
  {
    category: "F-string トークン",
    description: "Python 3.12 の f-string 細分化トークン",
    tokens: TOKEN_REFERENCE_FSTRING,
  },
  {
    category: "高度なトークン",
    description: "async/await, 型ヒント, ソフトキーワード, エラー",
    tokens: TOKEN_REFERENCE_ADVANCED,
  },
];

/**
 * トークン名から詳細情報を検索
 */
export function findTokenReference(name: string): TokenReference | undefined {
  for (const category of TOKEN_REFERENCE_ALL) {
    const found = category.tokens.find((t) => t.name === name);
    if (found) return found;
  }
  return undefined;
}

/**
 * 全トークンをフラット配列で取得（検索などに便利）
 */
export function getAllTokensFlat(): TokenReference[] {
  return TOKEN_REFERENCE_ALL.flatMap((cat) => cat.tokens);
}
