import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ultron Demo - Watch AI Agents Execute in Real Time",
  description:
    "Pick a command. Watch 5 AI agents coordinate across sales, content, outreach, research, and monitoring. Interactive workflow visualization.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Ultron Demo - Watch AI Agents Execute in Real Time",
    description:
      "Pick a command. Watch 5 AI agents coordinate across sales, content, outreach, research, and monitoring. Interactive workflow visualization.",
    images: ["/og/demo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultron Demo - Watch AI Agents Execute in Real Time",
    description:
      "Pick a command. Watch 5 AI agents coordinate across sales, content, outreach, research, and monitoring.",
    images: ["/og/demo.png"],
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
