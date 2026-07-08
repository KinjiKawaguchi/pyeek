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
  ]),
]);

export default eslintConfig;
