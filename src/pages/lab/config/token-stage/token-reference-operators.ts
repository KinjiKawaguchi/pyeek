/**
 * Python tokenize モジュールの演算子・記号トークン種別リファレンス
 * EXACT_TOKEN_TYPES が定義する括弧・演算子・記号の詳細説明
 */

import type { TokenReference } from "./token-reference-basic";

/**
 * 演算子・記号トークン: OP, LPAR, RPAR, LSQB, RSQB, LBRACE, RBRACE, COLON,
 * COMMA, SEMI, PLUS, MINUS, STAR, SLASH, VBAR, AMPER, LESS, GREATER, EQUAL,
 * DOT, PERCENT, EQEQUAL, NOTEQUAL, LESSEQUAL, GREATEREQUAL, TILDE, CIRCUMFLEX,
 * LEFTSHIFT, RIGHTSHIFT, DOUBLESTAR, PLUSEQUAL, MINEQUAL, STAREQUAL, SLASHEQUAL,
 * PERCENTEQUAL, AMPEREQUAL, VBAREQUAL, CIRCUMFLEXEQUAL, LEFTSHIFTEQUAL,
 * RIGHTSHIFTEQUAL, DOUBLESTAREQUAL, DOUBLESLASH, DOUBLESLASHEQUAL, AT, ATEQUAL,
 * RARROW, ELLIPSIS, COLONEQUAL, EXCLAMATION
 */
