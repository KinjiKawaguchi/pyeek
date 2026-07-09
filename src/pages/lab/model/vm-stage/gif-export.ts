import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { toCanvas } from "html-to-image";

// フレーム数が多いほど1枚ごとのDOMキャプチャが積み重なり体感生成時間が伸びる
// （手元計測で34フレーム≒22秒）ため、共有用途として十分な範囲に抑える。
const DEFAULT_MAX_FRAMES = 24;
const DEFAULT_FRAME_DELAY_MS = 550;
// seek後、CSSアニメーション（stack-view.tsx の plate-pop/フェード。
// POP_FADE_MS=260ms）が収まるまで待ってからキャプチャする。
// DOM反映を待つ二重rAFとは別に必要。
const DEFAULT_SETTLE_DELAY_MS = 280;

// steps.length と上限フレーム数から、間引いたフレームインデックス列を作る。
// -1（未実行・スタック空の初期状態）を先頭に含め、全体を均等にサンプリングする。
export function buildFrameIndices(stepCount: number, maxFrames: number): number[] {
  const total = stepCount + 1;
  if (total <= maxFrames) {
    return Array.from({ length: total }, (_, i) => i - 1);
  }
  const picked = new Set<number>();
  for (let i = 0; i < maxFrames; i++) {
    const t = maxFrames === 1 ? 0 : i / (maxFrames - 1);
    picked.add(Math.round(t * (total - 1)) - 1);
  }
  return [...picked].sort((a, b) => a - b);
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface CaptureGifOptions {
  element: HTMLElement;
  stepCount: number;
  // 指定したステップindex（-1始まり）を表示中の状態に切り替える。
  // 呼び出し側（VmStage）の setCurrentIndex をそのまま渡す想定。
  seek: (index: number) => void;
  maxFrames?: number;
  frameDelayMs?: number;
  settleDelayMs?: number;
}

// 再生の各ステップをコマ撮りしてアニメーションGIFに書き出す。
// スタックマシンの「動いているところ」そのものを共有できるようにするため
// （静止画のOGP画像や単なる共有リンクとは別の、Pyeekならではの見せ方）。
export async function captureStepsAsGif({
  element,
  stepCount,
  seek,
  maxFrames = DEFAULT_MAX_FRAMES,
  frameDelayMs = DEFAULT_FRAME_DELAY_MS,
  settleDelayMs = DEFAULT_SETTLE_DELAY_MS,
}: CaptureGifOptions): Promise<Blob> {
  const indices = buildFrameIndices(stepCount, maxFrames);
  const gif = GIFEncoder();

  for (const index of indices) {
    seek(index);
    await waitForPaint();
    await wait(settleDelayMs);

    // GIF生成ボタン自身（「生成中…」ラベル）は成果物に写り込むとノイズになるため除外する。
    const canvas = await toCanvas(element, {
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      filter: (node) =>
        !(node instanceof HTMLElement && node.classList.contains("vm-stage__gif-export-btn")),
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2D描画コンテキストを取得できませんでした");
    }
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const palette = quantize(data, 256);
    const paletteIndex = applyPalette(data, palette);
    gif.writeFrame(paletteIndex, width, height, { palette, delay: frameDelayMs, repeat: 0 });
  }

  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}

const SHARE_TITLE = "Pyeek — スタックマシンの動き";

// Web Share API のファイル共有に対応していればそのまま共有シートを開き、
// 非対応環境ではダウンロードにフォールバックする（ShareSnsButton と同じ方針）。
export async function shareOrDownloadGif(blob: Blob): Promise<void> {
  const file = new File([blob], "pyeek-vm-stage.gif", { type: "image/gif" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: SHARE_TITLE });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pyeek-vm-stage.gif";
  anchor.click();
  URL.revokeObjectURL(url);
}
