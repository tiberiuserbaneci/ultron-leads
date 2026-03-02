import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import MobileCTA from "@/components/MobileCTA";

export const metadata: Metadata = {
  metadataBase: new URL("https://work.51ultron.com"),
  title: {
    default: "Ultron — AI Agents for Founders",
    template: "%s | Ultron",
  },
  description: "5 AI agents that replace a full team. Research, leads, sales, content, and monitoring — running 24/7 for $19/month.",
  openGraph: {
    type: "website",
    siteName: "Ultron",
    locale: "en_US",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@51ultron",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#060606] text-white min-h-screen">
        <Nav />
        <main className="pt-14 pb-20 sm:pb-0">
          {children}
        </main>
        <MobileCTA />
      </body>
    </html>
  );
}
