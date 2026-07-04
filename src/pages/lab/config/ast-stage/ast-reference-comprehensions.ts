/**
 * Python ast モジュール 内包表記・ジェネレータノード型リファレンス
 * ListComp, SetComp, DictComp, GeneratorExp, comprehension の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 内包表記・ジェネレータノード: 高速な集合生成処理
 */
export const AST_REFERENCE_COMPREHENSIONS: AstReference[] = [
  {
    name: "ListComp",
    detail:
      "リスト内包表記を表すノード。[expr for x in iterable if condition] のような式を表現します。elt フィールドに生成される要素の式、generators フィールドに comprehension ノードのリスト（for句と対応する if条件を含む）が格納されます。複数の for ループをネストしている場合、generators リストに複数の comprehension が含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.ListComp",
    easy: "リスト内包表記。[x * 2 for x in range(10)] のような効率的なリスト生成。",
  },
  {
    name: "SetComp",
    detail:
      "セット内包表記を表すノード。{expr for x in iterable if condition} のような式を表現します。ListComp と同じ構造で、elt フィールドと generators フィールドを持ちます。結果が重複なしのセットになる点が異なります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.SetComp",
    easy: "セット内包表記。{x * 2 for x in range(10)} のような効率的なセット生成。",
  },
  {
    name: "DictComp",
    detail:
      "辞書内包表記を表すノード。{key: value for x in iterable if condition} のような式を表現します。key フィールドにキーの式、value フィールドに値の式、generators フィールドに comprehension ノードのリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.DictComp",
    easy: "辞書内包表記。{x: x**2 for x in range(5)} のような効率的な辞書生成。",
  },
  {
    name: "GeneratorExp",
    detail:
      "ジェネレータ式を表すノード。(expr for x in iterable if condition) のような式を表現します。ListComp と同じ構造を持ちますが、メモリ効率が良く、遅延評価されます。elt フィールドと generators フィールドを持ちます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.GeneratorExp",
    easy: "ジェネレータ式。(x * 2 for x in range(10)) のような遅延評価式。",
  },
  {
    name: "comprehension",
    detail:
      "内包表記またはジェネレータ式内の『for target in iter』部分を表す補助ノード。target フィールドに for 後の変数、iter フィールドにイテラブル、ifs フィールドに if 条件のリストが格納されます。expr は単に for ループの反復対象です。ListComp, SetComp, DictComp, GeneratorExp の generators フィールドはこのノードのリストです。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.comprehension",
    easy: "内包表記の『for ... in ... if ...』部分。target フィールドに for 後の変数が、iter フィールドに反復可能オブジェクトが入ります。",
  },
];
