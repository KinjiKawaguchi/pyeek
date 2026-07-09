import { describe, expect, it } from "vitest";
import { buildFrameIndices } from "@/pages/lab/model/vm-stage/gif-export";

describe("buildFrameIndices", () => {
  it("上限以内ならステップ数を間引かず-1始まりで全件返す", () => {
    expect(buildFrameIndices(3, 60)).toEqual([-1, 0, 1, 2]);
  });

  it("stepCountが0でも未実行状態の-1だけは含む", () => {
    expect(buildFrameIndices(0, 60)).toEqual([-1]);
  });

  it("上限を超える場合は昇順・重複なしで上限以下に間引く", () => {
    const indices = buildFrameIndices(1000, 60);
    expect(indices.length).toBeLessThanOrEqual(60);
    expect(indices).toEqual([...indices].sort((a, b) => a - b));
    expect(new Set(indices).size).toBe(indices.length);
  });

  it("間引いた場合も最初(-1)と最後(stepCount-1)を含む", () => {
    const indices = buildFrameIndices(1000, 60);
    expect(indices[0]).toBe(-1);
    expect(indices.at(-1)).toBe(999);
  });
});
