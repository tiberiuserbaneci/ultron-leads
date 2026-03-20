import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Ultron pricing: Free Starter plan, $19/month Max with full agent execution, or $297/month Enterprise with white-label deployment and up to 1,000 agents.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Ultron",
    description:
      "Ultron pricing: Free Starter plan, $19/month Max with full agent execution, or $297/month Enterprise with white-label deployment and up to 1,000 agents.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
