import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ultron Resources — Tools for Founders Building with AI Agents",
  description: "5 free tools and resources for founders deploying AI agents. Blueprints, ROI calculators, real agent logs, and competitive analysis.",
  openGraph: {
    title: "Ultron Resources — Tools for Founders Building with AI Agents",
    description: "5 free tools and resources for founders deploying AI agents.",
    url: "https://work.51ultron.com",
  },
  twitter: {
    title: "Ultron Resources | Ultron",
    description: "5 free tools and resources for founders deploying AI agents.",
  },
};

const leadMagnets = [
  {
    route: "/blueprint",
    title: "The 5-Agent Blueprint",
    tag: "Architecture",
    tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    description: "The exact agent architecture that replaces a $20,000/month team. Interactive diagram showing how all 5 agents connect.",
    cta: "See the blueprint",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    accentColor: "border-indigo-500/20 hover:border-indigo-500/40",
    accentBg: "bg-indigo-500/5",
  },
  {
    route: "/72hours",
    title: "72 Hours of Ultron",
    tag: "Real Logs",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "What 5 AI agents produced for a real business in 3 days. 50+ timestamped activity log entries. No human input.",
    cta: "Read the logs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
    accentColor: "border-emerald-500/20 hover:border-emerald-500/40",
    accentBg: "bg-emerald-500/5",
  },
  {
    route: "/calculator",
    title: "AI Team ROI Calculator",
    tag: "Interactive",
    tagColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    description: "Calculate how much doing everything manually is costing you per month, per year. See your savings with 5 AI agents.",
    cta: "Calculate your savings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <path d="M9 7h6M9 11h6M9 15h4"/>
      </svg>
    ),
    accentColor: "border-orange-500/20 hover:border-orange-500/40",
    accentBg: "bg-orange-500/5",
  },
  {
    route: "/stack",
    title: "The $10K/Month Stack",
    tag: "Revenue Model",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "The full revenue architecture — from content to leads to pipeline to close. Every node mapped to an Ultron agent.",
    cta: "Explore the stack",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    accentColor: "border-amber-500/20 hover:border-amber-500/40",
    accentBg: "bg-amber-500/5",
  },
  {
    route: "/competitor",
    title: "Your Competitor's AI Stack in 2026",
    tag: "Reality Check",
    tagColor: "bg-red-500/10 text-red-400 border-red-500/20",
    description: "A side-by-side comparison of what an automated competitor does vs a manual founder. Monday morning to end of quarter.",
    cta: "See the comparison",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    accentColor: "border-red-500/20 hover:border-red-500/40",
    accentBg: "bg-red-500/5",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span className="text-orange-400 text-sm font-medium">Free Resources</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
          Ultron Resources
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
          Tools and insights for founders building with AI agents.
          No email required. Just use them.
        </p>
      </div>

      {/* Lead magnet cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {leadMagnets.map((lm) => (
          <Link
            key={lm.route}
            href={lm.route}
            className={`group relative p-6 rounded-2xl border bg-[#111111] ${lm.accentColor} transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className={`w-10 h-10 rounded-xl ${lm.accentBg} border ${lm.accentColor} flex items-center justify-center mb-4 text-neutral-400 group-hover:text-white transition-colors`}>
              {lm.icon}
            </div>

            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border mb-3 ${lm.tagColor}`}>
              {lm.tag}
            </div>

            <h2 className="font-bold text-lg text-white mb-2 group-hover:text-white/90">
              {lm.title}
            </h2>

            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              {lm.description}
            </p>

            <div className="flex items-center gap-1.5 text-sm text-neutral-400 group-hover:text-orange-400 transition-colors">
              {lm.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        ))}

        {/* CTA card */}
        <div className="sm:col-span-2 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl p-6 sm:p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to deploy your AI team?</h2>
            <p className="text-neutral-400 mb-6 text-sm">
              Free plan available. 5 agents. 10 minutes to set up. No credit card required.
            </p>
            <Link
              href="https://app.51ultron.com/signup"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 glow-orange"
            >
              Try Ultron Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Social proof / quick stats */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "5", label: "specialized agents" },
          { value: "$19", label: "per month, all agents" },
          { value: "10 min", label: "to deploy" },
          { value: "24/7", label: "agents run autonomously" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-[#111111] border border-[#1a1a1a] rounded-xl">
            <div className="text-2xl font-bold text-orange-400 font-mono">{stat.value}</div>
            <div className="text-xs text-neutral-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
