import { expect, test } from "@playwright/test";
import { collectPageErrors, gotoAndWaitForPyodide } from "./helpers";

test.describe("3ステージクリック検査E2Eテスト", () => {
  test("トークンクリック：printトークンの説明表示とドキュメントリンク", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // 初期プリセット print("こんにちは!") が既に入力されているので、
    // 最初の "print" トークン（NAME）をクリック
    const tokens = page.locator(".tok");
    const printToken = await tokens.evaluateAll((items) => {
      const found = Array.from(items).find((item) => item.textContent?.includes("print"));
      return found ? found.textContent : null;
    });

    expect(printToken).toContain("print");

    // print トークンをクリック
    const printTokenButton = tokens.filter({ has: page.locator("text=print") }).first();
    await printTokenButton.click();

    // readout パネルが表示されることを確認
    const readout = page.locator(".token-stage__readout");
    await expect(readout).toBeVisible({ timeout: 5_000 });

    // チップが NAME を表示していることを確認
    const chip = readout.locator(".token-stage__chip");
    await expect(chip).toHaveText("NAME", { timeout: 5_000 });

    // readout-body に説明本文が表示されていることを確認
    const body = readout.locator(".token-stage__readout-body");
    await expect(body).toHaveText(/NAME|identifier|識別子/, { timeout: 5_000 });

    // ドキュメントリンクが正しいURLを持つことを確認
    const link = readout.locator(".token-stage__doc-link");
    await expect(link).toHaveAttribute(
      "href",
      "https://docs.python.org/3.12/library/token.html#token.NAME",
    );

    expect(errors).toHaveLength(0);
  });

  test("ASTノードクリック：Moduleノード（ソース範囲なし）", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // Module ノードをクリック
    // Module は通常ツリーの最上部
    const astNodes = page.locator(".ast-node");
    const moduleNode = astNodes.filter({ has: page.locator("text=Module") }).first();
    await expect(moduleNode).toBeVisible({ timeout: 5_000 });
    await moduleNode.click();

    // AST readout パネルが表示され、チップが Module になることを確認
    const readout = page.locator(".ast-stage__readout");
    await expect(readout).toBeVisible({ timeout: 5_000 });

    const chip = readout.locator(".ast-stage__chip");
    await expect(chip).toHaveText("Module", { timeout: 5_000 });

    // 説明本文が表示されていることを確認
    const body = readout.locator(".ast-stage__readout-body");
    await expect(body).not.toHaveText(/👆 ノードをタップ/, { timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("ASTノードクリック：同一範囲の親子ノード（ExprとCall）を順にクリック", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // AST readout を取得
    const readout = page.locator(".ast-stage__readout");
    const chip = readout.locator(".ast-stage__chip");

    // Expr ノードをクリック
    const astNodes = page.locator(".ast-node");
    const exprNode = astNodes.filter({ has: page.locator("text=Expr") }).first();
    await expect(exprNode).toBeVisible({ timeout: 5_000 });
    await exprNode.click();

    // チップが Expr になることを確認
    await expect(chip).toHaveText("Expr", { timeout: 5_000 });

    // Call ノードをクリック
    const callNode = astNodes.filter({ has: page.locator("text=Call") }).first();
    await expect(callNode).toBeVisible({ timeout: 5_000 });
    await callNode.click();

    // チップが Call に切り替わることを確認（Expr から Call に変わった）
    await expect(chip).toHaveText("Call", { timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("バイトコード命令クリック：RESUME（合成命令）", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // RESUME 命令をクリック
    // RESUME は通常最初の命令
    const instrs = page.locator(".instr");
    const resumeInstr = instrs.filter({ has: page.locator("text=RESUME") }).first();
    await expect(resumeInstr).toBeVisible({ timeout: 5_000 });
    await resumeInstr.click();

    // bytecode readout パネルが表示され、チップが RESUME になることを確認
    const readout = page.locator(".bytecode-stage__readout");
    await expect(readout).toBeVisible({ timeout: 5_000 });

    const chip = readout.locator(".bytecode-stage__chip");
    await expect(chip).toHaveText("RESUME", { timeout: 5_000 });

    // 説明本文が表示されていることを確認
    const body = readout.locator(".bytecode-stage__readout-body");
    await expect(body).not.toHaveText(/👆 命令をタップ/, { timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("バイトコード命令クリック：同一範囲の複数命令（CALL→POP_TOP→RETURN_CONST）", async ({
    page,
  }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // bytecode readout を取得
    const readout = page.locator(".bytecode-stage__readout");
    const chip = readout.locator(".bytecode-stage__chip");

    // CALL 命令をクリック
    const instrs = page.locator(".instr");
    const callInstr = instrs.filter({ has: page.locator("text=CALL") }).first();
    await expect(callInstr).toBeVisible({ timeout: 5_000 });
    await callInstr.click();

    // チップが CALL になることを確認
    await expect(chip).toHaveText("CALL", { timeout: 5_000 });

    // POP_TOP 命令をクリック（CALL の直後）
    const popTopInstr = instrs.filter({ has: page.locator("text=POP_TOP") }).first();
    await expect(popTopInstr).toBeVisible({ timeout: 5_000 });
    await popTopInstr.click();

    // チップが POP_TOP に切り替わることを確認
    await expect(chip).toHaveText("POP_TOP", { timeout: 5_000 });

    // RETURN_CONST 命令をクリック
    const returnInstr = instrs.filter({ has: page.locator("text=RETURN_CONST") }).first();
    await expect(returnInstr).toBeVisible({ timeout: 5_000 });
    await returnInstr.click();

    // チップが RETURN_CONST に切り替わることを確認
    await expect(chip).toHaveText("RETURN_CONST", { timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("説明パネルのリンク形式：AST docUrl は ast.html#ast.<型名>形式", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // Module ノードをクリック
    const astNodes = page.locator(".ast-node");
    const moduleNode = astNodes.filter({ has: page.locator("text=Module") }).first();
    await expect(moduleNode).toBeVisible({ timeout: 5_000 });
    await moduleNode.click();

    // ドキュメントリンクが正しいURLを持つことを確認
    const readout = page.locator(".ast-stage__readout");
    const link = readout.locator(".ast-stage__doc-link");
    await expect(link).toHaveAttribute(
      "href",
      /https:\/\/docs\.python\.org\/3\.12\/library\/ast\.html#ast\.Module$/,
    );

    expect(errors).toHaveLength(0);
  });

  test("説明パネルのリンク形式：バイトコード docUrl は dis.html#opcode-<命令名>形式", async ({
    page,
  }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // RESUME 命令をクリック
    const instrs = page.locator(".instr");
    const resumeInstr = instrs.filter({ has: page.locator("text=RESUME") }).first();
    await expect(resumeInstr).toBeVisible({ timeout: 5_000 });
    await resumeInstr.click();

    // ドキュメントリンクが正しいURLを持つことを確認
    const readout = page.locator(".bytecode-stage__readout");
    const link = readout.locator(".bytecode-stage__doc-link");
    await expect(link).toHaveAttribute(
      "href",
      "https://docs.python.org/3.12/library/dis.html#opcode-RESUME",
    );

    expect(errors).toHaveLength(0);
  });

  test("モード切り替え：やさしいモードでreadout説明本文が異なる", async ({ page }) => {
    // エラー収集を先に仕込む
    const errors = collectPageErrors(page);

    // ページ読み込み・Pyodide初期化待機
    await gotoAndWaitForPyodide(page);

    // print トークンをクリック
    const tokens = page.locator(".tok");
    const printToken = tokens.filter({ has: page.locator("text=print") }).first();
    await expect(printToken).toBeVisible({ timeout: 5_000 });
    await printToken.click();

    // readout パネルから説明本文を取得（詳しいモード）
    const readout = page.locator(".token-stage__readout");
    const body = readout.locator(".token-stage__readout-body");
    await expect(body).toBeVisible({ timeout: 5_000 });

    const detailText = await body.textContent();
    expect(detailText).toBeTruthy();

    // モード切り替えボタンを探してクリック
    // 通常「詳しい」「やさしい」等のテキストを含むボタン
    const modeButtons = page.locator("button");
    const easyModeButton = modeButtons.filter({ hasText: /やさしい|easy/ }).first();

    // ボタンが存在することを確認（存在しなければテスト失敗）
    await expect(easyModeButton).toBeVisible({ timeout: 5_000 });
    await easyModeButton.click();

    // readout 説明本文が変わったことを確認
    const easyText = await body.textContent();
    expect(easyText).toBeTruthy();
    // 詳しいモードとやさしいモードの説明は異なるはず
    expect(detailText).not.toEqual(easyText);

    expect(errors).toHaveLength(0);
  });
});
