// Pyodide の初期化・解析実行を専用スレッドで行う Web Worker。
//
// pyodide-bridge.ts と同じ理由（Next.js のバンドラが pyodide の wasm/stdlib
// zip をうまく扱えない）に加えて、Worker はブラウザが素の URL 文字列から
// 直接読み込む実行コンテキストのため、そもそも Next.js のバンドラを経由し
// ない。手書きのまま public/ 直下に置き、lint/typecheck 対象からも
// eslint.config.mjs の public/** 除外・tsconfig の include 対象外により
// 自然に外れる。

let pyodideReadyPromise = null;

async function loadPyodideRuntime() {
  postMessage({ type: "progress", phase: "downloading", message: "Python エンジンをダウンロード中…" });
  const pyodideModule = await import("/pyodide/pyodide.mjs");
  const pyodide = await pyodideModule.loadPyodide({ indexURL: "/pyodide/" });

  postMessage({ type: "progress", phase: "initializing", message: "pyeek_core を読み込み中…" });
  const coreResponse = await fetch("/py/pyeek_core.py");
  const coreSource = await coreResponse.text();
  pyodide.runPython(coreSource);

  return pyodide;
}

function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

self.onmessage = async (event) => {
  const msg = event.data;

  if (msg.type === "ready") {
    if (!pyodideReadyPromise) {
      pyodideReadyPromise = loadPyodideRuntime().catch((error) => {
        pyodideReadyPromise = null;
        throw error;
      });
    }
    try {
      await pyodideReadyPromise;
      postMessage({ type: "ready" });
    } catch (error) {
      postMessage({ type: "error", message: toErrorMessage(error) });
    }
    return;
  }

  if (msg.type === "analyzeAll") {
    try {
      const pyodide = await pyodideReadyPromise;
      const analyzeAllJson = pyodide.globals.get("analyze_all_json");
      const json = analyzeAllJson(msg.src);
      postMessage({ type: "result", requestId: msg.requestId, json });
    } catch (error) {
      postMessage({ type: "error", requestId: msg.requestId, message: toErrorMessage(error) });
    }
  }
};
