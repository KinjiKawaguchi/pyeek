/**
 * Python ast モジュール トップレベル・型関連ノード型リファレンス
 * Module, Interactive, Expression, FunctionType, TypeVar, TypeVarTuple, ParamSpec, TypeAlias, TypeIgnore の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * トップレベル・型関連ノード: モジュール、型パラメータ、特殊ノード
 */
export const AST_REFERENCE_TOP_LEVEL: AstReference[] = [
  {
    name: "Module",
    detail:
      "モジュール全体を表すノード。Pyeek がデフォルトで生成するルートノード（ast.parse(src) のデフォルト mode='exec' で常に Module を返す）。body フィールドにモジュール内のすべての文のリスト、type_ignores フィールドに type: ignore コメント情報のリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Module",
    easy: "Python スクリプト全体。ファイルの内容全体を表すルートノード。",
  },
  {
    name: "Interactive",
    detail:
      "インタラクティブモード（対話型Python、REPL）用のルートノード。ast.parse(src, mode='single') で生成されます。Pyeek はデフォルト mode='exec' を使用するため、このアプリケーション内では出現しません。技術的には body フィールドに文のリストを持ちます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Interactive",
    easy: "対話型 REPL 用ノード（Pyeek では出現しません）。",
  },
  {
    name: "Expression",
    detail:
      "式モード用のルートノード。ast.parse(src, mode='eval') で生成されます。単一の式だけをパースする場合に使用。Pyeek はデフォルト mode='exec' を使用するため、このアプリケーション内では出現しません。body フィールドに単一の式が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Expression",
    easy: "式モード用ノード（Pyeek では出現しません）。",
  },
  {
    name: "FunctionType",
    detail:
      "関数型モード用のルートノード。ast.parse(src, mode='func_type') で生成されます。関数のシグネチャ型をパースする際に使用（Python の型解析ツール向け）。Pyeek はデフォルト mode='exec' を使用するため、このアプリケーション内では出現しません。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.FunctionType",
    easy: "関数型モード用ノード（Pyeek では出現しません）。",
  },
  {
    name: "TypeVar",
    detail:
      "型パラメータ（型変数）を表すノード。PEP 695（Python 3.12新文法）で導入。def f[T](...): ...、class C[T]: ...、type Alias[T] = ... のように、関数・クラス・type エイリアスの角括弧 [] 内で宣言される型パラメータに使われます（typing.TypeVar('T') という古い書き方とは別物）。FunctionDef/ClassDef/TypeAlias の type_params フィールドのリスト内に出現します。name フィールドに型パラメータ名（文字列）、bound フィールドに上限型（def f[T: int]: ... のように : の後に書いた場合のみ、それ以外は None）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.TypeVar",
    easy: "型パラメータ。def f[T](x: T) -> T: ... のように、関数名などの直後の [ ] の中に書く型変数を表します。",
  },
  {
    name: "TypeVarTuple",
    detail:
      "可変長の型パラメータを表すノード。PEP 695（Python 3.12新文法）で導入。def f[*Ts](...): ... のように、type_params 内でアスタリスク付きで宣言されます（typing.TypeVarTuple('Ts') とは別物）。name フィールドに名前（文字列、アスタリスクは含まない）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.TypeVarTuple",
    easy: "可変長の型パラメータ。def f[*Ts](...): ... のように、[ ] の中で * を付けて書きます。",
  },
  {
    name: "ParamSpec",
    detail:
      "関数シグネチャ全体を表す型パラメータ。PEP 695（Python 3.12新文法）で導入。def f[**P](...): ... のように、type_params 内で ** 付きで宣言されます（typing.ParamSpec('P') とは別物）。name フィールドに名前（文字列、** は含まない）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.ParamSpec",
    easy: "関数の引数の型をまとめて表す型パラメータ。def f[**P](...): ... のように、[ ] の中で ** を付けて書きます。",
  },
  {
    name: "TypeAlias",
    detail:
      "型エイリアスを表すノード。PEP 695（Python 3.12新文法）で導入。type Name = SomeType や type Name[T] = SomeType[T] のような type 文全体に対応します。name フィールドはエイリアス名を表す Name ノード（単純な文字列ではない点に注意）、type_params フィールドに型パラメータ（TypeVar 等）のリスト、value フィールドにエイリアスされる型の式が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.TypeAlias",
    easy: "型エイリアス。type MyType = list[str] や type MyList[T] = list[T] など。",
  },
  {
    name: "TypeIgnore",
    detail:
      "type: ignore コメント情報を表すノード。type_ignores フィールド（Module ノード内）に格納されます。lineno フィールドにコメントの行番号、tag フィールドにコメント後の修飾子（例：type: ignore[error-code]）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.TypeIgnore",
    easy: "type: ignore コメント情報。# type: ignore のコメントが格納されます。",
  },
];
