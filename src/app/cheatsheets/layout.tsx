import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Cheatsheets",
  description:
    "Visual reference guides for Claude and AI prompt engineering. Free, printable cheatsheets covering workflows, techniques, and best practices.",
  alternates: { canonical: "/cheatsheets" },
  openGraph: {
    title: "Claude Cheatsheets | Ultron",
    description:
      "Visual reference guides for Claude and AI prompt engineering. Free, printable cheatsheets covering workflows, techniques, and best practices.",
    url: "/cheatsheets",
  },
};

export default function CheatsheetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
