// prebuild スクリプト。Next.js のバンドラ（webpack/Turbopack）は pyodide の
// wasm/stdlib zip をうまく扱えないため、バンドルを迂回して public/ 配下に
// 静的配信するファイルとして直接コピーする。src/shared/api/pyodide-bridge.ts
// が `indexURL: "/pyodide/"` としてこのディレクトリを参照する。
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const rootDir = fileURLToPath(new URL("..", import.meta.url));

const PYODIDE_RUNTIME_FILES = [
  "pyodide.mjs",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

async function copyPyodideRuntime() {
  const pyodidePackageJson = require.resolve("pyodide/package.json");
  const pyodideDir = path.dirname(pyodidePackageJson);
  const destDir = path.join(rootDir, "public", "pyodide");
  await mkdir(destDir, { recursive: true });

  for (const file of PYODIDE_RUNTIME_FILES) {
    await cp(path.join(pyodideDir, file), path.join(destDir, file));
  }
}

async function copyPyeekCore() {
  const srcPath = path.join(rootDir, "py", "pyeek_core.py");
  const destDir = path.join(rootDir, "public", "py");
  await mkdir(destDir, { recursive: true });
  const source = await readFile(srcPath, "utf8");
  await writeFile(path.join(destDir, "pyeek_core.py"), source);
}

await copyPyodideRuntime();
await copyPyeekCore();
console.log("[copy-pyodide] public/pyodide/ と public/py/pyeek_core.py を更新しました");
