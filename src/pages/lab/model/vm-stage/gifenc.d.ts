// gifenc は型定義を同梱しておらず、@types/gifenc も存在しないため、
// 実際に使う範囲のみを最小限に手書きする。
declare module "gifenc" {
  export type GifPalette = number[][];

  export interface QuantizeOptions {
    format?: "rgb565" | "rgba4444" | "rgb444";
    clearAlpha?: boolean;
    clearAlphaColor?: number;
    clearAlphaThreshold?: number;
    oneBitAlpha?: boolean;
    useSqrt?: boolean;
  }

  export function quantize(
    rgba: Uint8Array<ArrayBuffer> | Uint8ClampedArray,
    maxColors: number,
    opts?: QuantizeOptions,
  ): GifPalette;

  export function applyPalette(
    rgba: Uint8Array<ArrayBuffer> | Uint8ClampedArray,
    palette: GifPalette,
    format?: "rgb565" | "rgba4444" | "rgb444",
  ): Uint8Array<ArrayBuffer>;

  export interface WriteFrameOptions {
    palette?: GifPalette;
    delay?: number;
    transparent?: boolean;
    transparentIndex?: number;
    repeat?: number;
    colorDepth?: number;
    dispose?: number;
  }

  export interface GifEncoderInstance {
    writeFrame(
      index: Uint8Array<ArrayBuffer>,
      width: number,
      height: number,
      opts?: WriteFrameOptions,
    ): void;
    finish(): void;
    bytes(): Uint8Array<ArrayBuffer>;
  }

  export function GIFEncoder(opts?: {
    initialCapacity?: number;
    auto?: boolean;
  }): GifEncoderInstance;
}
