import type { LinkTier } from "@/entities/source-link";
import type { Instr } from "@/shared/api";
import { easyOpLabel } from "../../config/bytecode-stage/labels";
import type { DisplayMode } from "../../model/analysis-store";

export interface InstrRowProps {
  instr: Instr;
  mode: DisplayMode;
  linkTier: LinkTier | null;
  onSelect: () => void;
}

export function InstrRow({ instr, mode, linkTier, onSelect }: InstrRowProps) {
  const classNames = [
    "instr",
    linkTier === "active" ? "instr--active" : "",
    linkTier === "related" ? "instr--related" : "",
    instr.isJumpTarget ? "instr--jump-target" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classNames} onClick={onSelect}>
      <span className="instr__offset">{instr.offset}</span>
      <span className="instr__opname">{instr.opname}</span>
      {mode === "easy" ? <span className="instr__easy">{easyOpLabel(instr.opname)}</span> : null}
      {instr.argrepr ? <span className="instr__argrepr">{instr.argrepr}</span> : null}
      {instr.isJump ? <span className="instr__jump-badge">↷ ジャンプ</span> : null}
      {instr.isJumpTarget ? <span className="instr__target-badge">🎯 着地点</span> : null}
    </button>
  );
}
