// @vitest-environment node
//
// tests/python/test_pyeek_core.py と同じスナップショット・同じ
// tests/fixtures/cases.json を、今度は Node 上で動かした「本物の」npm
// pyodide パッケージ（ブラウザで配布するのと同じバージョン）に対して実行し、
// ローカル CPython（uv 管理）との出力ズレを検出する。pythonVersion 文字列
// 自体は環境ごとに異なりうるため比較対象から除外する。

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { beforeAll, describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, "..", "..");

// vitest/vite の ESM 変換を経由すると pyodide.mjs 内の import.meta.url ベース
// の自動パス解決が壊れる（存在しない src/js/ 配下を探しにいく）ため、
// node_modules 上の実体を indexURL として明示的に渡す。
const require = createRequire(import.meta.url);
const pyodidePackageDir = path.dirname(require.resolve("pyodide/package.json"));

interface PyeekResultLike {
  pythonVersion: string;
  [key: string]: unknown;
}

function omitPythonVersion(result: PyeekResultLike): Omit<PyeekResultLike, "pythonVersion"> {
  const { pythonVersion, ...rest } = result;
  return rest;
}

async function loadCases(): Promise<Record<string, string>> {
  const raw = await readFile(path.join(rootDir, "tests", "fixtures", "cases.json"), "utf8");
  return JSON.parse(raw) as Record<string, string>;
}

async function loadSnapshot(name: string): Promise<PyeekResultLike> {
  const raw = await readFile(
    path.join(rootDir, "tests", "python", "snapshots", `${name}.json`),
    "utf8",
  );
  return JSON.parse(raw) as PyeekResultLike;
}

// it.each はテスト収集の時点で同期的にケース一覧を必要とするため、
// beforeAll ではなくトップレベル await で先に読み込む。
const cases = await loadCases();
const caseNames = Object.keys(cases).sort();

describe("pyodide (Node) と CPython ローカル環境のスナップショット一致", () => {
  let pyodide: PyodideInterface;
  let analyzeAllJson: (src: string) => string;

  beforeAll(async () => {
    pyodide = await loadPyodide({ indexURL: `${pyodidePackageDir}/` });
    const coreSource = await readFile(path.join(rootDir, "py", "pyeek_core.py"), "utf8");
    pyodide.runPython(coreSource);
    analyzeAllJson = pyodide.globals.get("analyze_all_json") as (src: string) => string;
  });

  it("pythonVersion が 3.12 系である", () => {
    const actual = JSON.parse(analyzeAllJson("1")) as PyeekResultLike;
    expect(actual.pythonVersion.startsWith("3.12")).toBe(true);
  });

  it.each(caseNames)("%s: pythonVersion を除き snapshot と一致する", async (name) => {
    const source = cases[name];
    if (source === undefined) {
      throw new Error(`unknown case: ${name}`);
    }
    const actual = JSON.parse(analyzeAllJson(source)) as PyeekResultLike;
    const expected = await loadSnapshot(name);
    expect(omitPythonVersion(actual)).toEqual(omitPythonVersion(expected));
  });
});
