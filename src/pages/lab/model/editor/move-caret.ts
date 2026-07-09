// モバイル向けコードキーバーの矢印キーによるカーソル移動を表す純粋関数。
// テキストは変更せず、選択範囲(カーソル位置)だけを返す。

import type { EditorSelection } from "./indent";

export type CaretDirection = "left" | "right";

export function moveCaret(
  value: string,
  selection: EditorSelection,
  direction: CaretDirection,
): EditorSelection {
  const { start, end } = selection;
  if (start !== end) {
    const collapsed = direction === "left" ? start : end;
    return { start: collapsed, end: collapsed };
  }
  const next = direction === "left" ? start - 1 : start + 1;
  const clamped = Math.max(0, Math.min(next, value.length));
  return { start: clamped, end: clamped };
}
