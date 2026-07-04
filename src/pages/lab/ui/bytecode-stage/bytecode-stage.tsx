"use client";

import { useMemo, useState } from "react";
import { classifyRange, codePathKey, flattenCodeObjs, instrRange } from "@/entities/source-link";
import type { Instr } from "@/shared/api";
import { useAnalysis } from "../../model/analysis-store";
import { groupInstructionsByLine } from "../../model/bytecode-stage/instr-view";
import "./bytecode-stage.css";
import { InstrRow } from "./instr-row";
import { OpcodeReadout } from "./opcode-readout";

export function BytecodeStage() {
  const { state, setSelectedRange } = useAnalysis();
  const root = state.result?.bytecode ?? null;
  const codeEntries = useMemo(() => (root ? flattenCodeObjs(root) : []), [root]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // selectedRange（クロスステージ連動用）とは別に、クリックされた命令自身の
  // offset を直接持つ。範囲からの逆引きだと、RESUME のようにソース範囲を
  // 持たない命令や、同じ行内で複数命令が同一範囲を共有する場合（例:
  // CALL/POP_TOP/RETURN_CONST が同じ式全体の範囲を指す）に選択がずれるため。
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null);

  if (!root || codeEntries.length === 0) {
    return (
      <section className="card" aria-label="バイトコード">
        <p className="card__title">
          <span className="card__emoji">⚙️</span> バイトコード
        </p>
        <p className="bytecode-stage__empty">（コードを入力してください）</p>
      </section>
    );
  }

  const activeEntry =
    codeEntries.find((entry) => codePathKey(entry.path) === selectedKey) ?? codeEntries[0];

  if (!activeEntry) {
    return null;
  }

  const activeKey = codePathKey(activeEntry.path);
  const groups = groupInstructionsByLine(activeEntry.code.instructions);
  const selectedInstr =
    selectedOffset === null
      ? null
      : (activeEntry.code.instructions.find((instr) => instr.offset === selectedOffset) ?? null);

  const handleSelect = (instr: Instr) => {
    setSelectedOffset(instr.offset);
    const range = instrRange(instr);
    if (range) {
      setSelectedRange(range);
    }
  };

  return (
    <section className="card" aria-label="バイトコード">
      <p className="card__title">
        <span className="card__emoji">⚙️</span> バイトコード
        <span className="bytecode-stage__hint">
          {state.mode === "easy" ? "命令をひとつずつ実行していく" : "dis.Bytecode の出力"}
        </span>
      </p>
      {codeEntries.length > 1 ? (
        <div className="bytecode-stage__code-tabs" role="tablist" aria-label="コードオブジェクト">
          {codeEntries.map((entry) => {
            const key = codePathKey(entry.path);
            return (
              <button
                type="button"
                key={key}
                role="tab"
                aria-selected={key === activeKey}
                className={`bytecode-stage__code-tab${key === activeKey ? " bytecode-stage__code-tab--active" : ""}`}
                onClick={() => setSelectedKey(key)}
              >
                {entry.path.join(" › ")}
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="bytecode-stage__stream">
        {groups.map((group) => {
          const firstOffset = group.items[0]?.instr.offset;
          return (
            <div className="bytecode-stage__row" key={`L${group.line ?? "none"}@${firstOffset}`}>
              <span className="bytecode-stage__row-label">
                {group.line !== null ? `L${group.line}` : ""}
              </span>
              <div className="bytecode-stage__row-instrs">
                {group.items.map(({ instr, index }) => {
                  const range = instrRange(instr);
                  const linkTier = classifyRange(range, state.selectedRange);
                  return (
                    <InstrRow
                      key={index}
                      instr={instr}
                      mode={state.mode}
                      linkTier={linkTier}
                      isSelected={instr.offset === selectedOffset}
                      onSelect={() => handleSelect(instr)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <OpcodeReadout instr={selectedInstr} mode={state.mode} />
    </section>
  );
}
