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
  // 分岐・ループ命令のみ。取られた/取られなかった選択と着地先インデックス。
  jump?: { taken: boolean; targetIndex: number };
  // JUMP_BACKWARD系が実行された時点で、これから入るくり返しの周回数(1始まり)。
  iteration?: number;
}

export type StackSimResult =
  | { ok: true; steps: Step[]; truncated: boolean }
  | {
      ok: false;
      reason: "unsupported-jump" | "opaque-branch" | "opaque-iterable";
      detail?: string;
    };

const DEFAULT_MAX_STEPS = 256;

// ④a が実際に再生できるジャンプ系opcode。これ以外のジャンプ命令を含む
// コードは再生を拒否する(未知のジャンプの挙動を捏造しないため)。
const SUPPORTED_JUMP_OPS = new Set([
  "JUMP_FORWARD",
  "JUMP_BACKWARD",
  "JUMP_BACKWARD_NO_INTERRUPT",
  "POP_JUMP_IF_TRUE",
  "POP_JUMP_IF_FALSE",
  "POP_JUMP_IF_NONE",
  "POP_JUMP_IF_NOT_NONE",
  "FOR_ITER",
]);

// range() 呼び出しの結果を簡易モデル化したイテレータ状態。StackItem 自体は
// 全 Step で共有される不変オブジェクトなので、進行中のカーソルは
// id をキーにしたこのマップ側で保持する(巻き戻しても StackItem は壊れない)。
interface RangeIterator {
  next: number;
  stop: number;
  step: number;
}

function truthiness(label: string): boolean | null {
  if (label === "True") return true;
  if (label === "False" || label === "None") return false;
  if (/^-?\d+(\.\d+)?$/.test(label)) return Number(label) !== 0;
  return null;
}

function parseRangeCall(calleeLabel: string, argLabels: string[]): RangeIterator | null {
  if (calleeLabel !== "range") return null;
  const nums = argLabels.map(Number);
  if (nums.length === 0 || nums.some((n) => Number.isNaN(n))) return null;
  if (nums.length === 1) return { next: 0, stop: nums[0] ?? 0, step: 1 };
  if (nums.length === 2) return { next: nums[0] ?? 0, stop: nums[1] ?? 0, step: 1 };
  return { next: nums[0] ?? 0, stop: nums[1] ?? 0, step: nums[2] ?? 1 };
}

function rangeLabel(it: RangeIterator): string {
  return it.step === 1
    ? `range(${it.next}, ${it.stop})`
    : `range(${it.next}, ${it.stop}, ${it.step})`;
}

function resolveJumpIndex(instr: Instr, offsetToIndex: Map<number, number>): number | undefined {
  if (instr.jumpTarget == null) return undefined;
  return offsetToIndex.get(instr.jumpTarget);
}

