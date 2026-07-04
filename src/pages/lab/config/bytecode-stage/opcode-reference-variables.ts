/**
 * バイトコード逆アセンブルの変数・属性アクセス命令リファレンス
 * LOAD_* / STORE_* / DELETE_* 系の命令
 */

import type { OpcodeReference } from "./opcode-reference-general";

/**
 * 変数・属性アクセス: ロード・ストア・削除、様々なスコープ
 */
export const OPCODE_REFERENCE_VARIABLES: OpcodeReference[] = [
  {
    name: "LOAD_CONST",
    detail:
      "定数をスタックに積みます。引数は定数テーブルのインデックス。関数内で使用される数値リテラル・文字列リテラル・None・True・False 等、すべての定数がこれで読み込まれます。読み込み後、その定数は変更されないことが保証されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_CONST",
    easy: "定数（数字、文字列、None など）をスタックに積みます。",
  },
  {
    name: "LOAD_NAME",
    detail:
      "名前をスコープから読み込んでスタックに積みます。引数は名前テーブルのインデックス。ローカル変数として見つからない場合、グローバルスコープ、組み込みスコープの順に探索されます。スコープチェーンに従った名前解決が行われます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_NAME",
    easy: "名前をスコープから探して読み込みます。ローカル→グローバル→組み込みの順に探します。",
  },
  {
    name: "LOAD_FAST",
    detail:
      "ローカル変数をスタックに積みます。引数はローカル変数テーブルのインデックス。スコープ探索を行わず、直接ローカル変数フレーム内から高速に検索。関数内で最も頻繁に出現する命令です。変数の存在が静的に確定しないとコンパイラがエラーを出すため、常に有効な変数にのみ適用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_FAST",
    easy: "ローカル変数をスタックに積みます。関数内の局所変数の読み込みが最も多く使われる命令です。",
  },
  {
    name: "LOAD_FAST_AND_CLEAR",
    detail:
      "ローカル変数をスタックに積むと同時に、その変数をクリア（未定義状態に）します。with文の内部処理で使用され、例外の参照を一時的に保持してから破棄するメカニズム。変数をスタックに移動することでメモリリークを防止します。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_FAST_AND_CLEAR",
    easy: "ローカル変数を読み込んで同時にクリアします。例外処理で使われることが多いです。",
  },
  {
    name: "LOAD_FAST_CHECK",
    detail:
      "ローカル変数をスタックに積みます。LOAD_FASTと異なり、変数が未定義の場合に実行時エラーを発生させる確認処理が入ります。条件付きで定義される変数や、定義前に使用される可能性のあるコードパスでの安全性チェックに使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_FAST_CHECK",
    easy: "ローカル変数を読み込みますが、未定義時はエラーになります。安全性チェック付きです。",
  },
  {
    name: "LOAD_GLOBAL",
    detail:
      "グローバル変数をスタックに積みます。引数は名前テーブルのインデックス。ローカル変数ではなく、明示的にグローバルスコープから取得。global宣言で明示的にグローバルを指定した変数はこれで読み込まれます。スコープチェーンスキップにより高速化されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_GLOBAL",
    easy: "グローバル変数をスタックに積みます。global宣言した変数がここで読み込まれます。",
  },
  {
    name: "LOAD_DEREF",
    detail:
      "自由変数（クロージャで参照する外側スコープの変数）をスタックに積みます。セル経由でアクセスされ、ネストされた関数の内部から外側関数の変数へのアクセスを実現します。変数名テーブルと異なり、セルテーブルのインデックスが使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_DEREF",
    easy: "クロージャで外側スコープから参照する変数をスタックに積みます。ネストされた関数で使われます。",
  },
  {
    name: "LOAD_ATTR",
    detail:
      "オブジェクトの属性をスタックから読み込みます。スタック最上部のオブジェクトから、引数で指定された属性名の値を取得。__getattribute__ や __getattr__ が呼び出される可能性があります。結果がスタックに積まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_ATTR",
    easy: "オブジェクトの属性を読み込みます。obj.attr のような属性アクセスがここで実行されます。",
  },
  {
    name: "LOAD_BUILD_CLASS",
    detail:
      "組み込み関数 __build_class__ をスタックに積みます。クラス定義（class文）を処理するためのメタプログラミング関数。クラス定義時に常に最初に読み込まれる特殊な構成要素です。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_BUILD_CLASS",
    easy: "クラス定義を処理するための特殊な関数をロードします。class文の処理で使われます。",
  },
  {
    name: "LOAD_CLOSURE",
    detail:
      "関数の閉包セルをスタックに積みます。クロージャの構築時に、外側関数の変数がセルオブジェクトとして内側関数に渡されるための処理。MAKE_FUNCTIONの引数として使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_CLOSURE",
    easy: "クロージャの変数セルをスタックに積みます。ネストされた関数定義で使われます。",
  },
  {
    name: "LOAD_ASSERTION_ERROR",
    detail:
      "AssertionError例外クラスをスタックに積みます。assert文の処理時に、例外を投げるための準備として使用。引数は不要。スタックに AssertionError クラスオブジェクトが積まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_ASSERTION_ERROR",
    easy: "AssertionError例外クラスをスタックに積みます。assert文で例外を投げるときに使われます。",
  },
  {
    name: "LOAD_SUPER_ATTR",
    detail:
      "スーパークラスの属性をロードします。super()呼び出しと属性アクセスを最適化した命令。引数で属性名とロードモード（属性 or メソッド）を指定。Python 3.12で導入。スタックには自身のインスタンス（またはクラス）が必要。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_SUPER_ATTR",
    easy: "スーパークラスの属性をロードします。super()を使った属性アクセスがここで実行されます。",
  },
  {
    name: "LOAD_LOCALS",
    detail:
      "ローカル変数テーブル全体を辞書として取得してスタックに積みます。exec()やeval()の実行コンテキスト提供時、またはモジュール/クラスレベルのコード実行で局所スコープへのアクセスが必要な場合に使用。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_LOCALS",
    easy: "ローカル変数全体を辞書として取得します。exec()やeval()で使われることが多いです。",
  },
  {
    name: "LOAD_FROM_DICT_OR_DEREF",
    detail:
      "辞書またはセルから変数をロードします。スタック最上部の辞書を見て、その中に指定の変数があればそれを使用。なければセルテーブルから自由変数として取得。動的スコープと静的クロージャスコープの混在処理に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_FROM_DICT_OR_DEREF",
    easy: "辞書またはクロージャから変数をロードします。複雑なスコープ解決で使われます。",
  },
  {
    name: "LOAD_FROM_DICT_OR_GLOBALS",
    detail:
      "辞書またはグローバルスコープから変数をロードします。スタック最上部の辞書を見て、その中に指定の変数があればそれを使用。なければグローバルスコープから取得。動的な変数ロードと静的グローバル変数の混在処理に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-LOAD_FROM_DICT_OR_GLOBALS",
    easy: "辞書またはグローバルスコープから変数をロードします。複雑なスコープ解決で使われます。",
  },
  {
    name: "STORE_NAME",
    detail:
      "値をスタックから取り出し、指定の名前で保存します。引数は名前テーブルのインデックス。ローカル・グローバル・class本体などのスコープで名前を割り当てます。割り当て対象のスコープは文脈により異なります。代入文で最も一般的に出現。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_NAME",
    easy: "スタックの値を名前で保存します。一般的な変数代入がここで実行されます。",
  },
  {
    name: "STORE_FAST",
    detail:
      "値をスタックから取り出し、ローカル変数に保存します。引数はローカル変数テーブルのインデックス。関数内での局所変数への代入が最も一般的。スコープ探索を行わず直接ローカルフレームに書き込まれます。効率が高い。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_FAST",
    easy: "スタックの値をローカル変数に保存します。関数内での変数代入が最も多く使われる命令です。",
  },
  {
    name: "STORE_GLOBAL",
    detail:
      "値をスタックから取り出し、グローバル変数として保存します。引数は名前テーブルのインデックス。global宣言で明示的にグローバルを指定した変数への代入に使用。グローバルスコープ（モジュールレベル）に直接書き込まれます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_GLOBAL",
    easy: "スタックの値をグローバル変数に保存します。global宣言した変数の代入がここで実行されます。",
  },
  {
    name: "STORE_DEREF",
    detail:
      "値をスタックから取り出し、クロージャの自由変数（セル）に保存します。引数はセルテーブルのインデックス。ネストされた関数内で外側の変数に代入する際に使用。セル経由で書き込まれるため、外側の関数からも変更が見えます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_DEREF",
    easy: "スタックの値をクロージャの自由変数に保存します。ネストされた関数での代入で使われます。",
  },
  {
    name: "STORE_ATTR",
    detail:
      "スタックから値を取り出し、オブジェクトの属性として保存します。スタック最上部の値がオブジェクト、その下が保存する値。引数は属性名。__setattr__が呼び出される可能性があります。オブジェクトと値はスタックから削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_ATTR",
    easy: "スタックの値をオブジェクトの属性に保存します。obj.attr = value のような代入がここで実行されます。",
  },
  {
    name: "STORE_SUBSCR",
    detail:
      "スタックから値を取り出し、オブジェクトのサブスクリプト位置に保存します。スタック最上部から（オブジェクト、インデックス、値）の順で取り出し、obj[index] = value を実行。__setitem__が呼び出されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_SUBSCR",
    easy: "スタックの値をオブジェクトのサブスクリプト位置に保存します。list[0] = x のような代入がここで実行されます。",
  },
  {
    name: "STORE_SLICE",
    detail:
      "スタックから値を取り出し、オブジェクトのスライス範囲に保存します。スタック最上部から（オブジェクト、スタート、終了、値）の順で取り出し、obj[start:end] = value を実行。シーケンスのスライス代入に使用されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-STORE_SLICE",
    easy: "スタックの値をオブジェクトのスライス範囲に保存します。list[1:3] = newlist のような代入がここで実行されます。",
  },
  {
    name: "DELETE_NAME",
    detail:
      "指定の名前をスコープから削除します。引数は名前テーブルのインデックス。del文で名前への参照を削除。その後その名前でアクセスしようとするとNameErrorが発生します。スコープから名前の束縛が削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_NAME",
    easy: "指定の名前をスコープから削除します。del x のような削除がここで実行されます。",
  },
  {
    name: "DELETE_FAST",
    detail:
      "ローカル変数を削除します。引数はローカル変数テーブルのインデックス。del文でローカル変数への参照を削除。その後アクセスしようとするとUnboundLocalErrorが発生。ローカル変数フレームから名前の束縛が削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_FAST",
    easy: "ローカル変数を削除します。関数内での del x のような削除がここで実行されます。",
  },
  {
    name: "DELETE_GLOBAL",
    detail:
      "グローバル変数を削除します。引数は名前テーブルのインデックス。del文でグローバル変数への参照を削除。その後アクセスしようとするとNameErrorが発生。グローバルスコープから名前の束縛が削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_GLOBAL",
    easy: "グローバル変数を削除します。global宣言した変数の del x のような削除がここで実行されます。",
  },
  {
    name: "DELETE_DEREF",
    detail:
      "クロージャの自由変数（セル）を削除します。引数はセルテーブルのインデックス。ネストされた関数内で外側の変数への参照を削除。その後アクセスしようとするとUnboundLocalErrorが発生。セルからの束縛が削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_DEREF",
    easy: "クロージャの自由変数を削除します。ネストされた関数での del x のような削除で使われます。",
  },
  {
    name: "DELETE_ATTR",
    detail:
      "オブジェクトの属性を削除します。スタック最上部のオブジェクトから、引数で指定された属性名を削除。del obj.attr を実行。__delattr__が呼び出される可能性があります。オブジェクトはスタックから削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_ATTR",
    easy: "オブジェクトの属性を削除します。del obj.attr のような削除がここで実行されます。",
  },
  {
    name: "DELETE_SUBSCR",
    detail:
      "オブジェクトのサブスクリプト位置を削除します。スタック最上部から（オブジェクト、インデックス）の順で取り出し、del obj[index] を実行。__delitem__が呼び出されます。オブジェクトと値はスタックから削除されます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-DELETE_SUBSCR",
    easy: "オブジェクトのサブスクリプト位置を削除します。del list[0] のような削除がここで実行されます。",
  },
  {
    name: "MAKE_CELL",
    detail:
      "クロージャの自由変数を格納するためのセルオブジェクトを作成します。引数はセルインデックス。ネストされた関数が定義される際に、外側の関数のローカル変数がセルにラップされる処理。COPY_FREE_VARSと組み合わせてクロージャを完成させます。",
    docUrl: "https://docs.python.org/3.12/library/dis.html#opcode-MAKE_CELL",
    easy: "クロージャの変数を格納するセルを作成します。ネストされた関数定義で使われます。",
  },
];
