// Python コードエディタ用の Tab/Shift+Tab/Enter キー入力の純粋関数群。
// textarea 標準の Tab（フォーカス移動）や Enter（改行のみ）の挙動を上書きし、
// コードエディタとして最低限自然な振る舞い（インデント挿入・解除・
// 改行時のインデント継続とブロック開始時の自動追加）を実現する。

export interface EditorSelection {
  start: number;
  end: number;
}

export interface EditorEdit {
  value: string;
  selection: EditorSelection;
}

const INDENT = "    ";

function lineStartOf(value: string, pos: number): number {
  return value.lastIndexOf("\n", pos - 1) + 1;
}

function lineEndOf(value: string, pos: number): number {
  const next = value.indexOf("\n", pos);
  return next === -1 ? value.length : next;
}

function leadingRemovableWidth(line: string): number {
  if (line.startsWith("\t")) return 1;
  let count = 0;
  while (count < INDENT.length && line[count] === " ") count++;
  return count;
}

export function insertTab(value: string, selection: EditorSelection): EditorEdit {
  const { start, end } = selection;
  const spansMultipleLines = value.slice(start, end).includes("\n");
  if (start === end || !spansMultipleLines) {
    const newValue = value.slice(0, start) + INDENT + value.slice(end);
    const cursor = start + INDENT.length;
    return { value: newValue, selection: { start: cursor, end: cursor } };
  }
  return indentLines(value, start, end);
}

function indentLines(value: string, start: number, end: number): EditorEdit {
  const blockStart = lineStartOf(value, start);
  const blockEnd = lineEndOf(value, end);
  const lines = value.slice(blockStart, blockEnd).split("\n");
  const indented = lines.map((line) => INDENT + line).join("\n");
  const newValue = value.slice(0, blockStart) + indented + value.slice(blockEnd);
  return {
    value: newValue,
    selection: {
      start: start + INDENT.length,
      end: end + INDENT.length * lines.length,
    },
  };
}

export function outdentLines(value: string, selection: EditorSelection): EditorEdit {
  const { start, end } = selection;
  const blockStart = lineStartOf(value, start);
  const blockEnd = lineEndOf(value, end);
  const lines = value.slice(blockStart, blockEnd).split("\n");

  let firstLineRemoved = 0;
  let totalRemoved = 0;
  const dedented = lines.map((line, index) => {
    const removed = leadingRemovableWidth(line);
    if (index === 0) firstLineRemoved = removed;
    totalRemoved += removed;
    return line.slice(removed);
  });

  const newValue = value.slice(0, blockStart) + dedented.join("\n") + value.slice(blockEnd);
  return {
    value: newValue,
    selection: {
      start: Math.max(blockStart, start - firstLineRemoved),
      end: Math.max(blockStart, end - totalRemoved),
    },
  };
}

export function insertNewlineWithIndent(value: string, selection: EditorSelection): EditorEdit {
  const { start, end } = selection;
  const blockStart = lineStartOf(value, start);
  const textBeforeCursor = value.slice(blockStart, start);
  const baseIndent = textBeforeCursor.match(/^[ \t]*/)?.[0] ?? "";
  const opensBlock = textBeforeCursor.trimEnd().endsWith(":");
  const newIndent = opensBlock ? baseIndent + INDENT : baseIndent;

  const insertion = `\n${newIndent}`;
  const newValue = value.slice(0, start) + insertion + value.slice(end);
  const cursor = start + insertion.length;
  return { value: newValue, selection: { start: cursor, end: cursor } };
}
