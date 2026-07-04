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
    // Pyeek は単一ページアプリ（pages/lab のみ）。entities/analysis は
    // pages/lab 配下の token-stage/ast-stage/bytecode-stage/vm-stage
    // （旧 widgets、2026-07 に pages/lab 配下へ統合）が共有する解析結果・
    // 選択状態・段間リンクの純関数群を持つ。唯一の consumer が pages/lab
    // であること自体は、この規模のアプリでは想定通り。
    files: ["src/entities/analysis/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
