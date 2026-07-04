import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import type { SrcRange } from "@/entities/source-link";
import { AnalysisProvider, useAnalysis } from "@/pages/lab/model/analysis-store";
import type { BridgeLoadingState, PyeekBridge, PyeekResult, Token } from "@/shared/api";

// フェイク Bridge インスタンスの作成
const FAKE_TOKENS: Token[] = [
  {
    type: "NAME",
    exactType: "NAME",
    string: "x",
    start: [1, 0],
    end: [1, 1],
    isKeyword: false,
    isSoftKeyword: false,
  },
];

const FAKE_RESULT: PyeekResult = {
  source: "x = 1",
  pythonVersion: "3.12.0",
  tokens: FAKE_TOKENS,
  ast: null,
  bytecode: null,
  errors: [],
};

function createFakeBridge(
  overrides?: Partial<{
    readyError: unknown;
    analyzeError: unknown;
    onProgress: (state: BridgeLoadingState) => void;
  }>,
): PyeekBridge {
  return {
    async ready(onProgress?: (state: BridgeLoadingState) => void) {
      if (onProgress) {
        onProgress({ phase: "initializing", message: "Initializing..." });
        onProgress({ phase: "ready", message: "" });
      }
      if (overrides?.readyError) {
        throw overrides.readyError;
      }
    },
    async analyzeAll(src: string): Promise<PyeekResult> {
      if (overrides?.analyzeError) {
        throw overrides.analyzeError;
      }
      return { ...FAKE_RESULT, source: src };
    },
  };
}

// AnalysisProvider でラップしたまま useAnalysis を呼べるようにするヘルパー
function createWrapper(bridge?: PyeekBridge, initialSource?: string) {
  return ({ children }: { children: ReactNode }) => (
    <AnalysisProvider initialSource={initialSource ?? ""} bridge={bridge}>
      {children}
    </AnalysisProvider>
  );
}

