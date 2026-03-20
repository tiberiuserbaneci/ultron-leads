import type { Metadata } from "next";
import NexityNav from "@/components/NexityNav";
import NexityFooter from "@/components/NexityFooter";

export const metadata: Metadata = {
  title: "NXT Enterprises — AI & Blockchain Infrastructure",
  description:
    "AI and blockchain infrastructure for the autonomous economy. Powering Ultron, NXT RWA OS, and DealMaker.",
  openGraph: {
    type: "website",
    siteName: "NXT Enterprises",
    locale: "en_US",
  },
};

export default function NexityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#faf8f5] text-[#1a1a1a] min-h-screen">
      <NexityNav />
      <main className="pt-[72px]">{children}</main>
      <NexityFooter />
    </div>
  );
}
