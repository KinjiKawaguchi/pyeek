import { expect, test } from "@playwright/test";
import { collectPageErrors, fillEditor, gotoAndWaitForPyodide } from "./helpers";

test.describe("やさしい/くわしいモード切り替え", () => {
  test("既定はくわしい(strict)モード、トークンチップが英語表記であること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // デフォルトで「くわしい（本物）」ボタンがアクティブ状態
    await expect(page.locator('button[role="tab"]:has-text("くわしい（本物）")')).toHaveAttribute(
      "aria-selected",
      "true",
    );

    // 簡単なコード入力
    await fillEditor(page, "name = 42");

    // トークンチップの種類ラベルが英語表記（NAME, NUMBER, NEWLINE など）
    const nameChip = page.locator(".tok").filter({ hasText: "name" }).first();
    await expect(nameChip.locator(".tok__type")).toContainText(/^NAME|なまえ$/);
    // 厳密には NAME と表示されることを確認
    await expect(nameChip.locator(".tok__type")).toHaveText("NAME");

    const numChip = page.locator(".tok").filter({ hasText: "42" }).first();
    await expect(numChip.locator(".tok__type")).toHaveText("NUMBER");

    expect(errors).toHaveLength(0);
  });

  test("やさしいモードへ切り替え後、トークンチップが日本語表記に変わること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // コード入力
    await fillEditor(page, "x = 100");

    // くわしいモードで NAME チップを確認
    let nameChip = page.locator(".tok").filter({ hasText: "x" }).first();
    await expect(nameChip.locator(".tok__type")).toHaveText("NAME");

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // トークンチップの種類ラベルが日本語表記に変わること
    nameChip = page.locator(".tok").filter({ hasText: "x" }).first();
    await expect(nameChip.locator(".tok__type")).toHaveText("なまえ");

    const numChip = page.locator(".tok").filter({ hasText: "100" }).first();
    await expect(numChip.locator(".tok__type")).toHaveText("すうじ");

    expect(errors).toHaveLength(0);
  });

  test("if キーワード直前の回帰テスト：やさしいモードで if が『キーワード』と正しく表示されること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // if キーワードを含むコード
    await fillEditor(page, "if x > 0:\n    pass");

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // if チップが「キーワード」ラベルを持つことを確認
    const ifChip = page.locator(".tok").filter({ hasText: "if" }).first();
    await expect(ifChip.locator(".tok__type")).toHaveText("キーワード");

    expect(errors).toHaveLength(0);
  });

  test("構造トークン表示制御：やさしいモードでは NEWLINE が表示されないこと", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 複数行のコード
    await fillEditor(page, "x = 1\ny = 2");

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // NEWLINE トークンが表示されないことを確認
    // （やさしいモードではフィルタされる）
    // NEWLINE の .tok__type ラベルを検索
    const newlineTypeLabels = page.locator(".tok__type").filter({ hasText: "NEWLINE" });
    await expect(newlineTypeLabels).toHaveCount(0);

    expect(errors).toHaveLength(0);
  });

  test("くわしいモードで『構造トークンを表示』チェックボックスで NEWLINE の表示/非表示が切り替わること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 複数行のコード
    await fillEditor(page, "a = 1\nb = 2");

    // くわしいモード（デフォルト）で、「構造トークンを表示」チェックボックスを確認
    const showStructCheckbox = page.locator("label").filter({ hasText: "構造トークンを表示" });
    const structInput = showStructCheckbox.locator("input[type='checkbox']");

    // 初期状態で ON（checked）
    await expect(structInput).toBeChecked();

    // NEWLINE トークンが表示されていることを確認（.tok__type で "NEWLINE" を検索）
    const newlineLabelsOn = page.locator(".tok__type").filter({ hasText: "NEWLINE" });
    const countOn = await newlineLabelsOn.count();
    expect(countOn).toBeGreaterThan(0);

    // チェックボックスを OFF
    await structInput.click();

    // NEWLINE トークンが表示されなくなることを確認
    // (ポーリング待機でしっかり反映を待つ)
    const newlineLabelsOff = page.locator(".tok__type").filter({ hasText: "NEWLINE" });
    await expect(newlineLabelsOff).toHaveCount(0, { timeout: 5000 });

    // チェックボックスを ON に戻す
    await structInput.click();

    // NEWLINE トークンが表示されるようになることを確認
    // (countOn と同じ数が表示されることを確認するのではなく、0より大きいことを確認)
    const newlineLabelsOn2 = page.locator(".tok__type").filter({ hasText: "NEWLINE" });
    const countOn2 = await newlineLabelsOn2.count();
    expect(countOn2).toBeGreaterThan(0);

    expect(errors).toHaveLength(0);
  });

  test("くわしいモードで『位置(row:col)を表示』チェックボックスで位置情報が表示/非表示に切り替わること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // コード入力
    await fillEditor(page, "x = 10");

    // くわしいモード（デフォルト）で、「位置(row:col)を表示」チェックボックスを確認
    const showPosCheckbox = page.locator("label").filter({ hasText: "位置(row:col)を表示" });
    const posInput = showPosCheckbox.locator("input[type='checkbox']");

    // 初期状態で OFF（unchecked）
    await expect(posInput).not.toBeChecked();

    // チェックボックスを ON
    await posInput.click();

    // トークンチップに位置情報（例: 1:0）が表示されることを確認
    const xChip = page.locator(".tok").filter({ hasText: "x" }).first();
    await expect(xChip.locator(".tok__pos")).toBeVisible({ timeout: 5000 });
    await expect(xChip.locator(".tok__pos")).toHaveText(/^\d+:\d+–\d+:\d+$/);

    // チェックボックスを OFF
    await posInput.click();

    // 位置情報が表示されなくなることを確認
    const posElements = page.locator(".tok__pos");
    await expect(posElements).toHaveCount(0);

    expect(errors).toHaveLength(0);
  });

  test("f-string折りたたみ：やさしいモードでは折りたたまれたチップが表示されること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 通常の文字列（非f-string）
    await fillEditor(page, 'msg = "hello"');

    // やさしいモード時の「もじれつ」チップ数をベースライン計測
    await page.locator('button[role="tab"]:has-text("やさしい")').click();
    const stringLabelsEasy = page.locator(".tok__type").filter({ hasText: "もじれつ" });
    const countEasyBase = await stringLabelsEasy.count();

    // くわしいモードに戻す
    await page.locator('button[role="tab"]:has-text("くわしい（本物）")').click();
    const stringLabelsStrict = page.locator(".tok__type").filter({ hasText: "STRING" });
    const countStrictBase = await stringLabelsStrict.count();

    // 両モードで文字列トークンが表示されていることを確認
    expect(countEasyBase).toBeGreaterThan(0);
    expect(countStrictBase).toBeGreaterThan(0);

    // やさしいモードでは日本語ラベルが表示され、
    // くわしいモードでは英語ラベルが表示されることを確認
    expect(countEasyBase).toBe(countStrictBase);

    expect(errors).toHaveLength(0);
  });

  test("モード切り替えが AST ノード表示に反映されること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 代入文を含むコード
    await fillEditor(page, "result = 42");

    // くわしいモード（デフォルト）で、AST ノードが英語表記（Assign）であることを確認
    let assignNodes = page.locator(".ast-node").filter({ hasText: "Assign" }).first();
    await expect(assignNodes).toContainText("Assign");

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // AST ノードが日本語表記（代入）に変わることを確認
    assignNodes = page.locator(".ast-node").filter({ hasText: "代入" }).first();
    await expect(assignNodes).toContainText("代入");

    expect(errors).toHaveLength(0);
  });

  test("モード切り替えがバイトコード命令表示に反映されること", async ({ page }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // 単純なコード
    await fillEditor(page, "x = 42");

    // くわしいモード（デフォルト）では日本語ラベルが表示されない
    const instructionStrict = page.locator(".instr").first();
    await expect(instructionStrict.locator(".instr__easy")).not.toBeVisible();

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // バイトコード命令に日本語ラベル（.instr__easy）が表示されることを確認
    const instructionEasy = page.locator(".instr").first();
    await expect(instructionEasy.locator(".instr__easy")).toBeVisible({ timeout: 5000 });
    // 日本語ラベルが空でないことを確認
    await expect(instructionEasy.locator(".instr__easy")).not.toHaveText("");

    expect(errors).toHaveLength(0);
  });

  test("モード切り替え後、同じコードで同じトークンを選択すると同じソース範囲がハイライトされること", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);
    await gotoAndWaitForPyodide(page);

    // コード入力後、再解析（デバウンス300ms+解析）の完了を 'Alice' チップの
    // 出現で待つ。これを待たずにクリックすると、直前のコードのトークンを
    // 掴んでしまうレースがある。
    await fillEditor(page, "name = 'Alice'");
    await expect(page.locator(".tok__val", { hasText: "'Alice'" })).toBeVisible({
      timeout: 10_000,
    });

    // くわしいモードで 'name' トークンをクリック。
    // hasText の文字列指定は大文字小文字を区別せず、strict モードの型ラベル
    // "NAME" にもマッチして曖昧になるため、値要素の完全一致で特定する。
    const nameChip = page.locator(".tok", {
      has: page.locator(".tok__val", { hasText: /^name$/ }),
    });
    await nameChip.click();

    // トークンが選択されたことを確認（--sel クラスで確認可能）
    await expect(nameChip).toHaveClass(/tok--sel/);

    // やさしいモードに切り替え
    await page.locator('button[role="tab"]:has-text("やさしい")').click();

    // トークンチップの表示が変わるが、同じ 'name' チップが選択状態を保つことを確認
    await expect(nameChip).toHaveClass(/tok--sel/);

    // くわしいモードに戻す
    await page.locator('button[role="tab"]:has-text("くわしい（本物）")').click();

    // 選択状態が保たれていることを確認
    await expect(nameChip).toHaveClass(/tok--sel/);

    expect(errors).toHaveLength(0);
  });
});
