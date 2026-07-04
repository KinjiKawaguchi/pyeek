/**
 * Python ast モジュール インポート関連ノード型リファレンス
 * Import, ImportFrom, alias の詳細説明
 */

import type { AstReference } from "./ast-reference-literals";

/**
 * インポート文ノード
 */
export const AST_REFERENCE_IMPORTS: AstReference[] = [
  {
    name: "Import",
    detail:
      "import 文を表すノード。names フィールドに alias ノードのリストが格納されます。例：import os, sys as system は Import(names=[alias(name='os', asname=None), alias(name='sys', asname='system')])。複数モジュールを同時にインポート可能です。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.Import",
    easy: "モジュールのインポート。import os、import sys as system など。",
  },
  {
    name: "ImportFrom",
    detail:
      "from ... import 文を表すノード。module フィールドにモジュール名（文字列、ドット表記対応）、level フィールドに相対インポートのレベル（0 で絶対、1以上で相対、from . import X の . の個数）、names フィールドに alias ノードのリストが格納されます。例：from os.path import join は ImportFrom(module='os.path', level=0, names=[alias(name='join')])。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.ImportFrom",
    easy: "モジュールから特定の名前をインポート。from os import path、from . import utils など。",
  },
  {
    name: "alias",
    detail:
      "import 文内の個別の『モジュール名 as 別名』部分を表す補助ノード。name フィールドにモジュール名または関数/クラス名（文字列）、asname フィールドに別名（文字列、as を指定しない場合は None）が格納されます。例：import numpy as np の numpy as np は alias(name='numpy', asname='np')。",
    docUrl: "https://docs.python.org/3.12/library/ast.html#ast.alias",
    easy: "インポートの個別アイテム。『name as asname』の部分。",
  },
];
