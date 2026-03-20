import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ultron Brain - Command Center",
  description:
    "The AI command center that handles repeatable work and brings you only decisions worth making. Planning, evaluation, execution, and deployment in one interface.",
  alternates: { canonical: "/brain" },
  openGraph: {
    title: "Ultron Brain - Command Center | Ultron",
    description:
      "The AI command center that handles repeatable work and brings you only decisions worth making.",
    url: "/brain",
  },
};

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return children;
}
