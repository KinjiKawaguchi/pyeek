import { defineConfig, devices } from "@playwright/test";

/**
 * E2E スモークテスト用の Playwright 設定。
 * 開発用サーバー（pnpm dev）を起動した上で実行する。
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // GitHub Actions の ubuntu-latest は標準2 vCPU。Playwright自身の既定値
  // （論理コア数の半分）に合わせて2に設定する（1ワーカーあたりChromiumを
  // 1つ丸ごと起動するため、vCPU数を超えて増やしても頭打ちになりやすい）。
  workers: process.env.CI ? 2 : undefined,
  // CI ではシャーディング（--shard）で複数ジョブに分けて実行するため、
  // 各shardの結果を後段のmerge-reportsジョブで1つのHTMLに統合できる
  // blob形式で出力する。ローカルではそのまま閲覧できるhtmlのままにする。
  reporter: process.env.CI ? "blob" : "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
