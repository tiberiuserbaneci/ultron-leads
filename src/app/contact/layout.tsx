import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Get in touch with the Ultron team for enterprise agreements, custom integrations, rate limits, invoicing, and product support.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Sales | Ultron",
    description:
      "Get in touch with the Ultron team for enterprise agreements, custom integrations, rate limits, invoicing, and product support.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
