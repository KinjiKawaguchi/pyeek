/**
 * バイトコード逆アセンブルの関数・メソッド呼び出し命令リファレンス
 * CALL, MAKE_FUNCTION, RETURN_* など
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * 関数・メソッド呼び出しと戻り値処理
 */
export const OPCODE_REFERENCE_CALLS: OpcodeReference[] = [
  {
    name: "CALL",
    detail:
      "関数・メソッドを呼び出します。スタックから引数個数分の値と関数オブジェクトを取り出し、関数を実行。引数は呼び出し引数の個数。PUSH_NULL で積まれたNULL値の有無により、関数呼び出しとメソッド呼び出しが区別されます。戻り値がスタックに積まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CALL",
    easy: "関数またはメソッドを呼び出します。最も基本的な関数呼び出し命令です。",
  },
  {
    name: "CALL_FUNCTION_EX",
    detail:
      "関数を引数展開で呼び出します。スタックから関数オブジェクトと、*args の展開用シーケンスと **kwargs の展開用辞書を取り出し、それらを展開して関数を実行。引数フラグで *args と **kwargs の有無を指定（ビット0=**kwargs, ビット1=*args）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CALL_FUNCTION_EX",
    easy: "関数を引数展開で呼び出します。func(*args, **kwargs) の形式で呼ぶときに使われます。",
  },
  {
    name: "CALL_INTRINSIC_1",
    detail:
      "組み込み関数（バイトコード内部用）をスタックの1つの値で呼び出します。引数は組み込み関数の種類を指定。Python内部での特殊な処理（例：BUILD_STRING の文字列結合、PRINT_EXPRの表現など）を効率的に実装。ユーザーコードからは通常見えません。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CALL_INTRINSIC_1",
    easy: "内部組み込み関数を1つの値で呼び出します。通常は見えない内部処理です。",
  },
  {
    name: "CALL_INTRINSIC_2",
    detail:
      "組み込み関数（バイトコード内部用）をスタックの2つの値で呼び出します。引数は組み込み関数の種類を指定。Python内部での特殊な処理を効率的に実装。例えば例外ハンドリングやメモリ操作など。ユーザーコードからは通常見えません。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CALL_INTRINSIC_2",
    easy: "内部組み込み関数を2つの値で呼び出します。通常は見えない内部処理です。",
  },
  {
    name: "MAKE_FUNCTION",
    detail:
      "バイトコードから関数オブジェクトを作成します。スタックからコードオブジェクト・デフォルト値・クロージャ・アノテーション・クロージャセルなどを取り出し、新しい関数オブジェクトを構築。引数フラグで各要素の有無を指定（ビット0=デフォルト値, ビット1=kwonlyデフォルト, ビット2=アノテーション, ビット3=クロージャセル）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MAKE_FUNCTION",
    easy: "バイトコードから関数オブジェクトを作成します。関数定義（def）で使われます。",
  },
  {
    name: "RETURN_VALUE",
    detail:
      "スタック最上部の値を関数の戻り値として返却し、関数を終了します。呼び出し元に制御が戻ります。スタックから値を取り出され、その値が呼び出し側で受け取られます。関数の最後に必ず1回は出現（明示的 or 暗黙的）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RETURN_VALUE",
    easy: "スタックの値を戻り値として返して関数を終了します。return文で使われます。",
  },
  {
    name: "RETURN_CONST",
    detail:
      "定数を戻り値として返却し、関数を終了します。引数は定数テーブルのインデックス。RETURN_VALUE と異なり、スタックを参照せず直接定数を返す最適化版。None を返す場合など、頻繁に出現。関数終了時に呼び出し元へ制御が戻ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RETURN_CONST",
    easy: "定数を戻り値として返して関数を終了します。None を返すときなどに最適化されます。",
  },
  {
    name: "RETURN_GENERATOR",
    detail:
      "関数からジェネレータオブジェクトを返却し、ジェネレータ関数の初期化を完了します。yield を含む関数の開始時に実行。ジェネレータ実行エンジンを初期化し、呼び出し元に generator オブジェクトを返します。ジェネレータの準備処理に使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RETURN_GENERATOR",
    easy: "ジェネレータオブジェクトを返して初期化します。yield を含む関数で使われます。",
  },
];
