import type { Pos } from "@/shared/api";

export interface SrcRange {
  start: Pos;
  end: Pos;
}

function toLinear(pos: Pos): number {
  // col は同じ行内で高々数千桁の想定なので、行番号を大きく重み付けした
  // 単純な線形化で辞書式順序を表現する。
  return pos[0] * 1_000_000 + pos[1];
}

function posLt(a: Pos, b: Pos): boolean {
  return toLinear(a) < toLinear(b);
}

function posLte(a: Pos, b: Pos): boolean {
  return toLinear(a) <= toLinear(b);
}

export function rangesEqual(a: SrcRange, b: SrcRange): boolean {
  return (
    a.start[0] === b.start[0] &&
    a.start[1] === b.start[1] &&
    a.end[0] === b.end[0] &&
    a.end[1] === b.end[1]
  );
}

// 半開区間 [start, end) 同士が重なるか。
export function rangesOverlap(a: SrcRange, b: SrcRange): boolean {
  return posLt(a.start, b.end) && posLt(b.start, a.end);
}

export function rangeContains(outer: SrcRange, inner: SrcRange): boolean {
  return posLte(outer.start, inner.start) && posLte(inner.end, outer.end);
}
