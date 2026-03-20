import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFP Builder - AI Workflow Intake",
  description:
    "Define your AI automation scope with a structured 7-section intake form. Covers business context, workflow design, tech stack, delivery expectations, and review checklist.",
  alternates: { canonical: "/rfp" },
  openGraph: {
    title: "RFP Builder - AI Workflow Intake | Ultron",
    description:
      "Define your AI automation scope with a structured 7-section intake form covering workflow design, tech stack, and delivery expectations.",
    url: "/rfp",
  },
};

export default function RFPLayout({ children }: { children: React.ReactNode }) {
  return children;
}
