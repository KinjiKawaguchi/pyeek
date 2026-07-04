import { describe, expect, it } from "vitest";
import { classifyRange, isLinked } from "@/entities/analysis/model/link";
import type { SrcRange } from "@/entities/analysis/model/source-range";

const TOKEN_RANGE: SrcRange = { start: [1, 8], end: [1, 9] };
const ANCESTOR_RANGE: SrcRange = { start: [1, 0], end: [1, 9] };
const UNRELATED_RANGE: SrcRange = { start: [1, 20], end: [1, 25] };

describe("classifyRange", () => {
  it("どちらかが null なら null", () => {
    expect(classifyRange(null, TOKEN_RANGE)).toBeNull();
    expect(classifyRange(TOKEN_RANGE, null)).toBeNull();
  });

  it("完全一致は active", () => {
    expect(classifyRange(TOKEN_RANGE, { ...TOKEN_RANGE })).toBe("active");
  });

  it("重なるが一致しない場合は related", () => {
    expect(classifyRange(ANCESTOR_RANGE, TOKEN_RANGE)).toBe("related");
  });

  it("重ならない場合は null", () => {
    expect(classifyRange(UNRELATED_RANGE, TOKEN_RANGE)).toBeNull();
  });
});

describe("isLinked", () => {
  it("active/related のどちらでも true", () => {
    expect(isLinked(TOKEN_RANGE, { ...TOKEN_RANGE })).toBe(true);
    expect(isLinked(ANCESTOR_RANGE, TOKEN_RANGE)).toBe(true);
  });

  it("重ならなければ false", () => {
    expect(isLinked(UNRELATED_RANGE, TOKEN_RANGE)).toBe(false);
  });
});
