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
    // M0 時点では pages/lab のみが consumer だが、M1〜M4 で widgets/
    // {token,ast,bytecode,vm}-stage が同じ解析結果・選択状態を共有するために
    // 追加される計画（実装計画: pyeek-expressive-pnueli.md）。再利用計画が
    // 消えたら pages/lab 配下に戻す。
    files: ["src/entities/analysis/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    // Pyeek は単一ページアプリ（pages/lab のみ）なので、widgets 層の
    // 「複数ページでの再利用」という insignificant-slice の前提が成立しない。
    // ここでの widget は「マイルストーン単位で独立開発される大型UIブロック」
    // という意味で採用しており（将来の iframe/スニペット配布も見据える）、
    // 唯一の consumer が pages/lab であること自体は想定通り。
    files: ["src/widgets/**"],
    rules: {
      "fsd/insignificant-slice": "off",
      // token-stage/ast-stage/bytecode-stage/vm-stage は「①〜④の4段」という
      // ドメイン上の並びをそのまま slice 名にしている。"stage" の反復は
      // 命名の衝突ではなく意図した対称性なので無効化する。
      "fsd/repetitive-naming": "off",
    },
  },
]);
