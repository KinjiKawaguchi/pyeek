import type { Token } from "@/shared/api";
import { sliceSource } from "@/shared/lib/slice-source";

// 「やさしい」モード用の畳み込み。CPython 3.12 は f-string を
// FSTRING_START/MIDDLE/END + 埋め込み式トークンに分割するが、これは
// 直感的ではないため、1つの「もじれつ」チップに畳んで見せる。
// ネストした f-string（3.12+ で合法）にも対応するため深さカウンタで
// 対応する FSTRING_END まで一括して畳む。
export function foldFStrings(tokens: Token[], source: string): Token[] {
  const result: Token[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (token === undefined) break;

    if (token.type !== "FSTRING_START") {
      result.push(token);
      i++;
      continue;
    }

    const foldEnd = findMatchingFStringEnd(tokens, i);
    const last = tokens[foldEnd];
    result.push(foldToken(token, last ?? token, source));
    i = foldEnd + 1;
  }

  return result;
}

function findMatchingFStringEnd(tokens: Token[], startIndex: number): number {
  let depth = 1;
  let j = startIndex + 1;
  while (j < tokens.length && depth > 0) {
    const t = tokens[j];
    if (t?.type === "FSTRING_START") depth++;
    else if (t?.type === "FSTRING_END") depth--;
    j++;
  }
  return j - 1;
}

function foldToken(start: Token, end: Token, source: string): Token {
  return {
    type: "STRING",
    exactType: "STRING",
    string: sliceSource(source, start.start, end.end),
    start: start.start,
    end: end.end,
    isKeyword: false,
    isSoftKeyword: false,
  };
}
