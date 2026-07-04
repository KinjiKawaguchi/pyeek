"use client";

import { useAnalysis } from "@/entities/analysis";

// Pyodide の読み込み中だけ表示するオーバーレイ。ロード中もエディタ自体は
// 操作できる（AnalysisProvider が source-changed をそのまま受け付ける）ため、
// ここではブロッキングではなく状態を知らせるだけの控えめな表示にする。
export function LoadingOverlay() {
  const {
    state: { loading },
  } = useAnalysis();

  if (loading.phase === "ready" || loading.phase === "idle") {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <span className="loading-overlay__spinner" aria-hidden="true" />
      <span>{loading.message || "Python エンジンを準備中…"}</span>
    </div>
  );
}
