import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

// 折り返し(wrap)だと長い行が縦に伸びてモバイルで縦スクロールがストレス
// フルになるため、①トークン列・③バイトコード列は行ごとの横スクロールに
// している。狭いビューポートでないと確実に折り返しの余地が発生しない
// ため mobile-chromium プロジェクト限定で実行する(playwright.config.ts)。
const LONG_LINE_SOURCE =
  'total = 0\nfor i in range(10):\n    total = total + i * 2\nprint(f"合計は {total} です")';

test.describe("トークン列・バイトコード列の横スクロール", () => {
  test("長い行のトークン列は折り返さず横スクロールになること", async ({ page, isMobile }) => {
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

    const row = page.locator(".token-stage__row-tokens").nth(1); // L2: for i in range(10):
    const overflow = await row.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflow).toBe(true);

    expect(errors).toHaveLength(0);
  });

  test("他ステージのクリックで隠れているトークンが選択されると、その行が自動で横スクロールして見えるようになること", async ({
    page,
    isMobile,
  }) => {
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

    // L2行を右端まであらかじめスクロールしておき、行頭付近のトークンが
    // 見えていない状態を意図的に作る。
    const row = page.locator(".token-stage__row-tokens").nth(1);
    await row.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });

    // AST側で "for" に対応するノードをクリックして selectedRange を更新する
    // (L2行頭のトークンなので、直前の右端スクロールで隠れているはず)。
    const forNode = page.locator(".ast-node").filter({ hasText: "For" }).first();
    await expect(forNode).toBeVisible({ timeout: 10_000 });
    await forNode.click();

    const activeChip = page.locator(".tok--sel, .tok--related").first();
    await expect(activeChip).toBeVisible({ timeout: 5000 });

    // toBeVisible は横スクロールによる見切れを考慮しないため(要素自体は
    // DOM上「表示状態」のまま)、自動スクロールの反映を expect.poll で待つ。
    // 許容誤差は行コンテナのpadding分(2px)による数px程度のズレを吸収する
    // ためのもので、厳密な0px境界ではなく「実質的に見えているか」を見る。
    await expect
      .poll(
        () =>
          activeChip.evaluate((el) => {
            const container = el.closest(".token-stage__row-tokens");
            if (!container) return false;
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const tolerance = 5;
            return (
              elRect.left >= containerRect.left - tolerance &&
              elRect.right <= containerRect.right + tolerance
            );
          }),
        { timeout: 5000 },
      )
      .toBe(true);

    expect(errors).toHaveLength(0);
  });
});
