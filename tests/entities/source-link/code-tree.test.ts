import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { codePathKey, flattenCodeObjs } from "@/entities/source-link/model/code-tree";
import type { CodeObj } from "@/shared/api";

const SNAPSHOT_DIR = path.resolve(__dirname, "../../python/snapshots");

function loadBytecode(name: string): CodeObj {
  const raw = readFileSync(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
  const bytecode = (JSON.parse(raw) as { bytecode: CodeObj | null }).bytecode;
  if (!bytecode) {
    throw new Error(`${name} の bytecode が null`);
  }
  return bytecode;
}

describe("flattenCodeObjs", () => {
  it("ネストした関数の code オブジェクトをパス付きで平坦化する", () => {
    // nested_function.json: def f(x): return x + 1
    const bytecode = loadBytecode("nested_function");
    const entries = flattenCodeObjs(bytecode);

    expect(entries.map((e) => e.path)).toEqual([["<module>"], ["<module>", "f"]]);
  });

  it("ネストが無ければ root だけを返す", () => {
    const bytecode = loadBytecode("call");
    const entries = flattenCodeObjs(bytecode);
    expect(entries).toHaveLength(1);
    expect(entries[0]?.path).toEqual(["<module>"]);
  });
});

describe("codePathKey", () => {
  it("パスを > 区切りの一意なキーにする", () => {
    expect(codePathKey(["<module>", "f"])).toBe("<module>>f");
  });
});
