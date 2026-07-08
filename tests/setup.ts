import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest.config.ts で globals: true にしていないため、RTL の afterEach 自動検出
// （global の afterEach を見る）が効かず、同一ファイル内のテスト間で render() の
// DOM が蓄積していた。ここで明示的に cleanup を登録する。
afterEach(() => {
  cleanup();
});
