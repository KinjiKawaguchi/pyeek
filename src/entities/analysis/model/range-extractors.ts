import type { AstNode, Instr, Token } from "@/shared/api";
import type { SrcRange } from "./source-range";

export function tokenRange(token: Token): SrcRange {
  return { start: token.start, end: token.end };
}

export function astNodeRange(node: AstNode): SrcRange | null {
  if (
    node.lineno === null ||
    node.colOffset === null ||
    node.endLineno === null ||
    node.endColOffset === null
  ) {
    return null;
  }
  return { start: [node.lineno, node.colOffset], end: [node.endLineno, node.endColOffset] };
}

export function instrRange(instr: Instr): SrcRange | null {
  const p = instr.positions;
  if (
    !p ||
    p.lineno === null ||
    p.colOffset === null ||
    p.endLineno === null ||
    p.endColOffset === null
  ) {
    return null;
  }
  // lineno=0 は RESUME 等の合成命令（ソース上に対応箇所が無い）なのでリンク対象外。
  if (p.lineno === 0) {
    return null;
  }
  return { start: [p.lineno, p.colOffset], end: [p.endLineno, p.endColOffset] };
}
