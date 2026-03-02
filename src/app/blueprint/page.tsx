import type { Metadata } from "next";
import Link from "next/link";
import BlueprintDiagram from "./BlueprintDiagram";

export const metadata: Metadata = {
  title: "The 5-Agent Blueprint",
  description: "What a fully automated founder-led business looks like. 5 AI agents replacing a $20,000/month team for $19/month.",
  openGraph: {
    title: "The 5-Agent Blueprint | Ultron",
    description: "What a fully automated founder-led business looks like. 5 AI agents replacing a $20,000/month team for $19/month.",
    url: "https://work.51ultron.com/blueprint",
  },
  twitter: {
    title: "The 5-Agent Blueprint | Ultron",
    description: "What a fully automated founder-led business looks like. 5 AI agents replacing a $20,000/month team for $19/month.",
  },
};

export default function BlueprintPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-orange-400 text-sm font-medium">System Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          The 5-Agent Blueprint
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          What a fully automated founder-led business looks like.
        </p>
      </div>

      {/* Interactive Diagram */}
      <BlueprintDiagram />

      {/* Cost Comparison */}
      <div className="mt-20 text-center">
        <div className="inline-block bg-[#111111] border border-[#262626] rounded-2xl p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16">
            <div>
              <div className="text-neutral-400 text-sm mb-1">Traditional team cost</div>
              <div className="text-4xl font-bold text-red-400 line-through decoration-2">$20,000<span className="text-2xl">/mo</span></div>
            </div>
            <div className="text-4xl text-neutral-600 hidden sm:block">→</div>
            <div className="text-4xl text-neutral-600 sm:hidden">↓</div>
            <div>
              <div className="text-neutral-400 text-sm mb-1">Ultron</div>
              <div className="text-4xl font-bold text-orange-400">$19<span className="text-2xl">/mo</span></div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#262626]">
            <p className="text-neutral-400 text-sm">
              Same work. Runs 24/7. No meetings. No management overhead.
            </p>
          </div>
        </div>
      </div>

      {/* Agent breakdown table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">What each agent replaces</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left py-3 px-4 text-neutral-400 font-medium text-sm">Agent</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium text-sm">Role</th>
                <th className="text-left py-3 px-4 text-neutral-400 font-medium text-sm hidden sm:table-cell">Primary tasks</th>
                <th className="text-right py-3 px-4 text-neutral-400 font-medium text-sm">Replaces</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "CORTEX",
                  color: "text-indigo-400",
                  role: "Research & Intelligence",
                  tasks: "Competitor audits, prospect research, market intel",
                  replaces: "$3,000/mo",
                  replaceRole: "Research assistant",
                },
                {
                  name: "SPECTER",
                  color: "text-emerald-400",
                  role: "Lead Generation",
                  tasks: "Find prospects, score leads, draft outreach",
                  replaces: "$4,500/mo",
                  replaceRole: "SDR",
                },
                {
                  name: "STRIKER",
                  color: "text-orange-400",
                  role: "Sales & Deals",
                  tasks: "Inbox triage, follow-ups, pipeline tracking",
                  replaces: "$3,500/mo",
                  replaceRole: "Sales ops",
                },
                {
                  name: "PULSE",
                  color: "text-pink-400",
                  role: "Content & Social",
                  tasks: "LinkedIn posts, threads, blogs, email copy",
                  replaces: "$4,000/mo",
                  replaceRole: "Content marketer",
                },
                {
                  name: "SENTINEL",
                  color: "text-sky-400",
                  role: "Monitoring",
                  tasks: "Uptime checks, competitor tracking, security audits",
                  replaces: "$5,000/mo",
                  replaceRole: "DevOps contractor",
                },
              ].map((agent) => (
                <tr key={agent.name} className="border-b border-[#1a1a1a] hover:bg-[#111111] transition-colors">
                  <td className="py-4 px-4">
                    <span className={`font-mono font-bold text-sm ${agent.color}`}>{agent.name}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-neutral-300">{agent.role}</td>
                  <td className="py-4 px-4 text-sm text-neutral-500 hidden sm:table-cell">{agent.tasks}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="text-sm font-semibold text-red-400">{agent.replaces}</div>
                    <div className="text-xs text-neutral-500">{agent.replaceRole}</div>
                  </td>
                </tr>
              ))}
              <tr className="bg-[#111111]">
                <td colSpan={3} className="py-4 px-4 font-semibold text-sm">Total equivalent team cost</td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm font-bold text-red-400">$20,000/mo</div>
                  <div className="text-xs text-neutral-500">vs $19/mo with Ultron</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* How the system connects */}
      <div className="mt-16 bg-[#111111] border border-[#262626] rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6">How the agents work together</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              from: "CORTEX",
              fromColor: "text-indigo-400",
              to: "SPECTER",
              toColor: "text-emerald-400",
              desc: "Cortex researches the market and ICP landscape. Specter takes that intel to find and qualify matching prospects.",
            },
            {
              from: "SPECTER",
              fromColor: "text-emerald-400",
              to: "STRIKER",
              toColor: "text-orange-400",
              desc: "Specter builds the lead list and drafts outreach. Striker picks up replies, triages the inbox, and moves deals forward.",
            },
            {
              from: "CORTEX",
              fromColor: "text-indigo-400",
              to: "PULSE",
              toColor: "text-pink-400",
              desc: "Cortex finds trending topics and competitor weaknesses. Pulse turns that intel into content that positions you as the authority.",
            },
            {
              from: "SENTINEL",
              fromColor: "text-sky-400",
              to: "ALL",
              toColor: "text-orange-400",
              desc: "Sentinel monitors everything and alerts the system when competitors move, infrastructure breaks, or opportunities appear.",
            },
          ].map((link, i) => (
            <div key={i} className="flex gap-3 p-4 bg-[#0A0A0A] rounded-xl">
              <div className="flex-shrink-0 w-1 rounded-full bg-gradient-to-b from-orange-500 to-amber-500 mt-1" />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`font-mono text-xs font-bold ${link.fromColor}`}>{link.from}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neutral-600">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span className={`font-mono text-xs font-bold ${link.toColor}`}>{link.to}</span>
                </div>
                <p className="text-sm text-neutral-400">{link.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Deploy all 5 agents in 10 minutes</h2>
        <p className="text-neutral-400 mb-8">
          No setup required. Connect your tools, describe your business, and your agents start working.
        </p>
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
