import type { AstNode } from "@/shared/api";

export interface AstLayoutNode {
  node: AstNode;
  depth: number;
  // 単位系の水平位置（葉は整数、内部ノードは子の平均）。ピクセル変換は描画側の責務。
  x: number;
}

export interface AstLayoutEdge {
  parentId: number;
  childId: number;
  field: string;
}

export interface AstLayout {
  // 葉から根の順（post-order）。build-anim の出現順にそのまま使える。
  nodes: AstLayoutNode[];
  edges: AstLayoutEdge[];
  width: number;
  depth: number;
}

export function layoutAst(root: AstNode): AstLayout {
  const nodes: AstLayoutNode[] = [];
  const edges: AstLayoutEdge[] = [];
  let nextLeafX = 0;
  let maxDepth = 0;

  function visit(node: AstNode, depth: number): number {
    maxDepth = Math.max(maxDepth, depth);
    if (node.children.length === 0) {
      const x = nextLeafX;
      nextLeafX += 1;
      nodes.push({ node, depth, x });
      return x;
    }

    const childXs = node.children.map(({ node: child, field }) => {
      const childX = visit(child, depth + 1);
      edges.push({ parentId: node.id, childId: child.id, field });
      return childX;
    });
    const x = childXs.reduce((sum, v) => sum + v, 0) / childXs.length;
    nodes.push({ node, depth, x });
    return x;
  }

  visit(root, 0);
  return { nodes, edges, width: Math.max(nextLeafX, 1), depth: maxDepth + 1 };
}
