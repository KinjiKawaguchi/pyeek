import { DEFAULT_SOURCE } from "../config/presets";
import { GithubLink } from "./github-link";
import { LabWorkbench } from "./lab-workbench";

// Server Component。静的な教育テキスト・フッタはここに残し、解析結果に依存
// する部分だけを LabWorkbench（'use client'）へ委譲する。
export function LabPage() {
  return (
    <main className="lab-page">
      <GithubLink />
      <header className="lab-page__header">
        <span className="lab-page__kicker">PYTHON 字句解析 LABORATORY</span>
        <h1 className="lab-page__title">
          トークン <span className="lab-page__zap">ラボ</span>
        </h1>
        <p className="lab-page__lead">
          Python があなたのコードを最小の部品「トークン」に切り分ける様子を、実物どおりに見せます。
          「やさしい」で直感を、「くわしい」で本物の字句解析器の出力を。
        </p>
      </header>
      <LabWorkbench initialSource={DEFAULT_SOURCE} />
      <footer className="lab-page__footer">
        このツールは CPython 本物の <code>tokenize</code>{" "}
        をブラウザ上（Pyodide）でそのまま実行しています。位置・
        <code>NEWLINE</code>/<code>NL</code>・<code>INDENT</code>/<code>DEDENT</code>・
        <code>OP</code> の exact 型まで実物どおりです。
        <br />
        f文字列は「やさしい」モードでは 1つの <code>STRING</code> として畳んで表示します（本物の
        CPython 3.12 は内部で <code>FSTRING_START/MIDDLE/END</code>{" "}
        に分割します。「くわしい」モードで確認できます）。
      </footer>
    </main>
  );
}
