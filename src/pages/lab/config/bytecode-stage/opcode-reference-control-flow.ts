/**
 * バイトコード逆アセンブルの制御フロー命令リファレンス
 * ジャンプ・分岐・ループ制御
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * 制御フロー: 条件分岐、無条件ジャンプ、ループ制御
 */
export const OPCODE_REFERENCE_CONTROL_FLOW: OpcodeReference[] = [
  {
    name: "JUMP_FORWARD",
    detail:
      "無条件で引数で指定されたオフセット先（命令オフセット）に前方ジャンプします。ジャンプ先は常に現在地より後方。ループの終了後や if文の else側をスキップする場合に使用。スタックは変更されません。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-JUMP_FORWARD",
    easy: "前方にジャンプします。if-else文の else側をスキップするときなどに使われます。",
  },
  {
    name: "JUMP_BACKWARD",
    detail:
      "無条件で引数で指定されたオフセット先に後方ジャンプします。ジャンプ先は常に現在地より前方。ループの開始部に戻るために使用。Python 3.11で導入され、前後の区別により最適化が可能。スタックは変更されません。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-JUMP_BACKWARD",
    easy: "後方にジャンプします。ループの開始部に戻るときに使われます。",
  },
  {
    name: "JUMP_BACKWARD_NO_INTERRUPT",
    detail:
      "後方ジャンプと同じですが、ジャンプ先でPEP 669のsys.monitoring割り込みを禁止します。無限ループの検出やシグナルハンドリング中のコンテキストスイッチを避ける必要があるループで使用。Python 3.11で導入。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-JUMP_BACKWARD_NO_INTERRUPT",
    easy: "後方ジャンプしますが、割り込みを禁止します。特殊なループで使われます。",
  },
  {
    name: "POP_JUMP_IF_TRUE",
    detail:
      "スタック最上部の値をポップして調べます。真ならば引数で指定されたオフセットにジャンプ。偽ならば次の命令に進みます。if文の真分岐で使用。値は真偽値に変換されず、オブジェクトの真偽性そのものが判定されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_JUMP_IF_TRUE",
    easy: "スタックの値が真ならジャンプ、偽なら次に進みます。if文の条件判定で使われます。",
  },
  {
    name: "POP_JUMP_IF_FALSE",
    detail:
      "スタック最上部の値をポップして調べます。偽ならば引数で指定されたオフセットにジャンプ。真ならば次の命令に進みます。if-else文の else分岐で使用。値は真偽値に変換されず、オブジェクトの真偽性そのものが判定されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_JUMP_IF_FALSE",
    easy: "スタックの値が偽ならジャンプ、真なら次に進みます。if-else文で使われます。",
  },
  {
    name: "POP_JUMP_IF_NONE",
    detail:
      "スタック最上部の値をポップして調べます。Noneならば引数で指定されたオフセットにジャンプ。Noneでなければ次の命令に進みます。None値の特殊チェック。if x is None の場合に使用。値の型が None か判定（真偽性ではなく）。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_JUMP_IF_NONE",
    easy: "スタックの値が None ならジャンプ、そうでなければ次に進みます。None チェックに使われます。",
  },
  {
    name: "POP_JUMP_IF_NOT_NONE",
    detail:
      "スタック最上部の値をポップして調べます。Noneでなければ引数で指定されたオフセットにジャンプ。Noneならば次の命令に進みます。None値の特殊チェック。if x is not None の場合に使用。値の型が None か判定。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-POP_JUMP_IF_NOT_NONE",
    easy: "スタックの値が None でなければジャンプ、None なら次に進みます。None チェックに使われます。",
  },
  {
    name: "FOR_ITER",
    detail:
      "for ループの各反復を制御します。スタック最上部の反復子から次の値を取得し、スタックに積みます。反復が終わればループの終了位置（引数で指定）にジャンプ。反復子が終了したら POP_TOP で反復子を削除後、ジャンプしています。ループ内をすべて実行後、FOR_ITER に戻ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-FOR_ITER",
    easy: "for ループの各反復を制御します。反復子から次の値を取得してループを続けます。",
  },
  {
    name: "END_FOR",
    detail:
      "for ループの終了マーカー。ループが正常に終了したことを示し、スタック上の例外情報などを適切に処理します。ブロック管理の情報を更新。for ループのコード内の最後に配置されることが多い。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-END_FOR",
    easy: "for ループの終了を示します。ループの処理を完了したことを記録します。",
  },
  {
    name: "END_SEND",
    detail:
      "ジェネレータの SEND コマンド（またはジェネレータ式）の終了を示します。ジェネレータ実行中に処理が完了したことをマーク。async for ループや yield from に関連した終了処理。ブロック管理情報を更新。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-END_SEND",
    easy: "ジェネレータまたは async 処理の終了を示します。",
  },
];
