import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource Library",
  description:
    "Free resources for founders: Claude skills library, AI cheatsheets, professional client templates, and RFP builder. All tools to accelerate your AI automation.",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "Resource Library | Ultron",
    description:
      "Free resources for founders: Claude skills library, AI cheatsheets, professional client templates, and RFP builder.",
    url: "/library",
  },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
