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
      "演算子・記号を表す汎用トークン型。tokenize モジュールが報告する type フィールドは、あらゆる演算子・記号トークンについて常にこの OP になります（CPython のトークナイザは内部的には exact token type だけを使っており、OP という値自体は tokenize モジュールが後付けで報告するものです）。個々の記号の種類（+, -, *, (, ) など）は type ではなく exact_type（Pyeek の JSON では exactType）で LPAR, RPAR, PLUS, MINUS のように区別されます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.OP",
    easy: "演算子や記号。+, -, =, (, ), [ ] など。「ざっくりした種類」は全部 OP ですが、「くわしい」モードで見える exactType では個別の種類（LPAR など）に分かれます。",
  },
  {
    name: "LPAR",
    detail:
      "左丸括弧 '('。関数呼び出しの引数リスト、タプルの括弧、条件式の括弧など、多くの構文要素で出現します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LPAR",
    easy: "左丸括弧 '('。",
  },
  {
    name: "RPAR",
    detail: "右丸括弧 ')'。LPAR に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RPAR",
    easy: "右丸括弧 ')'。",
  },
  {
    name: "LSQB",
    detail: "左角括弧 '['。リスト・辞書・スライス表記の開始を示します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LSQB",
    easy: "左角括弧 '['。",
  },
  {
    name: "RSQB",
    detail: "右角括弧 ']'。LSQB に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RSQB",
    easy: "右角括弧 ']'。",
  },
  {
    name: "LBRACE",
    detail: "左波括弧 '{'。辞書・集合・f-string の埋め込み式の開始を示します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LBRACE",
    easy: "左波括弧 '{'。",
  },
  {
    name: "RBRACE",
    detail: "右波括弧 '}'。LBRACE に対応する閉じ括弧。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RBRACE",
    easy: "右波括弧 '}'。",
  },
  {
    name: "COMMA",
    detail: "カンマ ','。関数の引数、タプル、リスト、辞書などの要素を区切ります。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.COMMA",
    easy: "カンマ ','。複数の要素を区切ります。",
  },
  {
    name: "COLON",
    detail:
      "コロン ':'。if / for / def などのブロック構文の開始、辞書のキーと値の区切り、スライス表記など多くの場所で出現します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.COLON",
    easy: "コロン ':'。ブロック（if: や def: など）や辞書で出現します。",
  },
  {
    name: "SEMI",
    detail:
      "セミコロン ';'。複数の文を1行で区切る用途で使用されます（Python では一般的ではありません）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.SEMI",
    easy: "セミコロン ';'。複数の文を区切ります（あまり使いません）。",
  },
  {
    name: "DOT",
    detail:
      "ドット / ピリオド '.'。属性アクセス、メソッド呼び出し、スライスの範囲指定に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DOT",
    easy: "ドット '.'。オブジェクトの属性やメソッドにアクセスします。",
  },
  {
    name: "EQUAL",
    detail: "等号・代入演算子 '='。変数への代入や関数の引数のデフォルト値指定などで用いられます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.EQUAL",
    easy: "等号 '='。変数に値を代入します。",
  },
  {
    name: "PLUS",
    detail: "プラス記号 '+'。加算演算子。また PLUSEQUAL（+=）の構成要素。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.PLUS",
    easy: "プラス記号 '+'。足し算に使います。",
  },
  {
    name: "MINUS",
    detail: "マイナス記号 '-'。減算演算子、負号、矢印演算子（->）の構成要素。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.MINUS",
    easy: "マイナス記号 '-'。引き算や負の数に使います。",
  },
  {
    name: "STAR",
    detail: "アスタリスク '*'。乗算演算子、べき乗（**）の構成要素、アンパック演算子（*args）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.STAR",
    easy: "アスタリスク '*'。掛け算や *args で使います。",
  },
  {
    name: "SLASH",
    detail: "スラッシュ / '/'。除算演算子、フロア除算（//）の構成要素。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.SLASH",
    easy: "スラッシュ '/'。割り算に使います。",
  },
  {
    name: "PERCENT",
    detail: "パーセント記号 '%'。モジュロ（剰余）演算子、文字列フォーマット演算子。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.PERCENT",
    easy: "パーセント記号 '%'。割り算の余りを求めます。",
  },
  {
    name: "AMPER",
    detail: "アンパーサンド '&'。ビット単位 AND 演算子。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.AMPER",
    easy: "アンパーサンド '&'。ビット演算で使います。",
  },
  {
    name: "VBAR",
    detail: "縦棒 '|'。ビット単位 OR 演算子、型ヒントの和（Union）表記。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.VBAR",
    easy: "縦棒 '|'。ビット演算や型ヒントで使います。",
  },
  {
    name: "CIRCUMFLEX",
    detail: "キャレット / サーカムフレックス '^'。ビット単位 XOR 演算子。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.CIRCUMFLEX",
    easy: "キャレット '^'。ビット演算で使います。",
  },
  {
    name: "TILDE",
    detail: "チルダ '~'。ビット単位 NOT 演算子（ビット反転）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.TILDE",
    easy: "チルダ '~'。ビット反転に使います。",
  },
  {
    name: "LESS",
    detail: "小なり演算子 '<'。比較演算子。またはビットシフト（<<）の構成要素。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LESS",
    easy: "小なり記号 '<'。大小比較に使います。",
  },
  {
    name: "GREATER",
    detail: "大なり演算子 '>'。比較演算子。またはビットシフト（>>）の構成要素。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.GREATER",
    easy: "大なり記号 '>'。大小比較に使います。",
  },
  {
    name: "EQEQUAL",
    detail: "等価演算子 '=='。2つの値が等しいかどうかを比較します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.EQEQUAL",
    easy: "等価演算子 '=='。2つの値が同じかどうかを比較します。",
  },
  {
    name: "NOTEQUAL",
    detail: "不等価演算子 '!='。2つの値が異なるかどうかを比較します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.NOTEQUAL",
    easy: "不等価演算子 '!='。2つの値が異なるかどうかを比較します。",
  },
  {
    name: "LESSEQUAL",
    detail: "小なり等号演算子 '<='。左辺が右辺以下であるかを比較します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LESSEQUAL",
    easy: "小なり等号演算子 '<='。",
  },
  {
    name: "GREATEREQUAL",
    detail: "大なり等号演算子 '>='。左辺が右辺以上であるかを比較します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.GREATEREQUAL",
    easy: "大なり等号演算子 '>='。",
  },
  {
    name: "LEFTSHIFT",
    detail: "左ビットシフト演算子 '<<'。整数を左にビットシフトします。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LEFTSHIFT",
    easy: "左ビットシフト演算子 '<<'。",
  },
  {
    name: "RIGHTSHIFT",
    detail: "右ビットシフト演算子 '>>'。整数を右にビットシフトします。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RIGHTSHIFT",
    easy: "右ビットシフト演算子 '>>'。",
  },
  {
    name: "DOUBLESTAR",
    detail: "べき乗演算子 '**'。累乗を計算します。また **kwargs のアンパック。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DOUBLESTAR",
    easy: "べき乗演算子 '**'。2の3乗なら 2**3 と書きます。",
  },
  {
    name: "DOUBLESLASH",
    detail: "フロア除算演算子 '//'。除算後、小数点以下を切り捨てた整数を返します。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DOUBLESLASH",
    easy: "フロア除算演算子 '//'。割り切れない場合は小数点以下を切り捨てます。",
  },
  {
    name: "AT",
    detail: "@ 記号（アット）。デコレーター（@decorator）の開始、行列乗算演算子 @。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.AT",
    easy: "@ 記号。デコレーターや行列の掛け算で使います。",
  },
  {
    name: "RARROW",
    detail: "右矢印 '->'。関数の戻り値の型ヒント注釈に使用されます（例: def foo() -> int）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RARROW",
    easy: "右矢印 '->'。関数の戻り値の型を指定するのに使います。",
  },
  {
    name: "ELLIPSIS",
    detail:
      "省略符 '...'。スライス表記で「すべての次元」を表現、またはプレースホルダーとして使用（pass の代わりに ... と書く）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ELLIPSIS",
    easy: "省略符 '...'。スライスやプレースホルダーで使います。",
  },
  {
    name: "COLONEQUAL",
    detail:
      "ウォーラス演算子 ':='。代入と同時に値を式として使用できます（Python 3.8+）。例: if (n := len(a)) > 10。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.COLONEQUAL",
    easy: "ウォーラス演算子 ':='。代入と同時に値を条件式などで使えます。",
  },
  {
    name: "EXCLAMATION",
    detail:
      "感嘆符 '!'。Python 3.12 で f-string の細分化（PEP 701）とあわせて追加されたトークン。f-string の埋め込み式で変換指定子（!r, !s, !a）を書く際の区切り記号として使われます（例: f\"{x!r}\"）。単独の文では通常出現しません。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.EXCLAMATION",
    easy: "感嘆符 '!'。f\"{x!r}\" のように、f-string の中で値の変換方法（!r など）を指定するときの区切りとして使われます。",
  },
  {
    name: "PLUSEQUAL",
    detail: "拡張代入 '+='。x += y は x = x + y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.PLUSEQUAL",
    easy: "拡張代入 '+='。x += 1 は x = x + 1 と同じ意味。",
  },
  {
    name: "MINEQUAL",
    detail: "拡張代入 '-='。x -= y は x = x - y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.MINEQUAL",
    easy: "拡張代入 '-='。",
  },
  {
    name: "STAREQUAL",
    detail: "拡張代入 '*='。x *= y は x = x * y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.STAREQUAL",
    easy: "拡張代入 '*='。",
  },
  {
    name: "SLASHEQUAL",
    detail: "拡張代入 '/='。x /= y は x = x / y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.SLASHEQUAL",
    easy: "拡張代入 '/='。",
  },
  {
    name: "PERCENTEQUAL",
    detail: "拡張代入 '%='。x %= y は x = x % y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.PERCENTEQUAL",
    easy: "拡張代入 '%='。",
  },
  {
    name: "AMPEREQUAL",
    detail: "拡張代入 '&='。x &= y は x = x & y と同義（ビット AND）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.AMPEREQUAL",
    easy: "拡張代入 '&='。",
  },
  {
    name: "VBAREQUAL",
    detail: "拡張代入 '|='。x |= y は x = x | y と同義（ビット OR）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.VBAREQUAL",
    easy: "拡張代入 '|='。",
  },
  {
    name: "CIRCUMFLEXEQUAL",
    detail: "拡張代入 '^='。x ^= y は x = x ^ y と同義（ビット XOR）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.CIRCUMFLEXEQUAL",
    easy: "拡張代入 '^='。",
  },
  {
    name: "LEFTSHIFTEQUAL",
    detail: "拡張代入 '<<='。x <<= y は x = x << y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.LEFTSHIFTEQUAL",
    easy: "拡張代入 '<<='。",
  },
  {
    name: "RIGHTSHIFTEQUAL",
    detail: "拡張代入 '>>='。x >>= y は x = x >> y と同義。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.RIGHTSHIFTEQUAL",
    easy: "拡張代入 '>>='。",
  },
  {
    name: "DOUBLESTAREQUAL",
    detail: "拡張代入 '**='。x **= y は x = x ** y と同義（べき乗）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DOUBLESTAREQUAL",
    easy: "拡張代入 '**='。",
  },
  {
    name: "DOUBLESLASHEQUAL",
    detail: "拡張代入 '//='。x //= y は x = x // y と同義（フロア除算）。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.DOUBLESLASHEQUAL",
    easy: "拡張代入 '//='。",
  },
  {
    name: "ATEQUAL",
    detail: "拡張代入 '@='。行列乗算の拡張代入。NumPy などで使用。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ATEQUAL",
    easy: "拡張代入 '@='。行列演算で使います。",
  },
];
