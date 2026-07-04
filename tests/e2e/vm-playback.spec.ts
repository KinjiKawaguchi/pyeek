import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

test.describe("スタックマシンVMの再生 E2E", () => {
  test("直線コードのステップ実行: プリセット(n=4)で前進・後退・リセット", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // プリセット「n = 4\ntotal = 2 + 3 * n」を選択
    // ボタンテキストは「n = 4 …」（複数行なので省略記号付き）
    await page
      .locator("button.preset", { hasText: /^n = 4/ })
      .first()
      .click();

    // エディタに値が入力されたことを確認
    const editor = page.locator("textarea");
    await expect(editor).toHaveValue(/n = 4/);

    // VM ステージが再生可能状態に。プログレス表示が「1 / X」で始まることを確認
    // （-1 → 0 への遷移なので最初の状態は「0 / X」）
    await expect(page.locator(".player-controls__progress")).toContainText(/\d+ \/ \d+/);

    // 「1つ進む ▶」を3回クリック
    const stepForwardBtn = page.locator("button:has-text('1つ進む ▶')");
    for (let i = 0; i < 3; i++) {
      await stepForwardBtn.click();
      // ステップカウンタが進む（1/X, 2/X, 3/X）
      await expect(page.locator(".player-controls__progress")).toContainText(
        new RegExp(`${i + 1} \\/ \\d+`),
      );
    }

    // スタック表示に値が積まれていることを確認
    // (.stack-view__plate で値の積み重ねを検証)
    const stackPlates = page.locator(".stack-view__plate");
    const plateCount = await stackPlates.count();
    expect(plateCount).toBeGreaterThan(0);

    // 「◀ 1つ戻る」を1回クリック
    const stepBackBtn = page.locator("button:has-text('◀ 1つ戻る')");
    await stepBackBtn.click();
    // ステップカウンタが1つ減る
    await expect(page.locator(".player-controls__progress")).toContainText(/2 \/ \d+/);

    // 「⏮ 最初へ」をクリック
    const rewindBtn = page.locator("button:has-text('⏮ 最初へ')");
    await rewindBtn.click();
    // ステップカウンタがリセット（0 の行まで戻る、プログレス表示で確認）
    // リセット直後はボタンが disabled になる可能性もあるので、状態を確認
    await expect(rewindBtn).toBeDisabled();

    expect(errors).toHaveLength(0);
  });

  test("forループの完走: 「▶ 再生」で複数ステップまで再生される", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // プリセット「for i in range(3):\n    print(i)」を選択
    // ボタンテキストは「for i in range(3): …」
    await page
      .locator("button.preset", { hasText: /^for i in range\(3\)/ })
      .first()
      .click();

    // VM ステージが表示されたことを確認
    await expect(page.locator(".vm-stage__current")).toBeVisible({ timeout: 5_000 });

    // 「▶ 再生」ボタンを押す
    const playBtn = page.locator("button.player-controls__btn--main");
    await playBtn.click();

    // 再生中のプログレスが進むことを確認
    // PLAY_INTERVAL_MS = 900ms なので、2〜3秒待つと複数ステップ進む
    // 最初は「0 / N」から始まり、「2 / N」以上に進む
    await expect(page.locator(".player-controls__progress")).toContainText(/^[2-9]\d* \/ \d+$/, {
      timeout: 15_000,
    });

    // 再生中は複数のステップが実行されたことを確認（最低2ステップ以上進んでいる）
    const finalProgress = await page.locator(".player-controls__progress").textContent();
    const progressMatch = finalProgress?.match(/(\d+) \/ (\d+)/);
    expect(progressMatch).toBeTruthy();
    if (progressMatch) {
      const [, currentStr, totalStr] = progressMatch;
      const current = parseInt(currentStr ?? "0", 10);
      const total = parseInt(totalStr ?? "0", 10);
      // 再生が開始されたことを確認（最低2ステップ進んでいる）
      expect(current).toBeGreaterThanOrEqual(2);
      expect(total).toBeGreaterThan(0);
    }

    expect(errors).toHaveLength(0);
  });

  test("whileループの完走: 「▶ 再生」で複数ステップ再生される", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // プリセット「i = 0\nwhile i < 3:\n    i = i + 1」を選択
    // ボタンテキストは「i = 0 …」
    await page
      .locator("button.preset", { hasText: /^i = 0/ })
      .first()
      .click();

    // VM ステージが表示されたことを確認
    await expect(page.locator(".vm-stage__current")).toBeVisible({ timeout: 5_000 });

    // 「▶ 再生」ボタンを押す
    const playBtn = page.locator("button.player-controls__btn--main");
    await playBtn.click();

    // 再生が開始され、ステップカウンタが進行することを確認
    // whileループは約34ステップなので、十分な時間待つ
    await expect(page.locator(".player-controls__progress")).toContainText(/^[2-9]\d* \/ \d+$/, {
      timeout: 15_000,
    });

    expect(errors).toHaveLength(0);
  });

  test("不透明な分岐の正直な拒否: walrus(if x := len(data))で再生メッセージ表示", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // プリセット「if x := len(data):\n    print(x)」を選択
    // ボタンテキストは「if x := len(data): …」
    await page
      .locator("button.preset", { hasText: /^if x := len\(data\)/ })
      .first()
      .click();

    // VM ステージに拒否メッセージが表示されることを確認
    const guardMessage = page.locator(".vm-stage__guard");
    await expect(guardMessage).toBeVisible();

    // メッセージに「分岐条件の値がこの場では具体的に決まらない」が含まれることを確認
    // （実装の GUARD_MESSAGES["opaque-branch"] の文言）
    await expect(guardMessage).toContainText(/分岐条件の値がこの場では具体的に決まらない/);

    // 「▶ 再生」ボタンが disabled またはそもそも表示されていないこと
    // （isPlaying や onTogglePlay の実装で判定）
    const playBtn = page.locator("button.player-controls__btn--main");
    // ボタン自体が disabled になっているはずだが、念のため試す
    if (await playBtn.isVisible()) {
      await expect(playBtn).toBeDisabled();
    }

    expect(errors).toHaveLength(0);
  });

  test("再生ボタンの位置が固定されている回帰テスト: ステップが進んでも①トークン列カードの高さが変わらない", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    await page
      .locator("button.preset", { hasText: /^for i in range/ })
      .first()
      .click();
    await expect(page.locator(".vm-stage__current")).toBeVisible({ timeout: 5_000 });
    // プリセット切り替え後、①トークン列は新しいソース（2行分）の再解析
    // （デバウンス）が終わるまで行数が少ないまま。この一過性の変化を
    // 「レイアウトのずれ」と誤検知しないよう、新ソースのトークンが
    // 実際に描画されるまで待ってから計測を始める。
    await expect(page.locator(".tok__val", { hasText: "range" })).toBeVisible();

    // ④VMのステップ送りは selectedRange 経由で①トークン列のハイライトも
    // 動かす。①のカードがトークンの説明文の長さに応じて高さを変えると、
    // 下にある④の再生ボタンがステップごとに画面上で上下してしまう
    // （実際に報告されたUX不具合の回帰テスト）。
    const tokenSection = page.locator('section[aria-label="トークン列"]');
    const playBtn = page.locator("button.player-controls__btn--main");
    const stepForwardBtn = page.locator("button:has-text('1つ進む ▶')");
    const progress = page.locator(".player-controls__progress");

    // 1回目の click() は Playwright がボタンを画面内に自動スクロールする
    // ため、その分の座標変化を「レイアウトのずれ」と誤検知しないよう、
    // スクロールが落ち着いた後の状態をベースラインにする。
    // また、ステップ送り直後の描画完了を待つため、progress 表示
    // （毎ステップ必ず更新される）が期待値になるまで待ってから計測する
    // （最初の命令 RESUME はソース範囲を持たずトークンが選択されない
    // ステップなので、それを目印にはできない）。
    await stepForwardBtn.click();
    await expect(progress).toContainText(/^1 \//);
    const baselineHeight = (await tokenSection.boundingBox())?.height;
    const baselineBtnY = (await playBtn.boundingBox())?.y;

    for (let i = 0; i < 8; i++) {
      await stepForwardBtn.click();
      await expect(progress).toContainText(new RegExp(`^${i + 2} \\/`));
      const height = (await tokenSection.boundingBox())?.height;
      const btnY = (await playBtn.boundingBox())?.y;
      expect(height).toBe(baselineHeight);
      expect(btnY).toBe(baselineBtnY);
    }

    expect(errors).toHaveLength(0);
  });

  test("無限ループの打ち切りバナー: while True:で256ステップ打ち切り", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // エディタに「while True:\n    pass」を入力
    const infiniteCode = "while True:\n    pass";
    await fillEditor(page, infiniteCode);

    // 再解析完了を待つ。VM ステージに打ち切りバナーが表示されるのを確認
    const truncatedBanner = page.locator(".vm-stage__truncated-banner");
    await expect(truncatedBanner).toBeVisible({ timeout: 10_000 });

    // メッセージに「256ステップで打ち切り」の文言が含まれることを確認
    await expect(truncatedBanner).toContainText(/256/);

    expect(errors).toHaveLength(0);
  });
});
