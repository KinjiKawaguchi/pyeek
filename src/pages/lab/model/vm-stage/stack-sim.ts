import type { Instr } from "@/shared/api";
import { decomposeInstr } from "./opcode-flow";

export interface StackItem {
  id: number;
  label: string;
}

export interface Step {
  index: number;
  instr: Instr;
  stackBefore: StackItem[];
  stackAfter: StackItem[];
  poppedCount: number;
  pushedCount: number;
  note: string;
}

export type StackSimResult = { ok: true; steps: Step[] } | { ok: false; reason: "jump" };

// 全 Step を事前計算する。再生・一時停止・ステップ・巻き戻しはこの配列への
// インデックス移動だけになるため、巻き戻しは常に即時（再計算不要）。
export function simulateStack(instructions: Instr[]): StackSimResult {
  if (instructions.some((instr) => instr.isJump || instr.isJumpTarget)) {
    return { ok: false, reason: "jump" };
  }

  const vars = new Map<string, string>();
  const resolveName = (name: string) => vars.get(name) ?? name;

  let idCounter = 0;
  let stack: StackItem[] = [];
  const steps: Step[] = [];

  for (const [index, instr] of instructions.entries()) {
    const stackBefore = stack;
    const decomposition = decomposeInstr(instr, resolveName);
    const popCount = Math.min(decomposition.pop, stack.length);
    const poppedItems = stack.slice(stack.length - popCount);
    const remaining = stack.slice(0, stack.length - popCount);

    if (decomposition.storesTo && poppedItems[0]) {
      vars.set(decomposition.storesTo, poppedItems[0].label);
    }

    const pushedLabels = decomposition.push(poppedItems.map((item) => item.label));
    const pushedItems = pushedLabels.map((label) => ({ id: idCounter++, label }));
    stack = [...remaining, ...pushedItems];

    steps.push({
      index,
      instr,
      stackBefore,
      stackAfter: stack,
      poppedCount: popCount,
      pushedCount: pushedItems.length,
      note: decomposition.note,
    });
  }

  return { ok: true, steps };
}
