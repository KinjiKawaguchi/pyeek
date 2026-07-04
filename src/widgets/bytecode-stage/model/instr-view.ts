import type { Instr } from "@/shared/api";

export interface InstrGroup {
  line: number | null;
  items: { instr: Instr; index: number }[];
}

// dis の出力は「行番号 → 命令列」を実行順（コンパイル順）で並べたもの。
// ループ等では同じ行番号が非連続に複数回現れるため、連続する同じ行番号だけを
// 1グループにまとめる（重複排除はしない）。
export function groupInstructionsByLine(instructions: Instr[]): InstrGroup[] {
  const groups: InstrGroup[] = [];
  instructions.forEach((instr, index) => {
    const line = instr.positions?.lineno ?? null;
    const last = groups[groups.length - 1];
    if (last && last.line === line) {
      last.items.push({ instr, index });
    } else {
      groups.push({ line, items: [{ instr, index }] });
    }
  });
  return groups;
}
