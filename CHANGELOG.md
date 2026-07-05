# Changelog

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
