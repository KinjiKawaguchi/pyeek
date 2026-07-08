import { LabPage } from "@/pages/lab";

interface PageProps {
  searchParams: Promise<{ code?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { code } = await searchParams;
  const sharedSource = typeof code === "string" ? code : undefined;

  return <LabPage initialSource={sharedSource} />;
}
