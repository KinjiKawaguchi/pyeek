import type { DisplayMode, LinkTier } from "@/entities/analysis";
import type { Token } from "@/shared/api";
import { chipTypeLabel, formatPos, showValue, visualClass } from "../model/token-display";

export interface TokenChipProps {
  token: Token;
  mode: DisplayMode;
  linkTier: LinkTier | null;
  callHighlighted: boolean;
  showPos: boolean;
  onSelect: () => void;
}

export function TokenChip({
  token,
  mode,
  linkTier,
  callHighlighted,
  showPos,
  onSelect,
}: TokenChipProps) {
  const value = showValue(token);
  const isKeywordish = token.type === "NAME" && (token.isKeyword || token.isSoftKeyword);
  const classNames = [
    "tok",
    `tok--${visualClass(token, mode)}`,
    linkTier === "active" ? "tok--sel" : "",
    linkTier === "related" ? "tok--related" : "",
    callHighlighted ? "tok--callhi" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classNames} onClick={onSelect}>
      <span className="tok__type">{chipTypeLabel(token, mode)}</span>
      <span className={`tok__val${value === "" ? " tok__val--empty" : ""}`}>{value}</span>
      {mode === "strict" && isKeywordish ? (
        <span className="tok__kw">{token.isKeyword ? "keyword" : "soft-kw"}</span>
      ) : null}
      {mode === "strict" && showPos ? <span className="tok__pos">{formatPos(token)}</span> : null}
    </button>
  );
}
