import type { Metadata } from "next";
import Link from "next/link";
import ROICalculator from "./ROICalculator";

export const metadata: Metadata = {
  title: "AI Team ROI Calculator",
  description: "Calculate how much doing everything manually is costing you. See your savings with 5 AI agents at $19/month.",
  openGraph: {
    title: "AI Team ROI Calculator | Ultron",
    description: "Calculate how much doing everything manually is costing you. See your savings with 5 AI agents at $19/month.",
    url: "https://work.51ultron.com/calculator",
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
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          <span className="text-orange-400 text-sm font-medium">ROI Calculator</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          How much is doing everything manually costing you?
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Calculate what you would save with 5 AI agents.
        </p>
      </div>

      {/* Calculator */}
      <ROICalculator />

      {/* What you get */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-2 text-center">What you get for $19/month</h2>
        <p className="text-neutral-500 text-center mb-8">5 agents running 24/7. Vs hiring the equivalent team at $20,000/month.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "CORTEX",
              color: "text-indigo-400",
              border: "border-indigo-500/20",
              bg: "bg-indigo-500/5",
              desc: "Daily competitor monitoring, prospect research, market intel.",
              cost: "$3,000/mo equivalent",
            },
            {
              name: "SPECTER",
              color: "text-emerald-400",
              border: "border-emerald-500/20",
              bg: "bg-emerald-500/5",
              desc: "Finds leads, scores them, drafts personalized outreach.",
              cost: "$4,500/mo equivalent",
            },
            {
              name: "STRIKER",
              color: "text-orange-400",
              border: "border-orange-500/20",
              bg: "bg-orange-500/5",
              desc: "Triages inbox, tracks deals, writes follow-ups.",
              cost: "$3,500/mo equivalent",
            },
            {
              name: "PULSE",
              color: "text-pink-400",
              border: "border-pink-500/20",
              bg: "bg-pink-500/5",
              desc: "LinkedIn posts, threads, blogs — in your voice.",
              cost: "$4,000/mo equivalent",
            },
            {
              name: "SENTINEL",
              color: "text-sky-400",
              border: "border-sky-500/20",
              bg: "bg-sky-500/5",
              desc: "Uptime checks, competitor tracking, security audits.",
              cost: "$5,000/mo equivalent",
            },
            {
              name: "TOTAL",
              color: "text-orange-400",
              border: "border-orange-500/30",
              bg: "bg-orange-500/10",
              desc: "Full execution. All 5 agents. Unlimited conversations.",
              cost: "$19/mo — not $20,000",
            },
          ].map((agent) => (
            <div key={agent.name} className={`p-5 rounded-xl border ${agent.border} ${agent.bg}`}>
              <div className={`font-mono font-bold text-sm mb-2 ${agent.color}`}>{agent.name}</div>
              <p className="text-sm text-neutral-400 mb-3">{agent.desc}</p>
              <div className="text-xs text-neutral-600">{agent.cost}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-3">Stop overpaying.</h2>
        <p className="text-neutral-400 mb-8">Deploy your AI team and reclaim the hours — and money — you're burning every month.</p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 glow-orange text-lg"
        >
          Try Ultron Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-neutral-600 text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
