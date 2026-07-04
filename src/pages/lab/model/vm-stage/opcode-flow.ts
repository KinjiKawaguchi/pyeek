import type { Instr } from "@/shared/api";

export interface OpDecomposition {
  pop: number;
  push: (poppedLabels: string[]) => string[];
  note: string;
  // STORE 系命令の代入先変数名。stack-sim が変数表を更新するために使う。
  storesTo?: string;
}

function isNumericLiteral(label: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(label);
}

function applyBinaryOp(op: string, a: number, b: number): number | null {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "//":
      return Math.floor(a / b);
    case "%":
      return a % b;
    case "**":
      return a ** b;
    default:
      return null;
  }
}

function foldBinaryOp(op: string, left: string, right: string): string {
  if (isNumericLiteral(left) && isNumericLiteral(right)) {
    const result = applyBinaryOp(op, Number(left), Number(right));
    if (result !== null) {
      return String(result);
    }
  }
  return `${left} ${op} ${right}`;
}

// dis の opname → スタックへの push/pop の分解表。④a は「浅い」VM なので
// 実際に Python を実行するのではなく、この静的な表だけでスタック内容を再現する。
// resolveName は STORE_NAME 等で直前に記録された変数の値ラベルを引く関数
// （ジャンプの無い直線的なコードのみが対象のため、単純な前方参照で足りる）。
export function decomposeInstr(
  instr: Instr,
  resolveName: (name: string) => string,
): OpDecomposition {
  switch (instr.opname) {
    case "RESUME":
    case "NOP":
      return { pop: 0, push: () => [], note: "" };
    case "PUSH_NULL":
      return { pop: 0, push: () => ["（空き皿）"], note: "呼び出しの下ごしらえ" };
    case "LOAD_CONST":
      return { pop: 0, push: () => [instr.argrepr], note: `値 ${instr.argrepr} を積む` };
    case "LOAD_NAME":
    case "LOAD_FAST":
    case "LOAD_FAST_CHECK":
    case "LOAD_DEREF":
      return {
        pop: 0,
        push: () => [resolveName(instr.argrepr)],
        note: `${instr.argrepr} を読み込む`,
      };
    case "LOAD_GLOBAL": {
      const pushesNull = ((instr.arg ?? 0) & 1) === 1;
      const label = resolveName(instr.argrepr);
      return {
        pop: 0,
        push: () => (pushesNull ? ["（空き皿）", label] : [label]),
        note: `${instr.argrepr} を読み込む`,
      };
    }
    case "BINARY_OP":
      return {
        pop: 2,
        push: ([left, right]) => [foldBinaryOp(instr.argrepr, left ?? "?", right ?? "?")],
        note: `${instr.argrepr} を計算する`,
      };
    case "COMPARE_OP":
      return { pop: 2, push: () => [`<比較: ${instr.argrepr}>`], note: "比較する" };
    case "CALL": {
      const argCount = instr.arg ?? 0;
      return {
        pop: argCount + 2,
        push: (popped) => [`<${popped[1] ?? "呼び出し"}の結果>`],
        note: "関数を呼び出す",
      };
    }
    case "STORE_NAME":
    case "STORE_FAST":
    case "STORE_GLOBAL":
    case "STORE_DEREF":
      return {
        pop: 1,
        push: () => [],
        note: `${instr.argrepr} に代入する`,
        storesTo: instr.argrepr,
      };
    case "POP_TOP":
      return { pop: 1, push: () => [], note: "使い終わった値を捨てる" };
    case "RETURN_VALUE":
      return { pop: 1, push: () => [], note: "値を返す" };
    case "RETURN_CONST":
      return { pop: 0, push: () => [], note: "値を返す" };
    default: {
      const effect = instr.stackEffect ?? 0;
      if (effect >= 0) {
        return {
          pop: 0,
          push: () => Array.from({ length: effect }, () => "？"),
          note: "（このバージョンでは詳細を省略）",
        };
      }
      return { pop: -effect, push: () => [], note: "（このバージョンでは詳細を省略）" };
    }
  }
}
