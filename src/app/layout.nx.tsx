import type { Metadata } from "next";
import { JetBrains_Mono, M_PLUS_Rounded_1c, Zen_Maru_Gothic } from "next/font/google";
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
  title: "Pyeek — Python が動くまでを見るラボ",
  description:
    "Python の字句解析・構文解析・コンパイル・実行を、本物の CPython の内部表現で串刺しに可視化する教育用アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
