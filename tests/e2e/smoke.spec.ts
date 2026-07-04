import { expect, test } from "@playwright/test";

test.describe("Pyeek E2E スモークテスト", () => {
  test("トップページが読み込まれ、全ステージが描画されること", async ({ page }) => {
    // ページ読み込み・Pyodide初期化中のエラーも拾うため、goto() より前に登録する。
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(String(err));
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // Python バージョンバッジが表示されることを確認
    // Pyodide の初回ロードには数秒かかるため、長めのタイムアウトを設定
    await expect(page.locator("text=/^Python \\d+\\.\\d+\\.\\d+$/")).toBeVisible({
      timeout: 15_000,
    });

    // 4 つのステージ（Token, AST, Bytecode, VM）が描画されていることを確認
    // 各ステージは通常、セクション要素またはタイトル要素で識別される
    await expect(page.locator("text=トークン列")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator("text=構文木")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator("text=バイトコード")).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator("text=スタックマシン")).toBeVisible({ timeout: 5_000 });

    expect(consoleErrors).toHaveLength(0);
  });

  test("エディタが操作可能であること", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Python バージョンバッジが表示されるまで待機
    await expect(page.locator("text=/^Python \\d+\\.\\d+\\.\\d+$/")).toBeVisible({
      timeout: 15_000,
    });

    // エディタのテキストボックスを見つけて入力できることを確認
    const editor = page.locator("textarea");
    await expect(editor).toBeVisible();
    await editor.fill("x = 42");
    await expect(editor).toHaveValue("x = 42");
  });
});
