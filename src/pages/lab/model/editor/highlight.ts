// ①ステージで表示している本物の tokenize 結果を、エディタのシンタックス
// ハイライトにそのまま使い回す（Prism 等の別実装の Python 文法を持ち込まない）。

import type { Pos, Token } from "@/shared/api";
import { isBracket, isStructToken } from "../token-stage/token-display";

export type TokenCategory = "keyword" | "name" | "string" | "number" | "op" | "bracket" | "comment";

export interface HighlightSegment {
  text: string;
  category: TokenCategory | null;
}

function tokenCategory(token: Token): TokenCategory | null {
  if (token.isKeyword || token.isSoftKeyword) return "keyword";
  if (token.type === "OP") return isBracket(token.string) ? "bracket" : "op";
  if (token.type === "STRING" || token.type.startsWith("FSTRING")) return "string";
  if (token.type === "NUMBER") return "number";
  if (token.type === "COMMENT") return "comment";
  if (token.type === "NAME") return "name";
  if (isStructToken(token)) return null;
  return null;
}

function buildLineStarts(source: string): number[] {
  const starts = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === "\n") starts.push(i + 1);
  }
  return starts;
}

// tokenize の位置は (row, col)。row は1始まり、col は0始まり。
// ENCODING 等の擬似トークンは row 0 を使うことがあるため 0 にクランプする。
function toOffset(lineStarts: number[], pos: Pos, sourceLength: number): number {
  const [row, col] = pos;
  if (row < 1) return 0;
  const base = lineStarts[row - 1];
  if (base === undefined) return sourceLength;
  return Math.min(base + col, sourceLength);
}

// ソース文字列をトークンの位置情報で分割し、色分け用のセグメント列にする。
// トークンに覆われない区間（空白等）は category: null のまま素通しする。
export function buildHighlightSegments(source: string, tokens: Token[]): HighlightSegment[] {
  if (source === "") return [];

  const lineStarts = buildLineStarts(source);
  const ranges = tokens
    .map((token) => ({
      token,
      start: toOffset(lineStarts, token.start, source.length),
      end: toOffset(lineStarts, token.end, source.length),
    }))
    .filter((range) => range.end > range.start)
    .sort((a, b) => a.start - b.start);

  const segments: HighlightSegment[] = [];
  let cursor = 0;
  for (const { token, start, end } of ranges) {
    if (start < cursor) continue;
    if (start > cursor) segments.push({ text: source.slice(cursor, start), category: null });
    segments.push({ text: source.slice(start, end), category: tokenCategory(token) });
    cursor = end;
  }
  if (cursor < source.length) segments.push({ text: source.slice(cursor), category: null });
  return segments;
}
