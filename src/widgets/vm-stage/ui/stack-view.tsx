"use client";

import { useEffect, useRef, useState } from "react";
import type { StackItem } from "../model/stack-sim";

const POP_FADE_MS = 260;

// 直前のステップと比べて消えた要素を一瞬「薄く」表示してから消す。
// 純粋な描画だけでは pop の瞬間が分からないため、簡易的な退場アニメを補う。
function useLeavingItems(stack: StackItem[]): StackItem[] {
  const [leaving, setLeaving] = useState<StackItem[]>([]);
  const prevRef = useRef(stack);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = stack;
    const currentIds = new Set(stack.map((item) => item.id));
    const removed = prev.filter((item) => !currentIds.has(item.id));
    if (removed.length === 0) {
      return;
    }
    setLeaving(removed);
    const timer = setTimeout(() => setLeaving([]), POP_FADE_MS);
    return () => clearTimeout(timer);
  }, [stack]);

  return leaving;
}

export interface StackViewProps {
  stack: StackItem[];
}

export function StackView({ stack }: StackViewProps) {
  const leaving = useLeavingItems(stack);

  if (stack.length === 0 && leaving.length === 0) {
    return <p className="stack-view__empty">（スタックは空）</p>;
  }

  return (
    <div className="stack-view" aria-live="polite">
      {leaving.map((item) => (
        <div className="stack-view__plate stack-view__plate--leaving" key={`leaving-${item.id}`}>
          {item.label}
        </div>
      ))}
      {[...stack].reverse().map((item) => (
        <div className="stack-view__plate" key={item.id}>
          {item.label}
        </div>
      ))}
    </div>
  );
}
