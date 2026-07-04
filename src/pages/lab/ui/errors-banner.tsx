"use client";

import { useAnalysis } from "@/entities/analysis";

// pyeek_core 側（tokenize/ast/dis）の構文エラー等。Bridge 自体の失敗
// （runtimeError）とは別に、正常に返ってきた解析結果内のエラー配列を表示する。
export function ErrorsBanner() {
  const { state } = useAnalysis();
  const errors = state.result?.errors ?? [];
  if (errors.length === 0) return null;

  return <div className="errors-banner">⚠ {errors.map((error) => error.msg).join(" / ")}</div>;
}
