import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Complete AI Agent Map",
  description:
    "Every agent a business needs, organized by department. Click any agent to see what it does, what it replaces, and how it connects.",
  alternates: { canonical: "/agents-map" },
  openGraph: {
    title: "The Complete AI Agent Map — 32 Agents, 7 Departments",
    description:
      "Every agent a business needs, organized by department. Click any agent to see what it does, what it replaces, and how it connects.",
    url: "https://work.51ultron.com/agents-map",
    images: [{ url: "/og/agents-map.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "The Complete AI Agent Map — 32 Agents, 7 Departments",
    description:
      "Every agent a business needs, organized by department. Click any agent to see what it does, what it replaces, and how it connects.",
  },
};

export default function AgentsMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
