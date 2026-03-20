import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Kit - Professional Templates",
  description:
    "14 professional client templates including agreements, invoices, project briefs, discovery calls, welcome docs, and delivery guides. Print-ready, editable, no signup required.",
  alternates: { canonical: "/client-kit" },
  openGraph: {
    title: "Client Kit - Professional Templates | Ultron",
    description:
      "14 professional client templates including agreements, invoices, project briefs, discovery calls, welcome docs, and delivery guides.",
    url: "/client-kit",
  },
};

export default function ClientKitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
