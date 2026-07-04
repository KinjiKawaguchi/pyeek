"use client";

import { useMemo, useState } from "react";
import { classifyRange, tokenRange } from "@/entities/source-link";
import { useAnalysis } from "../../model/analysis-store";
import { buildTokenStageView } from "../../model/token-stage/token-view";
import "./token-stage.css";
import { TokenReadout } from "./token-readout";
import { TokenStream } from "./token-stream";

export function TokenStage() {
  const { state, setSelectedRange } = useAnalysis();
  const [showPos, setShowPos] = useState(false);
  const [showStruct, setShowStruct] = useState(true);

  const rawTokens = useMemo(() => state.result?.tokens ?? [], [state.result?.tokens]);
  const source = state.result?.source ?? "";
  const view = useMemo(
    () => buildTokenStageView(rawTokens, source, state.mode, showStruct),
    [rawTokens, source, state.mode, showStruct],
  );

  const linkTiers = useMemo(
    () => view.tokens.map((token) => classifyRange(tokenRange(token), state.selectedRange)),
    [view.tokens, state.selectedRange],
  );

  const activeIndex = linkTiers.indexOf("active");
  const selectedToken = activeIndex >= 0 ? (view.tokens[activeIndex] ?? null) : null;

  const handleSelect = (index: number) => {
    const token = view.tokens[index];
    if (!token) {
      return;
    }
    setSelectedRange(tokenRange(token));
  };

  return (
    <section className="card" aria-label="トークン列">
      <p className="card__title">
        <span className="card__emoji">🔍</span> トークン列
        <span className="token-stage__hint">{view.hint}</span>
      </p>
      {state.mode === "strict" ? (
        <div className="token-stage__opts">
          <label className="opt">
            <input
              type="checkbox"
              checked={showPos}
              onChange={(event) => setShowPos(event.target.checked)}
            />
            位置(row:col)を表示
          </label>
          <label className="opt">
            <input
              type="checkbox"
              checked={showStruct}
              onChange={(event) => setShowStruct(event.target.checked)}
            />
            構造トークンを表示
          </label>
        </div>
      ) : null}
      <div className="token-stage__machine-lip" />
      <TokenStream
        view={view}
        mode={state.mode}
        showPos={showPos}
        linkTiers={linkTiers}
        onSelect={handleSelect}
      />
      <TokenReadout token={selectedToken} />
    </section>
  );
}
