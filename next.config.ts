import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // FSD の canonical layer 名 `pages/` と Next.js Pages Router の
  // ファイルシステムルーティング自動検出が名前衝突する（Next.js は
  // src/pages/ の存在だけを見て Pages Router と判定し、ルート直下の
  // App Router `app/` と共存できず build が落ちる。Pages Router を
  // 無効化する設定は存在しない）。App Router のルートファイルだけが持つ
  // 拡張子に限定することで、FSD 配下の `src/pages/**` を検出対象から外す。
  // 同じ workaround を lol-draft-ai/apps/web でも採用している
  // （上流 issue: https://github.com/vercel/next.js/issues/51478）。
  pageExtensions: ["nx.tsx", "nx.ts"],

  // Traefik 経由（`pyeek.localhost`）でこのマシン上から動作確認する際、
  // dev サーバーが別オリジンからのリクエストとして拒否しないようにする。
  allowedDevOrigins: ["pyeek.localhost"],

  images: {
    // GitHub Star数バッジ（shields.io の動的SVG）用。SVGはNext.jsの画像最適化
    // パイプラインに通さず(unoptimized)そのまま配信する（公式ドキュメント推奨:
    // dangerouslyAllowSVGではなくunoptimizedを使う）。
    remotePatterns: [{ protocol: "https", hostname: "img.shields.io" }],
  },

  headers: async () => [
    // Pyodide の WASM ビルドは pthread(マルチスレッド)対応でコンパイルされて
    // おり、内部で `WebAssembly.Memory({ shared: true })` を確保する。
    // これは実体としては SharedArrayBuffer で、クロスオリジン分離
    // (COOP+COEP) が無い状態で使うと将来のブラウザで禁止される非推奨
    // 警告が出る（Lighthouse の "Uses deprecated APIs" で検出）。
    // COEP: require-corp は他オリジンのリソースにCORP/CORSヘッダーを
    // 要求するため、GitHub Starsバッジ(img.shields.io)が
    // `Cross-Origin-Resource-Policy: cross-origin` を返すことを確認
    // 済み(curlで実測)。
    //
    // 本番ビルドでのみ有効化する。開発モードでは @vercel/analytics が
    // デバッグ用スクリプト(va.vercel-scripts.com/v1/script.debug.js、
    // クロスオリジン・CORPヘッダー無し)を読み込むため、COEPを有効にすると
    // このスクリプトがブロックされる。本番ビルドでは同スクリプトは読み込まれず
    // 同一オリジンの /_vercel/insights/script.js が使われるため影響しない。
    ...(process.env.NODE_ENV === "production"
      ? [
          {
            source: "/:path*",
            headers: [
              {
                key: "Cross-Origin-Opener-Policy",
                value: "same-origin",
              },
              {
                key: "Cross-Origin-Embedder-Policy",
                value: "require-corp",
              },
            ],
          },
        ]
      : []),
    {
      // Pyodide ランタイムファイルのキャッシュ設定。
      // immutable キャッシュを採用しない理由：
      // - ファイル名にハッシュが付いていない（pyodide.mjs, pyodide.asm.wasm など）
      // - pyodide パッケージバージョンが package.json で ^0.27.0 と指定されており、
      //   npm/pnpm update で 0.27.1 以上にアップデートされる可能性がある
      // - この場合、ファイル内容は変わるが URL は変わらないため、
      //   immutable キャッシュではクライアント側が古いバージョンをキャッシュしたままになる恐れがある
      //
      // 戦略：
      // - max-age=604800（7日間）の短期キャッシュを設定
      // - 7日は実運用的には十分な長さで、ほとんどのクライアントがそれまでにアップデートを取得できる
      // - サーバー再起動時に自動で検証される（ETag/Last-Modified）
      // - アップデート時は明示的なデプロイで全クライアントに波及させる
      source: "/pyodide/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800",
        },
      ],
    },
    {
      source: "/py/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=604800",
        },
      ],
    },
  ],
};

export default nextConfig;
