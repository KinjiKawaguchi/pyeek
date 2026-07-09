// モバイル向けコードキーバーに並べるキーの定義。
// 標準のソフトウェアキーボードでは打ちづらいPythonの頻出記号を、
// 使用頻度が高いものから左に並べる。

export type KeybarKey =
  | { kind: "tab"; label: string }
  | { kind: "snippet"; label: string; text: string }
  | { kind: "move"; label: string; direction: "left" | "right" };

export const KEYBAR_KEYS: readonly KeybarKey[] = [
  { kind: "tab", label: "⇥" },
  { kind: "snippet", label: ":", text: ":" },
  { kind: "snippet", label: "(", text: "(" },
  { kind: "snippet", label: ")", text: ")" },
  { kind: "snippet", label: '"', text: '"' },
  { kind: "snippet", label: "=", text: "=" },
  { kind: "snippet", label: "[", text: "[" },
  { kind: "snippet", label: "]", text: "]" },
  { kind: "snippet", label: ",", text: "," },
  { kind: "snippet", label: "_", text: "_" },
  { kind: "snippet", label: "#", text: "#" },
  { kind: "move", label: "←", direction: "left" },
  { kind: "move", label: "→", direction: "right" },
];
