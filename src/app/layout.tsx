import type { Metadata } from "next";
import { Quintessential } from "next/font/google";
import "./globals.css";

const quintessential = Quintessential({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-quintessential",
});

export const metadata: Metadata = {
  title: "Amuse-Oeil",
  description: "감정 기반 셰프 매칭 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased ${quintessential.variable}`}>
        {children}
      </body>
    </html>
  );
}
