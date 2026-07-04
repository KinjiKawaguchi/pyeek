// 前身 token-lab.html の PRESETS をそのまま移植。
export const DEFAULT_SOURCE = 'print("こんにちは!")';

export const PRESETS: string[] = [
  'print("こんにちは!")',
  "print()",
  "x = 3 + 4 * 2",
  "for i in range(3):\n    print(i)",
  'name = input()\nprint("hi", name)',
  "if x := len(data):\n    print(x)",
  "total = 0\nfor n in nums:\n    total += n",
  'msg = f"合計は {total} です"',
  'data = {"a": [1, 2], "b": (3,)}',
  // スタックマシン(Stage④a)のデモ用。CPython は定数のみの式を畳み込むため
  // (2 + 3 * 4 は BINARY_OP が残らない)、変数を挟んで畳み込みを避けている。
  "n = 4\ntotal = 2 + 3 * n",
];
