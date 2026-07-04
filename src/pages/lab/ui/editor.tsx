"use client";

import { useAnalysis } from "../model/analysis-store";

// 4 ステージ共有の唯一のソースエディタ。前身 token-lab.html の
// textarea#code に相当する（M1 で CSS を移植する）。
export function Editor() {
  const {
    state: { source, runtimeError },
    setSource,
  } = useAnalysis();

  return (
    <div className="editor">
      <textarea
        className="editor__textarea"
        spellCheck={false}
        autoComplete="off"
        aria-label="Python コード"
        value={source}
        onChange={(event) => setSource(event.target.value)}
      />
      {runtimeError ? <p className="editor__error">⚠ {runtimeError}</p> : null}
    </div>
  );
}
