"use client";

import { useAnalysis } from "@/entities/analysis";

export function ModeToggle() {
  const { state, setMode } = useAnalysis();

  return (
    <div className="modes" role="tablist" aria-label="表示モード">
      <button
        type="button"
        role="tab"
        aria-selected={state.mode === "easy"}
        className={`mode-btn${state.mode === "easy" ? " mode-btn--active" : ""}`}
        onClick={() => setMode("easy")}
      >
        やさしい
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={state.mode === "strict"}
        className={`mode-btn${state.mode === "strict" ? " mode-btn--active" : ""}`}
        onClick={() => setMode("strict")}
      >
        くわしい（本物）
      </button>
    </div>
  );
}
