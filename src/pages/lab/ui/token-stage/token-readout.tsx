import type { Token } from "@/shared/api";
import { CHIP_COLOR } from "../../config/token-stage/explain";
import { findTokenReference } from "../../config/token-stage/token-reference-index";
import type { DisplayMode } from "../../model/analysis-store";
import { formatPos, isBracket } from "../../model/token-stage/token-display";

export interface TokenReadoutProps {
  token: Token | null;
  mode: DisplayMode;
}

function keywordNote(token: Token): string {
  if (token.type !== "NAME") return "";
  if (token.isKeyword) return "　これは Python のキーワードですが、字句解析では NAME 扱いです。";
  if (token.isSoftKeyword) {
    return "　これは soft keyword（match/case/type/_）。文脈により意味が変わるため、やはり NAME です。";
  }
  return "";
}

export function TokenReadout({ token, mode }: TokenReadoutProps) {
  if (!token) {
    return (
      <div className="token-stage__readout">
        <p className="token-stage__readout-hint">
          👆 トークンをタップすると、種類・位置・意味がわかります。
        </p>
      </div>
    );
  }

  const typeName = token.type === "OP" ? `${token.type} · ${token.exactType}` : token.type;
  const colorKey = token.type === "OP" ? (isBracket(token.string) ? "BRACKET" : "OP") : token.type;
  const color = CHIP_COLOR[colorKey] ?? "#888";
  const repr = token.string === "" ? "（空）" : JSON.stringify(token.string);
  const reference = findTokenReference(token.type === "OP" ? token.exactType : token.type);
  const explanation = reference ? (mode === "easy" ? reference.easy : reference.detail) : "";

  return (
    <div className="token-stage__readout">
      <div className="token-stage__readout-head">
        <span className="token-stage__chip" style={{ background: color }}>
          {typeName}
        </span>
        <span className="token-stage__pos">
          位置 {formatPos(token)}　文字列 {repr}
        </span>
      </div>
      <div className="token-stage__readout-body">
        {explanation}
        {keywordNote(token)}
      </div>
      {reference ? (
        <a
          href={reference.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="token-stage__doc-link"
        >
          公式ドキュメント →
        </a>
      ) : null}
    </div>
  );
}
