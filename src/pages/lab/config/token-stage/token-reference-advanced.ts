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
      "async キーワード用のトークン定数。Python 3.5-3.6 でのみ tokenize が実際に出力していましたが、3.7 で async/await が正式な予約語になったことで廃止され、以降 async は普通の NAME トークンとして字句解析されます（キーワードかどうかの判定は構文解析側が担う）。ASYNC/AWAIT は 3.8 で一度復活しましたが、これは ast.parse() を古い feature_version（Python 3.6 以下相当）で動かす後方互換パスのためだけに存在し、通常の tokenize.generate_tokens() では出現しません（Pyeek が使う経路もこちらです）。3.13 で再度廃止されています。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ASYNC",
    easy: "async キーワード専用のトークンでしたが、今は普通の「なまえ」トークン（NAME）として扱われます。このアプリで async def と入力しても ASYNC トークンは出てきません。",
  },
  {
    name: "AWAIT",
    detail:
      "await キーワード用のトークン定数。ASYNC と同じ経緯をたどり、Python 3.7 以降 await は NAME トークンとして字句解析されます。ASYNC/AWAIT トークン自体は 3.8-3.12 でも定義は残っていますが、古い feature_version 互換の内部処理専用で、通常の tokenize では出現しません。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.AWAIT",
    easy: "await キーワードも同様に、今は普通の「なまえ」トークン（NAME）として字句解析されます。専用トークンとして表示されることはありません。",
  },
  {
    name: "TYPE_COMMENT",
    detail:
      "# type: ... 形式の型コメントを表すトークン定数。ただしこれは ast.parse() などに PyCF_TYPE_COMMENTS フラグを渡した場合にのみ、通常の COMMENT の代わりに生成される特別な出力モードです。Pyeek が使う tokenize.generate_tokens() の素の呼び出しではこのフラグは有効化されないため、実際には型コメントも通常の COMMENT トークンとして表示されます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.TYPE_COMMENT",
    easy: "# type: int のような型コメント専用のトークンです。ただし特別な設定をしないと使われず、このアプリでは普通の「コメント」トークンとして表示されます。",
  },
  {
    name: "SOFT_KEYWORD",
    detail:
      "ソフトキーワード（match, case, _, type など、Python 3.10+ で文脈依存的にキーワードとして働く識別子）を示すためのトークン定数。公式ドキュメントは「tokenizer はこの値を決して生成しない」と明記しています。match/case などは常に NAME トークンとして字句解析され、ソフトキーワードかどうかは keyword.issoftkeyword() で別途判定します。Pyeek の解析結果 JSON にも、各 NAME トークンへ isSoftKeyword フラグとして同じ判定結果を付与しています。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.SOFT_KEYWORD",
    easy: "match や case などのソフトキーワードを表すための定数ですが、実際の字句解析では絶対に使われません。match と書いても、出てくるのは普通の「なまえ」トークン（NAME）です。",
  },
  {
    name: "ERRORTOKEN",
    detail:
      "誤った入力を示すためのトークン定数。ただし公式ドキュメントによれば、tokenize モジュールは通常エラーを例外（TokenError/SyntaxError 等）を送出することで伝え、このトークンを生成することは稀です。認識できない文字はむしろ OP や NAME として一旦トークン化され、後段の構文解析で拒否される場合もあります。Pyeek でも壊れた入力は基本的にエラーバナー（例外捕捉）として表示され、ERRORTOKEN 自体がトークン列に現れることはほぼありません。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.ERRORTOKEN",
    easy: "「読み取れない入力」を示すための定数ですが、実際には多くの場合エラーそのもの（例外）として扱われ、トークンとして表示されることは稀です。",
  },
  {
    name: "TYPE_IGNORE",
    detail:
      "# type: ignore 形式のコメントを表すトークン定数。TYPE_COMMENT と同じく PyCF_TYPE_COMMENTS フラグ付きでのみ生成される特別な出力で、Pyeek の素の tokenize 呼び出しでは有効化されないため、実際には通常の COMMENT トークンとして表示されます。",
    docUrl: "https://docs.python.org/3.12/library/token.html#token.TYPE_IGNORE",
    easy: "# type: ignore を表すための専用トークンですが、特別な設定をしないと使われず、このアプリでは普通の「コメント」トークンとして表示されます。",
  },
];
