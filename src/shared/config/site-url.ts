// Vercel は環境ごとに VERCEL_URL（デプロイ固有ホスト名）と
// VERCEL_PROJECT_PRODUCTION_URL（本番カスタムドメイン）を自動注入する。
// 本番ビルドではカスタムドメインを、プレビュー/開発では実際のデプロイ先の
// ホストを使うことで、OGP画像URL等の絶対URL解決をどの環境でも正しく行う
// （プレビューデプロイのOGP画像がそのプレビュー自身の内容を反映するように）。
export function getSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
