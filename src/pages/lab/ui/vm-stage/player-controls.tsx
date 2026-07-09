export interface PlayerControlsProps {
  currentIndex: number;
  stepCount: number;
  isPlaying: boolean;
  // GIF書き出し中など、外部要因で操作を一時的に禁止したい場合。
  disabled?: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onRewind: () => void;
}

export function PlayerControls({
  currentIndex,
  stepCount,
  isPlaying,
  disabled = false,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onRewind,
}: PlayerControlsProps) {
  const atStart = currentIndex <= -1;
  const atEnd = currentIndex >= stepCount - 1;

  return (
    <div className="player-controls">
      <button
        type="button"
        className="player-controls__btn"
        onClick={onRewind}
        disabled={disabled || atStart}
      >
        ⏮ 最初へ
      </button>
      <button
        type="button"
        className="player-controls__btn"
        onClick={onStepBack}
        disabled={disabled || atStart}
      >
        ◀ 1つ戻る
      </button>
      <button
        type="button"
        className="player-controls__btn player-controls__btn--main"
        onClick={onTogglePlay}
        disabled={disabled || (atEnd && !isPlaying)}
      >
        {isPlaying ? "⏸ 一時停止" : "▶ 再生"}
      </button>
      <button
        type="button"
        className="player-controls__btn"
        onClick={onStepForward}
        disabled={disabled || atEnd}
      >
        1つ進む ▶
      </button>
      <span className="player-controls__progress">
        {currentIndex + 1} / {stepCount}
      </span>
    </div>
  );
}
