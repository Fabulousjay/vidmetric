import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidMetrics — Competitor Intelligence",
  description: "Analyze any YouTube channel in seconds"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}