describe("AnalysisStore (analysis-store.tsx)", () => {
  describe("初期状態", () => {
    it('初期状態: mode は "strict" が既定であること', () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      expect(result.current.state.mode).toBe("strict");
    });

    it("初期状態: selectedRange は null であること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      expect(result.current.state.selectedRange).toBeNull();
    });
  });

  describe("setSource アクション", () => {
    it("setSource を呼ぶと source が更新されること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge(), "original"),
      });

      expect(result.current.state.source).toBe("original");

      act(() => {
        result.current.setSource("updated");
      });

      expect(result.current.state.source).toBe("updated");
    });

    it("setSource を呼ぶと selectedRange が null にリセットされること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge(), "x = 1"),
      });

      // 先に selectedRange をセット
      const range: SrcRange = { start: [1, 0], end: [1, 1] };
      act(() => {
        result.current.setSelectedRange(range);
      });
      expect(result.current.state.selectedRange).toEqual(range);

      // その後 setSource を呼ぶ
      act(() => {
        result.current.setSource("y = 2");
      });

      // selectedRange が null にリセットされることを確認
      expect(result.current.state.selectedRange).toBeNull();
    });
  });

  describe("setMode アクション", () => {
    it('setMode を呼ぶと mode が "easy" に切り替わること', () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      expect(result.current.state.mode).toBe("strict");

      act(() => {
        result.current.setMode("easy");
      });

      expect(result.current.state.mode).toBe("easy");
    });

    it('setMode を呼ぶと mode が "strict" に切り替わること', () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      act(() => {
        result.current.setMode("easy");
      });
      expect(result.current.state.mode).toBe("easy");

      act(() => {
        result.current.setMode("strict");
      });

      expect(result.current.state.mode).toBe("strict");
    });
  });

  describe("setSelectedRange アクション", () => {
    it("setSelectedRange を呼ぶと selectedRange が反映されること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      const range: SrcRange = { start: [1, 0], end: [1, 5] };
      act(() => {
        result.current.setSelectedRange(range);
      });

      expect(result.current.state.selectedRange).toEqual(range);
    });

    it("setSelectedRange に null を渡すと selectedRange がクリアされること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      const range: SrcRange = { start: [1, 0], end: [1, 5] };
      act(() => {
        result.current.setSelectedRange(range);
      });
      expect(result.current.state.selectedRange).not.toBeNull();

      act(() => {
        result.current.setSelectedRange(null);
      });

      expect(result.current.state.selectedRange).toBeNull();
    });
  });

  describe("bridge.ready() の初期化フロー", () => {
    it('フェイク bridge の ready() が成功した場合、loading.phase が最終的に "ready" になり、その後 analyzeAll の結果が result に反映されること', async () => {
      const bridge = createFakeBridge();
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(bridge, "x = 1"),
      });

      // loading.phase が "ready" になるまで待つ
      await waitFor(() => {
        expect(result.current.state.loading.phase).toBe("ready");
      });

      // result に analyzeAll の結果が反映されていることを確認
      await waitFor(() => {
        expect(result.current.state.result).not.toBeNull();
        expect(result.current.state.result?.source).toBe("x = 1");
        expect(result.current.state.result?.pythonVersion).toBe("3.12.0");
      });

      // runtimeError は null であること
      expect(result.current.state.runtimeError).toBeNull();
    });

    it("フェイク bridge の analyzeAll が reject するケース、result は更新されず runtimeError にエラーメッセージが入ること", async () => {
      const bridge = createFakeBridge({
        analyzeError: new Error("Analysis failed"),
      });
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(bridge, "x = 1"),
      });

      // ready() は成功するがanalyzeAll() が失敗
      await waitFor(() => {
        expect(result.current.state.runtimeError).not.toBeNull();
      });

      expect(result.current.state.result).toBeNull();
      expect(result.current.state.runtimeError).toBe("Analysis failed");
    });

    it("フェイク bridge の ready() 自体が reject するケース、runtimeError にエラーメッセージが入ること", async () => {
      const bridge = createFakeBridge({
        readyError: new Error("Ready failed"),
      });
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(bridge, "x = 1"),
      });

      // ready() が失敗して runtimeError にエラーメッセージが入ることを確認
      await waitFor(() => {
        expect(result.current.state.runtimeError).toBe("Ready failed");
      });

      // result は null のままであること
      expect(result.current.state.result).toBeNull();
    });

    it("エラーが Error インスタンスでない場合も toErrorMessage が機能すること（非 Error オブジェクトを投げるケース）", async () => {
      const bridge = createFakeBridge({
        readyError: { errorCode: 500, message: "Unknown error" },
      });
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(bridge, "x = 1"),
      });

      await waitFor(() => {
        expect(result.current.state.runtimeError).not.toBeNull();
      });

      // エラーオブジェクトが String(error) で変換されていることを確認（[object Object] になる）
      expect(result.current.state.runtimeError).toBe("[object Object]");
    });
  });

  describe("useAnalysis のコンテキスト検証", () => {
    it("useAnalysis を AnalysisProvider の外で呼ぶと例外が投げられること", () => {
      // Provider の外で useAnalysis を呼ぶ
      expect(() => {
        renderHook(() => useAnalysis());
      }).toThrow("useAnalysis は AnalysisProvider の内側で使ってください");
    });
  });

  describe("複合的なアクション検証", () => {
    it("複数回の setSource 呼び出しでも selectedRange が毎回リセットされること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge(), "initial"),
      });

      // 1回目：setSelectedRange → setSource
      const range1: SrcRange = { start: [1, 0], end: [1, 5] };
      act(() => {
        result.current.setSelectedRange(range1);
      });
      expect(result.current.state.selectedRange).toEqual(range1);

      act(() => {
        result.current.setSource("source1");
      });
      expect(result.current.state.selectedRange).toBeNull();

      // 2回目：setSelectedRange → setSource
      const range2: SrcRange = { start: [2, 0], end: [2, 3] };
      act(() => {
        result.current.setSelectedRange(range2);
      });
      expect(result.current.state.selectedRange).toEqual(range2);

      act(() => {
        result.current.setSource("source2");
      });
      expect(result.current.state.selectedRange).toBeNull();
    });

    it("mode と selectedRange は独立して操作できること", () => {
      const { result } = renderHook(() => useAnalysis(), {
        wrapper: createWrapper(createFakeBridge()),
      });

      // mode と selectedRange を変更
      const range: SrcRange = { start: [1, 0], end: [1, 1] };
      act(() => {
        result.current.setMode("easy");
        result.current.setSelectedRange(range);
      });

      expect(result.current.state.mode).toBe("easy");
      expect(result.current.state.selectedRange).toEqual(range);

      // mode を変更しても selectedRange は保持されること
      act(() => {
        result.current.setMode("strict");
      });
      expect(result.current.state.mode).toBe("strict");
      expect(result.current.state.selectedRange).toEqual(range);
    });
  });
});
