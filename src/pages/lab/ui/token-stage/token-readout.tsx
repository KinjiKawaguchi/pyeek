import type { Token } from "@/shared/api";
import { CHIP_COLOR, EXPLAIN } from "../../config/token-stage/explain";
import { formatPos, isBracket } from "../../model/token-stage/token-display";

export interface TokenReadoutProps {
  token: Token | null;
}

function keywordNote(token: Token): string {
  if (token.type !== "NAME") return "";
  if (token.isKeyword) return "　これは Python のキーワードですが、字句解析では NAME 扱いです。";
  if (token.isSoftKeyword) {
    return "　これは soft keyword（match/case/type/_）。文脈により意味が変わるため、やはり NAME です。";
  }
  return "";
}

export function TokenReadout({ token }: TokenReadoutProps) {
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
        {EXPLAIN[token.type] ?? ""}
        {keywordNote(token)}
      </div>
    </div>
  );
}
