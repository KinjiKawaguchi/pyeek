/**
 * Python ast モジュール 演算子・比較演算ノード型リファレンス
 * 二項演算子、単項演算子、比較演算子、論理演算子およびそれらを含む式ノード
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * 演算子ノード: 算術・ビット・比較・論理演算
 */
export const AST_REFERENCE_OPERATORS: AstReference[] = [
  {
    name: "BinOp",
    detail:
      "二項演算（2つのオペランドと1つの演算子）を表すノード。left, op, right フィールドで左オペランド、演算子、右オペランドを表現します。op フィールドは operator サブクラスのいずれか（Add, Sub, Mult など）です。例：x + y は BinOp(left=Name('x'), op=Add(), right=Name('y')) になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.BinOp",
    easy: "足し算、引き算、掛け算などの二項演算全体。x + y、a * b など。",
  },
  {
    name: "UnaryOp",
    detail:
      "単項演算（1つのオペランドと1つの演算子）を表すノード。op, operand フィールドで演算子とオペランドを表現します。op フィールドは unaryop サブクラスのいずれか（UAdd, USub, Not, Invert など）です。例：-x は UnaryOp(op=USub(), operand=Name('x')) になります。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.UnaryOp",
    easy: "マイナス符号、not、~ などの単項演算。-x、not x、~x など。",
  },
  {
    name: "BoolOp",
    detail:
      "論理演算（and, or）を表すノード。op, values フィールドで演算子と複数のオペランドを表現します。op フィールドは boolop サブクラス（And または Or）、values フィールドは2個以上の式のリストです。例：x and y and z は BoolOp(op=And(), values=[Name('x'), Name('y'), Name('z')]) になります。短絡評価が行われます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.BoolOp",
    easy: "and/or による論理演算。x and y、a or b など。",
  },
  {
    name: "Compare",
    detail:
      "比較演算を表すノード。left, ops, comparators フィールドで左オペランド、複数の演算子、複数の右オペランドを表現します。複数の比較を一度に表現できます：例えば a < b < c は Compare(left=Name('a'), ops=[Lt(), Lt()], comparators=[Name('b'), Name('c')]) になります。ops と comparators は同じ長さです。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Compare",
    easy: "大小比較や等価比較。x < y、a == b、1 < x < 10 など。",
  },
  {
    name: "Add",
    detail: "加算演算子。x + y 内の + を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Add",
    easy: "足し算の演算子（+）。",
  },
  {
    name: "Sub",
    detail: "減算演算子。x - y 内の - を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Sub",
    easy: "引き算の演算子（-）。",
  },
  {
    name: "Mult",
    detail: "乗算演算子。x * y 内の * を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Mult",
    easy: "掛け算の演算子（*）。",
  },
  {
    name: "Div",
    detail:
      "除算演算子。x / y 内の / を表します。常に浮動小数点結果になります。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Div",
    easy: "割り算の演算子（/）。常に小数点の結果になります。",
  },
  {
    name: "FloorDiv",
    detail:
      "床除算（整数除算）演算子。x // y 内の // を表します。結果は整数型になります。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.FloorDiv",
    easy: "整数除算の演算子（//）。常に整数の結果になります。",
  },
  {
    name: "Mod",
    detail: "剰余演算子。x % y 内の % を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Mod",
    easy: "割った余りを求める演算子（%）。",
  },
  {
    name: "Pow",
    detail: "累乗演算子。x ** y 内の ** を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Pow",
    easy: "べき乗（累乗）の演算子（**）。",
  },
  {
    name: "MatMult",
    detail:
      "行列乗算演算子。x @ y 内の @ を表します。NumPy などで使用されます。PEP 465で導入。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.MatMult",
    easy: "行列乗算の演算子（@）。NumPy など科学計算ライブラリで使用。",
  },
  {
    name: "LShift",
    detail:
      "左ビットシフト演算子。x << y 内の << を表します。x を y 桁左にシフトします。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.LShift",
    easy: "左ビットシフト演算子（<<）。",
  },
  {
    name: "RShift",
    detail:
      "右ビットシフト演算子。x >> y 内の >> を表します。x を y 桁右にシフトします。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.RShift",
    easy: "右ビットシフト演算子（>>）。",
  },
  {
    name: "BitOr",
    detail: "ビット論理和演算子。x | y 内の | を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.BitOr",
    easy: "ビット論理和演算子（|）。",
  },
  {
    name: "BitXor",
    detail: "ビット排他的論理和演算子。x ^ y 内の ^ を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.BitXor",
    easy: "ビット排他的論理和演算子（^）。",
  },
  {
    name: "BitAnd",
    detail: "ビット論理積演算子。x & y 内の & を表します。operator の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.BitAnd",
    easy: "ビット論理積演算子（&）。",
  },
  {
    name: "UAdd",
    detail:
      "単項正値演算子。+x 内の + を表します。値に作用しませんが、構文として記述できます。unaryop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.UAdd",
    easy: "単項プラス演算子（+x）。",
  },
  {
    name: "USub",
    detail:
      "単項負値演算子。-x 内の - を表します。オペランドを反転します。unaryop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.USub",
    easy: "単項マイナス演算子（-x）。",
  },
  {
    name: "Not",
    detail:
      "論理否定演算子。not x 内の not を表します。真理値を反転します。unaryop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Not",
    easy: "論理否定演算子（not）。",
  },
  {
    name: "Invert",
    detail:
      "ビット反転演算子。~x 内の ~ を表します。ビット表現のすべてのビットを反転します。unaryop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Invert",
    easy: "ビット反転演算子（~）。",
  },
  {
    name: "And",
    detail:
      "論理和演算子（and）。x and y を含む式の op フィールドに And() が格納されます。BoolOp ノード内で使用されます。boolop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.And",
    easy: "論理和演算子（and）。",
  },
  {
    name: "Or",
    detail:
      "論理和演算子（or）。x or y を含む式の op フィールドに Or() が格納されます。BoolOp ノード内で使用されます。boolop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Or",
    easy: "論理和演算子（or）。",
  },
  {
    name: "Eq",
    detail:
      "等値比較演算子（==）。a == b の == を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Eq",
    easy: "等しいか比較する演算子（==）。",
  },
  {
    name: "NotEq",
    detail:
      "不等値比較演算子（!=）。a != b の != を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.NotEq",
    easy: "等しくない比較演算子（!=）。",
  },
  {
    name: "Lt",
    detail:
      "より小さい比較演算子（<）。a < b の < を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Lt",
    easy: "より小さいの比較演算子（<）。",
  },
  {
    name: "LtE",
    detail:
      "以下比較演算子（<=）。a <= b の <= を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.LtE",
    easy: "以下の比較演算子（<=）。",
  },
  {
    name: "Gt",
    detail:
      "より大きい比較演算子（>）。a > b の > を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Gt",
    easy: "より大きいの比較演算子（>）。",
  },
  {
    name: "GtE",
    detail:
      "以上比較演算子（>=）。a >= b の >= を表します。cmpop の具象サブクラス。Compare ノード内の ops リストに含まれます。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.GtE",
    easy: "以上の比較演算子（>=）。",
  },
  {
    name: "Is",
    detail:
      "同一性比較演算子（is）。a is b の is を表します。メモリ上の同一オブジェクトであるかを比較します。cmpop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Is",
    easy: "同じオブジェクトか比較する演算子（is）。",
  },
  {
    name: "IsNot",
    detail:
      "同一性否定比較演算子（is not）。a is not b の is not を表します。cmpop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.IsNot",
    easy: "異なるオブジェクトか比較する演算子（is not）。",
  },
  {
    name: "In",
    detail:
      "所属判定演算子（in）。a in b の in を表します。a が b に含まれるかを判定します。cmpop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.In",
    easy: "要素が含まれるか判定する演算子（in）。",
  },
  {
    name: "NotIn",
    detail:
      "所属否定判定演算子（not in）。a not in b の not in を表します。a が b に含まれないかを判定します。cmpop の具象サブクラス。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.NotIn",
    easy: "要素が含まれないか判定する演算子（not in）。",
  },
];
