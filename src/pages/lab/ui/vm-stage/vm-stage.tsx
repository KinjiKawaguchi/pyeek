"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { codePathKey, flattenCodeObjs, instrRange } from "@/entities/source-link";
import { easyOpLabel } from "../../config/bytecode-stage/labels";
import { useAnalysis } from "../../model/analysis-store";
import { simulateStack } from "../../model/vm-stage/stack-sim";
import "./vm-stage.css";
import { PlayerControls } from "./player-controls";
import { StackView } from "./stack-view";

const PLAY_INTERVAL_MS = 900;

const GUARD_MESSAGES: Record<string, ReactNode> = {
  "unsupported-jump": (
    <>
      このジャンプ命令はこのバージョンではまだ再生できません。まずは <code>n = 4</code> や{" "}
      <code>total = 2 + 3 * n</code> のような、くり返しの無いコードで試してみてください。
    </>
  ),
  "opaque-branch": (
    <>
      分岐条件の値がこの場では具体的に決まらないため再生できません（例:
      <code>len(data)</code> の <code>data</code> の中身は分かりません）。
      <code>x = 5; if x &gt; 3: ...</code> のように具体的な値を使ったコードで試してみてください。
    </>
  ),
  "opaque-iterable": (
    <>
      くり返す対象(イテラブル)の中身がこの場では具体的に決まらないため再生できません。
      <code>range(3)</code> のような具体的なコードで試してみてください。
    </>
  ),
};

function jumpBadge(step: { instr: { opname: string }; jump?: { taken: boolean } }) {
  if (!step.jump) return null;
  const { opname } = step.instr;
  const label =
    opname === "FOR_ITER"
      ? step.jump.taken
        ? "↷ くり返し終了"
        : "↻ 次の値へ"
      : step.jump.taken
        ? "↷ ジャンプした"
        : "→ そのまま次へ";
  return (
    <span
      className={`vm-stage__jump-badge${
        step.jump.taken ? " vm-stage__jump-badge--taken" : " vm-stage__jump-badge--not-taken"
      }`}
    >
      {label}
    </span>
  );
}

export function VmStage() {
  const { state, setSelectedRange } = useAnalysis();
  const root = state.result?.bytecode ?? null;
  const codeEntries = useMemo(() => (root ? flattenCodeObjs(root) : []), [root]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const activeEntry =
    codeEntries.find((entry) => codePathKey(entry.path) === selectedKey) ?? codeEntries[0] ?? null;
  const activeKey = activeEntry ? codePathKey(activeEntry.path) : null;

  const simResult = useMemo(
    () => (activeEntry ? simulateStack(activeEntry.code.instructions) : null),
    [activeEntry],
  );
  const steps = useMemo(() => (simResult?.ok ? simResult.steps : []), [simResult]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  // ユーザーが「▶ 再生」で表明した意図。実際に再生中かどうか（atEndなら
  // 自動的に停止済み扱い）は isPlaying として derive する。
  const [autoPlayRequested, setAutoPlayRequested] = useState(false);

  // activeKeyが切り替わった直前レンダーとの比較でのみリセットする
  // （Reactの「前回レンダーの情報を保持する」パターン。エフェクトを使わない
  // ことで、切り替え直後の1フレームだけ古いステップが見える瞬間が発生しない）。
  const [prevActiveKey, setPrevActiveKey] = useState(activeKey);
  if (activeKey !== prevActiveKey) {
    setPrevActiveKey(activeKey);
    setCurrentIndex(-1);
    setAutoPlayRequested(false);
  }

  const isPlaying = autoPlayRequested && currentIndex < steps.length - 1;
  const currentStep = currentIndex >= 0 ? (steps[currentIndex] ?? null) : null;

  // currentIndexを動かす操作（送り・戻し・巻き戻し・自動再生）をすべてここに
  // 集約し、表示ステップの切り替えと段間ハイライト(selectedRange)の更新を同じ
  // タイミングに揃える。Effectで追随させると1フレーム分ハイライトが遅れて見える。
  const goToIndex = useCallback(
    (next: number) => {
      setCurrentIndex(next);
      const step = next >= 0 ? (steps[next] ?? null) : null;
      const range = step ? instrRange(step.instr) : null;
      if (range) {
        setSelectedRange(range);
      }
    },
    [steps, setSelectedRange],
  );

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const timer = setTimeout(() => goToIndex(currentIndex + 1), PLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, goToIndex]);

  if (!root || !activeEntry) {
    return (
      <section className="card" aria-label="スタックマシン">
        <p className="card__title">
          <span className="card__emoji">🧮</span> スタックマシン
        </p>
        <p className="vm-stage__empty">（コードを入力してください）</p>
      </section>
    );
  }

  const codeTabs =
    codeEntries.length > 1 ? (
      <div className="vm-stage__code-tabs" role="tablist" aria-label="コードオブジェクト">
        {codeEntries.map((entry) => {
          const key = codePathKey(entry.path);
          return (
            <button
              type="button"
              key={key}
              role="tab"
              aria-selected={key === activeKey}
              className={`vm-stage__code-tab${key === activeKey ? " vm-stage__code-tab--active" : ""}`}
              onClick={() => setSelectedKey(key)}
            >
              {entry.path.join(" › ")}
            </button>
          );
        })}
      </div>
    ) : null;

  if (!simResult?.ok) {
    const message = simResult ? GUARD_MESSAGES[simResult.reason] : null;
    return (
      <section className="card" aria-label="スタックマシン">
        <p className="card__title">
          <span className="card__emoji">🧮</span> スタックマシン
        </p>
        {codeTabs}
        <p className="vm-stage__guard">{message ?? GUARD_MESSAGES["unsupported-jump"]}</p>
      </section>
    );
  }

  const stack = currentStep?.stackAfter ?? [];

  const handleTogglePlay = () => {
    if (currentIndex >= steps.length - 1) {
      // 完走後の「▶ 再生」は最初から再生し直す
      goToIndex(-1);
      setAutoPlayRequested(true);
      return;
    }
    setAutoPlayRequested((requested) => !requested);
  };

  const handleStepForward = () => {
    setAutoPlayRequested(false);
    goToIndex(Math.min(currentIndex + 1, steps.length - 1));
  };

  const handleStepBack = () => {
    setAutoPlayRequested(false);
    goToIndex(Math.max(currentIndex - 1, -1));
  };

  const handleRewind = () => {
    setAutoPlayRequested(false);
    goToIndex(-1);
  };

  return (
    <section className="card" aria-label="スタックマシン">
      <p className="card__title">
        <span className="card__emoji">🧮</span> スタックマシン
        <span className="vm-stage__hint">
          {state.mode === "easy" ? "命令どおりに皿を積んだり片付けたりする" : "評価スタックの再生"}
        </span>
      </p>
      {codeTabs}
      {simResult.truncated ? (
        <p className="vm-stage__truncated-banner" role="status">
          ⚠️ くり返しの回数が多すぎるため、{steps.length}ステップで打ち切りました
          （無限ループになっているかもしれません）。
        </p>
      ) : null}
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
              <span className="vm-stage__current-op">
                {state.mode === "easy"
                  ? easyOpLabel(currentStep.instr.opname)
                  : currentStep.instr.opname}
              </span>
              <span className="vm-stage__current-note">{currentStep.note}</span>
              {jumpBadge(currentStep)}
              {currentStep.iteration != null ? (
                <span className="vm-stage__iteration-badge">{currentStep.iteration}周目</span>
              ) : null}
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
