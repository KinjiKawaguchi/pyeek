"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { SrcRange } from "@/entities/source-link";
import {
  type BridgeLoadingState,
  type PyeekBridge,
  type PyeekResult,
  pyodideBridge,
} from "@/shared/api";
import { debounce } from "@/shared/lib/debounce";

const ANALYZE_DEBOUNCE_MS = 300;

export type DisplayMode = "easy" | "strict";

export interface AnalysisState {
  source: string;
  result: PyeekResult | null;
  loading: BridgeLoadingState;
  runtimeError: string | null;
  mode: DisplayMode;
  // 段間リンク（①〜④のどこかで選択された範囲）。null は未選択。
  selectedRange: SrcRange | null;
}

type AnalysisAction =
  | { type: "source-changed"; source: string }
  | { type: "loading-progress"; loading: BridgeLoadingState }
  | { type: "analysis-succeeded"; result: PyeekResult }
  | { type: "analysis-failed"; message: string }
  | { type: "mode-changed"; mode: DisplayMode }
  | { type: "range-selected"; range: SrcRange | null };

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case "source-changed":
      return { ...state, source: action.source, selectedRange: null };
    case "loading-progress":
      return { ...state, loading: action.loading };
    case "analysis-succeeded":
      return { ...state, result: action.result, runtimeError: null };
    case "analysis-failed":
      return { ...state, runtimeError: action.message };
    case "mode-changed":
      return { ...state, mode: action.mode };
    case "range-selected":
      return { ...state, selectedRange: action.range };
    default:
      return state;
  }
}

function createInitialState(initialSource: string): AnalysisState {
  return {
    source: initialSource,
    result: null,
    loading: { phase: "idle", message: "" },
    runtimeError: null,
    // 前身 token-lab.html は「くわしい」を既定にしていた（本物の字句解析器の
    // 出力を前面に出す方針）ため、Pyeek でも踏襲する。
    mode: "strict",
    selectedRange: null,
  };
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

interface AnalysisContextValue {
  state: AnalysisState;
  setSource: (source: string) => void;
  setMode: (mode: DisplayMode) => void;
  setSelectedRange: (range: SrcRange | null) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export interface AnalysisProviderProps {
  initialSource: string;
  // テスト時に Pyodide 抜きのフェイク Bridge を差し込めるようにする。
  bridge?: PyeekBridge;
  children: ReactNode;
}

export function AnalysisProvider({
  initialSource,
  bridge = pyodideBridge,
  children,
}: AnalysisProviderProps) {
  const [state, dispatch] = useReducer(analysisReducer, initialSource, createInitialState);

  // ready() 完了時に「今エディタに入っている最新のソース」を解析したいが、
  // 依存配列に state.source を入れると ready effect が再実行されてしまうため
  // ref 経由で参照する。
  const sourceRef = useRef(initialSource);
  sourceRef.current = state.source;

  const runAnalysis = useCallback(
    async (source: string) => {
      try {
        const result = await bridge.analyzeAll(source);
        dispatch({ type: "analysis-succeeded", result });
      } catch (error) {
        dispatch({ type: "analysis-failed", message: toErrorMessage(error) });
      }
    },
    [bridge],
  );

  const debouncedAnalyze = useMemo(
    () => debounce((source: string) => void runAnalysis(source), ANALYZE_DEBOUNCE_MS),
    [runAnalysis],
  );

  // 初回マウント時に一度だけ実行する意図的な依存省略（bridge は不変の前提。
  // runAnalysis を依存に含めると setSource 経由の再解析のたびに ready() が
  // 再実行されてしまう）。
  // biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行する意図的な依存省略
  useEffect(() => {
    let cancelled = false;
    void bridge
      .ready((loading) => {
        if (!cancelled) {
          dispatch({ type: "loading-progress", loading });
        }
      })
      .then(() => {
        if (!cancelled) {
          void runAnalysis(sourceRef.current);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({ type: "analysis-failed", message: toErrorMessage(error) });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [bridge]);

  const setSource = useCallback(
    (source: string) => {
      dispatch({ type: "source-changed", source });
      if (state.loading.phase === "ready") {
        debouncedAnalyze(source);
      }
    },
    [debouncedAnalyze, state.loading.phase],
  );

  const setMode = useCallback((mode: DisplayMode) => {
    dispatch({ type: "mode-changed", mode });
  }, []);

  const setSelectedRange = useCallback((range: SrcRange | null) => {
    dispatch({ type: "range-selected", range });
  }, []);

  const value = useMemo<AnalysisContextValue>(
    () => ({ state, setSource, setMode, setSelectedRange }),
    [state, setSource, setMode, setSelectedRange],
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis は AnalysisProvider の内側で使ってください");
  }
  return ctx;
}
