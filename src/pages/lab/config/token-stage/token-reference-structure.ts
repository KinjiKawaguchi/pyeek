/**
 * Python tokenize モジュールの構造トークン種別リファレンス
 * INDENT, DEDENT, NEWLINE, NL, ENDMARKER, ENCODING の詳細説明
 */

import type { TokenReference } from "./token-reference-basic";

/**
 * 構造トークン: ブロック構造・行終了・ファイル開始/終了を表現
 */
export const TOKEN_REFERENCE_STRUCTURE: TokenReference[] = [
  {
    name: "NEWLINE",
    detail:
      "論理行の終わり。実行可能な文が完結したことを示す「意味のある改行」です。if / for / def など複数行のブロックが始まる行の末尾、または単一行の文の末尾に出現します。カッコ () [] {} の途中に改行がある場合は NEWLINE ではなく NL が出現します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.NEWLINE",
    easy: "文が完結したことを示す改行。if: や def: の後、または1行の文の最後に出現します。",
  },
  {
    name: "NL",
    detail:
      "意味を持たない改行。カッコ () [] {} の途中の改行、空行、コメントだけの行、または論理行の途中の改行で出現します。プログラムの実行フローには影響しません。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.NL",
    easy: "意味を持たない改行。カッコの途中や空行、コメントだけの行の改行で出現します。",
  },
  {
    name: "INDENT",
    detail:
      "字下げの開始。if / for / def / class などのブロック内に入る際、インデントレベルが増加したことを示す構造トークン。トークンの内容（string 属性）は実際の空白文字（スペースまたはタブ）ですが、そのテキストそのものはトークンの形式上の意味を持たず、レベル管理の信号としてのみ機能します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.INDENT",
    easy: "字下げが1段深くなったことを示す信号。if: や def: の後のブロックで出現します。",
  },
  {
    name: "DEDENT",
    detail:
      "字下げの終了。ブロックが1段浅くなったことを示す構造トークン。INDENT に対応します。複数段階のデデント（ネストの深さが複数段階減少）する場合、複数の DEDENT トークンが連続で出現します。トークンの内容は空文字列です。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DEDENT",
    easy: "字下げが1段浅くなったことを示す信号。ブロックを抜ける際に出現します。",
  },
  {
    name: "ENDMARKER",
    detail:
      "入力の終端を示す最後のトークン。全てのコードが処理されたことを示す合図。トークン列は必ずこのトークンで終わります。tokenize.tokenize() や tokenize.generate_tokens() の最後に出現します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ENDMARKER",
    easy: "ファイルの終わりを示す最後のトークン。すべてのコードが処理されたことを示します。",
  },
  {
    name: "ENCODING",
    detail:
      "ファイルの文字エンコーディング情報。tokenize.tokenize()（バイト列を処理）を使う際に、最初に出現します。tokenize.generate_tokens()（既に文字列に変換されたテキスト）を使う場合は出現しません。Python の coding: utf-8 などの宣言から抽出されます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ENCODING",
    easy: "ファイルの文字エンコーディング（例: utf-8）を示すトークン。ファイルの最初に出現することもあります。",
  },
];
