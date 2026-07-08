// 前身 token-lab.html の CHIP_COLOR / LEGEND_* をそのまま移植。
export const CHIP_COLOR: Record<string, string> = {
  NAME: "#176dbb",
  NUMBER: "#a25a12",
  STRING: "#197a54",
  OP: "#ce1616",
  COMMENT: "#616a8b",
  KEYWORD: "#9635d9",
  NEWLINE: "#656a8c",
  NL: "#656a8c",
  INDENT: "#656a8c",
  DEDENT: "#656a8c",
  ENDMARKER: "#656a8c",
  BRACKET: "#8d6800",
};

export type LegendItem = [label: string, color: string, description: string];

export const LEGEND_EASY: LegendItem[] = [
  ["なまえ", "#176dbb", "変数・関数・キーワード"],
  ["キーワード", "#9635d9", "if / for / def など"],
  ["すうじ", "#a25a12", "1, 3.14, 0xFF"],
  ["もじれつ", "#197a54", '"..." や f"..."'],
  ["きごう", "#ce1616", "+ - = : ."],
  ["かっこ", "#8d6800", "( ) [ ] { } ← 主役"],
  ["コメント", "#616a8b", "# から行末まで"],
];

export const LEGEND_STRICT: LegendItem[] = [
  ["NAME", "#176dbb", "識別子・キーワード（全部 NAME）"],
  ["NUMBER", "#a25a12", "数値リテラル"],
  ["STRING", "#197a54", "文字列リテラル"],
  ["OP", "#ce1616", "演算子・区切り（exact型つき）"],
  ["( ) [ ] { }", "#8d6800", "OP の中の括弧（LPAR等）"],
  ["COMMENT", "#616a8b", "コメント"],
  ["NEWLINE / NL", "#656a8c", "論理行末 / 意味なし改行"],
  ["INDENT / DEDENT", "#656a8c", "字下げの増減（構造）"],
  ["ENDMARKER", "#656a8c", "入力の終端"],
];
