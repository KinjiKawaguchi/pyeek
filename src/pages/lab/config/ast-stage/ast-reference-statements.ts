/**
 * Python ast モジュール 文・ステートメントノード型リファレンス
 * Expr, Assign, AugAssign, AnnAssign, Delete, Return, Pass, Break, Continue, Raise, Assert の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 文ノード: プログラムの実行単位となるステートメント
 */
export const AST_REFERENCE_STATEMENTS: AstReference[] = [
  {
    name: "Expr",
    detail:
      "式文（式をそのまま文として実行）を表すノード。value フィールドに式が格納されます。print(x) のような関数呼び出し、式を単独で書いた場合など、式の結果が使用されずに破棄される場合に現れます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Expr",
    easy: "式をそのまま文として書いたもの。print(x) や func() など。",
  },
  {
    name: "Assign",
    detail:
      "代入文を表すノード。targets フィールドに代入先のリスト（複数の等号で複数の代入が可能）、value フィールドに右辺の式が格納されます。例：x = y = 1 の場合 targets=[Name('x', ctx=Store()), Name('y', ctx=Store())]。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Assign",
    easy: "代入。x = 1、a = b = 5 など。",
  },
  {
    name: "AugAssign",
    detail:
      "拡張代入文（+=, -=, *=など）を表すノード。target フィールドに代入先、op フィールドに演算子（Add, Sub, Mult など operator サブクラス）、value フィールドに右辺の式が格納されます。例：x += 1 は AugAssign(target=Name('x'), op=Add(), value=Constant(1))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.AugAssign",
    easy: "拡張代入。x += 1、s *= 2 など。",
  },
  {
    name: "AnnAssign",
    detail:
      "型アノテーション付き代入を表すノード。target フィールドに代入先、annotation フィールドに型注釈の式、value フィールドに初期値（オプション）、simple フィールドに単純な代入かどうかが格納されます。例：x: int = 5 は AnnAssign(target=Name('x'), annotation=Name('int'), value=Constant(5))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.AnnAssign",
    easy: "型注釈付きの代入。x: int = 5、items: list[str] など。",
  },
  {
    name: "Delete",
    detail:
      "削除文（del）を表すノード。targets フィールドに削除対象のリストが格納されます。削除対象は Name, Attribute, Subscript など Load/Store/Del 文脈を取れる式です。例：del x, y.z は Delete(targets=[Name('x'), Attribute(...)])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Delete",
    easy: "削除。del x、del obj.attr など。",
  },
  {
    name: "Return",
    detail:
      "戻り値文を表すノード。関数内で使用されます。value フィールドに戻り値の式が格納されます。value が None の場合は return（値を指定しない）を意味します。関数外では構文エラーになりますが、AST としてはパース可能です。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Return",
    easy: "関数からの戻り値。return x、return など。",
  },
  {
    name: "Pass",
    detail:
      "パス文（何もしない）を表すノード。フィールドなし。if x: pass のようにブロックの中身が空の場合、または意図的に何もしたくない場合に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Pass",
    easy: "何もしない。if x: pass のようにブロック内で何も実行しない。",
  },
  {
    name: "Break",
    detail:
      "ループ脱出文を表すノード。for/while ループ内で使用されます。フィールドなし。break に遭遇すると、そのループを即座に終了し、ループの次の文に制御が移ります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Break",
    easy: "ループから抜ける。for x in items: ... break。",
  },
  {
    name: "Continue",
    detail:
      "ループ継続文を表すノード。for/while ループ内で使用されます。フィールドなし。continue に遭遇すると、現在のイテレーションをスキップし、次のイテレーションに進みます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Continue",
    easy: "ループの次の反復に進む。for x in items: ... continue。",
  },
  {
    name: "Raise",
    detail:
      "例外発生文を表すノード。exc フィールドに発生させる例外、cause フィールドに原因例外（from 句）が格納されます。例：raise ValueError('msg') は Raise(exc=Call(...), cause=None)。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Raise",
    easy: "例外を発生させる。raise ValueError('error')、raise ... from cause など。",
  },
  {
    name: "Assert",
    detail:
      "アサーション文を表すノード。test フィールドに条件式、msg フィールドに失敗時のメッセージ（オプション）が格納されます。例：assert x > 0, 'x must be positive' は Assert(test=Compare(...), msg=Constant('...'))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Assert",
    easy: "条件が真であることを確認する。assert x > 0、assert x is not None など。",
  },
];
