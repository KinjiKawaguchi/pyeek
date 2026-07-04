@AGENTS.md

# Pyeek

Python の字句解析・構文解析・コンパイル・実行を、本物の CPython の内部表現
（tokenize/ast/dis）で串刺しに可視化する教育用 Web アプリ。設計の全体像は
`/home/kkawaguchi/.claude/plans/pyeek-expressive-pnueli.md`（実装計画）を参照。

## アーキテクチャ

- Next.js（App Router）+ TypeScript。ディレクトリ構成は Feature-Sliced Design
  (FSD) v2.1: `src/{app,pages,entities,shared}`。widgets 層は無い（Pyeek は
  `pages/lab` 一枚だけの単一ページアプリで、4段（token/ast/bytecode/vm-stage）
  はすべて `pages/lab` 配下に同居している。2026-07 に `widgets/` から統合）。
- `pages/lab` の内部は FSD のセグメント規約（`ui/model/config` を最上位に置く）
  に従い、その中に stage 別サブフォルダを切っている:
  ```
  pages/lab/
  ├── ui/{editor,mode-toggle,...}.tsx      # ページ固有の合成UI
  │   ├── token-stage/  ├── ast-stage/  ├── bytecode-stage/  ├── vm-stage/
  ├── model/
  │   ├── token-stage/  ├── ast-stage/  ├── bytecode-stage/  ├── vm-stage/
  ├── config/{presets.ts, token-stage/, ast-stage/, bytecode-stage/}
  └── index.ts
  ```
  各 stage フォルダの直下にさらに `ui/`/`model/` を作ると steiger の
  `fsd/no-reserved-folder-names`（予約セグメント名の入れ子）に引っかかるため、
  segment が先・stage 名が後、という順序を厳守すること。各 stage の
  `ui/<stage>/index.ts` は内部向けの薄いバレル（`LabWorkbench` からの
  import を短くするだけで、FSD の public API 境界としての意味は無い）。
- 4段が単一ページ内に同居する理由は steiger の `insignificant-slice` 警告を
  無効化している `entities/analysis` 側のコメント、および実装計画ファイルを
  参照。widgets 層として独立させていた時期もあったが、「複数ページで使う」
  という widgets の前提が単一ページアプリでは成立しないため、pages/lab に
  統合した（1ページしか無いのに widgets があるのは実態に合わない、という
  指摘を受けての変更）。
- **Next.js の App Router ルートファイル（`page.nx.tsx`/`layout.nx.tsx`）は
  `src/app/` に置き、`.nx.tsx`/`.nx.ts` という非標準の拡張子で命名する**
  （`next.config.ts` の `pageExtensions`）。理由:
  - Next.js の `findPagesDir`（`node_modules/next/dist/lib/find-pages-dir.js`）
    は `pages/` と `app/` という**ディレクトリ名の存在だけ**を見て Pages
    Router / App Router を判定し、両者の**親ディレクトリが一致しないと**
    `pages and app directories should be under the same folder` で
    ビルドが落ちる。これは `pageExtensions` を設定しても変わらない
    （その設定が効くのは後段の「拡張子によるページ検出」だけ）。
  - FSD の pages 層 `src/pages/` を使う以上、Next 側の `app/` も**同じ
    `src/` 配下**に置かないと親が揃わない。そのため `app/` はリポジトリ
    直下ではなく `src/app/` に置く。
  - `src/app/` を Next のルーティング領域にすると、その配下にある FSD 由来
    の通常の `.ts`/`.tsx`（あれば）まで default-export 必須の Page として
    型検証されてしまう。`pageExtensions: ["nx.tsx", "nx.ts"]` で「Next が
    ルートファイルとして認識する拡張子」を限定し、これを避ける。
  - 上流 issue: https://github.com/vercel/next.js/issues/51478（2023年から
    open）。lol-draft-ai/apps/web と同一の workaround。
  - `steiger.config.ts` で `ignores: ["app/**"]`（`src/app/` は FSD 構造の
    一部ではないため scan 対象外）。
- FSD 構造は `pnpm fsd`（`steiger ./src`）で検証する。lefthook pre-commit
  にも組み込み済み。
- Python 側の実装は `py/pyeek_core.py` 一本（標準ライブラリのみ、CPython の
  tokenize/ast/dis をそのまま JSON 化する純粋関数群）。ブラウザでは Pyodide
  （`src/shared/api/pyodide-bridge.ts`）経由で実行する。
- `pnpm build`/`pnpm dev` の prebuild（`scripts/copy-pyodide.mjs`）が
  `node_modules/pyodide/*` と `py/pyeek_core.py` を `public/` にコピーする。
  Next.js のバンドラ（webpack/Turbopack）は pyodide の wasm/stdlib zip を
  扱えないため、`import(/* webpackIgnore: true */ "/pyodide/pyodide.mjs")`
  でバンドルを迂回して静的配信ファイルに直接到達する。

## CPython の定数畳み込みに関する注意

CPython は定数のみの式を AST 最適化段階で畳み込む。`2 + 3 * 4` のような式は
`BINARY_OP` が残らず `RETURN_CONST` のみになる（式文としては値が使われず
文自体が消えるため）。スタックVM（Stage④）のデモには変数を挟んだ式
（例: `n = 4; total = 2 + 3 * n`）を使うこと。詳細は実装計画ファイルを参照。

## テスト

- `pnpm test` — vitest（jsdom, unit プロジェクト）。純関数・コンポーネント。
- `pnpm test:integration` — vitest（node 環境）。npm の pyodide を Node 上で
  実際に起動し、`tests/python/snapshots/*.json` と照合して CPython の
  バージョンズレを検出する（pythonVersion フィールドは比較対象から除外）。
  wasm ロードで数秒かかるため pre-commit には含めない。
- `pnpm test:python`（`uv run pytest tests/python/`）— `pyeek_core.py` の
  スナップショットテスト。`tests/fixtures/cases.json` が
  `test_pyeek_core.py` と `pyodide-node.test.ts` の共有フィクスチャ。
  スナップショット更新は `PYEEK_UPDATE_SNAPSHOTS=1 uv run pytest tests/python/`。
- `pnpm typecheck` / `pnpm check`（biome）/ `pnpm check:fix`。
