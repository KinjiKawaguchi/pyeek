/**
 * バイトコード逆アセンブルの一般的な命令リファレンス
 * RESUME, NOP, PUSH_NULL, POP_TOP, COPY, SWAP, EXTENDED_ARG, SETUP_ANNOTATIONS, COPY_FREE_VARS など
 */

export interface OpcodeReference {
  name: string;
  /** 技術的に正確な詳細解説 */
  detail: string;
  /** 公式ドキュメントへのURL */
  docUrl: string;
  /** 初学者向けの平易な解説 */
  easy: string;
}

/**
 * 一般的な命令: スタック操作、スキップ、拡張引数、初期化処理
 */
export const OPCODE_REFERENCE_GENERAL: OpcodeReference[] = [
  {
    name: "RESUME",
    detail:
      "関数呼び出し時に実行準備完了を示す命令。Python 3.11で導入。関数のエントリポイント近くに配置され、例外情報の初期化と監視フック（PEP 669: sys.monitoring）のチェックポイントとして機能します。引数は監視レベル（デフォルト0）。通常の関数実行でも最初に1回必ず実行されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-RESUME",
    easy: "関数が呼び出されたときの準備処理。関数の最初に必ず実行されます。",
  },
  {
    name: "NOP",
    detail:
      "何もしない命令（No Operation）。プレースホルダーや最適化用途で使用されます。ジャンプターゲットの調整、デバッグビルド時のパディング、またはコード生成時の仮の命令として機能します。実行時の副作用はまったくありません。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-NOP",
    easy: "何もしない命令。通常は見えませんが、デバッグビルドなどで出現することがあります。",
  },
  {
    name: "PUSH_NULL",
    detail:
      "スタックにNULL（内部的には NULL_C値）を積みます。バイトコード内部の値で、Pythonの None と異なる特殊な内部値です。CALL系の命令の直前に置かれることが多く、メソッド呼び出しと関数呼び出しの区別に使用されます（メソッドの場合は SELF がここに置かれます）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-PUSH_NULL",
    easy: "スタックに特殊な「空き皿」を積みます。関数呼び出しの準備に使われることが多いです。",
  },
  {
    name: "POP_TOP",
    detail:
      "スタックの最上部の値を取り出して破棄します。値は使用されません。式の評価結果が使われない場合（例：関数呼び出しだけで戻り値を使わない）に出現します。スタックポインタを1段階低くします。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_TOP",
    easy: "スタックの上の値を捨てます。計算結果が使われないときに出現します。",
  },
  {
    name: "COPY",
    detail:
      "スタックの指定位置の値を複製してスタック最上部に積みます。引数で何段階下の値を複製するかを指定（1=最上部の1段下、2=2段下、など）。元の値はそのまま残ります。イミュータビリティを保ちながら値を再利用する際に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-COPY",
    easy: "スタックのどこかにある値を複製して、一番上に積みます。",
  },
  {
    name: "SWAP",
    detail:
      "スタック最上部と指定位置の値を入れ替えます。引数で何段階下の値と交換するかを指定（1=最上部1段下、2=2段下、など）。両方の値は置かれたままで、位置だけが入れ替わります。複数の値の順序を効率的に変更する際に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-SWAP",
    easy: "スタックの2つの値を入れ替えます。位置を変更するときに使われます。",
  },
  {
    name: "EXTENDED_ARG",
    detail:
      "後続の命令の引数を拡張します。バイトコード命令の引数は通常1バイト（0〜255）ですが、より大きい値が必要な場合、複数のEXTENDED_ARGが連続で出現し、各々が上位バイトを供給します。前に出現したEXTENDED_ARGからのシフト値は累積されます。大量の定数やローカル変数がある関数で出現します。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-EXTENDED_ARG",
    easy: "後ろの命令の引数を大きい数に拡張します。変数がたくさんある関数で出現します。",
  },
  {
    name: "FORMAT_VALUE",
    detail:
      "スタックの値をf-stringフォーマット仕様に従って文字列に変換します。引数フラグで変換タイプ（s/r/a）と書式指定子の有無を示します。Python 3.6で導入されたf-string構文の実行時処理に使用されます。BUILD_STRINGと組み合わせてf-string全体を構築します。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-FORMAT_VALUE",
    easy: "f-string内の値を文字列に変換します。f-stringの中身を処理するときに使われます。",
  },
  {
    name: "BUILD_STRING",
    detail:
      "スタックから指定個数の文字列を取り出し、連結して1つの文字列に統合します。f-stringの複数のパートを組み立てるために使用されます。FORMAT_VALUEで変換された複数の値を結合して、最終的なf-stringの完成形を作ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_STRING",
    easy: "複数の文字列をつなぎ合わせます。f-stringの全体を完成させるときに使われます。",
  },
  {
    name: "SETUP_ANNOTATIONS",
    detail:
      "関数内でアノテーション（型ヒント）を格納するための辞書を初期化します。from __future__ import annotations を使わない場合に、関数体内で型アノテーション付きの変数を扱う際に出現します。__annotations__ 辞書を作成または更新します。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-SETUP_ANNOTATIONS",
    easy: "型アノテーション用の辞書を初期化します。型ヒントを使う関数で出現します。",
  },
  {
    name: "COPY_FREE_VARS",
    detail:
      "クロージャの自由変数（外側のスコープから参照する変数）をセルに複製します。ネストされた関数定義時に、外側スコープの変数へのアクセスをセル経由で可能にするための準備処理。MAKE_FUNCTIONの前に使用され、クロージャの作成を完成させます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-COPY_FREE_VARS",
    easy: "外側の変数を内側の関数で使えるようにコピーします。ネストされた関数を作るときに使われます。",
  },
  {
    name: "GET_LEN",
    detail:
      "スタックの最上部のオブジェクトの長さを取得し、結果をスタックに積みます。len()組み込み関数の呼び出しを最適化した命令。オブジェクトが長さを持たない場合は例外が発生します。スタック上のオブジェクトは残されたままです。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_LEN",
    easy: "リストや文字列の長さを取得します。len()関数の呼び出しを最適化した命令です。",
  },
  {
    name: "PUSH_EXC_INFO",
    detail:
      "現在の例外情報（型・値・トレースバック）をスタックに積みます。例外ハンドリングの内部処理で使用され、except句の開始時に例外オブジェクトへのアクセスを可能にします。with文やtry-exceptブロックの処理に関連しています。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-PUSH_EXC_INFO",
    easy: "現在の例外情報をスタックに積みます。例外処理の内部で使われます。",
  },
  {
    name: "POP_EXCEPT",
    detail:
      "例外ハンドリングコンテキストを終了し、スタックから例外情報を取り出して破棄します。except句の処理完了後に実行され、except句内で設定された例外情報の参照を片付けます。WITH_EXCEPT_STARTと対応する終了処理です。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_EXCEPT",
    easy: "例外情報をスタックから削除して、例外処理を終了します。",
  },
  {
    name: "GET_ITER",
    detail:
      "スタック最上部のオブジェクトから反復子を取得し、スタックに積みます。for ループの開始時に、イテラブルから反復子を得るために使用。__iter__() メソッドが呼び出されます。イテラブルでない場合は TypeError。オブジェクトはスタックから削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-GET_ITER",
    easy: "スタックのイテラブルから反復子を取得します。for ループの開始で使われます。",
  },
  {
    name: "KW_NAMES",
    detail:
      "次のCALL命令で使用するキーワード引数の名前を指定します。引数は names_tupleの定数インデックス。呼び出す際にキーワード引数が含まれる場合、この命令がCALL直前に配置され、どの名前がキーワード引数かを示します。CALL_FUNCTION_EXの直前でも使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-KW_NAMES",
    easy: "次の関数呼び出しで、どの引数がキーワード引数かを指定します。",
  },
];
