import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisProvider } from "@/pages/lab/model/analysis-store";
import { BytecodeStage } from "@/pages/lab/ui/bytecode-stage/bytecode-stage";
import type { BridgeLoadingState, PyeekBridge, PyeekResult } from "@/shared/api";
import callSnapshot from "../../../../python/snapshots/call.json";

// call.json（print("hi")をコンパイルした実データ）を使う。
// bytecode には以下の命令が含まれる:
// - RESUME: offset=0, positions.lineno=0（特殊な命令、通常のソース行番号がない）
// - PUSH_NULL/LOAD_NAME: offset=2,4, colOffset=0, endColOffset=5（同一範囲）
// - CALL/POP_TOP/RETURN_CONST: offset=8,16,18, colOffset=0, endColOffset=11（全て同一範囲）

function createFakeBridgeWithResult(result: PyeekResult): PyeekBridge {
  return {
    async ready(onProgress?: (state: BridgeLoadingState) => void) {
      onProgress?.({ phase: "ready", message: "" });
    },
    async analyzeAll(): Promise<PyeekResult> {
      return result;
    },
  };
}

describe("BytecodeStage - 命令選択の回帰テスト", () => {
  it("RESUME命令（lineno=0で特殊）をクリックすると、詳細説明にRESUMEが表示される", async () => {
    // call.json の bytecode データをそのまま使用
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: null,
      bytecode: callSnapshot.bytecode,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <BytecodeStage />
      </AnalysisProvider>,
    );

    // RESUME 命令ボタンをクリック。最初の instr ボタンから offset と opname で特定
    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll("button.instr"));
      expect(buttons.length).toBeGreaterThan(0);
    });
    const instrButtons = Array.from(container.querySelectorAll("button.instr"));
    const resumeButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "0",
    );
    expect(resumeButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(resumeButton!);

    // 詳細説明パネルに RESUME チップが表示されることを確認
    await waitFor(() => {
      const chip = container.querySelector(".bytecode-stage__chip");
      expect(chip?.textContent).toBe("RESUME");
    });
  });

  it("CALL命令をクリックすると、詳細説明にCALLが表示される", async () => {
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: null,
      bytecode: callSnapshot.bytecode,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <BytecodeStage />
      </AnalysisProvider>,
    );

    // CALL 命令ボタンをクリック。offset=8で特定
    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll("button.instr"));
      expect(buttons.length).toBeGreaterThan(0);
    });
    const instrButtons = Array.from(container.querySelectorAll("button.instr"));
    const callButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "8",
    );
    expect(callButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(callButton!);

    // 詳細説明パネルの chip が "CALL" であることを確認
    await waitFor(() => {
      const chip = container.querySelector(".bytecode-stage__chip");
      expect(chip?.textContent).toBe("CALL");
    });
  });

  it("POP_TOP命令をクリックすると、詳細説明にPOP_TOPが表示される（CALLではない）", async () => {
    // 修正前（selectedOffset でなく selectedRange からの逆引き）だと、
    // CALL/POP_TOP/RETURN_CONST が全て同じソース範囲（colOffset=0, endColOffset=11）
    // を持つため、クリック対象がどれであろうとも「最初にその範囲と一致した要素」
    // （つまり CALL）が常に選ばれてしまう。
    // 修正後（selectedOffset をstate で直接管理）なら、
    // クリックされた要素のoffset（POP_TOP の offset=16）が記憶されるので、
    // POP_TOP の説明が正しく表示される。
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: null,
      bytecode: callSnapshot.bytecode,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <BytecodeStage />
      </AnalysisProvider>,
    );

    // POP_TOP 命令をクリック。offset=16で特定
    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll("button.instr"));
      expect(buttons.length).toBeGreaterThan(0);
    });
    const instrButtons = Array.from(container.querySelectorAll("button.instr"));
    const popTopButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "16",
    );
    expect(popTopButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(popTopButton!);

    // 詳細説明パネルの chip が "POP_TOP" であることを確認
    await waitFor(() => {
      const chip = container.querySelector(".bytecode-stage__chip");
      expect(chip?.textContent).toBe("POP_TOP");
    });
  });

  it("RETURN_CONST命令をクリックすると、詳細説明にRETURN_CONSTが表示される", async () => {
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: null,
      bytecode: callSnapshot.bytecode,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <BytecodeStage />
      </AnalysisProvider>,
    );

    // RETURN_CONST 命令をクリック。offset=18で特定
    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll("button.instr"));
      expect(buttons.length).toBeGreaterThan(0);
    });
    const instrButtons = Array.from(container.querySelectorAll("button.instr"));
    const returnConstButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "18",
    );
    expect(returnConstButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(returnConstButton!);

    // 詳細説明パネルの chip が "RETURN_CONST" であることを確認
    await waitFor(() => {
      const chip = container.querySelector(".bytecode-stage__chip");
      expect(chip?.textContent).toBe("RETURN_CONST");
    });
  });

  it("CALL → POP_TOP → RETURN_CONST と順に異なる命令をクリックすると、readoutが正しく切り替わる", async () => {
    // 修正前ならこのテストは失敗する。複数の命令が同じ範囲を共有するため、
    // クリック対象がどれであろうとも最初の CALL の説明がずっと表示される。
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: null,
      bytecode: callSnapshot.bytecode,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <BytecodeStage />
      </AnalysisProvider>,
    );

    // ボタンが出現するまで待機
    await waitFor(() => {
      const buttons = Array.from(container.querySelectorAll("button.instr"));
      expect(buttons.length).toBeGreaterThan(0);
    });
    const instrButtons = Array.from(container.querySelectorAll("button.instr"));

    // 1. CALL をクリック（offset=8）
    const callButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "8",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(callButton!);
    await waitFor(() => {
      expect(container.querySelector(".bytecode-stage__chip")?.textContent).toBe("CALL");
    });

    // 2. POP_TOP をクリック（offset=16）。修正前なら CALL の説明がずっと表示される
    const popTopButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "16",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(popTopButton!);
    await waitFor(() => {
      expect(container.querySelector(".bytecode-stage__chip")?.textContent).toBe("POP_TOP");
    });

    // 3. RETURN_CONST をクリック（offset=18）
    const returnConstButton = instrButtons.find(
      (btn) => btn.querySelector(".instr__offset")?.textContent?.trim() === "18",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(returnConstButton!);
    await waitFor(() => {
      expect(container.querySelector(".bytecode-stage__chip")?.textContent).toBe("RETURN_CONST");
    });
  });
});
