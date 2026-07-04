import type { Token } from "@/shared/api";

export interface CallInfo {
  callTokenIndexes: number[];
}

// print(...) のように NAME の直後に "(" が来る呼び出しをトークン列上で
// ハイライトするために検出する。
export function findCallInfo(tokens: Token[]): CallInfo {
  const callTokenIndexes: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token?.type !== "NAME") continue;

    const next = tokens[i + 1];
    const isCall = next?.type === "OP" && next.string === "(";
    if (isCall) callTokenIndexes.push(i);
  }

  return { callTokenIndexes };
}
