import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

// 折り返し(wrap)だと長い行が縦に伸びてモバイルで縦スクロールがストレス
// フルになるため、①トークン列・③バイトコード列はストリーム全体を1つの
// 横スクロールにしている(ast-stage__canvasと同じ「1画面1スクロール」)。
// 狭いビューポートでないと確実に折り返しの余地が発生しないため
// mobile-chromium プロジェクト限定で実行する(playwright.config.ts)。
const LONG_LINE_SOURCE =
  'total = 0\nfor i in range(10):\n    total = total + i * 2\nprint(f"合計は {total} です")';

test.describe("トークン列・バイトコード列の横スクロール", () => {
  test("長い行を含むトークン列は折り返さず横スクロールになること", async ({ page, isMobile }) => {
    test.skip(!isMobile, "デスクトップの広い幅では意図的にオーバーフローさせられないため検証不可");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);
    await fillEditor(page, LONG_LINE_SOURCE);

    // 再解析(デバウンス含む)が完了し新しいコードのトークンに置き換わる
    // まで待つ。行の可視性だけでは直前(デフォルトプリセット)の行が
    // 既に表示済みのため待機にならない。
    await expect(
      page.locator('[aria-label="トークン列"] .tok__val').filter({ hasText: "range" }),
    ).toBeVisible({ timeout: 10_000 });

    const stream = page.locator('[aria-label="トークン列"] .token-stage__stream');
    const overflow = await stream.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(true);

    expect(errors).toHaveLength(0);
  });

  test("長い行を含むバイトコード列は折り返さず横スクロールになること", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "デスクトップの広い幅では意図的にオーバーフローさせられないため検証不可");
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);
    await fillEditor(page, LONG_LINE_SOURCE);

    await expect(
      page.locator('[aria-label="バイトコード"] .instr__opname').filter({ hasText: "LOAD_NAME" }),
    ).toBeVisible({ timeout: 10_000 });

    const stream = page.locator('[aria-label="バイトコード"] .bytecode-stage__stream');
    const overflow = await stream.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(true);

    expect(errors).toHaveLength(0);
  });
});
