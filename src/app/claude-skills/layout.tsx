import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Skills Library",
  description:
    "Browse 12 production-ready AI skills for Claude Code. Inspect, download, and deploy skills for research, outreach, content, and automation workflows.",
  alternates: { canonical: "/claude-skills" },
  openGraph: {
    title: "Claude Skills Library | Ultron",
    description:
      "Browse 12 production-ready AI skills for Claude Code. Inspect, download, and deploy skills for research, outreach, content, and automation workflows.",
    url: "/claude-skills",
  },
};

export default function ClaudeSkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
