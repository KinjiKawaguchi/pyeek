import type { Pos } from "@/shared/api";

// tokenize の位置規約（row は 1 始まり、col は 0 始まり、end は排他的）に
// 沿ってソース文字列から範囲を切り出す汎用ユーティリティ。
export function sliceSource(source: string, start: Pos, end: Pos): string {
  const lines = source.split("\n");
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  if (startRow === endRow) {
    return lines[startRow - 1]?.slice(startCol, endCol) ?? "";
  }

  const segments = [lines[startRow - 1]?.slice(startCol) ?? ""];
  for (let row = startRow + 1; row < endRow; row++) {
    segments.push(lines[row - 1] ?? "");
  }
  segments.push(lines[endRow - 1]?.slice(0, endCol) ?? "");
  return segments.join("\n");
}
