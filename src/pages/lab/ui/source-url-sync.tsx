"use client";

import { useQueryState } from "nuqs";
import { useEffect, useMemo } from "react";
import { debounce } from "@/shared/lib/debounce";
import { DEFAULT_SOURCE } from "../config/presets";
import { useAnalysis } from "../model/analysis-store";
import { encodeSharedSource } from "../model/share/code-param";

const URL_SYNC_DEBOUNCE_MS = 500;

// エディタの内容を URL の code パラメータに同期する副作用専用コンポーネント。
// URL をコピーするだけで今のコードを共有できるようにするため。
// 既定のコードのときは URL を汚さないよう code パラメータ自体を外す。
// nuqs 標準の limitUrlUpdates（throttle）は連続更新時に中間状態を先に
// flush してしまうことがあり最終値を取りこぼすため、確実に最後の値だけを
// 送る自前の debounce（analysis-store の解析デバウンスと同じユーティリティ）
// で包む。
export function SourceUrlSync() {
  const {
    state: { source },
  } = useAnalysis();
  const [, setCodeParam] = useQueryState("code", { history: "replace" });

  const debouncedSetCodeParam = useMemo(
    () => debounce((value: string | null) => void setCodeParam(value), URL_SYNC_DEBOUNCE_MS),
    [setCodeParam],
  );

  useEffect(() => {
    debouncedSetCodeParam(source === DEFAULT_SOURCE ? null : encodeSharedSource(source));
  }, [source, debouncedSetCodeParam]);

  return null;
}
