"use client";

import { useMemo, useState } from "react";
import { astNodeRange, classifyRange } from "@/entities/source-link";
import type { AstNode } from "@/shared/api";
import { useAnalysis } from "../../model/analysis-store";
import { layoutAst } from "../../model/ast-stage/ast-layout";
import "./ast-stage.css";
import { AstNodeCard } from "./ast-node-card";
import { AstNodeReadout } from "./ast-node-readout";

const COL_WIDTH = 132;
const ROW_HEIGHT = 90;
const NODE_WIDTH = 118;
const NODE_HEIGHT = 54;
const PADDING = 20;

export function AstStage() {
  const { state, setSelectedRange } = useAnalysis();
  const root = state.result?.ast ?? null;
  const layout = useMemo(() => (root ? layoutAst(root) : null), [root]);
  // selectedRange（クロスステージ連動用）とは別に、クリックされたノード自身の
  // id を直接持つ。範囲からの逆引きだと、Module のように範囲を持たないノードや、
  // Expr が中身の Call と同一範囲になるような親子ノードで選択がずれてしまうため。
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const selectedNode = useMemo(() => {
    if (!layout || selectedNodeId === null) return null;
    return layout.nodes.find((layoutNode) => layoutNode.node.id === selectedNodeId)?.node ?? null;
  }, [layout, selectedNodeId]);

  if (!root || !layout) {
    return (
      <section className="card" aria-label="構文木">
        <p className="card__title">
          <span className="card__emoji">🌳</span> 構文木（AST）
        </p>
        <p className="ast-stage__empty">（コードを入力してください）</p>
      </section>
    );
  }

  const width = layout.width * COL_WIDTH + PADDING * 2;
  const height = (layout.depth - 1) * ROW_HEIGHT + PADDING * 2 + NODE_HEIGHT;
  const centerX = (x: number) => x * COL_WIDTH + PADDING + NODE_WIDTH / 2;
  const centerY = (depth: number) => depth * ROW_HEIGHT + PADDING + NODE_HEIGHT / 2;
  const posById = new Map(layout.nodes.map((n) => [n.node.id, n]));

  const handleSelect = (node: AstNode) => {
    setSelectedNodeId(node.id);
    const range = astNodeRange(node);
    if (range) {
      setSelectedRange(range);
    }
  };

  return (
    <section className="card" aria-label="構文木">
      <p className="card__title">
        <span className="card__emoji">🌳</span> 構文木（AST）
        <span className="ast-stage__hint">
          {state.mode === "easy" ? "木として組み立て直された姿" : "ast.parse() が組み立てた構文木"}
        </span>
      </p>
      <div className="ast-stage__canvas">
        <svg
          className="ast-stage__svg"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label="構文木の図"
        >
          <g className="ast-stage__edges">
            {layout.edges.map((edge) => {
              const parent = posById.get(edge.parentId);
              const child = posById.get(edge.childId);
              if (!parent || !child) {
                return null;
              }
              return (
                <line
                  key={`${edge.parentId}-${edge.childId}`}
                  className="ast-stage__edge"
                  x1={centerX(parent.x)}
                  y1={centerY(parent.depth) + NODE_HEIGHT / 2}
                  x2={centerX(child.x)}
                  y2={centerY(child.depth) - NODE_HEIGHT / 2}
                />
              );
            })}
          </g>
          {layout.nodes.map((layoutNode, order) => {
            const range = astNodeRange(layoutNode.node);
            const linkTier = classifyRange(range, state.selectedRange);
            return (
              <foreignObject
                key={layoutNode.node.id}
                x={layoutNode.x * COL_WIDTH + PADDING}
                y={layoutNode.depth * ROW_HEIGHT + PADDING}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
              >
                <AstNodeCard
                  node={layoutNode.node}
                  mode={state.mode}
                  linkTier={linkTier}
                  isSelected={layoutNode.node.id === selectedNodeId}
                  order={order}
                  onSelect={() => handleSelect(layoutNode.node)}
                />
              </foreignObject>
            );
          })}
        </svg>
      </div>
      <AstNodeReadout node={selectedNode} mode={state.mode} />
    </section>
  );
}
