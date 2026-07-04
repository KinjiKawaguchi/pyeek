import type { AstNode } from "@/shared/api";

// ast モジュールのノード型名 → 「やさしい」モード向けの平易な日本語。
// 未登録の型は node.type をそのまま表示する。
// 方針: 漢字の熟語（代入・属性・一致する 等）に頼らず、ひらがな中心の
// やさしい言葉にする。かっこ内の Python 構文（for/async/*/== 等）は
// 漢字ではないのでそのまま残してよい。
const EASY_LABELS: Record<string, string> = {
  Module: "プログラムぜんぶ",
  Interactive: "その場の1行",
  Expression: "式",
  FunctionDef: "関数をつくる",
  AsyncFunctionDef: "関数をつくる(async)",
  ClassDef: "クラスをつくる",
  Return: "かえす",
  Delete: "消す",
  Assign: "入れる",
  AugAssign: "計算しながら入れる",
  AnnAssign: "型をつけて入れる",
  For: "くり返し(for)",
  AsyncFor: "くり返し(async for)",
  While: "くり返し(while)",
  If: "もし〜なら",
  With: "with文",
  AsyncWith: "with文(async)",
  Raise: "例外を投げる",
  Try: "しっぱいにそなえる",
  TryStar: "しっぱいにそなえる(except*)",
  Assert: "たしかめる(assert)",
  Import: "よみこむ(import)",
  ImportFrom: "よみこむ(from import)",
  Global: "そとの変数(global)",
  Nonlocal: "ひとつそとの変数(nonlocal)",
  Expr: "式だけの行",
  Pass: "なにもしない",
  Break: "くり返しを抜ける",
  Continue: "つぎのくり返しへ",
  BoolOp: "and・orでつなげる",
  BinOp: "計算",
  UnaryOp: "前につくもの(+/-/not)",
  Lambda: "その場だけの関数",
  IfExp: "えらぶ(if式)",
  Dict: "辞書",
  Set: "あつまり",
  ListComp: "リストをまとめて作る",
  SetComp: "あつまりをまとめて作る",
  DictComp: "辞書をまとめて作る",
  GeneratorExp: "少しずつ作る(generator)",
  Await: "待つ(await)",
  Yield: "ひとつわたす(yield)",
  YieldFrom: "ひとつずつわたす(yield from)",
  Compare: "くらべる",
  Call: "呼び出し",
  FormattedValue: "うめこんだあたい",
  JoinedStr: "fのもじれつ",
  Constant: "あたい",
  Attribute: "持ちもの",
  Subscript: "なかみを出す([ ])",
  Starred: "ばらまく(*)",
  Name: "なまえ",
  List: "リスト",
  Tuple: "タプル",
  Slice: "スライス",
  NamedExpr: "その場で名前をつける(:=)",
  ExceptHandler: "うけとめる(except)",

  // 二項演算子（BinOpの子）
  Add: "たす(+)",
  Sub: "ひく(-)",
  Mult: "かける(*)",
  Div: "わる(/)",
  FloorDiv: "せいすうでわる(//)",
  Mod: "あまり(%)",
  Pow: "かけ算をくり返す(**)",
  MatMult: "行列のかけ算(@)",
  LShift: "左にずらす(<<)",
  RShift: "右にずらす(>>)",
  BitOr: "ビットOR(|)",
  BitXor: "ビットXOR(^)",
  BitAnd: "ビットAND(&)",

  // 単項演算子（UnaryOpの子）
  Invert: "ビットをひっくり返す(~)",
  Not: "ぎゃくにする(not)",
  UAdd: "そのまま(+)",
  USub: "マイナスにする(-)",

  // 論理演算子（BoolOpの子）
  And: "かつ(and)",
  Or: "または(or)",

  // 比較演算子（Compareの子）
  Eq: "おなじ(==)",
  NotEq: "ちがう(!=)",
  Lt: "ちいさい(<)",
  LtE: "ちいさいか、おなじ(<=)",
  Gt: "おおきい(>)",
  GtE: "おおきいか、おなじ(>=)",
  Is: "同じものか(is)",
  IsNot: "ちがうものか(is not)",
  In: "入っているか(in)",
  NotIn: "入っていないか(not in)",

  // 文脈（Name/Attribute/Subscriptがどう使われているか）
  Load: "よみとる",
  Store: "かきこむ",
  Del: "けされるほう",

  // 補助ノード
  arguments: "引数たち",
  arg: "引数",
  keyword: "なまえつき引数",
  alias: "べつのなまえ(as)",
  withitem: "withするもの",
  comprehension: "くり返し部分",

  // パターンマッチング（PEP 634、match文）
  Match: "パターンで分ける(match)",
  match_case: "そのばあい(case)",
  MatchValue: "あたいとおなじか",
  MatchSingleton: "None/True/Falseとおなじか",
  MatchSequence: "リストのようになっているか",
  MatchMapping: "辞書のようになっているか",
  MatchClass: "そのクラスの形か",
  MatchStar: "のこりをまとめる(*)",
  MatchAs: "なまえをつける(as)",
  MatchOr: "どれかとおなじか(|)",

  // 型関連（PEP 695、type: ignore）
  TypeAlias: "型にべつのなまえ(type)",
  TypeVar: "型のなまえ",
  TypeVarTuple: "型のなまえ(いくつも)",
  ParamSpec: "引数ぜんぶの型",
  TypeIgnore: "型は見ないという印",
  FunctionType: "関数の型ぜんぶ",
};

export function astEasyLabel(node: AstNode): string {
  return EASY_LABELS[node.type] ?? node.type;
}
