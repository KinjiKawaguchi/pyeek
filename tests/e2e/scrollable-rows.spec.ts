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

  test("他ステージのクリックで隠れているトークンが選択されると、ストリームが自動で横スクロールして見えるようになること", async ({
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

    // ストリームを右端まであらかじめスクロールしておき、行頭付近の
    // トークンが見えていない状態を意図的に作る。
    const stream = page.locator('[aria-label="トークン列"] .token-stage__stream');
    await stream.evaluate((el) => {
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
    // sticky な行ラベルが左端を覆っているため、その幅を左境界として使う
    // (実装のscrollIntoViewHorizontallyと同じ基準)。ラベルの
    // getBoundingClientRect().right ではなく width を使うのは、対象の行
    // 自体が現在のスクロール位置より狭く画面外にある間は sticky 要素が
    // 自分の行の箱の外に固定されず right の値が崩れるため(幅はスクロール
    // 位置に関わらず一定なので安全)。許容誤差はpadding等による数px程度の
    // ズレを吸収するためのもの。
    await expect
      .poll(
        () =>
          activeChip.evaluate((el) => {
            const container = el.closest(".token-stage__stream");
            if (!container) return false;
            const label = el.closest(".token-stage__row")?.querySelector(".token-stage__row-label");
            const containerRect = container.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const visibleLeft = containerRect.left + (label?.getBoundingClientRect().width ?? 0);
            const tolerance = 5;
            return (
              elRect.left >= visibleLeft - tolerance &&
              elRect.right <= containerRect.right + tolerance
            );
          }),
        { timeout: 5000 },
      )
      .toBe(true);

    expect(errors).toHaveLength(0);
  });
});
