import { expect, test } from "@playwright/test";
import { collectPageErrors, gotoAndWaitForPyodide } from "./helpers";

const KEYBAR = '[aria-label="コード入力補助キー"]';

test.describe("モバイル向けコードキーバー", () => {
  test("デスクトップでは表示されないこと", async ({ page, isMobile }) => {
    test.skip(isMobile, "デスクトップ専用の検証");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    await expect(page.locator(KEYBAR)).toBeHidden();
    expect(errors).toHaveLength(0);
  });

  test("モバイルでは表示されること", async ({ page, isMobile }) => {
    test.skip(!isMobile, "モバイル専用の検証");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    await expect(page.locator(KEYBAR)).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("記号キーをタップするとカーソル位置に挿入され、フォーカスが維持されること", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "モバイル専用の検証");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const editor = page.locator("textarea");
    await editor.tap();
    await editor.fill("print()");
    await editor.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(6, 6));

    await page.locator(KEYBAR).getByRole("button", { name: ":", exact: true }).tap();

    await expect(editor).toHaveValue("print(:)");
    const [activeId, selectionStart] = await editor.evaluate((el: HTMLTextAreaElement) => [
      document.activeElement?.id,
      el.selectionStart,
    ]);
    expect(activeId).toBe("pyeek-editor");
    expect(selectionStart).toBe(7);

    expect(errors).toHaveLength(0);
  });

  test("Tabキーをタップすると行頭にインデントが挿入されること", async ({ page, isMobile }) => {
    test.skip(!isMobile, "モバイル専用の検証");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    const editor = page.locator("textarea");
    await editor.tap();
    await editor.fill("x = 1");
    await editor.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(0, 0));

    await page.locator(KEYBAR).getByRole("button", { name: "⇥" }).tap();

    await expect(editor).toHaveValue("    x = 1");
    expect(errors).toHaveLength(0);
  });
});
