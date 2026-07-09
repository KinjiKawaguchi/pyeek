import type { Metadata } from "next";
import { decodeSharedSource, LabPage } from "@/pages/lab";

interface PageProps {
  searchParams: Promise<{ code?: string | string[] }>;
}

// リンクをSNSに貼った際、今表示中のコードを反映したOGP画像
// (/api/og) が展開されるようにする。generateMetadata はpage単位でしか
// searchParams を受け取れないため、layout側の静的metadataとは別にここで
// 動的に上書きする。
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { code } = await searchParams;
  const ogImageUrl =
    typeof code === "string" ? `/api/og?code=${encodeURIComponent(code)}` : "/api/og";

  return {
    openGraph: { images: [ogImageUrl] },
    twitter: { card: "summary_large_image", images: [ogImageUrl] },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { code } = await searchParams;
  const sharedSource =
    typeof code === "string" ? (decodeSharedSource(code) ?? undefined) : undefined;

  return <LabPage initialSource={sharedSource} />;
}
