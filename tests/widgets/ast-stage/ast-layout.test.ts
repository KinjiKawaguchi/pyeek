import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { AstNode } from "@/shared/api";
import { layoutAst } from "@/widgets/ast-stage/model/ast-layout";

const SNAPSHOT_DIR = path.resolve(__dirname, "../../python/snapshots");

function loadAst(name: string): AstNode {
  const raw = readFileSync(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
  const ast = (JSON.parse(raw) as { ast: AstNode | null }).ast;
  if (!ast) {
    throw new Error(`${name} の ast が null`);
  }
  return ast;
}

// "2 + 3 * 4" → Module > Expr > BinOp(+) > [Constant(2), Add, BinOp(*) > [Constant(3), Mult, Constant(4)]]
describe("layoutAst", () => {
  const ast = loadAst("constant_folding");
  const layout = layoutAst(ast);

  it("全ノードを1件ずつレイアウトする", () => {
    expect(layout.nodes).toHaveLength(9);
  });

  it("葉→根の順（post-order）で並ぶ。根が最後", () => {
    const last = layout.nodes[layout.nodes.length - 1];
    expect(last?.node.type).toBe("Module");
  });

  it("葉の本数がそのまま width になる", () => {
    // Constant(2), Add, Constant(3), Mult, Constant(4) の5枚
    expect(layout.width).toBe(5);
  });

  it("最大深さ+1が depth になる", () => {
    // Module(0) > Expr(1) > BinOp(2) > BinOp(3) > Constant(4)
    expect(layout.depth).toBe(5);
  });

  it("辺の数はノード数-1（木構造）", () => {
    expect(layout.edges).toHaveLength(8);
  });

  it("最初の葉の x は 0", () => {
    expect(layout.nodes[0]?.x).toBe(0);
  });

  it("内部ノードの x は子の平均", () => {
    const innerBinOp = layout.nodes.find((n) => n.node.type === "BinOp" && n.depth === 3);
    expect(innerBinOp).toBeDefined();
    // 内側の BinOp（3 * 4）の子は Constant(3)=x2, Mult=x3, Constant(4)=x4 → 平均3
    expect(innerBinOp?.x).toBe(3);
  });
});
