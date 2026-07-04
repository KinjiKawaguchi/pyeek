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
        disabled={atEnd && !isPlaying}
      >
        {isPlaying ? "⏸ 一時停止" : "▶ 再生"}
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
