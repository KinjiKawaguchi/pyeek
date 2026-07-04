/**
 * Python tokenize モジュールの基本トークン種別リファレンス
 * NAME, NUMBER, STRING, COMMENT の詳細説明・公式リファレンス・初学者向け解説
 */

export interface TokenReference {
  name: string;
  /** 技術的に正確な詳細解説 */
  detail: string;
  /** 公式ドキュメントへのURL（可能ならアンカー付き） */
  docUrl: string;
  /** 初学者向けの平易な解説 */
  easy: string;
}

/**
 * 基本トークン: 識別子、リテラル、コメント
 */
export const TOKEN_REFERENCE_BASIC: TokenReference[] = [
  {
    name: "NAME",
    detail:
      "Python の識別子および予約語。変数名、関数名、クラス名、キーワード（if, for, def など）を区別せず全てこのトークンとして字句解析されます。構文解析の段階でキーワードが識別されます。前置条件としてアルファベット・アンダースコアで始まり、英数字・アンダースコアで構成される1文字以上の文字列です。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "変数や関数、キーワード（if, for など）の名前。字句解析の段階では全部が「なまえ」トークンとして扱われます。",
  },
  {
    name: "NUMBER",
    detail:
      "数値リテラル。整数（10進・16進(0x)・8進(0o)・2進(0b)）、浮動小数点数（指数表記含む）、虚数（jまたはJ接尾辞）、複素数、および数字の桁区切り文字（_）を含む表現が1つのトークンにまとめられます。複数の数値が並ぶ場合や数値と演算子の組み合わせは別トークンに分割されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "数字で書かれた値。1, 3.14, 0xFF, 0b1010, 1+2j など。複数の数値が並ぶと別のトークンに分かれます。",
  },
  {
    name: "STRING",
    detail:
      "文字列リテラル。シングルクォート・ダブルクォート・三重引用符で囲まれたテキスト。f-string（f\"\" / f''）、raw 文字列（r\"\" / r''）、バイト文字列（b\"\" / b''）、unicode 文字列（u\"\" / u''）の前置子（プレフィックス）、複数の接尾辞の組み合わせも1つのトークンに含まれます。ただし f-string は Python 3.12 以降で細分化され、FSTRING_START / FSTRING_MIDDLE / FSTRING_END に分割されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: '引用符で囲まれたテキスト。\'hello\' や "world" や f"x={x}" など。',
  },
  {
    name: "COMMENT",
    detail:
      "コメント。# 文字から行末までの全ての文字。Python では複数行コメント専用の構文がないため、複数行コメントを表現する場合は各行に # を付けるか、三重引用符で囲まれた文字列（ただし文字列リテラル扱い）を使用します。コメントはプログラム実行に影響せず、トークン列から除外されることもあります。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "# から行末までの説明書き。プログラムの動作には影響しません。",
  },
];
