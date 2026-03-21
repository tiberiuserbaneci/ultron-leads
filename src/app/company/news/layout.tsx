import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News — NXT Enterprises",
  description:
    "Latest news, insights, and product updates from NXT Enterprises and Ultron — covering AI agents, agentic AI, and AI for business.",
  alternates: {
    canonical: "https://work.51ultron.com/company/news",
  },
  openGraph: {
    type: "website",
    title: "News — NXT Enterprises",
    description:
      "Latest news, insights, and product updates from NXT Enterprises and Ultron.",
    siteName: "NXT Enterprises",
    locale: "en_US",
    url: "https://work.51ultron.com/company/news",
    images: [
      {
        url: "https://work.51ultron.com/og/home.png",
        width: 1200,
        height: 630,
        alt: "NXT Enterprises News",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@51ultron",
    title: "News — NXT Enterprises",
    description:
      "Latest news, insights, and product updates from NXT Enterprises and Ultron.",
    images: ["https://work.51ultron.com/og/home.png"],
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > div > div.bg-\\[\\#faf8f5\\] { background: #ffffff !important; }
      `}</style>
      {children}
    </>
  );
}
