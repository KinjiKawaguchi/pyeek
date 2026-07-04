import { expect, test } from "@playwright/test";
import { collectPageErrors, gotoAndWaitForPyodide } from "./helpers";

test.describe("Pyeek E2E スモークテスト", () => {
  test("トップページが読み込まれ、全ステージが描画されること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 4 つのステージ（Token, AST, Bytecode, VM）が描画されていることを確認。
    // ステージ本文には同じ語（トークン列など）が注記等にも現れるため、
    // section の aria-label で一意に特定する。
    await expect(page.locator('section[aria-label="トークン列"]')).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator('section[aria-label="構文木"]')).toBeVisible({ timeout: 5_000 });
    await expect(page.locator('section[aria-label="バイトコード"]')).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator('section[aria-label="スタックマシン"]')).toBeVisible({
      timeout: 5_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("エディタが操作可能であること", async ({ page }) => {
    await gotoAndWaitForPyodide(page);

    // エディタのテキストボックスを見つけて入力できることを確認
    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();
    await editor.fill("x = 42");
    await expect(editor).toHaveValue("x = 42");
  });
});
