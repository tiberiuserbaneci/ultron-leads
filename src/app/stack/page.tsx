import type { Metadata } from "next";
import Link from "next/link";
import StackDiagram from "./StackDiagram";

export const metadata: Metadata = {
  title: "The $10K/Month Stack",
  description: "The exact system architecture behind a fully automated business. Revenue flow from traffic to $10K/month using 5 AI agents.",
  openGraph: {
    title: "The $10K/Month Stack | Ultron",
    description: "The exact system architecture behind a fully automated business generating $10K/month.",
    url: "https://work.51ultron.com/stack",
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
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span className="text-amber-400 text-sm font-medium">Revenue Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          The $10K/Month Stack
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          The exact system architecture behind a fully automated business.
        </p>
      </div>

      {/* Stack Diagram */}
      <StackDiagram />

      {/* Quote */}
      <div className="mt-16 bg-[#111111] border border-[#262626] rounded-2xl p-8 sm:p-10">
        <p className="text-xl sm:text-2xl text-neutral-300 leading-relaxed">
          "This system runs 24/7. No meetings. No standups. No Slack messages asking for updates. You wake up to leads scored, emails drafted, content published, and deals flagged."
        </p>
      </div>

      {/* Comparison */}
      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div className="bg-[#1a0a0a] border border-red-900/30 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-red-400">Building this yourself</h3>
          <ul className="space-y-3">
            {[
              { label: "5 freelancers", value: "$15–20K/month" },
              { label: "8+ SaaS tools", value: "$500–1,000/month" },
              { label: "Your coordination time", value: "20+ hrs/week" },
              { label: "Time to set up", value: "3–6 months" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{item.label}</span>
                <span className="text-red-400 font-medium font-mono">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0a1a0a] border border-emerald-900/30 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-emerald-400">Deploying on Ultron</h3>
          <ul className="space-y-3">
            {[
              { label: "1 subscription", value: "$19/month" },
              { label: "Setup time", value: "10 minutes" },
              { label: "Coordination needed", value: "0" },
              { label: "Agents running 24/7", value: "5" },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">{item.label}</span>
                <span className="text-emerald-400 font-medium font-mono">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Deploy the $10K stack</h2>
        <p className="text-neutral-400 mb-8">
          The system is ready. You just have to turn it on.
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
