import { DEFAULT_SOURCE } from "../config/presets";
import { GithubLink } from "./github-link";
import { LabWorkbench } from "./lab-workbench";

export interface LabPageProps {
  // URL の code パラメータ経由で共有されたソース。無指定なら DEFAULT_SOURCE。
  initialSource?: string;
}

// Server Component。静的な教育テキスト・フッタはここに残し、解析結果に依存
// する部分だけを LabWorkbench（'use client'）へ委譲する。
export function LabPage({ initialSource }: LabPageProps) {
  return (
    <main className="lab-page">
      <GithubLink />
      <header className="lab-page__header">
        <span className="lab-page__kicker">PYEEK</span>
        <h1 className="lab-page__title">
          🐍 Python が動くまで<span className="lab-page__zap">を見てみよう！</span>
        </h1>
        <p className="lab-page__lead">
          Python があなたのコードを実行するまでの4段階（字句解析・構文解析・コンパイル・実行）で、
          同じコードが本物の CPython の中でどう姿を変えていくかを見ることができます。
        </p>
      </header>
      <LabWorkbench initialSource={initialSource || DEFAULT_SOURCE} />
    </main>
  );
}
