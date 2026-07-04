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
};

export default nextConfig;
