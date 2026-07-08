import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { JetBrains_Mono, M_PLUS_Rounded_1c, Zen_Maru_Gothic } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getSiteUrl } from "@/shared/config";
import "./styles/globals.css";

const bodyFont = M_PLUS_Rounded_1c({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Zen_Maru_Gothic({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const monoFont = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  // OGP画像等、page側で組み立てる相対URLの解決基点。
  metadataBase: new URL(getSiteUrl()),
  title: "Pyeek — Python が動くまでを見るラボ",
  description:
    "Python の字句解析・構文解析・コンパイル・実行の4段階で、同じコードがどう姿を変えていくかを本物の CPython の内部表現で可視化する教育用アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable}`}>
      <head>
        {/* Pyodide の主要アセットをHTML解析時点でブラウザのプリロードスキャナに
            拾わせるため、RSC側で直接 <head> に出力する(useEffectでの後付けだと
            ハイドレーション後になり、プリロードスキャナの恩恵を受けられない)。 */}
        <link
          rel="preload"
          href="/pyodide/pyodide.asm.wasm"
          as="fetch"
          type="application/wasm"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/pyodide/python_stdlib.zip"
          as="fetch"
          type="application/zip"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
