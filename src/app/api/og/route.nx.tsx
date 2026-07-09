import { ImageResponse } from "next/og";
import { DEFAULT_SOURCE, decodeSharedSource } from "@/pages/lab";

const TAGLINE = "Python が動くまでを見るラボ";
const MAX_PREVIEW_LINES = 6;
const MAX_PREVIEW_CHARS = 220;
// Satori (next/og の内部エンジン) が woff2 のbrotli展開に対応していないため、
// woff2を返さない古いUAを装ってGoogle FontsからTTFを取得する。
const GOOGLE_FONT_UA = "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko";

function buildPreview(source: string): string {
  const lines = source.split("\n").slice(0, MAX_PREVIEW_LINES);
  const joined = lines.join("\n").slice(0, MAX_PREVIEW_CHARS);
  return joined.length < source.length ? `${joined}…` : joined;
}

// Satori はデフォルトでラテン文字しか描画できない。共有されるPythonコードは
// 日本語の文字列リテラルを含みうる（DEFAULT_SOURCE 自体がそう）ため、実際に
// 描画する文字だけをGoogle Fontsのtext=パラメータでサブセット取得する
// （フルフォントを同梱せずペイロードを小さく保つ）。取得に失敗しても
// 画像生成自体は継続し、日本語部分だけが欠けた見た目になる。
async function loadJapaneseFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssResponse = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": GOOGLE_FONT_UA } },
    );
    const css = await cssResponse.text();
    const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!fontUrl) {
      return null;
    }
    const fontResponse = await fetch(fontUrl);
    return await fontResponse.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const source = (code ? decodeSharedSource(code) : null) ?? DEFAULT_SOURCE;
  const preview = buildPreview(source);
  const fontData = await loadJapaneseFont(`${TAGLINE}${preview}`);
  const fontFamily = fontData ? "Noto Sans JP" : undefined;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: "56px",
        background: "#f3f1fb",
        fontFamily,
      }}
    >
      <span
        style={{
          display: "flex",
          alignSelf: "flex-start",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 2,
          color: "#7d55c9",
          background: "#fff",
          border: "3px solid #e6dbfa",
          borderRadius: 999,
          padding: "8px 20px",
        }}
      >
        🐍 PYEEK
      </span>
      <div
        style={{ display: "flex", marginTop: 28, fontSize: 34, fontWeight: 800, color: "#2b2450" }}
      >
        {TAGLINE}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: 32,
          background: "#ffffff",
          border: "3px solid #e2ddf5",
          borderRadius: 22,
          padding: "32px 36px",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "pre-wrap",
            fontSize: 26,
            lineHeight: 1.6,
            color: "#2b2450",
            fontFamily,
          }}
        >
          {preview}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: fontData ? [{ name: "Noto Sans JP", data: fontData, style: "normal" }] : undefined,
    },
  );
}