export const TOKEN_REFERENCE_OPERATORS: TokenReference[] = [
  {
    name: "OP",
    detail:
      "演算子または記号トークン。OP 型は最も汎用的な演算子型ですが、Python 3.0 以降の tokenize モジュールではより細かく EXACT_TOKEN_TYPES で細分化されており、個々の演算子記号（+, -, *, /, (, ), [, ], {, }, :, ;, . など）は専用の型が割り当てられます。OP 型が実際に出現することは稀で、多くの場合は LPAR, RPAR, PLUS, MINUS など個別の型で表現されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "演算子や記号。+, -, =, (, ), [ ] など。新しい Python では個別の種類に細かく分かれます。",
  },
  {
    name: "LPAR",
    detail:
      "左丸括弧 '('。関数呼び出しの引数リスト、タプルの括弧、条件式の括弧など、多くの構文要素で出現します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "左丸括弧 '('。",
  },
  {
    name: "RPAR",
    detail: "右丸括弧 ')'。LPAR に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "右丸括弧 ')'。",
  },
  {
    name: "LSQB",
    detail: "左角括弧 '['。リスト・辞書・スライス表記の開始を示します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "左角括弧 '['。",
  },
  {
    name: "RSQB",
    detail: "右角括弧 ']'。LSQB に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "右角括弧 ']'。",
  },
  {
    name: "LBRACE",
    detail: "左波括弧 '{'。辞書・集合・f-string の埋め込み式の開始を示します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "左波括弧 '{'。",
  },
  {
    name: "RBRACE",
    detail: "右波括弧 '}'。LBRACE に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "右波括弧 '}'。",
  },
  {
    name: "COMMA",
    detail: "カンマ ','。関数の引数、タプル、リスト、辞書などの要素を区切ります。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "カンマ ','。複数の要素を区切ります。",
  },
  {
    name: "COLON",
    detail:
      "コロン ':'。if / for / def などのブロック構文の開始、辞書のキーと値の区切り、スライス表記など多くの場所で出現します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "コロン ':'。ブロック（if: や def: など）や辞書で出現します。",
  },
  {
    name: "SEMI",
    detail:
      "セミコロン ';'。複数の文を1行で区切る用途で使用されます（Python では一般的ではありません）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "セミコロン ';'。複数の文を区切ります（あまり使いません）。",
  },
  {
    name: "DOT",
    detail:
      "ドット / ピリオド '.'。属性アクセス、メソッド呼び出し、スライスの範囲指定に使用されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "ドット '.'。オブジェクトの属性やメソッドにアクセスします。",
  },
  {
    name: "EQUAL",
    detail: "等号・代入演算子 '='。変数への代入や関数の引数のデフォルト値指定などで用いられます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "等号 '='。変数に値を代入します。",
  },
  {
    name: "PLUS",
    detail: "プラス記号 '+'。加算演算子。また PLUSEQUAL（+=）の構成要素。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "プラス記号 '+'。足し算に使います。",
  },
  {
    name: "MINUS",
    detail: "マイナス記号 '-'。減算演算子、負号、矢印演算子（->）の構成要素。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "マイナス記号 '-'。引き算や負の数に使います。",
  },
  {
    name: "STAR",
    detail: "アスタリスク '*'。乗算演算子、べき乗（**）の構成要素、アンパック演算子（*args）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "アスタリスク '*'。掛け算や *args で使います。",
  },
  {
    name: "SLASH",
    detail: "スラッシュ / '/'。除算演算子、フロア除算（//）の構成要素。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "スラッシュ '/'。割り算に使います。",
  },
  {
    name: "PERCENT",
    detail: "パーセント記号 '%'。モジュロ（剰余）演算子、文字列フォーマット演算子。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "パーセント記号 '%'。割り算の余りを求めます。",
  },
  {
    name: "AMPER",
    detail: "アンパーサンド '&'。ビット単位 AND 演算子。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "アンパーサンド '&'。ビット演算で使います。",
  },
  {
    name: "VBAR",
    detail: "縦棒 '|'。ビット単位 OR 演算子、型ヒントの和（Union）表記。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "縦棒 '|'。ビット演算や型ヒントで使います。",
  },
  {
    name: "CIRCUMFLEX",
    detail: "キャレット / サーカムフレックス '^'。ビット単位 XOR 演算子。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "キャレット '^'。ビット演算で使います。",
  },
  {
    name: "TILDE",
    detail: "チルダ '~'。ビット単位 NOT 演算子（ビット反転）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "チルダ '~'。ビット反転に使います。",
  },
  {
    name: "LESS",
    detail: "小なり演算子 '<'。比較演算子。またはビットシフト（<<）の構成要素。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "小なり記号 '<'。大小比較に使います。",
  },
  {
    name: "GREATER",
    detail: "大なり演算子 '>'。比較演算子。またはビットシフト（>>）の構成要素。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "大なり記号 '>'。大小比較に使います。",
  },
  {
    name: "EQEQUAL",
    detail: "等価演算子 '=='。2つの値が等しいかどうかを比較します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "等価演算子 '=='。2つの値が同じかどうかを比較します。",
  },
  {
    name: "NOTEQUAL",
    detail: "不等価演算子 '!='。2つの値が異なるかどうかを比較します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "不等価演算子 '!='。2つの値が異なるかどうかを比較します。",
  },
  {
    name: "LESSEQUAL",
    detail: "小なり等号演算子 '<='。左辺が右辺以下であるかを比較します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "小なり等号演算子 '<='。",
  },
  {
    name: "GREATEREQUAL",
    detail: "大なり等号演算子 '>='。左辺が右辺以上であるかを比較します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "大なり等号演算子 '>='。",
  },
  {
    name: "LEFTSHIFT",
    detail: "左ビットシフト演算子 '<<'。整数を左にビットシフトします。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "左ビットシフト演算子 '<<'。",
  },
  {
    name: "RIGHTSHIFT",
    detail: "右ビットシフト演算子 '>>'。整数を右にビットシフトします。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "右ビットシフト演算子 '>>'。",
  },
  {
    name: "DOUBLESTAR",
    detail: "べき乗演算子 '**'。累乗を計算します。また **kwargs のアンパック。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "べき乗演算子 '**'。2の3乗なら 2**3 と書きます。",
  },
  {
    name: "DOUBLESLASH",
    detail: "フロア除算演算子 '//'。除算後、小数点以下を切り捨てた整数を返します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "フロア除算演算子 '//'。割り切れない場合は小数点以下を切り捨てます。",
  },
  {
    name: "AT",
    detail: "@ 記号（アット）。デコレーター（@decorator）の開始、行列乗算演算子 @。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "@ 記号。デコレーターや行列の掛け算で使います。",
  },
  {
    name: "RARROW",
    detail: "右矢印 '->'。関数の戻り値の型ヒント注釈に使用されます（例: def foo() -> int）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "右矢印 '->'。関数の戻り値の型を指定するのに使います。",
  },
  {
    name: "ELLIPSIS",
    detail:
      "省略符 '...'。スライス表記で「すべての次元」を表現、またはプレースホルダーとして使用（pass の代わりに ... と書く）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "省略符 '...'。スライスやプレースホルダーで使います。",
  },
  {
    name: "COLONEQUAL",
    detail:
      "ウォーラス演算子 ':='。代入と同時に値を式として使用できます（Python 3.8+）。例: if (n := len(a)) > 10。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "ウォーラス演算子 ':='。代入と同時に値を条件式などで使えます。",
  },
  {
    name: "EXCLAMATION",
    detail: "感嘆符 '!'。Python の正式な構文では限定的な用途（型注釈の ! 接尾辞など）です。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "感嘆符 '!'。特殊な用途で使われることもあります。",
  },
  {
    name: "PLUSEQUAL",
    detail: "拡張代入 '+='。x += y は x = x + y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '+='。x += 1 は x = x + 1 と同じ意味。",
  },
  {
    name: "MINEQUAL",
    detail: "拡張代入 '-='。x -= y は x = x - y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '-='。",
  },
  {
    name: "STAREQUAL",
    detail: "拡張代入 '*='。x *= y は x = x * y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '*='。",
  },
  {
    name: "SLASHEQUAL",
    detail: "拡張代入 '/='。x /= y は x = x / y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '/='。",
  },
  {
    name: "PERCENTEQUAL",
    detail: "拡張代入 '%='。x %= y は x = x % y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '%='。",
  },
  {
    name: "AMPEREQUAL",
    detail: "拡張代入 '&='。x &= y は x = x & y と同義（ビット AND）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '&='。",
  },
  {
    name: "VBAREQUAL",
    detail: "拡張代入 '|='。x |= y は x = x | y と同義（ビット OR）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '|='。",
  },
  {
    name: "CIRCUMFLEXEQUAL",
    detail: "拡張代入 '^='。x ^= y は x = x ^ y と同義（ビット XOR）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '^='。",
  },
  {
    name: "LEFTSHIFTEQUAL",
    detail: "拡張代入 '<<='。x <<= y は x = x << y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '<<='。",
  },
  {
    name: "RIGHTSHIFTEQUAL",
    detail: "拡張代入 '>>='。x >>= y は x = x >> y と同義。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '>>='。",
  },
  {
    name: "DOUBLESTAREQUAL",
    detail: "拡張代入 '**='。x **= y は x = x ** y と同義（べき乗）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '**='。",
  },
  {
    name: "DOUBLESLASHEQUAL",
    detail: "拡張代入 '//='。x //= y は x = x // y と同義（フロア除算）。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '//='。",
  },
  {
    name: "ATEQUAL",
    detail: "拡張代入 '@='。行列乗算の拡張代入。NumPy などで使用。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "拡張代入 '@='。行列演算で使います。",
  },
];
