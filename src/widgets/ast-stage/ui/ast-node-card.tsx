import type { DisplayMode, LinkTier } from "@/entities/analysis";
import type { AstNode } from "@/shared/api";
import { astEasyLabel } from "../config/labels";

export interface AstNodeCardProps {
  node: AstNode;
  mode: DisplayMode;
  linkTier: LinkTier | null;
  // layoutAst() は葉→根の順でノードを返すため、そのまま出現アニメーションの
  // 遅延段数として使える。
  order: number;
  onSelect: () => void;
}

export function AstNodeCard({ node, mode, linkTier, order, onSelect }: AstNodeCardProps) {
  const label = mode === "easy" ? astEasyLabel(node) : node.type;
  const fieldEntries = Object.entries(node.fields);
  const classNames = [
    "ast-node",
    linkTier === "active" ? "ast-node--active" : "",
    linkTier === "related" ? "ast-node--related" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      style={{ animationDelay: `${order * 45}ms` }}
      onClick={onSelect}
    >
      <span className="ast-node__type">{label}</span>
      {mode === "strict" && fieldEntries.length > 0 ? (
        <span className="ast-node__fields">
          {fieldEntries.map(([key, value]) => `${key}=${value}`).join(" ")}
        </span>
      ) : null}
    </button>
  );
}
