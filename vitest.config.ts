import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// 単体テストは jsdom（純関数・コンポーネント）、tests/bridge/ は
// ファイル先頭の `// @vitest-environment node` で本物の Pyodide を Node 上で動かす。
// integration という named project を分けているのは、pre-commit の対象から
// pyodide-node.test.ts（wasm ロードで数秒〜十数秒かかる）を除外するため。
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "src/app"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/shared": path.resolve(__dirname, "src/shared"),
    },
  },
  test: {
    environment: "jsdom",
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.test.{ts,tsx}"],
          exclude: ["tests/bridge/**"],
          setupFiles: ["tests/setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/bridge/**/*.test.ts"],
          testTimeout: 60_000,
        },
      },
    ],
  },
});
