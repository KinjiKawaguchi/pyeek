import { rangesEqual, rangesOverlap, type SrcRange } from "./source-range";

// active: 選択範囲そのもの（クリックされた要素自身、または完全に対応する要素）
// related: 選択範囲と重なるが一致はしない要素（祖先ノードなど）
export type LinkTier = "active" | "related";

export function classifyRange(
  itemRange: SrcRange | null,
  selected: SrcRange | null,
): LinkTier | null {
  if (!itemRange || !selected) {
    return null;
  }
  if (rangesEqual(itemRange, selected)) {
    return "active";
  }
  if (rangesOverlap(itemRange, selected)) {
    return "related";
  }
  return null;
}

export function isLinked(itemRange: SrcRange | null, selected: SrcRange | null): boolean {
  return classifyRange(itemRange, selected) !== null;
}
