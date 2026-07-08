import type { BridgeLoadingState, PyeekBridge } from "./bridge";
import type { PyeekResult } from "./pyeek-result";

// Pyodide の初期化・実行は専用の Web Worker（public/pyodide-worker.js）に
// 委譲する。Pyodide の WASM 初期化と CPython 解析実行はメインスレッドを
// 1秒以上ブロックする重い処理（Lighthouse の Total Blocking Time 悪化の
// 直接要因）で、Pyodide 公式もWorker上での実行を推奨パターンとしている。
const PYODIDE_WORKER_URL = "/pyodide-worker.js";

type WorkerToMainMessage =
  | { type: "progress"; phase: "downloading" | "initializing"; message: string }
  | { type: "ready" }
  | { type: "result"; requestId: number; json: string }
  | { type: "error"; requestId?: number; message: string };

type MainToWorkerMessage =
  | { type: "ready" }
  | { type: "analyzeAll"; requestId: number; src: string };

class PyodideBridge implements PyeekBridge {
  private worker: Worker | null = null;
  private readyPromise: Promise<void> | null = null;
  private readyResolvers: { resolve: () => void; reject: (error: Error) => void } | null = null;
  private onReadyProgress: ((state: BridgeLoadingState) => void) | null = null;
  private nextRequestId = 0;
  private readonly pending = new Map<
    number,
    { resolve: (json: string) => void; reject: (error: Error) => void }
  >();

  private ensureWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }
    const worker = new Worker(PYODIDE_WORKER_URL, { type: "module" });
    worker.addEventListener("message", (event: MessageEvent<WorkerToMainMessage>) => {
      this.handleMessage(event.data);
    });
    worker.addEventListener("error", (event: ErrorEvent) => {
      this.handleFatalError(new Error(event.message));
    });
    this.worker = worker;
    return worker;
  }

  private handleMessage(msg: WorkerToMainMessage): void {
    switch (msg.type) {
      case "progress":
        this.onReadyProgress?.({ phase: msg.phase, message: msg.message });
        return;
      case "ready":
        this.readyResolvers?.resolve();
        this.readyResolvers = null;
        return;
      case "result":
        this.pending.get(msg.requestId)?.resolve(msg.json);
        this.pending.delete(msg.requestId);
        return;
      case "error":
        if (msg.requestId === undefined) {
          this.readyResolvers?.reject(new Error(msg.message));
          this.readyResolvers = null;
        } else {
          this.pending.get(msg.requestId)?.reject(new Error(msg.message));
          this.pending.delete(msg.requestId);
        }
    }
  }

  private handleFatalError(error: Error): void {
    this.readyResolvers?.reject(error);
    this.readyResolvers = null;
    for (const request of this.pending.values()) {
      request.reject(error);
    }
    this.pending.clear();
  }

  async ready(onProgress?: (state: BridgeLoadingState) => void): Promise<void> {
    this.onReadyProgress = onProgress ?? null;
    if (!this.readyPromise) {
      const worker = this.ensureWorker();
      this.readyPromise = new Promise<void>((resolve, reject) => {
        this.readyResolvers = { resolve, reject };
        worker.postMessage({ type: "ready" } satisfies MainToWorkerMessage);
      }).catch((error: unknown) => {
        // 失敗時は次回呼び出しでまた読み込みを試せるようにリセットする。
        this.readyPromise = null;
        throw error;
      });
    }
    await this.readyPromise;
    onProgress?.({ phase: "ready", message: "準備完了" });
  }

  async analyzeAll(src: string): Promise<PyeekResult> {
    const worker = this.ensureWorker();
    const requestId = this.nextRequestId++;
    const json = await new Promise<string>((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      worker.postMessage({ type: "analyzeAll", requestId, src } satisfies MainToWorkerMessage);
    });
    return JSON.parse(json) as PyeekResult;
  }
}

export const pyodideBridge: PyeekBridge = new PyodideBridge();
