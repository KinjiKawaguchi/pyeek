/**
 * Python ast モジュール 関数・クラス定義、非同期、ジェネレータノード型リファレンス
 * FunctionDef, AsyncFunctionDef, ClassDef, arguments, arg, keyword, Await, Yield, YieldFrom の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 関数・クラス・非同期・ジェネレータノード
 */
export const AST_REFERENCE_FUNCTIONS: AstReference[] = [
  {
    name: "FunctionDef",
    detail:
      "関数定義を表すノード。name フィールドに関数名（文字列）、args フィールドに arguments ノード（引数リスト）、body フィールドに関数本体の文のリスト、decorator_list フィールドにデコレータのリスト、returns フィールドに戻り値の型アノテーション（オプション）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.FunctionDef",
    easy: "関数定義。def func(arg1, arg2): ... など。",
  },
  {
    name: "AsyncFunctionDef",
    detail:
      "非同期関数定義を表すノード。async def で定義される関数。FunctionDef と同じ構造を持ちます。async/await 構文を使用する関数内でのみ現れます。Python 3.5以降。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.AsyncFunctionDef",
    easy: "非同期関数定義。async def func(arg): ... など。",
  },
  {
    name: "ClassDef",
    detail:
      "クラス定義を表すノード。name フィールドにクラス名（文字列）、bases フィールドに基底クラスのリスト、keywords フィールドにメタクラスなどのキーワード引数のリスト、body フィールドにクラス本体の文のリスト、decorator_list フィールドにデコレータのリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.ClassDef",
    easy: "クラス定義。class MyClass(Base): ... など。",
  },
  {
    name: "arguments",
    detail:
      "関数の引数リストを表すノード。posonlyargs フィールドに位置のみ引数、args フィールドに通常の位置引数、vararg フィールドに *args（arg ノード、オプション）、kwonlyargs フィールドにキーワード専用引数、kwarg フィールドに **kwargs（arg ノード、オプション）、defaults フィールドにデフォルト値のリスト、kw_defaults フィールドにキーワード専用引数のデフォルト値のリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.arguments",
    easy: "関数の引数リスト。def func(a, b=1, *args, c, **kwargs): の引数情報全体。",
  },
  {
    name: "arg",
    detail:
      "個別の関数引数を表すノード。arg フィールドに引数名（文字列）、annotation フィールドに型アノテーション（オプション）が格納されます。例：def func(x: int) の x は arg(arg='x', annotation=Name('int'))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.arg",
    easy: "個別の関数引数。def func(x, y: int): の x や y: int の部分。",
  },
  {
    name: "keyword",
    detail:
      "キーワード引数を表すノード。関数呼び出しのキーワード引数、またはクラス定義のキーワード引数。arg フィールドに引数名（文字列、**kwargs 展開の場合は None）、value フィールドに値の式が格納されます。例：func(a=1, **kw) は Call(..., keywords=[keyword(arg='a', value=Constant(1)), keyword(arg=None, value=Name('kw'))])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.keyword",
    easy: "キーワード引数。func(key=value, **dict) など。",
  },
  {
    name: "Await",
    detail:
      "await 式を表すノード。await future_or_task のような式。value フィールドに await される値（通常は Coroutine または Future）が格納されます。async 関数内のみで使用できます。Python 3.5以降。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Await",
    easy: "非同期待機。await async_func()、await future など。",
  },
  {
    name: "Yield",
    detail:
      "yield 式を表すノード。ジェネレータ関数で値を生成します。value フィールドに yield される値（オプション）が格納されます。yield だけで None が yield されます。例：yield x は Yield(value=Name('x'))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Yield",
    easy: "ジェネレータの値生成。yield x、yield など。",
  },
  {
    name: "YieldFrom",
    detail:
      "yield from 式を表すノード。別のイテラブルから値を委譲します。value フィールドに委譲先のイテラブル（expr）が格納されます。例：yield from other_iter は YieldFrom(value=Name('other_iter'))。Python 3.3以降。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.YieldFrom",
    easy: "ジェネレータ委譲。yield from other_generator など。",
  },
];
