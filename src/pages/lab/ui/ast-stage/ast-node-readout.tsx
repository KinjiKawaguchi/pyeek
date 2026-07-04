import type { AstNode } from "@/shared/api";
import { findAstReference } from "../../config/ast-stage/ast-reference-index";
import type { DisplayMode } from "../../model/analysis-store";

export interface AstNodeReadoutProps {
  node: AstNode | null;
  mode: DisplayMode;
}

export function AstNodeReadout({ node, mode }: AstNodeReadoutProps) {
  if (!node) {
    return (
      <div className="ast-stage__readout">
        <p className="ast-stage__readout-hint">
          👆 ノードをタップすると、種類・位置・意味がわかります。
        </p>
      </div>
    );
  }

  const fieldEntries = Object.entries(node.fields);
  const reference = findAstReference(node.type);
  const explanation = reference ? (mode === "easy" ? reference.easy : reference.detail) : "";
  const pos =
    node.lineno !== null
      ? `${node.lineno}:${node.colOffset}`
      : node.endLineno !== null
        ? `〜${node.endLineno}`
        : "";

  return (
    <div className="ast-stage__readout">
      <div className="ast-stage__readout-head">
        <span className="ast-stage__chip">{node.type}</span>
        {pos ? <span className="ast-stage__pos">位置 {pos}</span> : null}
        {fieldEntries.length > 0 ? (
          <span className="ast-stage__pos">
            {fieldEntries.map(([key, value]) => `${key}=${value}`).join(" ")}
          </span>
        ) : null}
      </div>
      <div className="ast-stage__readout-body">{explanation}</div>
      {reference ? (
        <a
          href={reference.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ast-stage__doc-link"
        >
          公式ドキュメント →
        </a>
      ) : null}
    </div>
  );
}
