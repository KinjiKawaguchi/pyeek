import type { Instr } from "@/shared/api";
import { findOpcodeReference } from "../../config/bytecode-stage/opcode-reference-index";
import type { DisplayMode } from "../../model/analysis-store";

export interface OpcodeReadoutProps {
  instr: Instr | null;
  mode: DisplayMode;
}

export function OpcodeReadout({ instr, mode }: OpcodeReadoutProps) {
  if (!instr) {
    return (
      <div className="bytecode-stage__readout">
        <p className="bytecode-stage__readout-hint">
          👆 命令をタップすると、種類・位置・意味がわかります。
        </p>
      </div>
    );
  }

  const reference = findOpcodeReference(instr.opname);
  const explanation = reference ? (mode === "easy" ? reference.easy : reference.detail) : "";
  const pos = instr.positions?.lineno != null ? `L${instr.positions.lineno}` : "";

  return (
    <div className="bytecode-stage__readout">
      <div className="bytecode-stage__readout-head">
        <span className="bytecode-stage__chip">{instr.opname}</span>
        <span className="bytecode-stage__pos">
          offset {instr.offset}
          {pos ? `　位置 ${pos}` : ""}
          {instr.argrepr ? `　引数 ${instr.argrepr}` : ""}
        </span>
      </div>
      <div className="bytecode-stage__readout-body">{explanation}</div>
      {reference ? (
        <a
          href={reference.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bytecode-stage__doc-link"
        >
          公式ドキュメント →
        </a>
      ) : null}
    </div>
  );
}
