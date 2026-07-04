import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

test.describe("ステージ間ハイライト連動", () => {
  test("トークン→他ステージへの連動: print トークンをクリックすると ASTと バイトコード にハイライトが付く", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // デフォルト print("こんにちは!") コードで開始
    // print トークンをクリック
    const printToken = page.locator(".tok").first();
    await expect(printToken).toBeVisible();
    await printToken.click();

    // トークン自身に .tok--sel が付く
    await expect(printToken).toHaveClass(/tok--sel/);

    // AST の Name ノード（print に対応）に active/related系クラスが付く
    // Call ノードの直下に Name ノードがあり、それがハイライトされるはず
    const astNameNode = page.locator(".ast-node").filter({ hasText: "Name" }).first();
    await expect(astNameNode).toHaveClass(/ast-node--(active|related)/);

    // バイトコードの LOAD_NAME 命令に active/related系クラスが付く
    const loadNameInstr = page.locator(".instr").filter({ hasText: "LOAD_NAME" }).first();
    await expect(loadNameInstr).toHaveClass(/instr--(active|related)/);

    expect(errors).toHaveLength(0);
  });

  test("ASTノード→他ステージへの連動: Call ノードをクリックすると トークンとバイトコード がハイライトされる", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // AST の Call ノードを見つけてクリック
    const callNode = page.locator(".ast-node").filter({ hasText: "Call" }).first();
    await expect(callNode).toBeVisible();
    await callNode.click();

    // Call ノード自身に .ast-node--active が付く
    await expect(callNode).toHaveClass(/ast-node--(active|selected)/);

    // Call に対応するトークン群（print, (, 文字列, )）に related系クラスが付く
    // Call の全体範囲に対応する複数のトークンがハイライトされるはず
    const highlightedTokens = page.locator(".tok--related, .tok--sel");
    await expect(highlightedTokens.first()).toBeVisible({ timeout: 5000 });

    // バイトコードの CALL 命令に active/related系クラスが付く
    const callInstr = page.locator(".instr").filter({ hasText: "CALL" }).first();
    await expect(callInstr).toHaveClass(/instr--(active|related)/, { timeout: 5000 });

    expect(errors).toHaveLength(0);
  });

  test("バイトコード→他ステージへの連動: LOAD_CONST をクリックすると トークンと ASTがハイライトされる", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // バイトコードの LOAD_CONST 命令をクリック
    const loadConstInstr = page.locator(".instr").filter({ hasText: "LOAD_CONST" }).first();
    await expect(loadConstInstr).toBeVisible({ timeout: 5000 });
    await loadConstInstr.click();

    // LOAD_CONST 命令自身に .instr--active が付く
    await expect(loadConstInstr).toHaveClass(/instr--(active|selected)/);

    // トークン列のいずれかが --related または --sel クラスを持つことを確認
    // （LOAD_CONST は文字列定数に対応）
    const highlightedTokens = page.locator(".tok--related, .tok--sel");
    await expect(highlightedTokens.first()).toBeVisible({ timeout: 5000 });

    // AST の Constant ノード（文字列定数）に active/related系クラスが付く
    const constantNode = page.locator(".ast-node").filter({ hasText: "Constant" }).first();
    await expect(constantNode).toHaveClass(/ast-node--(active|related)/, { timeout: 5000 });

    expect(errors).toHaveLength(0);
  });

  test("編集でハイライトが消える: ハイライト状態でコードを編集するとハイライトが全ステージから消える", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 何かを選択（print トークンをクリック）
    const printToken = page.locator(".tok").first();
    await expect(printToken).toBeVisible();
    await printToken.click();

    // ハイライトが付いていることを確認
    await expect(printToken).toHaveClass(/tok--sel/);

    // ハイライト状態のまま、エディタのコードを変更
    await fillEditor(page, "x = 42");

    // デバウンス（300ms）と解析時間を考慮してハイライトが消えるのを待つ
    // 再解析の完了を待つため、トークン列が更新されるのを待つ
    await expect(page.locator(".tok").first()).toBeVisible({ timeout: 10_000 });

    // トークン列から --sel クラスがなくなったことを確認
    const activeTokens = page.locator(".tok--sel");
    await expect(activeTokens).toHaveCount(0);

    // AST からもハイライトが消える
    const activeAstNodes = page.locator(".ast-node--active, .ast-node--related");
    await expect(activeAstNodes).toHaveCount(0);

    // バイトコードからもハイライトが消える
    const activeInstrs = page.locator(".instr--active, .instr--related");
    await expect(activeInstrs).toHaveCount(0);

    expect(errors).toHaveLength(0);
  });

  test("ネスト関数のコードオブジェクトタブ: ネスト関数を含むコードでバイトコード ステージに複数タブが表示される", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // ネスト関数を含むコード
    const nestedFunctionCode = "def f():\n    def g():\n        pass\n    g()";
    await fillEditor(page, nestedFunctionCode);

    // 再解析完了を待つ（トークン列が再描画されるのを待つ）
    await expect(page.locator(".tok").first()).toBeVisible({ timeout: 10_000 });

    // バイトコードステージの code-tabs（コードオブジェクトタブ）が複数表示されるのを待つ
    const codeTabs = page.locator(".bytecode-stage__code-tab");
    await expect(codeTabs).toHaveCount(3, { timeout: 10_000 }); // <module>, f, g の3つ

    // タブのテキスト内容を確認（少なくとも1つはネストされた関数を示す）
    const firstTab = codeTabs.first();
    const secondTab = codeTabs.nth(1);
    await expect(firstTab).toBeVisible();
    await expect(secondTab).toBeVisible();

    // 2番目のタブをクリックして命令列が切り替わることを確認
    await secondTab.click();

    // クリック後、そのタブが active状態になる
    await expect(secondTab).toHaveClass(/bytecode-stage__code-tab--active/);

    // 命令列が再描画される（見た目の変化）
    await expect(page.locator(".instr").first()).toBeVisible({ timeout: 5000 });

    expect(errors).toHaveLength(0);
  });
});
