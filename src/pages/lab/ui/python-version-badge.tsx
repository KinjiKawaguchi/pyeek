"use client";

import { useAnalysis } from "@/entities/analysis";

export function PythonVersionBadge() {
  const { state } = useAnalysis();
  if (!state.result) return null;

  return (
    <span className="badge">
      <span className="badge__dot" />
      Python {state.result.pythonVersion}
    </span>
  );
}
