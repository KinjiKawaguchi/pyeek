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
