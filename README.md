# Pyeek

Python のコードが実行されるまでの4段階 — **字句解析・構文解析・コンパイル・実行**
— を、同一のソースコードに対して串刺しに可視化する教育用 Web アプリです。
CPython を再実装せず、[Pyodide](https://pyodide.org/) を通じてブラウザ上で
本物の CPython の `tokenize`/`ast`/`dis` をそのまま動かし、その内部表現を
そのまま描画します。

**本番環境**: https://pyeek.kawakin.tech

## これは何を見せるアプリか

同じ Python コードが、CPython の中でどう姿を変えていくかを4段階で追います。

1. **① 字句解析（Token）** — `tokenize` が吐く本物のトークン列（`NAME`/`OP`/`STRING`/`INDENT`/`DEDENT` など、位置情報つき）
2. **② 構文解析（AST）** — `ast.parse()` が組み立てる構文木
3. **③ コンパイル（Bytecode）** — `dis.Bytecode` が返すバイトコード命令列
4. **④ 実行（Stack Machine）** — バイトコードを1命令ずつ再生し、評価スタックが push/pop される様子をアニメーションで見せる（浅いスタックVM。関数呼び出しなど深いフレームは非対応、ジャンプ/分岐を含むコードは再生非対応）

各段は選択範囲で相互にハイライトし、同じソース位置が①〜③でどう対応しているかを確認できます。「やさしい」（直感的な言い換え）と「くわしい」（本物の名称・位置情報）の2モードを切り替え可能です。

## 使い方（ローカル開発）

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。`pnpm dev`/`pnpm build`
の prebuild（`scripts/copy-pyodide.mjs`）が `node_modules/pyodide/*` と
`py/pyeek_core.py` を `public/` にコピーします（初回のみ数秒かかります）。

Python 側の実装は `py/pyeek_core.py`（標準ライブラリのみ、Python 3.12 前提）
一本です。ローカルに Python 3.12 系が無くても、ブラウザ側は Pyodide が
自前の CPython 3.12 系をバンドルしているため動作します。

## テスト

```bash
pnpm typecheck        # tsc --noEmit
pnpm check             # biome
pnpm fsd                # steiger（Feature-Sliced Design 構造検証）
pnpm test               # vitest（jsdom, 純関数・コンポーネントの単体テスト）
pnpm test:integration   # vitest（node環境で実際に Pyodide を起動し、CPythonの版ズレを検出）
pnpm test:python         # uv run pytest tests/python/（pyeek_core.py のスナップショットテスト）
```

`tests/fixtures/cases.json` が `test_pyeek_core.py`（ローカル pytest）と
`pyodide-node.test.ts`（`test:integration`）の共有フィクスチャ。スナップショット
更新は `PYEEK_UPDATE_SNAPSHOTS=1 uv run pytest tests/python/`。

## アーキテクチャ

Next.js（App Router）+ TypeScript。ディレクトリ構成は
[Feature-Sliced Design](https://feature-sliced.design/) v2.1
（`src/{app,pages,entities,shared}`。widgets 層は無い）。

```
src/
├── app/                    # Next.js App Router ルート（.nx.tsx/.nx.ts、next.config.ts の pageExtensions）
├── pages/lab/              # 唯一のページ。4段（token/ast/bytecode/vm-stage）が同居
├── entities/source-link/   # ドメインモデル: SrcRange/Token/AstNode/Instr の対応関係
└── shared/api/             # Pyodide とのブリッジ（PyeekBridge）
```

- 解析セッションの状態（source/result/mode/selectedRange）は
  `pages/lab/model/analysis-store.tsx`
- FSD 構造は `pnpm fsd`（[steiger](https://github.com/feature-sliced/steiger)）で
  検証する。lefthook pre-commit にも組み込み済み
- Python 側の実装は `py/pyeek_core.py` 一本。ブラウザでは
  `src/shared/api/pyodide-bridge.ts` 経由で Pyodide 上で実行する

### 開発時の注意

- 使用している Next.js のバージョンは新しく、一般に知られている情報と異なる
  場合がある。挙動確認は `node_modules/next/dist/docs/` を参照。
- CPython は定数のみの式を畳み込む（`2 + 3 * 4` → `RETURN_CONST`）。
  スタックVM（④）のデモには `n = 4; total = 2 + 3 * n` のように変数を
  挟んだ式を使うこと。

## デプロイ

`infra/`（Terraform、`vercel` + `cloudflare` プロバイダ）で管理しています。
Vercel の `build_command` は `pnpm build`（prebuild の Pyodide アセットコピーを
走らせるため必須）。詳細は [`infra/README.md`](./infra/README.md) を参照してください。

## ロードマップ

優先順位は未確定です。

### 機能拡張
- [x] **④スタックVMのジャンプ・分岐対応** — `if`/`for`/`while` の再生。値が特定できない分岐は再生を拒否し、無限ループは256ステップで打ち切る。
- [ ] **深い実行トレース** — ユーザー定義関数を呼んだときにコールスタックへフレームが積まれる様子を見せる（現状は単一フレームの「浅い」スタックVM）。
- [ ] **①→②、②→③のハイライト同期** — トークンやASTノードが出現するタイミングで、対応する範囲を自動的にハイライトする（クリック時の相互ハイライトは実装済み。対応データは既にあり、UI実装のみ）。

### 教育コンテンツ
- [ ] プリセット拡充（内包表記・ジェネレータ・デコレータ・クラス・クロージャなど）
- [ ] `try`/`except` のバイトコード可視化（3.11+ の zero-cost exception table）
- [x] **①Tokenの全種別リファレンス** — 実際に出現しうる68種の詳細解説＋公式リンク＋やさしい訳。クリック検査と接続済み。
- [x] **②ASTの全種別リファレンス** — 同111種。
- [x] **③Bytecodeの全種別リファレンス** — 同108種。
- [ ] **④スタックマシンの全種別リファレンス** — ③の全opcode解説を再利用して「スタックをどう操作するか」の観点を加えるとともに、push/pop・評価スタック・フレームなどの基本概念用語集を用意する。

### 品質・保守
- [x] Playwright での画面確認をCIに組み込む
- [x] Pyodide 初回ロードの体感改善（キャッシュヘッダ＋preload）
- [ ] 全ステージ通しでのアクセシビリティ・レスポンシブ確認

### 検討中（優先度が低い、コストの大きい選択肢）
- [ ] CPython をフォークし、構文解析・コンパイルの内部処理（PEGパーサのバックトラック、コンパイラのCFG構築）に計装（トレース出力）を追加してビルドし直す案。パッチ自体は同一マイナーバージョン内では安定するが、Pyodide本体（wasmランタイム＋JSグルーコード）の自動更新を受けられなくなる代償があるため、当面は見送り。
