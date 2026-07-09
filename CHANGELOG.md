# Changelog

## [1.4.0](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.5...v1.4.0) (2026-07-09)


### Features

* 共有コードを反映した動的OGP画像を生成する ([#29](https://github.com/KinjiKawaguchi/pyeek/issues/29)) ([156d464](https://github.com/KinjiKawaguchi/pyeek/commit/156d46496b263062dea8807fd4e4b5beffcb9949))


### Bug Fixes

* Vercel System Environment VariablesをDeploymentへ自動公開する ([#36](https://github.com/KinjiKawaguchi/pyeek/issues/36)) ([0439b89](https://github.com/KinjiKawaguchi/pyeek/commit/0439b893703772e15656342c5e69fc7ef29d9627))

## [1.3.5](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.4...v1.3.5) (2026-07-08)


### Performance Improvements

* Pyodideの初期化・実行をWeb Workerに逃がしメインスレッドのブロッキングを解消 ([#24](https://github.com/KinjiKawaguchi/pyeek/issues/24)) ([8cb4466](https://github.com/KinjiKawaguchi/pyeek/commit/8cb4466381df29c6d4b309971d24a36c7b457e2b))

## [1.3.4](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.3...v1.3.4) (2026-07-08)


### Bug Fixes

* Lighthouseで検出されたアクセシビリティの色コントラスト・aria-label不整合を修正 ([#22](https://github.com/KinjiKawaguchi/pyeek/issues/22)) ([9f5b13d](https://github.com/KinjiKawaguchi/pyeek/commit/9f5b13d4538ad6075b69eafe00a5bfed8f559b42))

## [1.3.3](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.2...v1.3.3) (2026-07-08)


### Bug Fixes

* SharedArrayBuffer非推奨警告をCOOP/COEPヘッダーで解消 ([#23](https://github.com/KinjiKawaguchi/pyeek/issues/23)) ([36bd8b0](https://github.com/KinjiKawaguchi/pyeek/commit/36bd8b08be6dd819910eae8dac3f87ce0bd4166b))

## [1.3.2](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.1...v1.3.2) (2026-07-08)


### Bug Fixes

* AST木の横スクロールに気づけるようスクロールシャドウを追加 ([#20](https://github.com/KinjiKawaguchi/pyeek/issues/20)) ([8682088](https://github.com/KinjiKawaguchi/pyeek/commit/868208826af80a7699f49e5489f0b5df0899ad6e))

## [1.3.1](https://github.com/KinjiKawaguchi/pyeek/compare/v1.3.0...v1.3.1) (2026-07-08)


### Bug Fixes

* モバイル幅で見出しバッジの重なりとヘッダー行の分断を直す ([#18](https://github.com/KinjiKawaguchi/pyeek/issues/18)) ([6200416](https://github.com/KinjiKawaguchi/pyeek/commit/6200416335f54a6549ef17b1e1c82dfd35eddff8))

## [1.3.0](https://github.com/KinjiKawaguchi/pyeek/compare/v1.2.0...v1.3.0) (2026-07-08)


### Features

* エディタの内容をURLで共有できるようにする ([#12](https://github.com/KinjiKawaguchi/pyeek/issues/12)) ([da50354](https://github.com/KinjiKawaguchi/pyeek/commit/da5035430d2df9dba602a60ed3b27a5d711bfe91))

## [1.2.0](https://github.com/KinjiKawaguchi/pyeek/compare/v1.1.0...v1.2.0) (2026-07-08)


### Features

* Vercel Web Analyticsを追加する ([#13](https://github.com/KinjiKawaguchi/pyeek/issues/13)) ([e01aeb7](https://github.com/KinjiKawaguchi/pyeek/commit/e01aeb7ba7a246b017e3321e538437d961febd58))

## [1.1.0](https://github.com/KinjiKawaguchi/pyeek/compare/v1.0.3...v1.1.0) (2026-07-08)


### Features

* エディタにシンタックスハイライトを追加する ([#10](https://github.com/KinjiKawaguchi/pyeek/issues/10)) ([53cae59](https://github.com/KinjiKawaguchi/pyeek/commit/53cae592970ed846053201997253e8d21834aeb8))

## [1.0.3](https://github.com/KinjiKawaguchi/pyeek/compare/v1.0.2...v1.0.3) (2026-07-06)


### Bug Fixes

* ラボ画面ヘッダーの文言をREADMEの表現に揃える ([#8](https://github.com/KinjiKawaguchi/pyeek/issues/8)) ([8298736](https://github.com/KinjiKawaguchi/pyeek/commit/82987366ac4405e197cd165d47b909a091e11fde))

## [1.0.2](https://github.com/KinjiKawaguchi/pyeek/compare/v1.0.1...v1.0.2) (2026-07-06)


### Bug Fixes

* 「串刺し」という言い回しをやめ、既存の平易な表現に統一する ([#5](https://github.com/KinjiKawaguchi/pyeek/issues/5)) ([5c1401b](https://github.com/KinjiKawaguchi/pyeek/commit/5c1401b99f5e6402817bafa14afad6e2a1472914))

## [1.0.1](https://github.com/KinjiKawaguchi/pyeek/compare/v1.0.0...v1.0.1) (2026-07-05)


### Bug Fixes

* release-pleaseのマージにPATを使い後続タグ作成が動くようにする ([#3](https://github.com/KinjiKawaguchi/pyeek/issues/3)) ([c9c0b12](https://github.com/KinjiKawaguchi/pyeek/commit/c9c0b1262e3a1f964152f216755e3bb66b737524))

## 1.0.0 (2026-07-05)


### Features

* ①Tokenの全種別リファレンスを追加 ([bd059ef](https://github.com/KinjiKawaguchi/pyeek/commit/bd059ef47b0cecae878f910f16f320bc6dc426bb))
* ②AST・③バイトコードのリファレンスをラボ画面に配線 ([4a1be72](https://github.com/KinjiKawaguchi/pyeek/commit/4a1be723f85426af2ed1c7558d113f32ca18535e))
* ②AST全種別の全種別リファレンスを追加 ([4f769b9](https://github.com/KinjiKawaguchi/pyeek/commit/4f769b92b371361879418a90598b785e666b7821))
* 3ステージのクリック検査を全種別リファレンスに接続 ([eb94d4e](https://github.com/KinjiKawaguchi/pyeek/commit/eb94d4e600f9a897c4d045470b00ab79d72b00bd))
* ③バイトコード全種別のリファレンスを追加 ([37700df](https://github.com/KinjiKawaguchi/pyeek/commit/37700df41c4f84dbb5789f821cbd181d87c813e9))
* favicon をPyeek独自のものに差し替え ([10b31d2](https://github.com/KinjiKawaguchi/pyeek/commit/10b31d2f4e8e8e510a5a0eb80df211b6d639c861))
* GitHub Star バッジを追加 ([d084da5](https://github.com/KinjiKawaguchi/pyeek/commit/d084da53a93306d1adaa9e1b454be02c48dd8366))
* OSSであることを示すGitHubリンクをヘッダーに追加 ([1b05737](https://github.com/KinjiKawaguchi/pyeek/commit/1b057374ee8a798c489ddcae13509ef73e3d935f))
* Pyeek MVP(M0-M4) — CPython字句解析/AST/バイトコード/浅いスタックVMの可視化 ([c14238d](https://github.com/KinjiKawaguchi/pyeek/commit/c14238db3ed5d8f5f03ff9f38816d69e34c8800e))
* release-pleaseによるCHANGELOG・バージョン管理を自動化する ([#1](https://github.com/KinjiKawaguchi/pyeek/issues/1)) ([7f802b6](https://github.com/KinjiKawaguchi/pyeek/commit/7f802b646a3b259107f61cf7b3f3de32e3cbd65a))
* エディタでTab/Shift+Tab/Enterによるインデント操作をサポート ([e719f48](https://github.com/KinjiKawaguchi/pyeek/commit/e719f487ad49eeb78b3f37a11d39b29a62b369bc))


### Bug Fixes

* ①Tokenリファレンスのリンク切れと内容誤りを修正 ([75cb224](https://github.com/KinjiKawaguchi/pyeek/commit/75cb2241302bc2ab118f81985a01798eafdd55dc))
* ④VM再生でトークン説明パネルの高さが変わり再生ボタンが動く不具合を修正 ([8db065d](https://github.com/KinjiKawaguchi/pyeek/commit/8db065db79f227d5d83f60c1ee804d5ea8426554))
* かんたんモードのトークン構造の捏造をやめ、ラベルを平易化する ([205d4de](https://github.com/KinjiKawaguchi/pyeek/commit/205d4de1826185f6afb924eab5af1c0a348f9e22))
* 範囲を持たない/共有するノード・命令のクリック選択を修正 ([83e48c1](https://github.com/KinjiKawaguchi/pyeek/commit/83e48c14fd607915920fc4e7a81c50adcd82f30d))
