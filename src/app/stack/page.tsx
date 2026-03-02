import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import StackDiagram from "./StackDiagram";

export const metadata: Metadata = {
  title: "The $10K/Month Stack",
  description: "The exact system architecture behind a fully automated business. Revenue flow from traffic to $10K/month using 5 AI agents.",
  openGraph: {
    title: "The $10K/Month Stack | Ultron",
    description: "The exact system architecture behind a fully automated business generating $10K/month.",
    url: "https://work.51ultron.com/stack",
    images: [{ url: "/og/stack.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "The $10K/Month Stack | Ultron",
    description: "The exact system architecture behind a fully automated business generating $10K/month.",
  },
};

export default function StackPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#DA4E24]">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span className="text-[#DA4E24] text-sm font-medium">Revenue Architecture</span>
        </div>
        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          The $10K/Month Stack
        </h1>
        <p className="animate-fade-up-2 text-xl text-[#999] max-w-2xl mx-auto">
          The exact system architecture behind a fully automated business.
        </p>
      </div>

      {/* Stack Diagram */}
      <StackDiagram />

      {/* Revenue Math. right after diagram */}
      <div className="mt-16 bg-[#0a0a0a] border border-[#DA4E24]/20 rounded-2xl p-8 sm:p-10">
        <div className="text-xs text-[#DA4E24] font-mono uppercase tracking-widest mb-6">The Math Behind $10K/Month</div>
        <div className="space-y-3">
          {[
            { label: "20 qualified leads/month", agent: "SPECTER", value: "20" },
            { label: "× 25% close rate (Striker follow-ups)", agent: "STRIKER", value: "= 5 deals" },
            { label: "× $2,000 average deal size", agent: null, value: "" },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-white flex-1">{row.label}</span>
              {row.agent && (
                <span className={`text-xs font-mono font-bold ${
                  row.agent === "SPECTER" ? "text-[#DA4E24]" : "text-[#DA4E24]"
                } bg-black border border-[#1a1a1a] rounded px-2 py-0.5`}>
                  {row.agent}
                </span>
              )}
            </div>
          ))}
          <div className="border-t border-[#DA4E24]/20 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">= $10,000/month</span>
              <span className="text-[#DA4E24] font-mono text-sm">5 × $2,000</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-[#999] mt-5 leading-relaxed">
          Pulse drives traffic. Specter qualifies leads. Cortex provides intel. Striker closes deals. Sentinel keeps it running.
        </p>
      </div>

      {/* Comparison. right after revenue math, while architecture is fresh */}
      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <div className="bg-[#0a0a0a] border border-[#999]/20 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-[#999]">Building this yourself</h3>
          <ul className="space-y-3">
            {[
              { label: "5 freelancers", value: "$15-20K/month" },
              { label: "8+ SaaS tools", value: "$500-1,000/month" },
              { label: "Your coordination time", value: "20+ hrs/week" },
              { label: "Time to set up", value: "3-6 months" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#999]">{item.label}</span>
                <span className="text-[#999] font-medium font-mono">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0a0a0a] border border-[#DA4E24]/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-[#DA4E24]">Deploying on Ultron</h3>
          <ul className="space-y-3">
            {[
              { label: "1 subscription", value: "$19/month" },
              { label: "Setup time", value: "10 minutes" },
              { label: "Coordination needed", value: "0" },
              { label: "Agents running 24/7", value: "5" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#999]">{item.label}</span>
                <span className="text-[#DA4E24] font-medium font-mono">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-10 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 sm:p-10">
        <p className="text-xl sm:text-2xl text-white leading-relaxed">
          This system runs 24/7. No meetings. No standups. No Slack messages asking for updates. You wake up to leads scored, emails drafted, content published, and deals flagged.
        </p>
      </div>

      {/* Cross-page nav */}
      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <Link href="/72hours" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">SEE IT IN ACTION</div>
            <div className="font-semibold text-white text-sm">See 72 hours of real output</div>
            <div className="text-xs text-[#999] mt-0.5">72 Hours of Ultron</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link href="/competitor" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#222] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#666] mb-1 font-mono">REALITY CHECK</div>
            <div className="font-semibold text-white text-sm">See your competitor&apos;s stack</div>
            <div className="text-xs text-[#999] mt-0.5">Your Competitor&apos;s AI Stack in 2026</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Share */}
      <div className="mt-6 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
        <p className="text-sm text-[#999] mb-3 text-center">Know a founder who needs to see this?</p>
        <ShareButtons page="stack" />
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Deploy the $10K stack</h2>
        <p className="text-[#999] mb-8">
          The system is ready. You just have to turn it on.
        </p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 btn-gradient glow-accent text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
        >
          Start Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-[#666] text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
