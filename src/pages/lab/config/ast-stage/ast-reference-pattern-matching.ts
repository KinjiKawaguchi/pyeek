/**
 * Python ast モジュール パターンマッチングノード型リファレンス
 * Match 文と各種パターンの詳細説明（PEP 634）
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * パターンマッチングノード: Python 3.10+ の match-case 文
 */
export const AST_REFERENCE_PATTERN_MATCHING: AstReference[] = [
  {
    name: "Match",
    detail:
      "match 文を表すノード。Python 3.10で導入（PEP 634）。subject フィールドにマッチさせる値の式、cases フィールドに match_case ノードのリスト（各 case 句）が格納されます。例：match x: case 0: ... case _: ... は Match(subject=Name('x'), cases=[match_case(...), match_case(...)])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Match",
    easy: "パターンマッチング。match value: case pattern: ... など。",
  },
  {
    name: "MatchValue",
    detail:
      "値パターンを表すノード。case 5: のように具体的な値と比較するパターン。value フィールドに比較対象の値の式が格納されます。例：case 42: は MatchValue(value=Constant(42))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchValue",
    easy: "値パターン。case 5:、case 'hello': など具体的な値。",
  },
  {
    name: "MatchSingleton",
    detail:
      "シングルトンパターンを表すノード。case True:, case False:, case None: のように True/False/None と比較するパターン。value フィールドにシングルトン値（True/False/None のいずれか）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchSingleton",
    easy: "シングルトンパターン。case True:、case False:、case None: など。",
  },
  {
    name: "MatchSequence",
    detail:
      "シーケンスパターンを表すノード。case [x, y, z]: や case (a, b): のようにリストやタプルの要素を分解するパターン。patterns フィールドに部分パターンのリストが格納されます。可変長要素（*rest）を含む場合も patterns に含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchSequence",
    easy: "シーケンスパターン。case [x, y]:、case (a, *rest): など。",
  },
  {
    name: "MatchMapping",
    detail:
      "マッピングパターンを表すノード。case {'key': value}: のように辞書の要素を分解するパターン。keys フィールドにキーの式のリスト、patterns フィールドに対応するパターンのリスト、rest フィールドに **rest（オプション、残りキーを取得）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchMapping",
    easy: "マッピングパターン。case {'key': val}:、case {**rest}: など。",
  },
  {
    name: "MatchClass",
    detail:
      "クラスパターンを表すノード。case Point(x, y): のようにクラスのインスタンスを分解するパターン。cls フィールドにクラスの式、patterns フィールドに位置パターンのリスト、kwd_attrs フィールドにキーワード属性名のリスト、kwd_patterns フィールドに対応するパターンのリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchClass",
    easy: "クラスパターン。case Point(x, y):、case Rectangle(w=width, h=height): など。",
  },
  {
    name: "MatchStar",
    detail:
      "可変長要素パターンを表すノード。シーケンスパターン内の *name で残りの要素を取得するパターン。name フィールドに取得する変数名（文字列、None の場合は _ 相当で値を取得しない）が格納されます。例：case [a, *rest, b]: の *rest は MatchStar(name='rest')。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchStar",
    easy: "可変長要素パターン。case [a, *rest]:、case (*items,): など。",
  },
  {
    name: "MatchOr",
    detail:
      "選択肢パターンを表すノード。case A | B | C: のように複数のパターンをOR で組み合わせるパターン。patterns フィールドに2個以上のパターンのリストが格納されます。例：case 0 | 1 | 2: は MatchOr(patterns=[MatchValue(...), MatchValue(...), MatchValue(...)])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchOr",
    easy: "選択肢パターン。case A | B | C: など複数パターンの組み合わせ。",
  },
  {
    name: "MatchAs",
    detail:
      "キャプチャパターンを表すノード。pattern as name で部分パターンをキャプチャする、または _ でワイルドカード。pattern フィールドに部分パターン（None の場合はワイルドカード _）、name フィールドにキャプチャ変数名（文字列、None の場合は _）が格納されます。例：case [x, y] as point: は MatchAs(pattern=MatchSequence(...), name='point')。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatchAs",
    easy: "キャプチャパターン。case [x, y] as point:、case _: など。",
  },
  {
    name: "match_case",
    detail:
      "match 文内の個別の『case pattern: body』部分を表す補助ノード。pattern フィールドにパターン、guard フィールドに追加の条件式（if 後の式、オプション）、body フィールドに case ブロックの文のリストが格納されます。例：case x if x > 0: ... は match_case(pattern=..., guard=Compare(...), body=[...])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.match_case",
    easy: "match 文の個別 case 句。『pattern: statements』または『pattern if condition: statements』。",
  },
];
