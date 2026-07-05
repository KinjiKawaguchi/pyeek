import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

test.describe("エディタ・プリセット・エラー表示", () => {
  // シナリオ1: エディタ入力→再解析
  test("エディタに入力するとトークン列が更新されること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 最初の入力: "a = 1"
    await fillEditor(page, "a = 1");

    // トークンチップに "a" が表示されることを確認
    // (デバウンス+解析時間で数秒かかる可能性)
    // トークン列セクション内の .tok__val スパンで値を直接確認
    await expect(
      page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "a" }),
    ).toBeVisible({ timeout: 10_000 });

    // 複数行に拡張: "a = 1\nb = 2"
    await fillEditor(page, "a = 1\nb = 2");

    // "b" のトークンチップが表示されることを確認
    await expect(
      page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "b" }),
    ).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  // シナリオ2: プリセット切り替え
  test("プリセットボタンをクリックするとエディタとステージが更新されること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 1つ目のプリセット（デフォルト "print("こんにちは!")" ）が既に入っているはず
    const editor = page.locator("textarea");
    const currentValue = await editor.inputValue();
    expect(currentValue).toBe('print("こんにちは!")');

    // プリセットボタンを取得（複数存在するはず）
    const presetButtons = page.locator("button.preset");
    const count = await presetButtons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // 2番目のプリセット「print()」をクリック
    await presetButtons.nth(1).click();

    // エディタの値が変わることを確認
    await expect(editor).toHaveValue("print()", { timeout: 5_000 });

    // トークン列が更新されたことを確認（トークンチップが表示される）
    await expect(
      page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "print" }),
    ).toBeVisible({ timeout: 10_000 });

    // 3番目のプリセット「x = 3 + 4 * 2」をクリック
    if (count >= 3) {
      await presetButtons.nth(2).click();

      // エディタの値が変わることを確認
      await expect(editor).toHaveValue("x = 3 + 4 * 2", { timeout: 5_000 });

      // "x" のトークンが表示されることを確認
      await expect(
        page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "x" }),
      ).toBeVisible({ timeout: 10_000 });
    }

    expect(errors).toHaveLength(0);
  });

  // シナリオ3: 壊れた入力のエラーバナー
  test("未完成のコードを入力するとエラーバナーが表示され、修正するとバナーが消えること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 未完成のコード（閉じていない文字列）
    await fillEditor(page, 'x = "abc');

    // エラーバナーが表示されることを確認
    await expect(page.locator(".errors-banner")).toBeVisible({ timeout: 10_000 });

    // アプリがクラッシュしていないことを確認（ページエラーゼロ）
    // エディタがまだ操作可能であることを確認
    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();

    // 正しいコードに修正
    await fillEditor(page, 'x = "abc"');

    // エラーバナーが消えることを確認（要素が非表示または存在しない）
    await expect(page.locator(".errors-banner")).not.toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  // シナリオ5: Tab/Shift+Tab/Enterでのインデント操作
  test("Tabでインデント挿入、Shift+Tabで解除、Enterでインデントが継続・追加されること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const editor = page.locator("textarea");
    await editor.click();
    await editor.fill("");

    // "if True:" と入力して Enter → ':' で終わる行の後は1段深くインデントされる
    await page.keyboard.type("if True:");
    await page.keyboard.press("Enter");
    await page.keyboard.type("x = 1");
    await expect(editor).toHaveValue("if True:\n    x = 1");

    // Enter → 前の行のインデントがそのまま引き継がれる（':'で終わらない）
    await page.keyboard.press("Enter");
    await page.keyboard.type("y = 2");
    await expect(editor).toHaveValue("if True:\n    x = 1\n    y = 2");

    // 行頭で Tab → 4スペース挿入
    await editor.fill("z = 3");
    await page.keyboard.press("Home");
    await page.keyboard.press("Tab");
    await expect(editor).toHaveValue("    z = 3");

    // 行頭で Shift+Tab → 4スペース解除
    await page.keyboard.press("Home");
    await page.keyboard.press("Shift+Tab");
    await expect(editor).toHaveValue("z = 3");

    expect(errors).toHaveLength(0);
  });

  // シナリオ4: 空入力
  test("エディタを空にしてもアプリがクラッシュしないこと", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 複数行のコードを入力
    await fillEditor(page, "a = 1\nb = 2\nc = 3");

    // トークンが複数表示されたことを確認
    await expect(
      page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "a" }),
    ).toBeVisible({ timeout: 10_000 });

    // 空にする
    await fillEditor(page, "");

    // エディタが操作可能なまま存在する（クラッシュしていない）
    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();
    await expect(editor).toHaveValue("");

    // AST セクションが存在し、レイアウト可能なまま（Module ノードが表示される）
    await expect(page.locator('[aria-label="構文木"]')).toBeVisible();

    // アプリがクラッシュしていないことを確認
    expect(errors).toHaveLength(0);
  });
});
