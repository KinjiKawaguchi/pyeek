import { expect, type Page } from "@playwright/test";

/**
 * ページを開き、Pyodide の初期化完了（Python バージョンバッジの表示）まで待つ。
 * 各テストの冒頭で呼ぶ共通セットアップ。
 */
export async function gotoAndWaitForPyodide(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("text=/^Python \\d+\\.\\d+\\.\\d+$/")).toBeVisible({
    timeout: 30_000,
  });
}

/**
 * コンソールエラー・ページエラーの収集を開始する。
 * page.goto() より前に呼ぶこと（初期化中のエラーも拾うため）。
 * 戻り値の配列は同一参照のまま随時追記されるので、テスト末尾で中身を検証する。
 */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    errors.push(String(err));
  });
  return errors;
}

/**
 * エディタにコードを入力し、デバウンス(300ms)後の再解析完了を待つための
 * 入力ヘルパー。解析完了自体は呼び出し側が期待する画面変化で待つこと。
 */
export async function fillEditor(page: Page, source: string): Promise<void> {
  const editor = page.locator("textarea");
  await expect(editor).toBeVisible();
  await editor.fill(source);
}
