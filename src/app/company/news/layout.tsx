import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News — NXT Enterprises",
  description:
    "Latest news, insights, and product updates from NXT Enterprises and Ultron.",
  openGraph: {
    type: "website",
    siteName: "NXT Enterprises",
    locale: "en_US",
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
