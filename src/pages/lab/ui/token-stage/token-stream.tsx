import type { LinkTier } from "@/entities/source-link";
import type { DisplayMode } from "../../model/analysis-store";
import type { TokenStageView } from "../../model/token-stage/token-view";
import { TokenChip } from "./token-chip";

export interface TokenStreamProps {
  view: TokenStageView;
  mode: DisplayMode;
  showPos: boolean;
  linkTiers: (LinkTier | null)[];
  onSelect: (index: number) => void;
}

export function TokenStream({ view, mode, showPos, linkTiers, onSelect }: TokenStreamProps) {
  if (view.rows.length === 0) {
    return <p className="token-stage__empty">（コードを入力してください）</p>;
  }

  return (
    <div className="token-stage__stream" aria-live="polite">
      {view.rows.map((rowGroup) => (
        <div className="token-stage__row" key={rowGroup.row}>
          {mode === "strict" ? (
            <span className="token-stage__row-label">L{rowGroup.row}</span>
          ) : null}
          {rowGroup.items.map(({ token, index }) => (
            <TokenChip
              key={index}
              token={token}
              mode={mode}
              linkTier={linkTiers[index] ?? null}
              callHighlighted={view.callHighlightIndexes.has(index)}
              showPos={showPos}
              onSelect={() => onSelect(index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
