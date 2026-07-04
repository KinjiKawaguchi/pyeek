/**
 * Python ast モジュール全ノード種別リファレンス インデックス
 * 全カテゴリのAST ノード型を統合し、検索・表示用に整理したデータ
 */

import { AST_REFERENCE_COMPREHENSIONS } from "./ast-reference-comprehensions";
import { AST_REFERENCE_CONTROL_FLOW } from "./ast-reference-control-flow";
import { AST_REFERENCE_EXPRESSIONS } from "./ast-reference-expressions";
import { AST_REFERENCE_FUNCTIONS } from "./ast-reference-functions";
import { AST_REFERENCE_IMPORTS } from "./ast-reference-imports";
import type { AstReference } from "./ast-reference-literals";
import { AST_REFERENCE_LITERALS } from "./ast-reference-literals";
import { AST_REFERENCE_OPERATORS } from "./ast-reference-operators";
import { AST_REFERENCE_PATTERN_MATCHING } from "./ast-reference-pattern-matching";
import { AST_REFERENCE_STATEMENTS } from "./ast-reference-statements";
import { AST_REFERENCE_TOP_LEVEL } from "./ast-reference-top-level";
import { AST_REFERENCE_VARIABLES } from "./ast-reference-variables";

export type { AstReference };

export interface AstReferenceCategory {
  category: string;
  description: string;
  nodes: AstReference[];
}

/**
 * 全AST ノード種別をカテゴリ別に整理したリスト
 */
export const AST_REFERENCE_ALL: AstReferenceCategory[] = [
  {
    category: "リテラル・定数",
    description: "数値・文字列・None・True・False 等の値",
    nodes: AST_REFERENCE_LITERALS,
  },
  {
    category: "変数・参照・アクセス",
    description: "変数参照、属性アクセス、インデックスアクセス、文脈",
    nodes: AST_REFERENCE_VARIABLES,
  },
  {
    category: "演算子・比較",
    description: "算術・ビット・比較・論理演算子およびそれらを含む式",
    nodes: AST_REFERENCE_OPERATORS,
  },
  {
    category: "式",
    description: "ラムダ式、条件式、関数呼び出し、コレクションリテラル",
    nodes: AST_REFERENCE_EXPRESSIONS,
  },
  {
    category: "内包表記・ジェネレータ",
    description: "リスト内包、セット内包、辞書内包、ジェネレータ式",
    nodes: AST_REFERENCE_COMPREHENSIONS,
  },
  {
    category: "文・ステートメント",
    description: "代入、削除、return、pass、break、continue、raise、assert",
    nodes: AST_REFERENCE_STATEMENTS,
  },
  {
    category: "制御フロー・スコープ",
    description: "if/while/for/with/try 文、global/nonlocal、except ハンドラ",
    nodes: AST_REFERENCE_CONTROL_FLOW,
  },
  {
    category: "インポート",
    description: "import 文、from...import 文、モジュール別名",
    nodes: AST_REFERENCE_IMPORTS,
  },
  {
    category: "パターンマッチング",
    description: "match-case 文と各種パターン（PEP 634）",
    nodes: AST_REFERENCE_PATTERN_MATCHING,
  },
  {
    category: "関数・クラス・非同期",
    description: "関数/クラス定義、引数、async/await、yield、ジェネレータ",
    nodes: AST_REFERENCE_FUNCTIONS,
  },
  {
    category: "トップレベル・型関連",
    description: "モジュール、型パラメータ、type: ignore（PEP 695）",
    nodes: AST_REFERENCE_TOP_LEVEL,
  },
];

/**
 * ノード名から詳細情報を検索
 */
export function findAstReference(name: string): AstReference | undefined {
  for (const category of AST_REFERENCE_ALL) {
    const found = category.nodes.find((node) => node.name === name);
    if (found) return found;
  }
  return undefined;
}

/**
 * 全ノードをフラット配列で取得（検索などに便利）
 */
export function getAllAstNodesFlat(): AstReference[] {
  return AST_REFERENCE_ALL.flatMap((cat) => cat.nodes);
}
