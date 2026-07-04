import type { DisplayMode } from "@/entities/analysis";
import type { Token } from "@/shared/api";
import { findCallInfo } from "./call-info";
import { foldFStrings } from "./fstring-fold";
import { isStructToken } from "./token-display";

export interface TokenRowItem {
  token: Token;
  index: number;
}

export interface TokenRow {
  row: number;
  items: TokenRowItem[];
}

export interface TokenStageView {
  tokens: Token[];
  rows: TokenRow[];
  callHighlightIndexes: Set<number>;
  hint: string;
}

export function buildTokenStageView(
  rawTokens: Token[],
  source: string,
  mode: DisplayMode,
  showStruct: boolean,
): TokenStageView {
  const tokens = mode === "easy" ? foldFStrings(rawTokens, source) : rawTokens;
  const visible = filterVisible(tokens, mode, showStruct);

  return {
    tokens,
    rows: groupByRow(visible),
    callHighlightIndexes: buildCallHighlightIndexes(tokens),
    hint:
      mode === "strict"
        ? `— 実際の tokenize 出力（${tokens.length} トークン）`
        : `— ${visible.length}個のかたまり`,
  };
}

function filterVisible(tokens: Token[], mode: DisplayMode, showStruct: boolean): TokenRowItem[] {
  return tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) =>
      mode === "easy" ? !isStructToken(token) : showStruct || !isStructToken(token),
    );
}

function groupByRow(items: TokenRowItem[]): TokenRow[] {
  const rows: TokenRow[] = [];
  for (const item of items) {
    const row = item.token.start[0];
    const lastRow = rows.at(-1);
    if (lastRow && lastRow.row === row) {
      lastRow.items.push(item);
    } else {
      rows.push({ row, items: [item] });
    }
  }
  return rows;
}

function buildCallHighlightIndexes(tokens: Token[]): Set<number> {
  const info = findCallInfo(tokens);
  const indexes = new Set<number>();
  for (const idx of info.callTokenIndexes) {
    indexes.add(idx);
    indexes.add(idx + 1);
  }
  return indexes;
}
