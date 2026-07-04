import type { Token } from "@/shared/api";
import type { DisplayMode } from "../analysis-store";

const STRUCT_TYPES = new Set(["NEWLINE", "NL", "INDENT", "DEDENT", "ENDMARKER"]);

export function isStructToken(token: Token): boolean {
  return STRUCT_TYPES.has(token.type);
}

export function isBracket(opString: string): boolean {
  return (
    opString === "(" ||
    opString === ")" ||
    opString === "[" ||
    opString === "]" ||
    opString === "{" ||
    opString === "}"
  );
}

// 表示上の色分けクラス（前身 token-lab.html の visualClass 相当）。
export function visualClass(token: Token, mode: DisplayMode): string {
  if (token.type === "OP") return isBracket(token.string) ? "BRACKET" : "OP";
  if (token.type === "NAME" && mode === "easy" && token.isKeyword) return "KEYWORD";
  if (isStructToken(token)) return "STRUCT";
  return token.type;
}

const EASY_TYPE_LABEL: Record<string, string> = {
  NAME: "なまえ",
  NUMBER: "すうじ",
  STRING: "もじれつ",
  COMMENT: "コメント",
};

export function chipTypeLabel(token: Token, mode: DisplayMode): string {
  if (mode === "easy") {
    if (token.type === "OP") return isBracket(token.string) ? "かっこ" : "きごう";
    if (EASY_TYPE_LABEL[token.type]) return EASY_TYPE_LABEL[token.type] as string;
    return token.isKeyword ? "キーワード" : token.type;
  }
  return token.type === "OP" ? token.exactType : token.type;
}

export function showValue(token: Token): string {
  if (token.type === "INDENT") {
    const visible = token.string.replaceAll("\t", "→").replaceAll(" ", "·");
    return visible || "·";
  }
  if (token.type === "NEWLINE") return token.string === "" ? "∅" : "⏎";
  if (token.type === "NL") return "⏎";
  if (token.type === "DEDENT" || token.type === "ENDMARKER") return "∅";
  return token.string.replaceAll("\t", "→").replaceAll("\r", "").replaceAll("\n", "⏎");
}

export function formatPos(token: Token): string {
  return `${token.start[0]}:${token.start[1]}–${token.end[0]}:${token.end[1]}`;
}
