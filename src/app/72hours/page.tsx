import type { Metadata } from "next";
import Link from "next/link";
import TerminalLog from "./TerminalLog";

export const metadata: Metadata = {
  title: "72 Hours of Ultron",
  description: "What 5 AI agents produced for a real business in 3 days. No human input. 23 companies researched, 12 leads found, 8 emails drafted.",
  openGraph: {
    title: "72 Hours of Ultron | Ultron",
    description: "What 5 AI agents produced for a real business in 3 days. No human input.",
    url: "https://work.51ultron.com/72hours",
  },
  twitter: {
    title: "72 Hours of Ultron | Ultron",
    description: "What 5 AI agents produced for a real business in 3 days. No human input.",
  },
};

export default function SeventyTwoHoursPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium font-mono">CLASSIFIED / INTERNAL LOG</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          72 Hours of Ultron
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl">
          What 5 AI agents produced for a real business in 3 days. No human input.
        </p>
      </div>

      {/* Terminal */}
      <TerminalLog />

      {/* Summary stats */}
      <div className="mt-12 bg-[#0a0f0a] border border-emerald-500/20 rounded-2xl p-8">
        <div className="font-mono text-emerald-400 text-sm mb-6">// 72-HOUR SUMMARY — SESSION COMPLETE</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "23", label: "companies researched" },
            { value: "12", label: "qualified leads found" },
            { value: "8", label: "cold emails drafted" },
            { value: "5", label: "LinkedIn posts written" },
            { value: "3", label: "competitor analyses" },
            { value: "2", label: "deal opportunities flagged" },
            { value: "1", label: "security audit completed" },
            { value: "0", label: "hours of human input" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
              <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-neutral-400 mb-2 text-lg">
          This is what your business looks like after deploying Ultron.
        </p>
        <p className="text-neutral-600 mb-8">
          Monday morning you wake up to this. Every week.
        </p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 glow-orange text-lg"
        >
          Start Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-neutral-600 text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