// 全 Step を事前計算する。再生・一時停止・ステップ・巻き戻しはこの配列への
// インデックス移動だけになるため、巻き戻しは常に即時（再計算不要）。
// ループ・分岐がある場合はプログラムカウンタで instructions を辿るため、
// 同じ命令が複数回 Step として現れうる(index は一意でも単調でもない)。
export function simulateStack(
  instructions: Instr[],
  options?: { maxSteps?: number },
): StackSimResult {
  const maxSteps = options?.maxSteps ?? DEFAULT_MAX_STEPS;

  const hasUnsupportedJump = instructions.some(
    (instr) => instr.isJump && !SUPPORTED_JUMP_OPS.has(instr.opname),
  );
  if (hasUnsupportedJump) {
    return { ok: false, reason: "unsupported-jump" };
  }

  const offsetToIndex = new Map<number, number>();
  instructions.forEach((instr, idx) => {
    offsetToIndex.set(instr.offset, idx);
  });

  const vars = new Map<string, string>();
  const resolveName = (name: string) => vars.get(name) ?? name;
  const iterators = new Map<number, RangeIterator>();

  let idCounter = 0;
  let stack: StackItem[] = [];
  const steps: Step[] = [];
  let pc = 0;
  let iteration = 0;
  let truncated = false;

  while (pc < instructions.length) {
    if (steps.length >= maxSteps) {
      truncated = true;
      break;
    }

    const instr = instructions[pc];
    if (!instr) break;
    const stackBefore = stack;

    if (instr.opname === "FOR_ITER") {
      const top = stack[stack.length - 1];
      const it = top ? iterators.get(top.id) : undefined;
      if (!it) {
        return { ok: false, reason: "opaque-iterable" };
      }
      if (it.next < it.stop) {
        const label = String(it.next);
        it.next += it.step;
        const pushed = { id: idCounter++, label };
        stack = [...stack, pushed];
        steps.push({
          index: pc,
          instr,
          stackBefore,
          stackAfter: stack,
          poppedCount: 0,
          pushedCount: 1,
          note: `${label} を取り出す`,
          jump: { taken: false, targetIndex: pc + 1 },
        });
        pc += 1;
        continue;
      }
      const target = resolveJumpIndex(instr, offsetToIndex);
      if (target === undefined) return { ok: false, reason: "unsupported-jump" };
      const placeholder = { id: idCounter++, label: "（くり返し終了）" };
      stack = [...stack, placeholder];
      steps.push({
        index: pc,
        instr,
        stackBefore,
        stackAfter: stack,
        poppedCount: 0,
        pushedCount: 1,
        note: "くり返しが尽きたので抜ける",
        jump: { taken: true, targetIndex: target },
      });
      pc = target;
      continue;
    }

    if (
      instr.opname === "POP_JUMP_IF_TRUE" ||
      instr.opname === "POP_JUMP_IF_FALSE" ||
      instr.opname === "POP_JUMP_IF_NONE" ||
      instr.opname === "POP_JUMP_IF_NOT_NONE"
    ) {
      const top = stack[stack.length - 1];
      const label = top?.label ?? "?";
      const truth = truthiness(label);
      if (truth === null) {
        return { ok: false, reason: "opaque-branch", detail: label };
      }
      const takeJump =
        instr.opname === "POP_JUMP_IF_TRUE"
          ? truth === true
          : instr.opname === "POP_JUMP_IF_FALSE"
            ? truth === false
            : instr.opname === "POP_JUMP_IF_NONE"
              ? label === "None"
              : label !== "None";

      stack = stack.slice(0, -1);
      let targetIndex = pc + 1;
      if (takeJump) {
        const target = resolveJumpIndex(instr, offsetToIndex);
        if (target === undefined) return { ok: false, reason: "unsupported-jump" };
        targetIndex = target;
      }
      steps.push({
        index: pc,
        instr,
        stackBefore,
        stackAfter: stack,
        poppedCount: 1,
        pushedCount: 0,
        note: takeJump ? "条件が成立 → ジャンプする" : "条件が不成立 → 次に進む",
        jump: { taken: takeJump, targetIndex },
      });
      pc = targetIndex;
      continue;
    }

    if (
      instr.opname === "JUMP_FORWARD" ||
      instr.opname === "JUMP_BACKWARD" ||
      instr.opname === "JUMP_BACKWARD_NO_INTERRUPT"
    ) {
      const target = resolveJumpIndex(instr, offsetToIndex);
      if (target === undefined) return { ok: false, reason: "unsupported-jump" };
      const isBackward = instr.opname !== "JUMP_FORWARD";
      if (isBackward) iteration += 1;
      steps.push({
        index: pc,
        instr,
        stackBefore,
        stackAfter: stack,
        poppedCount: 0,
        pushedCount: 0,
        note: isBackward ? `${iteration}周目へ` : "ジャンプする",
        jump: { taken: true, targetIndex: target },
        iteration: isBackward ? iteration : undefined,
      });
      pc = target;
      continue;
    }

    // 通常命令(ジャンプ系以外)は既存の decomposeInstr で処理する。
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

    // range() の呼び出し結果にイテレータ状態を紐付ける(GET_ITER/FOR_ITER が使う)。
    if (instr.opname === "CALL" && pushedItems.length === 1 && pushedItems[0]) {
      const argCount = instr.arg ?? 0;
      const calleeLabel = poppedItems[poppedItems.length - argCount - 1]?.label;
      const argLabels = poppedItems.slice(poppedItems.length - argCount).map((item) => item.label);
      const rangeIt = calleeLabel ? parseRangeCall(calleeLabel, argLabels) : null;
      if (rangeIt) {
        iterators.set(pushedItems[0].id, rangeIt);
        pushedItems[0].label = rangeLabel(rangeIt);
      }
    }
    if (instr.opname === "GET_ITER" && pushedItems[0]) {
      const sourceId = stackBefore[stackBefore.length - 1]?.id;
      const it = sourceId !== undefined ? iterators.get(sourceId) : undefined;
      if (it) iterators.set(pushedItems[0].id, it);
    }

    steps.push({
      index: pc,
      instr,
      stackBefore,
      stackAfter: stack,
      poppedCount: popCount,
      pushedCount: pushedItems.length,
      note: decomposition.note,
    });

    if (instr.opname === "RETURN_VALUE" || instr.opname === "RETURN_CONST") {
      break;
    }
    pc += 1;
  }

  return { ok: true, steps, truncated };
}
