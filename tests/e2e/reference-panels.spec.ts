import { expect, test } from "@playwright/test";
import { collectPageErrors, gotoAndWaitForPyodide } from "./helpers";

test.describe("Pyeek E2E 全種別リファレンスパネル", () => {
  test("①トークンリファレンス: summary開閉・精度注記・カテゴリ展開・項目詳細を検証", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // トークンリファレンスの summary が存在し、閉じた状態から開く
    const tokenSummary = page.locator(
      'details.token-stage__reference > summary:has-text("①トークンの全種別リファレンス")',
    );
    await expect(tokenSummary).toBeVisible({ timeout: 5_000 });

    // summary クリックで details 開く
    await tokenSummary.click();

    // 精度注記が表示される
    const tokenAccuracyNotice = page.locator(".token-stage__accuracy-notice");
    await expect(tokenAccuracyNotice).toBeVisible({ timeout: 5_000 });
    await expect(tokenAccuracyNotice).toContainText("誤りが含まれる可能性があります");
    await expect(tokenAccuracyNotice.locator("a")).toHaveAttribute(
      "href",
      "https://docs.python.org/3.12/library/token.html",
    );

    // カテゴリが 5 つ表示されていることを確認
    const categories = page.locator(".token-stage__category");
    await expect(categories).toHaveCount(5, { timeout: 5_000 });

    // 最初のカテゴリ（基本トークン）を開く
    const firstCategoryButton = categories.first().locator(".token-stage__category-header");
    await firstCategoryButton.click();

    // カテゴリ内の項目リストが表示される
    const firstTokensList = categories.first().locator(".token-stage__tokens-list");
    await expect(firstTokensList).toBeVisible({ timeout: 5_000 });

    // 最初の項目（NAME）を開く
    const firstTokenButton = firstTokensList.locator(".token-stage__token-header").first();
    await firstTokenButton.click();

    // 詳細セクションが表示される
    const tokenDetail = firstTokensList.locator(".token-stage__token-detail").first();
    await expect(tokenDetail).toBeVisible({ timeout: 5_000 });
    await expect(tokenDetail.locator("h5")).toContainText("詳細");
    await expect(tokenDetail.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 初学者向けセクションが表示される
    const tokenEasy = firstTokensList.locator(".token-stage__token-easy").first();
    await expect(tokenEasy).toBeVisible({ timeout: 5_000 });
    await expect(tokenEasy.locator("h5")).toContainText("初学者向け");
    await expect(tokenEasy.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 公式ドキュメントリンクが表示され、#token.NAME で終わる
    const tokenDocLink = firstTokensList.locator(".token-stage__doc-link").first();
    await expect(tokenDocLink).toBeVisible({ timeout: 5_000 });
    const href = await tokenDocLink.getAttribute("href");
    expect(href).toMatch(/#token\./);

    expect(errors).toHaveLength(0);
  });

  test("①トークンリファレンス: アコーディオン開閉と排他挙動を検証", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const tokenSummary = page.locator(
      'details.token-stage__reference > summary:has-text("①トークンの全種別リファレンス")',
    );
    await tokenSummary.click();

    // 最初のカテゴリを開く
    const categories = page.locator(".token-stage__category");
    const firstCategoryButton = categories.first().locator(".token-stage__category-header");
    await firstCategoryButton.click();

    // 最初のカテゴリ内の項目リストが表示される
    const firstTokensList = categories.first().locator(".token-stage__tokens-list");
    await expect(firstTokensList).toBeVisible({ timeout: 5_000 });

    const tokenButtons = firstTokensList.locator(".token-stage__token-header");
    const itemCount = await tokenButtons.count();
    expect(itemCount).toBeGreaterThan(0);

    // 最初の項目を開く
    const firstButton = tokenButtons.first();
    await firstButton.click();
    const firstTokenContent = categories.first().locator(".token-stage__token-content").first();
    await expect(firstTokenContent).toBeVisible({ timeout: 5_000 });

    // 同じボタンをもう一度クリックで閉じる
    await firstButton.click();
    await expect(firstTokenContent).not.toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("②ASTリファレンス: summary開閉・精度注記・カテゴリ展開・技術情報ブロック・項目詳細を検証", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // AST リファレンスの summary が存在し、開く
    const astSummary = page.locator(
      'details.ast-stage__reference > summary:has-text("②構文木(AST)の全種別リファレンス")',
    );
    await expect(astSummary).toBeVisible({ timeout: 5_000 });
    await astSummary.click();

    // 精度注記が表示される
    const astAccuracyNotice = page.locator(".ast-stage__accuracy-notice");
    await expect(astAccuracyNotice).toBeVisible({ timeout: 5_000 });
    await expect(astAccuracyNotice).toContainText("誤りが含まれる可能性があります");
    await expect(astAccuracyNotice.locator("a")).toHaveAttribute(
      "href",
      "https://docs.python.org/3.12/library/ast.html",
    );

    // 技術情報ブロック（抽象グループ型の説明）が表示される
    const abstractNotice = page.locator(".ast-stage__abstract-notice");
    await expect(abstractNotice).toBeVisible({ timeout: 5_000 });
    await expect(abstractNotice).toContainText("グループ型");
    await expect(abstractNotice).toContainText("具象型");

    // カテゴリが 11 つ表示されていることを確認
    const categories = page.locator(".ast-stage__category");
    await expect(categories).toHaveCount(11, { timeout: 5_000 });

    // 最初のカテゴリを開く
    const firstCategoryButton = categories.first().locator(".ast-stage__category-header");
    await firstCategoryButton.click();

    // カテゴリ内のノード項目リストが表示される
    const firstNodesList = categories.first().locator(".ast-stage__nodes-list");
    await expect(firstNodesList).toBeVisible({ timeout: 5_000 });

    // 最初のノード項目を開く
    const firstNodeButton = firstNodesList.locator(".ast-stage__node-header").first();
    await firstNodeButton.click();

    // 詳細セクションが表示される
    const nodeDetail = firstNodesList.locator(".ast-stage__node-detail").first();
    await expect(nodeDetail).toBeVisible({ timeout: 5_000 });
    await expect(nodeDetail.locator("h5")).toContainText("詳細");
    await expect(nodeDetail.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 初学者向けセクションが表示される
    const nodeEasy = firstNodesList.locator(".ast-stage__node-easy").first();
    await expect(nodeEasy).toBeVisible({ timeout: 5_000 });
    await expect(nodeEasy.locator("h5")).toContainText("初学者向け");
    await expect(nodeEasy.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 公式ドキュメントリンクが表示され、#ast. で含まれる
    const nodeDocLink = firstNodesList.locator(".ast-stage__doc-link").first();
    await expect(nodeDocLink).toBeVisible({ timeout: 5_000 });
    const href = await nodeDocLink.getAttribute("href");
    expect(href).toMatch(/#ast\./);

    expect(errors).toHaveLength(0);
  });

  test("②ASTリファレンス: アコーディオン開閉と排他挙動を検証", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const astSummary = page.locator(
      'details.ast-stage__reference > summary:has-text("②構文木(AST)の全種別リファレンス")',
    );
    await astSummary.click();

    // 最初のカテゴリを開く
    const categories = page.locator(".ast-stage__category");
    const firstCategoryButton = categories.first().locator(".ast-stage__category-header");
    await firstCategoryButton.click();

    // 最初のカテゴリ内のノード項目リストが表示される
    const firstNodesList = categories.first().locator(".ast-stage__nodes-list");
    await expect(firstNodesList).toBeVisible({ timeout: 5_000 });

    const nodeButtons = firstNodesList.locator(".ast-stage__node-header");
    const count = await nodeButtons.count();
    expect(count).toBeGreaterThan(0);

    // 最初のノード項目を開く
    const firstButton = nodeButtons.first();
    await firstButton.click();
    const firstNodeContent = categories.first().locator(".ast-stage__node-content").first();
    await expect(firstNodeContent).toBeVisible({ timeout: 5_000 });

    // 同じボタンをもう一度クリックで閉じる
    await firstButton.click();
    await expect(firstNodeContent).not.toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("③バイトコードリファレンス: summary開閉・精度注記・出現しない命令カテゴリ注記・項目詳細を検証", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // バイトコードリファレンスの summary が存在し、開く
    const bytecodeSummary = page.locator(
      'details.bytecode-stage__reference > summary:has-text("③バイトコードの全種別リファレンス")',
    );
    await expect(bytecodeSummary).toBeVisible({ timeout: 5_000 });
    await bytecodeSummary.click();

    // 精度注記が表示される
    const bytecodeAccuracyNotice = page.locator(".bytecode-stage__accuracy-notice");
    await expect(bytecodeAccuracyNotice).toBeVisible({ timeout: 5_000 });
    await expect(bytecodeAccuracyNotice).toContainText("誤りが含まれる可能性があります");
    await expect(bytecodeAccuracyNotice.locator("a")).toHaveAttribute(
      "href",
      "https://docs.python.org/3.12/library/dis.html",
    );

    // 出現しない命令カテゴリの注記が表示される（CACHE、INSTRUMENTED_*等）
    await expect(bytecodeAccuracyNotice).toContainText("CACHE");
    await expect(bytecodeAccuracyNotice).toContainText("INSTRUMENTED");

    // カテゴリが 8 つ表示されていることを確認
    const categories = page.locator(".bytecode-stage__category");
    await expect(categories).toHaveCount(8, { timeout: 5_000 });

    // 最初のカテゴリを開く
    const firstCategoryButton = categories.first().locator(".bytecode-stage__category-header");
    await firstCategoryButton.click();

    // カテゴリ内のオペコード項目リストが表示される
    const firstOpcodesList = categories.first().locator(".bytecode-stage__opcodes-list");
    await expect(firstOpcodesList).toBeVisible({ timeout: 5_000 });

    // 最初のオペコード項目を開く
    const firstOpcodeButton = firstOpcodesList.locator(".bytecode-stage__opcode-header").first();
    await firstOpcodeButton.click();

    // 詳細セクションが表示される
    const opcodeDetail = firstOpcodesList.locator(".bytecode-stage__opcode-detail").first();
    await expect(opcodeDetail).toBeVisible({ timeout: 5_000 });
    await expect(opcodeDetail.locator("h5")).toContainText("詳細");
    await expect(opcodeDetail.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 初学者向けセクションが表示される
    const opcodeEasy = firstOpcodesList.locator(".bytecode-stage__opcode-easy").first();
    await expect(opcodeEasy).toBeVisible({ timeout: 5_000 });
    await expect(opcodeEasy.locator("h5")).toContainText("初学者向け");
    await expect(opcodeEasy.locator("p")).not.toHaveText("", { ignoreCase: true });

    // 公式ドキュメントリンクが表示され、#opcode- で含まれる
    const opcodeDocLink = firstOpcodesList.locator(".bytecode-stage__doc-link").first();
    await expect(opcodeDocLink).toBeVisible({ timeout: 5_000 });
    const href = await opcodeDocLink.getAttribute("href");
    expect(href).toMatch(/#opcode-/);

    expect(errors).toHaveLength(0);
  });

  test("③バイトコードリファレンス: アコーディオン開閉と排他挙動を検証", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const bytecodeSummary = page.locator(
      'details.bytecode-stage__reference > summary:has-text("③バイトコードの全種別リファレンス")',
    );
    await bytecodeSummary.click();

    // 最初のカテゴリを開く
    const categories = page.locator(".bytecode-stage__category");
    const firstCategoryButton = categories.first().locator(".bytecode-stage__category-header");
    await firstCategoryButton.click();

    // 最初のカテゴリ内のオペコード項目リストが表示される
    const firstOpcodesList = categories.first().locator(".bytecode-stage__opcodes-list");
    await expect(firstOpcodesList).toBeVisible({ timeout: 5_000 });

    const opcodeButtons = firstOpcodesList.locator(".bytecode-stage__opcode-header");
    const count = await opcodeButtons.count();
    expect(count).toBeGreaterThan(0);

    // 最初のオペコード項目を開く
    const firstButton = opcodeButtons.first();
    await firstButton.click();
    const firstOpcodeContent = categories
      .first()
      .locator(".bytecode-stage__opcode-content")
      .first();
    await expect(firstOpcodeContent).toBeVisible({ timeout: 5_000 });

    // 同じボタンをもう一度クリックで閉じる
    await firstButton.click();
    await expect(firstOpcodeContent).not.toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test("全3パネル: details の開閉が独立していることを検証", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const tokenSummary = page.locator(
      'details.token-stage__reference > summary:has-text("①トークンの全種別リファレンス")',
    );
    const astSummary = page.locator(
      'details.ast-stage__reference > summary:has-text("②構文木(AST)の全種別リファレンス")',
    );
    const bytecodeSummary = page.locator(
      'details.bytecode-stage__reference > summary:has-text("③バイトコードの全種別リファレンス")',
    );

    // 全パネルが存在することを確認
    await expect(tokenSummary).toBeVisible({ timeout: 5_000 });
    await expect(astSummary).toBeVisible({ timeout: 5_000 });
    await expect(bytecodeSummary).toBeVisible({ timeout: 5_000 });

    // トークンパネルを開く
    await tokenSummary.click();
    await expect(page.locator(".token-stage__accuracy-notice")).toBeVisible({ timeout: 5_000 });

    // AST パネルを開く
    await astSummary.click();
    await expect(page.locator(".ast-stage__accuracy-notice")).toBeVisible({ timeout: 5_000 });

    // バイトコードパネルを開く
    await bytecodeSummary.click();
    await expect(page.locator(".bytecode-stage__accuracy-notice")).toBeVisible({
      timeout: 5_000,
    });

    // 全パネルが開いた状態であることを確認
    await expect(page.locator(".token-stage__reference-content")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator(".ast-stage__reference-content")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator(".bytecode-stage__reference-content")).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });
});
