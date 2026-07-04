"use client";

import { useAnalysis } from "@/entities/analysis";
import { PRESETS } from "../config/presets";

export function PresetPicker() {
  const { setSource } = useAnalysis();

  return (
    <div className="presets">
      {PRESETS.map((preset) => {
        const firstLine = preset.split("\n")[0] ?? "";
        const label = preset.includes("\n") ? `${firstLine} …` : firstLine;
        return (
          <button
            key={preset}
            type="button"
            className="preset"
            title={preset}
            onClick={() => setSource(preset)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
