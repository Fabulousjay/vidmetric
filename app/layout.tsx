import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "VidMetrics — YouTube Competitor Analysis",
  description: "Instantly analyze any YouTube channel's top performing videos, trends, and engagement metrics."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jakarta.variable} ${dmMono.variable}`}
    >
      <body className="font-body">
        <Nav />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}