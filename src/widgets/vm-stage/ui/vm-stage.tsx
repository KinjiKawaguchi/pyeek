"use client";

import { useEffect, useMemo, useState } from "react";
import { instrRange, useAnalysis } from "@/entities/analysis";
import { simulateStack } from "../model/stack-sim";
import "./vm-stage.css";
import { PlayerControls } from "./player-controls";
import { StackView } from "./stack-view";

const PLAY_INTERVAL_MS = 900;

export function VmStage() {
  const { state, setSelectedRange } = useAnalysis();
  const root = state.result?.bytecode ?? null;
  const simResult = useMemo(() => (root ? simulateStack(root.instructions) : null), [root]);
  const steps = simResult?.ok ? simResult.steps : [];

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: ソース(root)が変わった時だけ再生位置をリセットしたい意図的な依存
  useEffect(() => {
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, [root]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    if (currentIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentIndex((i) => i + 1), PLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, steps.length]);

  const currentStep = currentIndex >= 0 ? (steps[currentIndex] ?? null) : null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentStep の命令が変わった時だけ他ステージと同期したい意図的な依存
  useEffect(() => {
    if (!currentStep) {
      return;
    }
    const range = instrRange(currentStep.instr);
    if (range) {
      setSelectedRange(range);
    }
  }, [currentStep]);

  if (!root) {
    return (
      <section className="card" aria-label="スタックマシン">
        <p className="card__title">
          <span className="card__emoji">🧮</span> スタックマシン
        </p>
        <p className="vm-stage__empty">（コードを入力してください）</p>
      </section>
    );
  }

  if (!simResult?.ok) {
    return (
      <section className="card" aria-label="スタックマシン">
        <p className="card__title">
          <span className="card__emoji">🧮</span> スタックマシン
        </p>
        <p className="vm-stage__guard">
          ループ・分岐は次のバージョンで対応予定です。まずは <code>n = 4</code> や{" "}
          <code>total = 2 + 3 * n</code> のような、くり返しの無いコードで試してみてください。
        </p>
      </section>
    );
  }

  const stack = currentStep?.stackAfter ?? [];

  const handleTogglePlay = () => {
    if (!isPlaying && currentIndex >= steps.length - 1) {
      setCurrentIndex(-1);
    }
    setIsPlaying((playing) => !playing);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentIndex((i) => Math.max(i - 1, -1));
  };

  const handleRewind = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
  };

  return (
    <section className="card" aria-label="スタックマシン">
      <p className="card__title">
        <span className="card__emoji">🧮</span> スタックマシン
        <span className="vm-stage__hint">
          {state.mode === "easy" ? "命令どおりに皿を積んだり片付けたりする" : "評価スタックの再生"}
        </span>
      </p>
      <PlayerControls
        currentIndex={currentIndex}
        stepCount={steps.length}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onStepBack={handleStepBack}
        onStepForward={handleStepForward}
        onRewind={handleRewind}
      />
      <div className="vm-stage__body">
        <div className="vm-stage__current">
          {currentStep ? (
            <>
              <span className="vm-stage__current-op">{currentStep.instr.opname}</span>
              <span className="vm-stage__current-note">{currentStep.note}</span>
            </>
          ) : (
            <span className="vm-stage__current-note">▶ を押すと実行が始まります</span>
          )}
        </div>
        <StackView stack={stack} />
      </div>
    </section>
  );
}
