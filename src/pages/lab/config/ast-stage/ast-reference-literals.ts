/**
 * Python ast モジュール リテラル・定数ノード型リファレンス
 * Constant, FormattedValue, JoinedStr の詳細説明・公式リファレンス・初学者向け解説
 */

export interface AstReference {
  name: string;
  /** 技術的に正確な詳細解説 */
  detail: string;
  /** 公式ドキュメントへのURL（可能ならアンカー付き） */
  docUrl: string;
  /** 初学者向けの平易な解説 */
  easy: string;
}

/**
 * リテラル・定数ノード: 数値・文字列・Noneなど、値そのもの
 */
export const AST_REFERENCE_LITERALS: AstReference[] = [
  {
    name: "Constant",
    detail:
      "定数値を表すノード。整数・浮動小数点数・複素数・文字列・バイト列・None・True・False・Ellipsis(...) など、すべての不変リテラル値を統一的に表現します。Python 3.8以降、かつての Num, Str, Bytes, NameConstant, Ellipsis は廃止され、すべて Constant に統合されました。value フィールドにPythonの実際の値オブジェクトが格納されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Constant",
    easy: "数値、文字列、None、True、False など、そのまま書かれた値。1、3.14、'hello'、None などが全部 Constant ノードになります。",
  },
  {
    name: "FormattedValue",
    detail:
      "f-string（フォーマット済み文字列リテラル）内に埋め込まれた式を表すノード。f-string の {式} 部分が FormattedValue になります。value フィールドに埋め込み式が格納され、conversion フィールドに変換フラグ（!r, !s, !a のいずれか、またはデフォルト -1）、format_spec フィールドにフォーマット指定文字列（: 後の部分）が格納されます。Python 3.12 から f-string の細分化に伴い重要性が増しました。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.FormattedValue",
    easy: "f-string の中の {x} や {x!r} の部分。埋め込まれた変数や式を表します。",
  },
  {
    name: "JoinedStr",
    detail:
      "f-string（フォーマット済み文字列リテラル）全体を表すノード。values フィールドに Constant（文字列リテラル部分）と FormattedValue（埋め込み式部分）が混在したリストが格納されます。例えば f'hello {x} world' は JoinedStr(values=[Constant('hello '), FormattedValue(...), Constant(' world')]) になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.JoinedStr",
    easy: "f-string 全体。f'value={value}' のような文字列全体が JoinedStr になります。",
  },
];
