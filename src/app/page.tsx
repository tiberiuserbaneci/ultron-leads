"use client";

import Link from "next/link";
import { useState } from "react";

const diagnosticOptions = [
  {
    pain: "I'm doing everything myself and there aren't enough hours",
    sub: "See the 5-agent architecture that replaces a full team →",
    route: "/blueprint",
    color: "hover:border-indigo-500/50 hover:bg-indigo-500/5",
    glow: "hover:shadow-[0_0_24px_rgba(129,140,248,0.10)]",
    accent: "text-indigo-400",
  },
  {
    pain: "I don't know if AI agents are actually worth the investment",
    sub: "Calculate what you're losing every month in hours and dollars →",
    route: "/calculator",
    color: "hover:border-orange-500/50 hover:bg-orange-500/5",
    glow: "hover:shadow-[0_0_24px_rgba(232,84,26,0.10)]",
    accent: "text-orange-400",
  },
  {
    pain: "I need proof this actually works before I commit",
    sub: "Read 72 hours of real agent logs — no humans involved →",
    route: "/72hours",
    color: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    glow: "hover:shadow-[0_0_24px_rgba(52,211,153,0.10)]",
    accent: "text-emerald-400",
  },
  {
    pain: "I want to see how AI agents actually generate revenue",
    sub: "The full $10K/month architecture, node by node →",
    route: "/stack",
    color: "hover:border-amber-500/50 hover:bg-amber-500/5",
    glow: "hover:shadow-[0_0_24px_rgba(245,158,11,0.10)]",
    accent: "text-amber-400",
  },
  {
    pain: "I feel like competitors are pulling ahead and I can't keep up",
    sub: "See exactly what an automated competitor does vs you →",
    route: "/competitor",
    color: "hover:border-red-500/50 hover:bg-red-500/5",
    glow: "hover:shadow-[0_0_24px_rgba(239,68,68,0.10)]",
    accent: "text-red-400",
  },
];

const allResources = [
  { route: "/blueprint", title: "The 5-Agent Blueprint", tag: "Architecture", desc: "Interactive diagram showing how 5 agents replace a $20K/month team." },
  { route: "/72hours", title: "72 Hours of Ultron", tag: "Real Logs", desc: "50+ timestamped entries. What agents produced with zero human input." },
  { route: "/calculator", title: "AI Team ROI Calculator", tag: "Interactive", desc: "Calculate the real cost of doing everything manually." },
  { route: "/stack", title: "The $10K/Month Stack", tag: "Revenue Model", desc: "Revenue architecture from content to leads to pipeline to close." },
  { route: "/competitor", title: "Your Competitor's AI Stack in 2026", tag: "Reality Check", desc: "Monday morning to end of quarter. Them vs you." },
];

export default function HomePage() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Stats bar — social proof above the fold */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
        {[
          { value: "5", label: "specialized agents" },
          { value: "$19", label: "per month, all agents" },
          { value: "10 min", label: "to deploy" },
          { value: "24/7", label: "autonomous execution" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-[#0e0e0e] border border-[#191919] rounded-xl">
            <div className="text-2xl font-bold text-[#E8541A] font-mono">{stat.value}</div>
            <div className="text-xs text-neutral-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
          What&apos;s slowing your<br className="hidden sm:block"/>business down?
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-xl mx-auto">
          Pick your biggest problem. We&apos;ll show you exactly how AI agents fix it.
        </p>
      </div>

      {/* Diagnostic option cards */}
      <div className="space-y-3">
        {diagnosticOptions.map((opt) => (
          <Link
            key={opt.route}
            href={opt.route}
            className={`group flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-[#191919] bg-[#0e0e0e] transition-all duration-200 card-lift ${opt.color} ${opt.glow}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-semibold text-white leading-snug mb-1">
                {opt.pain}
              </p>
              <p className={`text-sm ${opt.accent} transition-opacity duration-200 opacity-0 group-hover:opacity-100`}>
                {opt.sub}
              </p>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 text-neutral-700 group-hover:text-[#E8541A] transition-all duration-200 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* Explore all toggle */}
      <div className="mt-10 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-4"
        >
          {showAll ? "Hide resources ↑" : "Or explore all resources"}
        </button>

        {showAll && (
          <div className="mt-5 space-y-2 text-left">
            {allResources.map((res) => (
              <Link
                key={res.route}
                href={res.route}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[#191919] bg-[#0e0e0e] hover:border-[#333] hover:bg-[#111] transition-all duration-150 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold text-white">{res.title}</span>
                    <span className="text-xs text-neutral-600 font-mono">{res.tag}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{res.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 group-hover:text-[#E8541A] transition-colors flex-shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
