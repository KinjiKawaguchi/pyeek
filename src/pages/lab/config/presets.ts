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
  // while ループのスタックマシン再生デモ用。
  "i = 0\nwhile i < 3:\n    i = i + 1",
  // 少し複雑な例（内包表記・ジェネレータ・デコレータ・クラス・クロージャ）。
  // ④スタックマシンは浅い1フレームのみの再生なので、関数呼び出しの中身は
  // 追わず「<呼び出しの結果>」という不透明な値として扱う（クラッシュはしない）。
  "squares = [n * n for n in range(5)]",
  "def counter():\n    n = 0\n    while n < 3:\n        yield n\n        n += 1\n\nfor v in counter():\n    print(v)",
  'def bold(f):\n    def wrapper():\n        return f()\n    return wrapper\n\n@bold\ndef shout():\n    return "hi!"\n\nprint(shout())',
  "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(1, 2)\nprint(p.x)",
  "def make_adder(n):\n    def adder(x):\n        return x + n\n    return adder\n\nadd5 = make_adder(5)\nprint(add5(3))",
];
