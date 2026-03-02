import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import BlueprintDiagram from "./BlueprintDiagram";

export const metadata: Metadata = {
  title: "The 5-Agent Blueprint",
  description: "What a fully automated founder-led business looks like. 5 AI agents replacing a $20,000/month team for $19/month.",
  openGraph: {
    title: "The 5-Agent Blueprint | Ultron",
    description: "The 5-agent architecture that replaces a $20,000/month team for $19/month.",
    url: "https://work.51ultron.com/blueprint",
    images: [{ url: "/og/blueprint.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "The 5-Agent Blueprint | Ultron",
    description: "The 5-agent architecture that replaces a $20,000/month team for $19/month.",
  },
};

export default function BlueprintPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-soft" />
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

      {/* MEGA Cost Comparison */}
      <div className="mt-24 relative">
        <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,84,26,0.06), transparent)" }} />
        <div className="relative bg-[#0a0a0a] border border-[#191919] rounded-3xl p-8 sm:p-14 text-center">
          <div className="text-neutral-500 text-sm font-mono uppercase tracking-widest mb-10">The cost difference</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14">
            <div>
              <div className="text-xs text-neutral-600 uppercase tracking-wider mb-2">Traditional team</div>
              <div className="text-6xl sm:text-8xl font-black text-neutral-700 line-through decoration-red-500/60 decoration-4">
                $20,000
              </div>
              <div className="text-neutral-600 text-lg mt-1 font-mono">/month</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="hidden sm:flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#E8541A]/50" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8541A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <div className="w-px h-8 bg-gradient-to-b from-[#E8541A]/50 to-transparent" />
              </div>
              <div className="sm:hidden text-3xl text-[#E8541A]/60">↓</div>
            </div>

            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-2">With Ultron</div>
              <div className="text-6xl sm:text-8xl font-black" style={{ color: "#E8541A", textShadow: "0 0 60px rgba(232,84,26,0.3)" }}>
                $19
              </div>
              <div className="text-neutral-400 text-lg mt-1 font-mono">/month</div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#191919]">
            <p className="text-neutral-400 text-lg">
              Same work. Runs 24/7. No meetings. No management. No sick days.
            </p>
          </div>
        </div>
      </div>

      {/* How agents connect */}
      <div className="mt-16 bg-[#0e0e0e] border border-[#191919] rounded-2xl p-8">
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
            <div key={i} className="flex gap-3 p-4 bg-[#060606] rounded-xl border border-[#191919]">
              <div className="flex-shrink-0 w-1 rounded-full bg-gradient-to-b from-[#E8541A] to-[#F59E0B] mt-1" />
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

      {/* What breaks when an agent is missing */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-2 text-center">What happens when one piece is missing</h2>
        <p className="text-neutral-500 text-center mb-8 text-sm">Every agent depends on every other agent. Remove one and the system degrades.</p>
        <div className="space-y-3">
          {[
            {
              agent: "CORTEX",
              agentColor: "text-indigo-400",
              missing: "Without CORTEX",
              consequence: "Specter prospects blind. Your outreach hits the wrong people. Content has no competitive angle. You're guessing instead of knowing.",
              impact: "Pipeline quality drops. Content engagement falls. Competitors stay invisible.",
            },
            {
              agent: "SPECTER",
              agentColor: "text-emerald-400",
              missing: "Without SPECTER",
              consequence: "Striker has an empty pipeline. Nothing to close. All the intel Cortex gathers sits unused. You're back to manual prospecting.",
              impact: "Revenue dries up. Cortex intel wasted. You're back to LinkedIn scrolling.",
            },
            {
              agent: "STRIKER",
              agentColor: "text-orange-400",
              missing: "Without STRIKER",
              consequence: "Leads pile up. Follow-ups die. Proposals sent go unanswered. Revenue leaks through every gap in your process.",
              impact: "Specter's work wasted. Deals stall. Pipeline never converts.",
            },
            {
              agent: "PULSE",
              agentColor: "text-pink-400",
              missing: "Without PULSE",
              consequence: "Nobody knows you exist. Competitors own the conversation. Inbound leads dry up. Cortex intel has nowhere to go.",
              impact: "Invisible in market. Inbound goes to zero. Brand equity: none.",
            },
            {
              agent: "SENTINEL",
              agentColor: "text-sky-400",
              missing: "Without SENTINEL",
              consequence: "Something breaks at 3am. You find out from a customer. Competitor moves go undetected for weeks. Security issues compound silently.",
              impact: "Blind to threats. First to know is a lost customer. Infrastructure risk accumulates.",
            },
          ].map((item) => (
            <div key={item.agent} className="flex gap-4 p-5 bg-[#0e0e0e] border border-[#191919] rounded-xl hover:border-[#2a2a2a] transition-colors">
              <div className="flex-shrink-0">
                <div className={`font-mono font-bold text-xs ${item.agentColor} bg-[#060606] border border-[#191919] rounded px-2 py-1`}>
                  {item.missing}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300 mb-1.5">{item.consequence}</p>
                <p className="text-xs text-red-400/70 font-mono">{item.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-page nav */}
      <div className="mt-16 grid sm:grid-cols-2 gap-4">
        <Link href="/72hours" className="group flex items-center justify-between gap-3 p-5 bg-[#0e0e0e] border border-[#191919] hover:border-[#333] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-neutral-600 mb-1 font-mono">NEXT READ</div>
            <div className="font-semibold text-white text-sm">See what these agents produce</div>
            <div className="text-xs text-neutral-500 mt-0.5">72 Hours of Ultron</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 group-hover:text-[#E8541A] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link href="/calculator" className="group flex items-center justify-between gap-3 p-5 bg-[#0e0e0e] border border-[#191919] hover:border-[#333] rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-neutral-600 mb-1 font-mono">ALSO USEFUL</div>
            <div className="font-semibold text-white text-sm">Calculate your savings</div>
            <div className="text-xs text-neutral-500 mt-0.5">AI Team ROI Calculator</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 group-hover:text-[#E8541A] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Share */}
      <div className="mt-8 p-5 bg-[#0e0e0e] border border-[#191919] rounded-2xl">
        <p className="text-sm text-neutral-400 mb-3 text-center">Know a founder who needs to see this?</p>
        <ShareButtons page="blueprint" />
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Deploy all 5 agents in 10 minutes</h2>
        <p className="text-neutral-400 mb-8">
          No setup required. Connect your tools, describe your business, and your agents start working.
        </p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 bg-[#E8541A] hover:bg-[#F97316] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 glow-orange text-lg"
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
