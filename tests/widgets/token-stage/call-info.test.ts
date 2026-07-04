import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Token } from "@/shared/api";
import { findCallInfo } from "@/widgets/token-stage/model/call-info";

const SNAPSHOT_DIR = path.resolve(__dirname, "../../python/snapshots");

function loadTokens(name: string): Token[] {
  const raw = readFileSync(path.join(SNAPSHOT_DIR, `${name}.json`), "utf8");
  return (JSON.parse(raw) as { tokens: Token[] }).tokens;
}

describe("findCallInfo", () => {
  it("NAME の直後に ( があれば呼び出しとして検出する", () => {
    const tokens = loadTokens("call"); // print("hi")
    const info = findCallInfo(tokens);
    expect(info.callTokenIndexes).toHaveLength(1);
    expect(tokens[info.callTokenIndexes[0] as number]?.string).toBe("print");
    expect(info.bareBuiltin).toBeNull();
  });

  it("呼び出しの無い builtin 名は bareBuiltin として検出する", () => {
    const tokens: Token[] = [
      {
        type: "NAME",
        exactType: "NAME",
        string: "print",
        start: [1, 0],
        end: [1, 5],
        isKeyword: false,
        isSoftKeyword: false,
      },
      {
        type: "NEWLINE",
        exactType: "NEWLINE",
        string: "",
        start: [1, 5],
        end: [1, 6],
        isKeyword: false,
        isSoftKeyword: false,
      },
      {
        type: "ENDMARKER",
        exactType: "ENDMARKER",
        string: "",
        start: [2, 0],
        end: [2, 0],
        isKeyword: false,
        isSoftKeyword: false,
      },
    ];
    const info = findCallInfo(tokens);
    expect(info.callTokenIndexes).toHaveLength(0);
    expect(info.bareBuiltin).toBe("print");
  });

  it("obj.print のような属性アクセスは bareBuiltin にしない", () => {
    const tokens: Token[] = [
      {
        type: "NAME",
        exactType: "NAME",
        string: "obj",
        start: [1, 0],
        end: [1, 3],
        isKeyword: false,
        isSoftKeyword: false,
      },
      {
        type: "OP",
        exactType: "DOT",
        string: ".",
        start: [1, 3],
        end: [1, 4],
        isKeyword: false,
        isSoftKeyword: false,
      },
      {
        type: "NAME",
        exactType: "NAME",
        string: "print",
        start: [1, 4],
        end: [1, 9],
        isKeyword: false,
        isSoftKeyword: false,
      },
    ];
    const info = findCallInfo(tokens);
    expect(info.bareBuiltin).toBeNull();
  });
});
