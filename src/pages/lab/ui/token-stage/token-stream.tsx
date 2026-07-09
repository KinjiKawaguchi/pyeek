import { useEffect, useRef } from "react";
import type { LinkTier } from "@/entities/source-link";
import { scrollIntoViewHorizontally } from "../../lib/scroll-into-view-horizontally";
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
  const streamRef = useRef<HTMLDivElement>(null);

  // ストリーム全体を横スクロールにしたため、他ステージのクリックでこの
  // ステージのトークンが active/related になっても、横に隠れている可能性
  // がある。選択が変わるたびに、対象トークンをストリーム内に自動で
  // スクロールインさせる。厳密一致(active)が無ければ related の先頭を
  // 使う(例: For文全体のようなAST側の広い範囲選択では、範囲が完全一致
  // する単一トークンが存在せず related のみが付く)。
  // biome-ignore lint/correctness/useExhaustiveDependencies: linkTiersは本体で参照しないが、参照が変わる(=選択範囲が変わる)たびに再実行したいため意図的な依存
  useEffect(() => {
    const target =
      streamRef.current?.querySelector(".tok--sel") ??
      streamRef.current?.querySelector(".tok--related");
    if (!target || !streamRef.current) return;
    // 行ラベル(L1等)は position:sticky で左端に固定表示されるため、
    // その下に隠れないようラベル幅を左境界として渡す(やさしいモードは
    // ラベル自体が無いため undefined になり、通常の左端が使われる)。
    const label = target.closest(".token-stage__row")?.querySelector(".token-stage__row-label");
    scrollIntoViewHorizontally(target, streamRef.current, label?.getBoundingClientRect().width);
  }, [linkTiers]);

  if (view.rows.length === 0) {
    return <p className="token-stage__empty">（コードを入力してください）</p>;
  }

  return (
    <div className="token-stage__stream" ref={streamRef} aria-live="polite">
      {view.rows.map((rowGroup) => (
        <div className="token-stage__row" key={rowGroup.row}>
          {mode === "strict" ? (
            <span className="token-stage__row-label">L{rowGroup.row}</span>
          ) : null}
          <div className="token-stage__row-tokens">
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
        </div>
      ))}
    </div>
  );
}
