import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Engine — Build Your Growth Engine",
  description:
    "Choose a founder-led growth engine. See which agents activate, what roles get replaced, and how the system compounds over time.",
  openGraph: {
    title: "Client Engine — Build the Growth Engine Ultron Should Deploy",
    description:
      "6 prebuilt revenue engines. Interactive strategy console for founder-led businesses. See opportunity signals, agent activation, team replacement, and compounding outcomes.",
    url: "https://work.51ultron.com/client-engine",
    images: [{ url: "/og/client-engine.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "Client Engine — Build the Growth Engine Ultron Should Deploy",
    description:
      "6 prebuilt revenue engines. Interactive strategy console for founder-led businesses.",
  },
};

export default function ClientEngineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
