import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ultron Command Center",
  description:
    "Real-time dashboard showing AI agent performance across sales, content, outreach, research, and monitoring. The CEO view of an AI-native business.",
  openGraph: {
    title: "Ultron Command Center — Live Business Intelligence",
    description:
      "Real-time dashboard showing AI agent performance across sales, content, outreach, research, and monitoring. The CEO view of an AI-native business.",
    url: "https://work.51ultron.com/live",
    images: [{ url: "/og/live.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Ultron Command Center — Live Business Intelligence",
    description:
      "Real-time dashboard showing AI agent performance across sales, content, outreach, research, and monitoring. The CEO view of an AI-native business.",
  },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
