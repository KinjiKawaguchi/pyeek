// モバイル向けコードキーバーがタップされたときの記号挿入を表す純粋関数。
// 選択範囲を挿入テキストで置き換え、カーソルを挿入直後に置く。
// 標準のソフトウェアキーボードと挙動を揃えるため、括弧の自動ペアリングはしない。

import type { EditorEdit, EditorSelection } from "./indent";

export function insertSnippet(value: string, selection: EditorSelection, text: string): EditorEdit {
  const { start, end } = selection;
  const newValue = value.slice(0, start) + text + value.slice(end);
  const cursor = start + text.length;
  return { value: newValue, selection: { start: cursor, end: cursor } };
}
