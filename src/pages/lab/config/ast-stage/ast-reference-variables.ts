/**
 * Python ast モジュール 変数・参照・アクセスノード型リファレンス
 * Name, Attribute, Subscript, Slice, Load, Store, Del, Starred の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 変数・参照ノード: 値への読み書き、属性・インデックスアクセス
 */
export const AST_REFERENCE_VARIABLES: AstReference[] = [
  {
    name: "Name",
    detail:
      "識別子（変数名、関数名、属性名への参照など）を表すノード。id フィールドに文字列として名前が格納されます。ctx フィールドは expr_context（Load, Store, Del のいずれか）で、その名前が読み取られるのか、代入されるのか、削除されるのかを示します。例：x という変数を参照すると Name(id='x', ctx=Load())、x に代入すると Name(id='x', ctx=Store()) になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Name",
    easy: "変数や関数の名前。x、foo、my_var などの識別子全体が Name ノードです。",
  },
  {
    name: "Load",
    detail:
      "値を読み取る文脈を示す式コンテキスト。Name、Attribute、Subscript などのノードの ctx フィールドに Load() が格納される場合、その変数・属性・要素の値を読み取ろうとしていることを示します。代入文の右辺や、print(x) での x のように、値を使用する場面で現れます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Load",
    easy: "変数の値を読み込むとき。例：x = 1 の右辺の 1、print(x) の x など。",
  },
  {
    name: "Store",
    detail:
      "値を書き込む（代入する）文脈を示す式コンテキスト。代入文の左辺で現れます。x = 1 での x、for x in range(10) での x、[y for x in items] での x など、変数に値が格納される場面では ctx=Store() になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Store",
    easy: "変数に値を代入するとき。例：x = 1 の左辺の x、for x in ... の x など。",
  },
  {
    name: "Del",
    detail:
      "値を削除する文脈を示す式コンテキスト。del 文で参照される変数・属性・要素に現れます。del x での x、del obj.attr での obj.attr（Attribute ノード）、del lst[0] での lst[0]（Subscript ノード）など、削除される対象の ctx フィールドが Del() に設定されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Del",
    easy: "変数や属性を削除するとき。例：del x、del obj.attr など。",
  },
  {
    name: "Attribute",
    detail:
      "属性アクセス（ドット記法）を表すノード。obj.attr のような式を表現します。value フィールドにオブジェクト（obj、通常は expr）、attr フィールドに属性名（文字列）が格納されます。ctx フィールドで Load/Store/Del のいずれかが指定されます。例：obj.x を読み取る場合 Attribute(value=Name('obj', ctx=Load()), attr='x', ctx=Load())、obj.x に代入する場合 ctx=Store() になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Attribute",
    easy: "ドット（.）を使った属性アクセス。obj.attr、obj.method など。",
  },
  {
    name: "Subscript",
    detail:
      "インデックス・キーアクセス（角括弧記法）を表すノード。lst[i]、dct[key]、arr[1:3] などの表現を表します。value フィールドにコンテナ（lst など）、slice フィールドに添字またはスライス指定が格納されます。ctx フィールドで Load/Store/Del が指定されます。例：lst[0] を読み取る場合は Subscript(..., ctx=Load())、lst[0] = x に代入する場合は ctx=Store()、del lst[0] で削除する場合は ctx=Del() になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Subscript",
    easy: "角括弧を使ったインデックスアクセス。lst[0]、dct['key']、arr[1:3] など。",
  },
  {
    name: "Slice",
    detail:
      "スライス指定を表すノード。lower, upper, step フィールドに下限・上限・ステップが格納されます。例：lst[1:3:2] は Slice(lower=Constant(1), upper=Constant(3), step=Constant(2)) になります。各フィールドは None（指定なし）または式になります。単純なインデックスアクセス lst[0] では slice フィールドには Constant(0) が直接格納され、Slice ノードは使われません。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Slice",
    easy: "スライス指定。lst[1:3]、lst[::2]、arr[start:end:step] など。",
  },
  {
    name: "Starred",
    detail:
      "アンパック（展開）を表すノード。*x の形式で現れます。アンパック代入 a, *b, c = items での *b、関数呼び出し func(*args) での *args、リスト内包表記など様々な文脈で使われます。value フィールドに展開される式が格納されます。ctx フィールドで Load/Store が指定されます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Starred",
    easy: "アンパック（展開）。*args、*items など。",
  },
];
