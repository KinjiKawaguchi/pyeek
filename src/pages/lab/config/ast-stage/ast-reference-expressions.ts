/**
 * Python ast モジュール 式ノード型リファレンス
 * Lambda, IfExp, Call, Dict, Set, Tuple, List, NamedExpr の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 各種式ノード: ラムダ式、条件式、関数呼び出し、コレクション
 */
export const AST_REFERENCE_EXPRESSIONS: AstReference[] = [
  {
    name: "Lambda",
    detail:
      "ラムダ式（無名関数）を表すノード。lambda x, y: x + y のような式を表現します。args フィールドに arguments ノード（関数の引数情報）が格納され、body フィールドに式が格納されます。ラムダ式は常に式の値として単一の式を返します（複数文は書けません）。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Lambda",
    easy: "ラムダ式。lambda x: x * 2 のような簡潔な無名関数。",
  },
  {
    name: "IfExp",
    detail:
      "条件式（三項演算子）を表すノード。a if condition else b のような式を表現します。test フィールドに条件（expr）、body フィールドに真の場合の式、orelse フィールドに偽の場合の式が格納されます。If 文とは異なり、IfExp は値を返す式です。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.IfExp",
    easy: "三項演算子。x if condition else y のような条件式。",
  },
  {
    name: "Call",
    detail:
      "関数呼び出しを表すノード。func(arg1, arg2, kw=val) のような式を表現します。func フィールドに関数オブジェクト、args フィールドに位置引数のリスト、keywords フィールドに keyword ノード（キーワード引数、*args, **kwargs）のリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Call",
    easy: "関数呼び出し。func(arg1, arg2) のような呼び出し全体。",
  },
  {
    name: "Dict",
    detail:
      "辞書リテラルを表すノード。{key1: val1, key2: val2} のような式を表現します。keys と values フィールドにそれぞれキーと値のリストが格納されます。**dict 展開が含まれる場合、そこだけ None がキーになり、値に Dict ノードが来ます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Dict",
    easy: "辞書。{'key': value, ...} のような辞書リテラル。",
  },
  {
    name: "Set",
    detail:
      "セット（集合）リテラルを表すノード。{1, 2, 3} のような式を表現します。elts フィールドに要素のリストが格納されます。空のセット {} は Dict() になるため、Set は常に1個以上の要素を持ちます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Set",
    easy: "セット。{1, 2, 3} のようなセットリテラル。",
  },
  {
    name: "Tuple",
    detail:
      "タプルリテラルまたはタプル式を表すノード。(1, 2, 3) または x, y のような式を表現します。elts フィールドに要素のリストが格納されます。ctx フィールドで Load/Store/Del が指定されます。単一要素のタプル (x,) でも Tuple ノードになります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Tuple",
    easy: "タプル。(1, 2, 3) または 1, 2, 3 のようなタプルリテラル。",
  },
  {
    name: "List",
    detail:
      "リストリテラルまたはリスト式を表すノード。[1, 2, 3] のような式を表現します。elts フィールドに要素のリストが格納されます。ctx フィールドで Load/Store/Del が指定されます。リスト内包表記とは異なり、List は単なるリテラル式を表します。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.List",
    easy: "リスト。[1, 2, 3] のようなリストリテラル。",
  },
  {
    name: "NamedExpr",
    detail:
      "セイウチ演算子（代入式、walrus operator :=）を表すノード。(x := value) のような式を表現します。PEP 572で導入。target フィールドに代入対象、value フィールドに右辺の式が格納されます。式として値を返しながら、同時に値を変数に代入します。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.NamedExpr",
    easy: "セイウチ演算子。(x := value) のような代入式。",
  },
];
