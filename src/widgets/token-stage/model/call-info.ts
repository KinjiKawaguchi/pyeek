import type { Token } from "@/shared/api";

// print(...) のように NAME の直後に "(" が来る呼び出しを検出する。
// 「()のひみつ」カードは、呼び出しがあれば「実行された」を、裸の
// builtin 名（呼び出しなし）があれば「まだ実行されていない」を示す。
const BUILTINS = new Set([
  "print",
  "input",
  "len",
  "range",
  "int",
  "str",
  "float",
  "list",
  "dict",
  "set",
  "tuple",
  "sum",
  "max",
  "min",
  "abs",
  "sorted",
  "type",
  "open",
  "map",
  "filter",
]);

export interface CallInfo {
  callTokenIndexes: number[];
  bareBuiltin: string | null;
}

export function findCallInfo(tokens: Token[]): CallInfo {
  const callTokenIndexes: number[] = [];
  let bareBuiltin: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token?.type !== "NAME") continue;

    const next = tokens[i + 1];
    const isCall = next?.type === "OP" && next.string === "(";
    if (isCall) {
      callTokenIndexes.push(i);
      continue;
    }

    if (BUILTINS.has(token.string) && !token.isKeyword) {
      const prev = tokens[i - 1];
      const isAttributeAccess = prev?.type === "OP" && prev.string === ".";
      if (!isAttributeAccess) bareBuiltin = token.string;
    }
  }

  return { callTokenIndexes, bareBuiltin };
}
