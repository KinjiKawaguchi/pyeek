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
        <span className="lab-page__kicker">PYEEK</span>
        <h1 className="lab-page__title">
          Python が動くまで<span className="lab-page__zap">を見るラボ</span>
        </h1>
        <p className="lab-page__lead">
          Python があなたのコードを実行するまでの4段階（字句解析・構文解析・コンパイル・実行）で、
          同じコードが本物の CPython の中でどう姿を変えていくかを見ることができます。
        </p>
      </header>
      <LabWorkbench initialSource={DEFAULT_SOURCE} />
    </main>
  );
}
