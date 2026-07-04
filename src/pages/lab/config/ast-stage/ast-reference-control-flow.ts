/**
 * Python ast モジュール 制御フローノード型リファレンス
 * If, While, For, With, Try, TryStar, ExceptHandler, Global, Nonlocal, withitem の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 制御フロー・スコープノード: 条件分岐、ループ、例外処理、スコープ
 */
export const AST_REFERENCE_CONTROL_FLOW: AstReference[] = [
  {
    name: "If",
    detail:
      "if 文を表すノード。test フィールドに条件式、body フィールドに真の場合の文のリスト、orelse フィールドに偽の場合の文のリスト（elif/else）が格納されます。例：if x: ... elif y: ... else: ... は orelse に elif の If ノードまたは else の文リストが含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.If",
    easy: "条件分岐。if x: ... elif y: ... else: ... など。",
  },
  {
    name: "While",
    detail:
      "while ループを表すノード。test フィールドに条件式、body フィールドにループ本体の文のリスト、orelse フィールドに else 句の文のリスト（ループが正常終了した場合に実行）が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.While",
    easy: "条件付きループ。while condition: ... など。",
  },
  {
    name: "For",
    detail:
      "for ループを表すノード。target フィールドにループ変数（複数の代入をサポート）、iter フィールドにイテラブル、body フィールドにループ本体の文のリスト、orelse フィールドに else 句の文のリストが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.For",
    easy: "反復ループ。for x in items: ... など。",
  },
  {
    name: "AsyncFor",
    detail:
      "async for ループを表すノード。async/await が可能な環境でのみ使用されます。For と同じ構造で target, iter, body, orelse フィールドを持ちます。iter は非同期イテラブルである必要があります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.AsyncFor",
    easy: "非同期反復ループ。async for x in async_iterable: ... など。",
  },
  {
    name: "With",
    detail:
      "with 文を表すノード。items フィールドに withitem ノードのリスト（各 with アイテム）、body フィールドにブロック内の文のリストが格納されます。with の各句は withitem ノードで表現されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.With",
    easy: "コンテキストマネージャ。with open(file) as f: ... など。",
  },
  {
    name: "AsyncWith",
    detail:
      "async with 文を表すノード。async/await が可能な環境でのみ使用されます。With と同じ構造で items と body フィールドを持ちます。非同期コンテキストマネージャを使用する際に用いられます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.AsyncWith",
    easy: "非同期コンテキストマネージャ。async with resource as r: ... など。",
  },
  {
    name: "Try",
    detail:
      "try-except-finally 文を表すノード。body フィールドに try ブロック、handlers フィールドに ExceptHandler ノードのリスト（except 句）、orelse フィールドに else 句、finalbody フィールドに finally 句が格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Try",
    easy: "例外処理。try: ... except Exception: ... else: ... finally: ... など。",
  },
  {
    name: "TryStar",
    detail:
      "try-except* 文を表すノード。PEP 654で導入された例外グループの処理。Try と同じ構造を持ちます。複数の例外グループを同時に処理できます。Python 3.11以降。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.TryStar",
    easy: "例外グループ処理。try: ... except* ExceptionGroup: ... など。",
  },
  {
    name: "ExceptHandler",
    detail:
      "except 句を表すノード。type フィールドに例外型、name フィールドに例外名（as name）、body フィールドに except ブロックの文のリストが格納されます。例：except ValueError as e: ... は ExceptHandler(type=Name('ValueError'), name='e', body=[...])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.ExceptHandler",
    easy: "例外キャッチ。except ValueError as e: ... など。",
  },
  {
    name: "Global",
    detail:
      "global 文を表すノード。関数内で global スコープの変数を参照できるようにします。names フィールドに文字列のリストが格納されます。例：global x, y は Global(names=['x', 'y'])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Global",
    easy: "グローバル変数宣言。global x、global a, b など。",
  },
  {
    name: "Nonlocal",
    detail:
      "nonlocal 文を表すノード。ネストされた関数内で、外側の関数のスコープの変数を参照できるようにします。names フィールドに文字列のリストが格納されます。例：nonlocal x は Nonlocal(names=['x'])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Nonlocal",
    easy: "外側スコープ変数宣言。nonlocal x、nonlocal a, b など。",
  },
  {
    name: "withitem",
    detail:
      "with 文内の個別の『context_expr as var』部分を表す補助ノード。context_expr フィールドにコンテキストマネージャの式、optional_vars フィールドに as 後の変数（オプション）が格納されます。例：with open(f) as file: ... は withitem(context_expr=Call(...), optional_vars=Name('file'))。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.withitem",
    easy: "with 句の個別アイテム。『expr as var』の部分。",
  },
];
