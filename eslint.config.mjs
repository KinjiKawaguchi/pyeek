import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // public/ は scripts/copy-pyodide.mjs がコピーした Pyodide 本体・生成物
    // (public/pyodide/*, public/py/*) を含み、静的配信用でソースコードでは
    // ないため lint 対象から外す。
    "public/**",
    "playwright-report/**",
    // .claude/worktrees/ 配下は Claude Code のworktree作業ディレクトリ
    // (.gitignore済み)。lint実行時のcwd次第で意図せず拾われてしまうため除外する。
    ".claude/**",
  ]),
]);

export default eslintConfig;
