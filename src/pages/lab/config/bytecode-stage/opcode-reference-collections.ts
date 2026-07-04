/**
 * バイトコード逆アセンブルのコレクション構築命令リファレンス
 * BUILD_LIST, BUILD_DICT, BUILD_SET, BUILD_TUPLE など
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * コレクション構築と要素追加: リスト・辞書・集合・タプル・スライス
 */
export const OPCODE_REFERENCE_COLLECTIONS: OpcodeReference[] = [
  {
    name: "BUILD_LIST",
    detail:
      "スタックから指定個数の値を取り出し、それらを要素とするリストオブジェクトを構築します。引数は要素個数。スタック上の順序でそのままリストが作られます。[x, y, z] のリスト括弧内の各要素がスタックに積まれた後、この命令で統合されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_LIST",
    easy: "スタックの値からリストを構築します。[x, y, z] のようなリスト作成がここで実行されます。",
  },
  {
    name: "BUILD_TUPLE",
    detail:
      "スタックから指定個数の値を取り出し、それらを要素とするタプルオブジェクトを構築します。引数は要素個数。スタック上の順序でそのままタプルが作られます。(x, y, z) のタプル括弧内の各要素がスタックに積まれた後、この命令で統合されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_TUPLE",
    easy: "スタックの値からタプルを構築します。(x, y, z) のようなタプル作成がここで実行されます。",
  },
  {
    name: "BUILD_SET",
    detail:
      "スタックから指定個数の値を取り出し、それらを要素とする集合（set）オブジェクトを構築します。引数は要素個数。スタック上の値は順不同で集合に格納。{x, y, z} の集合括弧内の各要素がスタックに積まれた後、この命令で統合されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_SET",
    easy: "スタックの値から集合を構築します。{x, y, z} のような集合作成がここで実行されます。",
  },
  {
    name: "BUILD_MAP",
    detail:
      "スタックから指定個数のキー・値ペアを取り出し、それらを要素とする辞書オブジェクトを構築します。引数はペア個数（キー・値ペアの個数）。スタック上の順序（キー, 値, キー, 値, ...）でそのまま辞書が作られます。{k: v, ...} の辞書括弧内がこれで統合されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_MAP",
    easy: "スタックのキー・値ペアから辞書を構築します。{k: v} のような辞書作成がここで実行されます。",
  },
  {
    name: "BUILD_CONST_KEY_MAP",
    detail:
      "定数キーを用いて辞書を構築します。スタック最上部が定数キーのタプル、その下に値が指定個数積まれています。定数キー（ハッシュ計算が不要）での高速辞書構築。**dict展開での最適化に使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_CONST_KEY_MAP",
    easy: "定数キーを使った辞書を高速に構築します。**dict のような展開で使われます。",
  },
  {
    name: "BUILD_SLICE",
    detail:
      "スタックからスライス引数（開始・終了・ステップ）を取り出し、スライスオブジェクト（slice(start, stop, step)）を構築します。引数でステップの有無（2または3）を指定。スライスオブジェクト自体は x[1:3:2] の内側で使用される中間オブジェクト。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-BUILD_SLICE",
    easy: "スライスオブジェクトを構築します。x[1:3:2] のようなスライス操作で使われます。",
  },
  {
    name: "LIST_APPEND",
    detail:
      "スタック最上部の値をリストに追加します。スタック深さで指定されたリストに対して append を実行。リスト内包表現や for-else ループ内で頻繁に出現。リスト・値両方ともスタックに残ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LIST_APPEND",
    easy: "スタックの値をリストに追加します。リスト内包表現で使われます。",
  },
  {
    name: "LIST_EXTEND",
    detail:
      "スタック最上部のイテラブルをリストに展開・追加します。スタック深さで指定されたリストに対して extend を実行。*iterable のような展開操作をリスト内包表現内で行う際に使用。リスト・イテラブル両方ともスタックに残ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LIST_EXTEND",
    easy: "スタックのイテラブルをリストに展開・追加します。リスト展開で使われます。",
  },
  {
    name: "SET_ADD",
    detail:
      "スタック最上部の値を集合に追加します。スタック深さで指定された集合に対して add を実行。集合内包表現で頻繁に出現。集合・値両方ともスタックに残ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-SET_ADD",
    easy: "スタックの値を集合に追加します。集合内包表現で使われます。",
  },
  {
    name: "SET_UPDATE",
    detail:
      "スタック最上部のイテラブルを集合に展開・追加します。スタック深さで指定された集合に対して update を実行。{*iterable} のような展開操作を集合内包表現内で行う際に使用。集合・イテラブル両方ともスタックに残ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-SET_UPDATE",
    easy: "スタックのイテラブルを集合に展開・追加します。集合展開で使われます。",
  },
  {
    name: "MAP_ADD",
    detail:
      "スタック最上部のキー・値ペアを辞書に追加します。スタック深さで指定された辞書に対して items を add/update する操作。辞書内包表現で頻繁に出現。辞書・キー・値がスタックに残ります。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MAP_ADD",
    easy: "スタックのキー・値ペアを辞書に追加します。辞書内包表現で使われます。",
  },
  {
    name: "DICT_MERGE",
    detail:
      "スタック最上部の辞書を別の辞書に統合（マージ）します。**dict のような展開を辞書内包表現や辞書作成時に行う際に使用。両辞書の内容がマージされ、新しい辞書が作られます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DICT_MERGE",
    easy: "スタックの辞書を別の辞書にマージします。**dict の展開で使われます。",
  },
  {
    name: "DICT_UPDATE",
    detail:
      "スタック最上部の辞書で別の辞書を更新します。スタック深さで指定された辞書に対して update メソッドを実行。キーの重複時は新しい値で上書き。辞書構築時に複数の辞書マージを行う場合に使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DICT_UPDATE",
    easy: "スタックの辞書で別の辞書を更新します。辞書の統合で使われます。",
  },
  {
    name: "UNPACK_SEQUENCE",
    detail:
      "スタック最上部のシーケンスを指定個数の値に分解（アンパック）します。引数は分解要素数。スタックには分解結果が積まれます。複数の変数への同時代入（a, b, c = seq）がこれで実装。シーケンスの要素数が指定個数と異なるとValueErrorが発生。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-UNPACK_SEQUENCE",
    easy: "スタックのシーケンスを複数の値に分解します。a, b, c = [1, 2, 3] のようなアンパックがここで実行されます。",
  },
  {
    name: "UNPACK_EX",
    detail:
      "スタック最上部のイテラブルを最初と最後の要素数を指定して分解します。引数の下位ニブル（4ビット）が前側要素数、上位ニブルが後側要素数。a, *rest, b = seq のような拡張アンパック（*付き）で使用。イテラブルの要素数が最小要素数より少ないと ValueError。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-UNPACK_EX",
    easy: "スタックのイテラブルを *付きで分解します。a, *rest, b = seq のような拡張アンパックがここで実行されます。",
  },
];
