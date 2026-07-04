import { describe, expect, it } from "vitest";
import {
  rangeContains,
  rangesEqual,
  rangesOverlap,
  type SrcRange,
} from "@/entities/analysis/model/source-range";

const RANGE_4 = (): SrcRange => ({ start: [1, 4], end: [1, 8] });
const RANGE_8_12 = (): SrcRange => ({ start: [1, 8], end: [1, 12] });
const RANGE_2_20 = (): SrcRange => ({ start: [1, 2], end: [1, 20] });
const RANGE_MULTILINE = (): SrcRange => ({ start: [1, 4], end: [2, 3] });

describe("rangesEqual", () => {
  it("開始・終了が一致すれば true", () => {
    expect(rangesEqual(RANGE_4(), { start: [1, 4], end: [1, 8] })).toBe(true);
  });

  it("片方でもずれていれば false", () => {
    expect(rangesEqual(RANGE_4(), { start: [1, 4], end: [1, 9] })).toBe(false);
  });
});

describe("rangesOverlap", () => {
  it("完全に重なる範囲は true", () => {
    expect(rangesOverlap(RANGE_4(), RANGE_4())).toBe(true);
  });

  it("一方が他方を包含する場合は true", () => {
    expect(rangesOverlap(RANGE_2_20(), RANGE_4())).toBe(true);
    expect(rangesOverlap(RANGE_4(), RANGE_2_20())).toBe(true);
  });

  it("端点が接するだけ（半開区間）は重ならない", () => {
    expect(rangesOverlap(RANGE_4(), RANGE_8_12())).toBe(false);
  });

  it("離れた範囲は false", () => {
    expect(rangesOverlap(RANGE_4(), { start: [1, 100], end: [1, 200] })).toBe(false);
  });

  it("複数行にまたがる範囲も評価できる", () => {
    expect(rangesOverlap(RANGE_MULTILINE(), { start: [2, 0], end: [2, 3] })).toBe(true);
  });
});

describe("rangeContains", () => {
  it("外側が内側を包含していれば true", () => {
    expect(rangeContains(RANGE_2_20(), RANGE_4())).toBe(true);
  });

  it("同一範囲は包含とみなす", () => {
    expect(rangeContains(RANGE_4(), RANGE_4())).toBe(true);
  });

  it("内側の方が大きければ false", () => {
    expect(rangeContains(RANGE_4(), RANGE_2_20())).toBe(false);
  });
});
