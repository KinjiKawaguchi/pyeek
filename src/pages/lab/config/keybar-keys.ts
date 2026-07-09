// モバイル向けコードキーバーに並べるキーの定義。
// 標準のソフトウェアキーボードでは打ちづらいPythonの頻出記号を、
// 使用頻度が高いものから左に並べる。
//
// 「記号を挿入するキー」と「カーソルを動かすキー」は機能の種類が違うため、
// 見た目でも区切りが分かるようグループ分けして持つ(UI側は区切り線を挟む)。

export type KeybarKey =
  | { kind: "tab"; label: string }
  | { kind: "snippet"; label: string; text: string }
  | { kind: "move"; label: string; direction: "left" | "right" };

export const KEYBAR_GROUPS: readonly (readonly KeybarKey[])[] = [
  [
    { kind: "tab", label: "Tab" },
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
  ],
  [
    { kind: "move", label: "←", direction: "left" },
    { kind: "move", label: "→", direction: "right" },
  ],
];
