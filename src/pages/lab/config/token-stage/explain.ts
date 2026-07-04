// 前身 token-lab.html の CHIP_COLOR / LEGEND_* をそのまま移植。
export const CHIP_COLOR: Record<string, string> = {
  NAME: "#2f8fe6",
  NUMBER: "#e88a2c",
  STRING: "#25b47c",
  OP: "#ef6b6b",
  COMMENT: "#9aa0b8",
  KEYWORD: "#a959e0",
  NEWLINE: "#7b80a0",
  NL: "#7b80a0",
  INDENT: "#7b80a0",
  DEDENT: "#7b80a0",
  ENDMARKER: "#7b80a0",
  BRACKET: "#c99400",
};

export type LegendItem = [label: string, color: string, description: string];

export const LEGEND_EASY: LegendItem[] = [
  ["なまえ", "#2f8fe6", "変数・関数・キーワード"],
  ["キーワード", "#a959e0", "if / for / def など"],
  ["すうじ", "#e88a2c", "1, 3.14, 0xFF"],
  ["もじれつ", "#25b47c", '"..." や f"..."'],
  ["きごう", "#ef6b6b", "+ - = : ."],
  ["かっこ", "#c99400", "( ) [ ] { } ← 主役"],
  ["コメント", "#9aa0b8", "# から行末まで"],
];

export const LEGEND_STRICT: LegendItem[] = [
  ["NAME", "#2f8fe6", "識別子・キーワード（全部 NAME）"],
  ["NUMBER", "#e88a2c", "数値リテラル"],
  ["STRING", "#25b47c", "文字列リテラル"],
  ["OP", "#ef6b6b", "演算子・区切り（exact型つき）"],
  ["( ) [ ] { }", "#c99400", "OP の中の括弧（LPAR等）"],
  ["COMMENT", "#9aa0b8", "コメント"],
  ["NEWLINE / NL", "#7b80a0", "論理行末 / 意味なし改行"],
  ["INDENT / DEDENT", "#7b80a0", "字下げの増減（構造）"],
  ["ENDMARKER", "#7b80a0", "入力の終端"],
];
