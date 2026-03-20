import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import Footer from "@/components/Footer";
import TerminalLog from "./TerminalLog";

export const metadata: Metadata = {
  title: "72 Hours of Ultron",
  description: "What 5 AI agents produced for a real business in 3 days. No human input. 23 companies researched, 12 leads found, 8 emails drafted.",
  alternates: { canonical: "/72hours" },
  openGraph: {
    title: "72 Hours of Ultron | Ultron",
    description: "What 5 AI agents produced for a real business in 3 days. No human input.",
    url: "https://work.51ultron.com/72hours",
    images: [{ url: "/og/72hours.png", width: 1200, height: 630 }],
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
      <div className="mb-10">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#DA4E24] text-sm font-medium font-terminal">CLASSIFIED / INTERNAL LOG</span>
        </div>
        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          72 Hours of Ultron
        </h1>
        <p className="animate-fade-up-2 text-lg text-[#999] max-w-2xl mb-3">
          What 5 AI agents produced for a real business in 3 days. No human input.
        </p>
        <a href="#summary" className="animate-fade-up-3 text-sm text-[#999] hover:text-[#DA4E24] transition-colors underline underline-offset-4 inline-block">
          Skip to results
        </a>
      </div>

      {/* Terminal */}
      <TerminalLog />

      {/* Summary stats */}
      <div id="summary" className="mt-12 bg-[#0a0a0a] border border-[#DA4E24]/20 rounded-2xl p-8">
        <div className="font-mono text-[#DA4E24] text-sm mb-6">// 72-HOUR SUMMARY. SESSION COMPLETE</div>
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
              <div className="text-xs text-[#999] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition line */}
      <p className="mt-10 text-center text-lg text-[#999]">
        This was one business. One week. Imagine what 30 days looks like for yours.
      </p>

      {/* Cross-page nav */}
      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Link href="/competitor" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">NEXT READ</div>
            <div className="font-semibold text-white text-sm">See what you&apos;re up against</div>
            <div className="text-xs text-[#999] mt-0.5">Your Competitor&apos;s AI Stack in 2026</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link href="/stack" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">ALSO WORTH READING</div>
            <div className="font-semibold text-white text-sm">See the revenue model</div>
            <div className="text-xs text-[#999] mt-0.5">The $10K/Month Stack</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Share */}
      <div className="mt-8 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
        <p className="text-sm text-[#999] mb-3 text-center font-medium">Know a founder who needs to see this?</p>
        <ShareButtons page="72hours" />
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-[#999] mb-2 text-lg">
          This is what your business looks like after deploying Ultron.
        </p>
        <p className="text-[#666] mb-8">
          Monday morning you wake up to this. Every week.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="https://app.51ultron.com/signup"
            className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
          >
            Try for free
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
          >
            View Pricing
          </Link>
        </div>
        <p className="mt-3 text-[#666] text-sm">Free plan. No credit card required.</p>
      </div>

      <Footer />
    </div>
  );
}
