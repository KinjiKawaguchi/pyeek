import type { PyodideInterface } from "pyodide";
import type { BridgeLoadingState, PyeekBridge } from "./bridge";
import type { PyeekResult } from "./pyeek-result";

// Next.js のバンドラ（webpack/Turbopack）は pyodide の wasm/stdlib zip を
// うまく扱えないため、public/pyodide/ に静的配置したファイルへ実行時に
// 素の import() で到達する。webpackIgnore は両バンドラで有効。
// 対象がリテラルでなく識別子なのは、tsc がこのパスを実モジュールとして
// 静的解決しようとして「モジュールが見つからない」エラーになるのを避けるため。
const PYODIDE_MODULE_URL = "/pyodide/pyodide.mjs";
const PYEEK_CORE_URL = "/py/pyeek_core.py";

type LoadPyodideFn = (options?: { indexURL?: string }) => Promise<PyodideInterface>;

let readyPromise: Promise<PyodideInterface> | null = null;

async function loadPyodideRuntime(
  onProgress?: (state: BridgeLoadingState) => void,
): Promise<PyodideInterface> {
  onProgress?.({ phase: "downloading", message: "Python エンジンをダウンロード中…" });
  const pyodideModule = (await import(/* webpackIgnore: true */ PYODIDE_MODULE_URL)) as unknown as {
    loadPyodide: LoadPyodideFn;
  };
  const pyodide = await pyodideModule.loadPyodide({ indexURL: "/pyodide/" });

  onProgress?.({ phase: "initializing", message: "pyeek_core を読み込み中…" });
  const coreResponse = await fetch(PYEEK_CORE_URL);
  const coreSource = await coreResponse.text();
  pyodide.runPython(coreSource);

  return pyodide;
}

class PyodideBridge implements PyeekBridge {
  private pyodide: PyodideInterface | null = null;

  async ready(onProgress?: (state: BridgeLoadingState) => void): Promise<void> {
    if (!readyPromise) {
      readyPromise = loadPyodideRuntime(onProgress).catch((error: unknown) => {
        // 失敗時は次回呼び出しでまた読み込みを試せるようにリセットする。
        readyPromise = null;
        throw error;
      });
    }
    this.pyodide = await readyPromise;
    onProgress?.({ phase: "ready", message: "準備完了" });
  }

  async analyzeAll(src: string): Promise<PyeekResult> {
    if (!this.pyodide) {
      throw new Error("PyodideBridge.ready() を先に呼び出してください");
    }
    const analyzeAllJson = this.pyodide.globals.get("analyze_all_json") as (
      source: string,
    ) => string;
    const json = analyzeAllJson(src);
    return JSON.parse(json) as PyeekResult;
  }
}

export const pyodideBridge: PyeekBridge = new PyodideBridge();
