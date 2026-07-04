/**
 * Python tokenize モジュールの f-string トークン種別リファレンス
 * Python 3.12 で導入された FSTRING_START, FSTRING_MIDDLE, FSTRING_END の詳細説明
 */

import type { TokenReference } from "./token-reference-basic";

/**
 * F-string トークン: Python 3.12 で導入された f-string の細分化トークン
 */
export const TOKEN_REFERENCE_FSTRING: TokenReference[] = [
  {
    name: "FSTRING_START",
    detail:
      'F-string の開始。f"、f\'、f"""、f\'\'\' など f-string の開始を示します。Python 3.12 以前では STRING トークンで全体が表現されていましたが、3.12 以降では埋め込み式を含む f-string は複数のトークンに分割されます。FSTRING_START は f" などの開始部分のみを表します。',
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "F-string の開始。f\" や f' で始まる部分を示します。",
  },
  {
    name: "FSTRING_MIDDLE",
    detail:
      'F-string のリテラルテキスト部分のみ。{ と } に囲まれた埋め込み式は含まれず、NAME/OP/NUMBER 等の通常のトークンとして別に出現する。埋め込み式が複数あれば、その間のテキストごとに複数の FSTRING_MIDDLE が現れる。例えば f"a {x} b" は FSTRING_START "f\\"" → FSTRING_MIDDLE "a " → OP "{" → NAME "x" → OP "}" → FSTRING_MIDDLE " b" → FSTRING_END "\\"" と分解される。',
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "F-string の中の、文字としてそのまま表示される部分だけ。{ } の中身は別のトークンとして扱われる。",
  },
  {
    name: "FSTRING_END",
    detail: "F-string の終了。\" や ' などの閉じ引用符を示します。FSTRING_START に対応します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "F-string の終わり。閉じ引用符 \" や ' を示します。",
  },
];
