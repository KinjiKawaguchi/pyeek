import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Next.js App Router のルートファイル（*.nx.tsx/*.nx.ts）を src/app/ に
    // 置いている（pages/app のディレクトリ判定の親を揃えるため）。FSD の
    // 構造の一部ではないので scan 対象外にする。
    ignores: ["app/**"],
  },
  {
    // Pyeek は単一ページアプリ（pages/lab のみ）。entities/source-link は
    // 「同じソースコード上の同じ範囲が、トークン列・AST・バイトコードという
    // 複数の内部表現の間でどう対応するか」という Pyeek 固有のドメインを
    // 表す純粋関数群（SrcRange の比較・Token/AstNode/Instr からの範囲抽出・
    // ネストした code オブジェクトの平坦化）。pages/lab 配下の
    // token-stage/ast-stage/bytecode-stage/vm-stage 全てから横断的に
    // 参照されるため entity として独立させている。唯一の consumer が
    // pages/lab であること自体は、この規模のアプリでは想定通り。
    //
    // 一方、解析セッションの状態（source/result/mode/loading/selectedRange）
    // はドメインモデルではなくページ固有のUI状態なので、entities では
    // なく pages/lab/model/analysis-store.tsx に置いている（意図的な分離）。
    files: ["src/entities/source-link/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
