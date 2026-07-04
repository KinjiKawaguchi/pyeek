/**
 * Python tokenize モジュールの高度なトークン種別リファレンス
 * ASYNC, AWAIT, TYPE_COMMENT, SOFT_KEYWORD, ERRORTOKEN, TYPE_IGNORE の詳細説明
 */

import type { TokenReference } from "./token-reference-basic";

/**
 * 高度・特殊なトークン: async/await, 型ヒント, キーワード関連, エラー
 */
export const TOKEN_REFERENCE_ADVANCED: TokenReference[] = [
  {
    name: "ASYNC",
    detail:
      "async キーワード。async def などで非同期関数を定義する際に出現します。Python 3.7+ で正式化されましたが、Python 3.5-3.6 では制限的な実装でした。NAME トークンではなく専用の ASYNC トークンで識別されることで、構文解析が効率化されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "async キーワード。非同期関数を定義する async def で出現します。",
  },
  {
    name: "AWAIT",
    detail:
      "await キーワード。非同期関数内で await 式として使用されます。async 関数の内部でのみ有効で、その外での使用は SyntaxError になります。NAME トークンではなく専用トークンで識別されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "await キーワード。async 関数の中で非同期処理の完了を待つのに使います。",
  },
  {
    name: "TYPE_COMMENT",
    detail:
      "型コメント。# type: ... の形式で書かれた型情報の注釈。Python 3.5-3.9 では型ヒントの主流でしたが、Python 3.10+ では型ヒント構文の推奨が変わっています。tokenize では TYPE_COMMENT として識別されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "型コメント。# type: int のように型情報をコメントで指定します。",
  },
  {
    name: "SOFT_KEYWORD",
    detail:
      "ソフトキーワード。Python 3.10+ で導入された match など、文脈依存的なキーワード。これらは特定の文脈でのみキーワードとして機能し、他の文脈では NAME トークンとして扱える可能性があります。SOFT_KEYWORD トークンは Python 3.10+ の tokenize で出現します。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "ソフトキーワード。Python 3.10+ で追加された match などの文脈依存的なキーワード。",
  },
  {
    name: "ERRORTOKEN",
    detail:
      "エラートークン。字句解析で認識できない文字列が出現したとき生成されます。これはそのまま構文解析エラーにつながります。例: 不正な文字記号、正しくない連続など。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "エラートークン。字句解析で認識できない文字や記号で出現します。プログラムは実行できません。",
  },
  {
    name: "TYPE_IGNORE",
    detail:
      "型チェック無視コメント。# type: ignore の形式で、特定の行の型チェックを無視するよう mypy などの型チェッカーに指示します。tokenize では TYPE_IGNORE として識別されます。",
    docUrl: "https://docs.python.org/3/library/tokenize.html#token-types",
    easy: "型チェック無視コメント。# type: ignore で型チェッカーの警告を無視します。",
  },
];
