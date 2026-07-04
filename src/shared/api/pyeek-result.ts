// pyeek_core.py の analyze_all が返す JSON と 1:1 対応する契約型。
// フロントの全レイヤーはこの型にのみ依存し、CPython 側の実装詳細
// （tokenize/ast/dis の内部 API）には触れない。

export type Pos = [row: number, col: number];

export interface Token {
  type: string;
  exactType: string;
  string: string;
  start: Pos;
  end: Pos;
  isKeyword: boolean;
  isSoftKeyword: boolean;
}

export interface AstNode {
  id: number;
  type: string;
  label: string;
  fields: Record<string, string>;
  lineno: number | null;
  colOffset: number | null;
  endLineno: number | null;
  endColOffset: number | null;
  children: { field: string; node: AstNode }[];
}

export interface InstrPositions {
  lineno: number | null;
  endLineno: number | null;
  colOffset: number | null;
  endColOffset: number | null;
}

export interface Instr {
  offset: number;
  opname: string;
  arg: number | null;
  argrepr: string;
  positions: InstrPositions | null;
  isJumpTarget: boolean;
  isJump: boolean;
  // ジャンプ命令のみ非null。絶対ターゲットバイトオフセット(dis の argval)。
  jumpTarget: number | null;
  stackEffect: number | null;
}

export interface CodeObj {
  name: string;
  instructions: Instr[];
  consts: string[];
  varnames: string[];
  names: string[];
  children: CodeObj[];
}

export type PyeekErrorStage = 1 | 2 | 3 | 4;

export interface PyeekError {
  stage: PyeekErrorStage;
  type: string;
  msg: string;
  lineno: number | null;
  offset: number | null;
}

export interface PyeekResult {
  source: string;
  pythonVersion: string;
  tokens: Token[];
  ast: AstNode | null;
  bytecode: CodeObj | null;
  errors: PyeekError[];
}
