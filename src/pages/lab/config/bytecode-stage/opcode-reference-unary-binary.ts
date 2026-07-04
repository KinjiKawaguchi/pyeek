/**
 * バイトコード逆アセンブルの単項・二項演算命令リファレンス
 * UNARY_NOT, UNARY_NEGATIVE, UNARY_INVERT, BINARY_OP, BINARY_SUBSCR, COMPARE_OP など
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * 単項演算と二項演算: 算術、比較、論理、ビット演算
 */
export const OPCODE_REFERENCE_UNARY_BINARY: OpcodeReference[] = [
  {
    name: "UNARY_NOT",
    detail:
      "スタック最上部の値に対して論理否定を適用し、結果をスタックに積みます。Python の not 演算子に相当。真偽値のみならず、あらゆるPythonオブジェクトの真偽性に基づいて判定されます。元の値はスタックから取り出されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-UNARY_NOT",
    easy: "スタックの値を論理否定（not）します。true なら false に、false なら true になります。",
  },
  {
    name: "UNARY_NEGATIVE",
    detail:
      "スタック最上部の数値の符号を反転します。Python の - 単項演算子に相当。整数・浮動小数点数・複素数すべてに対応しており、型に応じた符号反転が行われます。元の値はスタックから取り出されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-UNARY_NEGATIVE",
    easy: "スタックの値の符号を反転します。5 なら -5 に、-3 なら 3 になります。",
  },
  {
    name: "UNARY_INVERT",
    detail:
      "スタック最上部の整数のビット反転を行います。Python の ~ 演数演算子に相当。全ビットを反転（0は1に、1は0に）し、Python の arbitrary-precision 整数で計算されます。~x は -(x+1) と等価。元の値はスタックから取り出されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-UNARY_INVERT",
    easy: "スタックの値をビット反転します。~5 は -6 になります。",
  },
  {
    name: "BINARY_OP",
    detail:
      "スタックから2つの値を取り出し、指定の二項演算を実行してスタックに積みます。引数で演算子を指定（+, -, *, @, /, //, %, **, |, &, ^, <<, >>, など）。Python 3.11で導入され、旧来の BINARY_* 系の命令よりも汎用的で効率的な実装。型に応じた適切な演算処理が行われます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BINARY_OP",
    easy: "スタックの2つの値に演算を適用します。足し算、引き算、掛け算など、各種演算がこれでまかなわれます。",
  },
  {
    name: "BINARY_SLICE",
    detail:
      "スタックからシーケンス・スタートインデックス・終了インデックスを取り出し、スライシング（スタート:終了）を実行します。Python の x[start:end] を実行。負数インデックス・範囲外指定などの処理も含まれます。スタック上の値順序は（オブジェクト、スタート、終了）の3つ。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BINARY_SLICE",
    easy: "スタックのリストや文字列をスライシングします。x[1:3] のような範囲指定をここで実行します。",
  },
  {
    name: "BINARY_SUBSCR",
    detail:
      "スタックからシーケンス/マッピングとインデックスを取り出し、要素アクセスを実行します。Python の x[i] に相当。リスト・タプル・文字列・辞書など、あらゆるサブスクリプト可能なオブジェクトに対応しており、型に応じた効率的なアクセスが行われます。スタック順序は（オブジェクト、インデックス）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BINARY_SUBSCR",
    easy: "スタックのオブジェクトをインデックスで要素アクセスします。list[0] のような指定がここで実行されます。",
  },
  {
    name: "COMPARE_OP",
    detail:
      "スタックから2つの値を取り出し、指定の比較演算を実行します。引数で比較演算子を指定（<, <=, ==, !=, >, >=, in, not in, is, is not など）。Python の比較演算子すべてをカバー。チェーン可能な比較（a < b < c）も複数のCOMPARE_OP命令で実装されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-COMPARE_OP",
    easy: "スタックの2つの値を比較します。<, ==, > などの比較がここで実行されます。",
  },
  {
    name: "CONTAINS_OP",
    detail:
      "スタックからコンテナとメンバーシップテスト対象を取り出し、包含判定を実行します。Python の in と not in 演算子に相当。引数で in（0）または not in（1）を指定。リスト・集合・辞書・文字列などで効率的なメンバーシップ判定が行われます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-CONTAINS_OP",
    easy: "スタックの値がコンテナに含まれているかチェックします。'x' in [1, 2, 'x'] などの判定がここで実行されます。",
  },
  {
    name: "IS_OP",
    detail:
      "スタックから2つの値を取り出し、恒等性（同一オブジェクト）をテストします。Python の is と is not 演算子に相当。引数で is（0）または is not（1）を指定。メモリアドレスの比較で実装され、値の等価性ではなく「同じオブジェクトか」をチェック。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-IS_OP",
    easy: "スタックの2つの値が同じオブジェクトかチェックします。x is y のような判定がここで実行されます。",
  },
];
