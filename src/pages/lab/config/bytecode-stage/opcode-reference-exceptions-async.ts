/**
 * バイトコード逆アセンブルの例外処理・async/コルーチン命令リファレンス
 * RAISE_VARARGS, WITH_EXCEPT_START, async/await, yield など
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * 例外処理、context manager (with), async/await, ジェネレータ
 */
export const OPCODE_REFERENCE_EXCEPTIONS_ASYNC: OpcodeReference[] = [
  {
    name: "RAISE_VARARGS",
    detail:
      "例外を発生させます。引数で例外のタイプを指定（0=なし/再発生, 1=例外, 2=例外と原因）。スタックから例外オブジェクト（あれば）を取り出し、例外を投げます。raise文のすべてのバリエーション（raise, raise e, raise e from cause）をカバー。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RAISE_VARARGS",
    easy: "例外を発生させます。raise 文で使われます。",
  },
  {
    name: "RERAISE",
    detail:
      "現在の例外を再発生させます。引数なし。except ブロック内で例外情報が保持されている場合に、その例外を再度投げます。raise（引数なし）と等価。例外情報をスタックから取得して再度発生させます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RERAISE",
    easy: "現在の例外を再発生させます。except ブロック内での再発生で使われます。",
  },
  {
    name: "CHECK_EXC_MATCH",
    detail:
      "スタックから例外型と例外クラスを取り出し、その例外型がクラスに一致するか判定します。except clause でどの except ブロックに入るかを判定。isinstance() でのチェックと同様。真偽値をスタックに積みます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CHECK_EXC_MATCH",
    easy: "例外型が指定クラスに一致するか判定します。except 句で例外をフィルタリングするときに使われます。",
  },
  {
    name: "WITH_EXCEPT_START",
    detail:
      "with 文の終了処理を開始します。スタックから（例外型、例外値、トレースバック）を取り出し、context manager の __exit__ メソッドを呼び出すための準備。例外を抑止するか再発生させるかの判定が WITH_EXCEPT_START 直後の分岐命令で行われます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-WITH_EXCEPT_START",
    easy: "with 文の終了処理を開始します。__exit__ メソッドを呼び出すための準備がここで行われます。",
  },
  {
    name: "BEFORE_WITH",
    detail:
      "with 文の開始時に context manager オブジェクトから __enter__ メソッドを取得・呼び出して準備します。スタック最上部の context manager オブジェクトから __enter__ を呼び出し、戻り値がスタックに積まれます。with の as 変数にこの値が代入されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BEFORE_WITH",
    easy: "with 文の開始時に __enter__ メソッドを呼び出して準備します。",
  },
  {
    name: "BEFORE_ASYNC_WITH",
    detail:
      "async with 文の開始時に async context manager オブジェクトから __aenter__ メソッドを取得・呼び出して準備します。スタック最上部の async context manager オブジェクトから __aenter__ を非同期で呼び出し、その awaitable がスタックに積まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BEFORE_ASYNC_WITH",
    easy: "async with 文の開始時に __aenter__ メソッドを呼び出して準備します。",
  },
  {
    name: "END_ASYNC_FOR",
    detail:
      "async for ループの終了マーカー。ループが正常に終了したことを示し、非同期反復子の cleanup を実行します。async for ループのコード内の最後に配置。ブロック管理の情報を更新。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-END_ASYNC_FOR",
    easy: "async for ループの終了を示します。ループの処理を完了したことを記録します。",
  },
  {
    name: "GET_AWAITABLE",
    detail:
      "スタック最上部の値をawaitable（await可能なオブジェクト）に変換します。awaitable でない場合は TypeError を発生させます。async 関数・ジェネレータ・非同期イテレータなど、await 式の前処理として使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_AWAITABLE",
    easy: "スタックの値を await 可能なオブジェクトに変換します。",
  },
  {
    name: "GET_AITER",
    detail:
      "スタック最上部の値を非同期反復子（async iterator）に変換します。async for ループの開始時に反復子を準備。__aiter__メソッドが呼び出されます。非同期反復子でない場合は TypeError。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_AITER",
    easy: "スタックの値を async for で使える非同期反復子に変換します。",
  },
  {
    name: "GET_ANEXT",
    detail:
      "スタック最上部の非同期反復子から次の値を取得します。async for ループの各反復で実行。__anext__ メソッドが呼び出され、awaitable が返されます。その awaitable が次の SEND または GET_AWAITABLE でawaitされます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_ANEXT",
    easy: "スタックの非同期反復子から次の値を取得します。async for ループで使われます。",
  },
  {
    name: "GET_YIELD_FROM_ITER",
    detail:
      "スタック最上部の値を yield from の対象となるイテラブルに変換します。通常のイテラブルを反復子に、またはジェネレータはそのまま使用。yield from の前置処理として使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_YIELD_FROM_ITER",
    easy: "スタックの値を yield from で使えるイテラブルに変換します。",
  },
  {
    name: "YIELD_VALUE",
    detail:
      "スタック最上部の値をジェネレータから yield（生成）し、実行を一時停止します。yield 式の評価。呼び出し元に値が返され、次に send() または next() で再開されるまで待機。yield の戻り値（send() で送られた値）がスタックに積まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-YIELD_VALUE",
    easy: "スタックの値をジェネレータから yield します。yield 文で使われます。",
  },
  {
    name: "SEND",
    detail:
      "ジェネレータ・非同期関数の実行を再開し、値を send します。スタック最上部の awaitable/generator に対して send() メソッド相当の処理を実行。async for の各反復や yield from での値の送受信で使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-SEND",
    easy: "ジェネレータまたは非同期処理に値を send して実行を再開します。",
  },
  {
    name: "CLEANUP_THROW",
    detail:
      "ジェネレータ・非同期関数の cleanup 処理で例外を投げます。ジェネレータが途中で close() された場合の例外ハンドリング。GeneratorExit 例外が throw() される処理をサポート。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CLEANUP_THROW",
    easy: "ジェネレータのクリーンアップ時に例外を投げます。",
  },
  {
    name: "IMPORT_NAME",
    detail:
      "モジュールをインポートしてスタックに積みます。引数はモジュール名テーブルのインデックス。import 文で使用。__import__() 組み込き関数を呼び出し、モジュールオブジェクトをスタックに積みます。from X import Y の場合も X をインポートしますが、その後 IMPORT_FROM で Y を取り出します。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-IMPORT_NAME",
    easy: "モジュールをインポートします。import 文で使われます。",
  },
  {
    name: "IMPORT_FROM",
    detail:
      "スタック最上部のモジュールから指定の属性をインポートしてスタックに積みます。引数は属性名テーブルのインデックス。from X import Y で Y に相当。モジュールからの getattr 操作。属性がない場合は ImportError。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-IMPORT_FROM",
    easy: "モジュールから指定の属性をインポートします。from X import Y で使われます。",
  },
];
