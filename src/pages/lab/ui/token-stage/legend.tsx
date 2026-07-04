"use client";

import { LEGEND_EASY, LEGEND_STRICT } from "../../config/token-stage/explain";
import { useAnalysis } from "../../model/analysis-store";

export function TokenLegend() {
  const { state } = useAnalysis();
  const items = state.mode === "strict" ? LEGEND_STRICT : LEGEND_EASY;

  return (
    <details className="token-stage__legend">
      <summary>いろ と 種類の凡例</summary>
      <div className="token-stage__legend-grid">
        {items.map(([label, color, description]) => (
          <div className="token-stage__legend-item" key={label}>
            <span className="token-stage__legend-swatch" style={{ background: color }} />
            <div>
              <b>{label}</b>
              <br />
              <span className="token-stage__legend-desc">{description}</span>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
