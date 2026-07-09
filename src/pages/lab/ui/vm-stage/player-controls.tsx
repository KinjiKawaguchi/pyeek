export interface PlayerControlsProps {
  currentIndex: number;
  stepCount: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onRewind: () => void;
}

export function PlayerControls({
  currentIndex,
  stepCount,
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onRewind,
}: PlayerControlsProps) {
  const atStart = currentIndex <= -1;
  const atEnd = currentIndex >= stepCount - 1;
  // 完走後の「▶ 再生」は最初から再生し直す操作のため、atEndでも無効化しない。
  // 無効化するのはそもそも再生できるステップが無い場合のみ。
  const hasNoSteps = stepCount === 0;
  // 完走後は「1つ進む」の延長ではなく「最初から再生し直す」という別の操作に
  // なるため、ラベルを変えて区別する。
  const hasFinished = atEnd && !hasNoSteps;

  return (
    <div className="player-controls">
      <button type="button" className="player-controls__btn" onClick={onRewind} disabled={atStart}>
        ⏮ 最初へ
      </button>
      <button
        type="button"
        className="player-controls__btn"
        onClick={onStepBack}
        disabled={atStart}
      >
        ◀ 1つ戻る
      </button>
      <button
        type="button"
        className="player-controls__btn player-controls__btn--main"
        onClick={onTogglePlay}
        disabled={hasNoSteps}
      >
        {isPlaying ? "⏸ 一時停止" : hasFinished ? "⭯ もう一度再生" : "▶ 再生"}
      </button>
      <button
        type="button"
        className="player-controls__btn"
        onClick={onStepForward}
        disabled={atEnd}
      >
        1つ進む ▶
      </button>
      <span className="player-controls__progress">
        {currentIndex + 1} / {stepCount}
      </span>
    </div>
  );
}
