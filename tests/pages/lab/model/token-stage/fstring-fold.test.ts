import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { foldFStrings } from "@/pages/lab/model/token-stage/fstring-fold";
import type { Token } from "@/shared/api";

const SNAPSHOT_DIR = path.resolve(__dirname, "../../../../python/snapshots");

function loadSnapshot(name: string): { source: string; tokens: Token[] } {
  const raw = readFileSync(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
  return JSON.parse(raw) as { source: string; tokens: Token[] };
}

describe("foldFStrings", () => {
  it("f-string を持たないトークン列はそのまま返す", () => {
    const { source, tokens } = loadSnapshot("call");
    expect(foldFStrings(tokens, source)).toEqual(tokens);
  });

  it("単純な f-string を 1 つの STRING トークンに畳む", () => {
    const { source, tokens } = loadSnapshot("fstring");
    const folded = foldFStrings(tokens, source);

    expect(folded.some((t) => t.type.startsWith("FSTRING_"))).toBe(false);
    const stringTokens = folded.filter((t) => t.type === "STRING");
    expect(stringTokens).toHaveLength(1);
    expect(stringTokens[0]?.string).toBe('f"合計は {total} です"');
    // NAME(msg), OP(=), <畳んだ STRING>, NEWLINE, ENDMARKER
    expect(folded.map((t) => t.type)).toEqual(["NAME", "OP", "STRING", "NEWLINE", "ENDMARKER"]);
  });

  it("ネストした f-string も外側の FSTRING_END まで 1 つの STRING トークンに畳む", () => {
    const { source, tokens } = loadSnapshot("fstring_nested");
    const folded = foldFStrings(tokens, source);

    expect(folded.some((t) => t.type.startsWith("FSTRING_"))).toBe(false);
    const stringTokens = folded.filter((t) => t.type === "STRING");
    expect(stringTokens).toHaveLength(1);
    expect(stringTokens[0]?.string).toBe(source.slice(source.indexOf('f"')));
    expect(folded.map((t) => t.type)).toEqual(["NAME", "OP", "STRING", "NEWLINE", "ENDMARKER"]);
  });
});
