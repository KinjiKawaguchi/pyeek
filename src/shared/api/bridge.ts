import type { PyeekResult } from "./pyeek-result";

// 解析エンジンの抽象。実体は Pyodide（ブラウザ完結）だが、将来サーバ API に
// 差し替える場合もこの契約だけを実装すればよい。
export type BridgeLoadingPhase = "idle" | "downloading" | "initializing" | "ready" | "error";

export interface BridgeLoadingState {
  phase: BridgeLoadingPhase;
  message: string;
}

export interface PyeekBridge {
  ready(onProgress?: (state: BridgeLoadingState) => void): Promise<void>;
  analyzeAll(src: string): Promise<PyeekResult>;
}
