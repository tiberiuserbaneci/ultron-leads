import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import ROICalculator from "./ROICalculator";

export const metadata: Metadata = {
  title: "AI Team ROI Calculator",
  description: "Calculate how much doing everything manually is costing you. See your savings with 5 AI agents at $19/month.",
  openGraph: {
    title: "AI Team ROI Calculator | Ultron",
    description: "Calculate how much doing everything manually is costing you. See your savings with 5 AI agents at $19/month.",
    url: "https://work.51ultron.com/calculator",
    images: [{ url: "/og/calculator.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "AI Team ROI Calculator | Ultron",
    description: "Calculate how much doing everything manually is costing you.",
  },
};

export default function CalculatorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#DA4E24]">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span className="text-[#DA4E24] text-sm font-medium">ROI Calculator</span>
        </div>
        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          How much is doing everything manually costing you?
        </h1>
        <p className="animate-fade-up-2 text-xl text-[#999] max-w-2xl mx-auto">
          Calculate what you would save with 5 AI agents.
        </p>
      </div>

      {/* Calculator */}
      <ROICalculator />

      {/* Instead of agent cards. single line cross-link */}
      <div className="mt-12 text-center p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
        <p className="text-[#999] text-sm">
          5 agents. Every department. Full breakdown →{" "}
          <Link href="/blueprint" className="text-[#DA4E24] hover:text-[#DA4E24] transition-colors font-medium underline underline-offset-2">
            See the Blueprint
          </Link>
        </p>
      </div>

      {/* Cross-page nav */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <Link href="/blueprint" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">SEE THE ARCHITECTURE</div>
            <div className="font-semibold text-white text-sm">See the 5-agent architecture</div>
            <div className="text-xs text-[#999] mt-0.5">The 5-Agent Blueprint</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link href="/stack" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">SEE THE REVENUE</div>
            <div className="font-semibold text-white text-sm">See how it generates $10K/month</div>
            <div className="text-xs text-[#999] mt-0.5">The $10K/Month Stack</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Share */}
      <div className="mt-6 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
        <p className="text-sm text-[#999] mb-3 text-center">Know a founder who needs to see this?</p>
        <ShareButtons page="calculator" />
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Stop overpaying.</h2>
        <p className="text-[#999] mb-8">Deploy your AI team and reclaim the hours and money you&apos;re burning every month.</p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 btn-gradient glow-accent text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
        >
          Try Ultron Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-[#666] text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
