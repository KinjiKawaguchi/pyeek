import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnalysisProvider } from "@/pages/lab/model/analysis-store";
import { AstStage } from "@/pages/lab/ui/ast-stage/ast-stage";
import type { BridgeLoadingState, PyeekBridge, PyeekResult } from "@/shared/api";
import callSnapshot from "../../../../python/snapshots/call.json";

// call.json（print("hi")をコンパイルした実データ）を使う。
// ast には以下が含まれる:
// - Module: id=0, lineno=null, colOffset=null （ソース範囲を持たないノード）
// - Expr: id=1, lineno=1, colOffset=0, endColOffset=11
// - Call: id=2, lineno=1, colOffset=0, endColOffset=11 （ExprとCallが同一範囲）

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

describe("AstStage - ノード選択の回帰テスト", () => {
  it("Moduleノード（ソース範囲を持たない）をクリックすると、詳細説明にModuleが表示される", async () => {
    // call.json の ast データをそのまま使用
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: callSnapshot.ast,
      bytecode: null,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <AstStage />
      </AnalysisProvider>,
    );

    // Module ノードボタンを取得してクリック
    await waitFor(() => {
      const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
      expect(astNodeButtons.length).toBeGreaterThan(0);
    });
    const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
    const moduleButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Module",
    );
    expect(moduleButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(moduleButton!);

    // 詳細説明パネルに Module チップが表示されることを確認
    await waitFor(() => {
      const chip = container.querySelector(".ast-stage__chip");
      expect(chip?.textContent).toBe("Module");
    });
  });

  it("Exprノードをクリックすると、詳細説明にExprが表示される（Moduleではない）", async () => {
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: callSnapshot.ast,
      bytecode: null,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <AstStage />
      </AnalysisProvider>,
    );

    // Expr ノードボタンを取得してクリック
    await waitFor(() => {
      const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
      expect(astNodeButtons.length).toBeGreaterThan(0);
    });
    const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
    const exprButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Expr",
    );
    expect(exprButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(exprButton!);

    // 詳細説明パネルの chip が "Expr" であることを確認
    await waitFor(() => {
      const chip = container.querySelector(".ast-stage__chip");
      expect(chip?.textContent).toBe("Expr");
    });
  });

  it("Callノードをクリックすると、詳細説明にCallが表示される（Exprではない）", async () => {
    // 修正前（selectedRange からの逆引きのみ）だと、Call と Expr が
    // 同じソース範囲（colOffset=0, endColOffset=11）を持つため、
    // クリック対象がどちらであろうとも「最初にその範囲と一致した要素」
    // （つまり Expr）が常に選ばれてしまう。
    // 修正後（selectedNodeId をstate で直接管理）なら、
    // クリックされた要素のid（Call の id=2）が記憶されるので、
    // Call の説明が正しく表示される。
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: callSnapshot.ast,
      bytecode: null,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <AstStage />
      </AnalysisProvider>,
    );

    // Call ノードボタンを取得してクリック
    await waitFor(() => {
      const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
      expect(astNodeButtons.length).toBeGreaterThan(0);
    });
    const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
    const callButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Call",
    );
    expect(callButton).toBeInTheDocument();
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(callButton!);

    // 詳細説明パネルの chip が "Call" であることを確認
    await waitFor(() => {
      const chip = container.querySelector(".ast-stage__chip");
      expect(chip?.textContent).toBe("Call");
    });
  });

  it("Module → Expr → Call と順に異なるノードをクリックすると、readoutが正しく切り替わる", async () => {
    // 修正前ならこのテストは失敗する。Module クリックで何も起きず、
    // Expr をクリックしても Expr の説明が出る。Call をクリックしても
    // Expr が同じ範囲のため Expr の説明がずっと表示される。
    const result = {
      source: callSnapshot.source,
      pythonVersion: callSnapshot.pythonVersion,
      tokens: callSnapshot.tokens,
      ast: callSnapshot.ast,
      bytecode: null,
      errors: [],
    } as unknown as PyeekResult;

    const { container } = render(
      <AnalysisProvider
        initialSource={callSnapshot.source}
        bridge={createFakeBridgeWithResult(result)}
      >
        <AstStage />
      </AnalysisProvider>,
    );

    // ボタンが出現するまで待機
    await waitFor(() => {
      const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));
      expect(astNodeButtons.length).toBeGreaterThan(0);
    });

    const astNodeButtons = Array.from(container.querySelectorAll("button.ast-node"));

    // 1. Module をクリック
    const moduleButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Module",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(moduleButton!);
    await waitFor(() => {
      expect(container.querySelector(".ast-stage__chip")?.textContent).toBe("Module");
    });

    // 2. Expr をクリック
    const exprButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Expr",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(exprButton!);
    await waitFor(() => {
      // readout の chip が Expr に切り替わったことを確認
      expect(container.querySelector(".ast-stage__chip")?.textContent).toBe("Expr");
    });

    // 3. Call をクリック
    const callButton = astNodeButtons.find(
      (btn) => btn.querySelector(".ast-node__type")?.textContent?.trim() === "Call",
    );
    // biome-ignore lint/style/noNonNullAssertion: already checked via expect
    fireEvent.click(callButton!);
    await waitFor(() => {
      // readout の chip が Call に切り替わったことを確認
      expect(container.querySelector(".ast-stage__chip")?.textContent).toBe("Call");
    });
  });
});
