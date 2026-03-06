"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import FounderTerminal from "@/components/FounderTerminal";

const diagnosticOptions = [
  {
    pain: "I want to see Ultron work before I commit",
    sub: "Watch agents execute real business tasks in real time",
    route: "/demo",
  },
  {
    pain: "I'm doing everything myself and there aren't enough hours",
    sub: "See the 5-agent architecture that replaces a full team",
    route: "/blueprint",
  },
  {
    pain: "I don't know if AI agents are actually worth the investment",
    sub: "Calculate what you're losing every month in hours and dollars",
    route: "/calculator",
  },
  {
    pain: "I need proof this actually works before I commit",
    sub: "Read 72 hours of real agent logs. No humans involved.",
    route: "/72hours",
  },
  {
    pain: "I want to see how AI agents actually generate revenue",
    sub: "The full $10K/month architecture, node by node",
    route: "/stack",
  },
  {
    pain: "I feel like competitors are pulling ahead and I can't keep up",
    sub: "See exactly what an automated competitor does vs you",
    route: "/competitor",
  },
  {
    pain: "I don't know how automated my business actually is",
    sub: "Take the 10-question assessment. Get your score in 2 minutes.",
    route: "/assess",
  },
  {
    pain: "I'm using AI tools but nothing is connected and I'm still doing everything",
    sub: "See the 4 levels of AI automation and where you stand",
    route: "/levels",
  },
  {
    pain: "I want to see every agent a business needs",
    sub: "The complete map of 32 agents across 7 departments",
    route: "/agents-map",
  },
];

const allResources = [
  { route: "/demo", title: "Interactive Demo", tag: "Live Demo", desc: "Pick a command. Watch 5 AI agents execute in real time." },
  { route: "/blueprint", title: "The 5-Agent Blueprint", tag: "Architecture", desc: "Interactive diagram. 5 agents. $20K team for $19/month." },
  { route: "/72hours", title: "72 Hours of Ultron", tag: "Real Logs", desc: "50+ timestamped entries. Zero human input." },
  { route: "/calculator", title: "AI Team ROI Calculator", tag: "Interactive", desc: "Calculate the real cost of doing everything manually." },
  { route: "/stack", title: "The $10K/Month Stack", tag: "Revenue Model", desc: "From content to leads to close. Every node mapped." },
  { route: "/competitor", title: "Your Competitor's AI Stack in 2026", tag: "Reality Check", desc: "Monday morning to end of quarter. Them vs you." },
  { route: "/assess", title: "Business Automation Assessment", tag: "Quiz", desc: "10 questions. Find out what's missing in your stack." },
  { route: "/levels", title: "The 4 Levels of AI Automation", tag: "Framework", desc: "Self-assess your level. Understand the gap. See the bridge." },
  { route: "/agents-map", title: "The Complete AI Agent Map", tag: "Agent Map", desc: "32 agents across 7 departments. Click any to see what it replaces." },
];

export default function HomePage() {
  const [showAll, setShowAll] = useState(false);
  const [visible, setVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      {/* Subtle hero glow */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      {/* Stats bar */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {[
          { value: "5", label: "specialized agents" },
          { value: "70%", label: "of your work delegated" },
          { value: "10 min", label: "to deploy" },
          { value: "24/7", label: "autonomous execution" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
            <div className="text-2xl font-bold text-[#DA4E24] font-terminal">{stat.value}</div>
            <div className="text-xs text-[#666] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hero */}
      <div
        className={`text-center mb-12 transition-all duration-500 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
          Are you buried in tasks<br className="hidden sm:block"/> that agents should handle?
        </h1>
        <p className="text-lg sm:text-xl text-[#999] max-w-xl mx-auto">
          Delegate 70% of your work to Ultron in 10 minutes.
        </p>
      </div>

      {/* Diagnostic option cards - stagger in */}
      <div className="space-y-3">
        {diagnosticOptions.map((opt, i) => (
          <Link
            key={opt.route}
            href={opt.route}
            className={`group flex items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] card-lift transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${150 + i * 80}ms` }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-semibold text-white leading-snug mb-1">
                {opt.pain}
              </p>
              <p className="text-sm text-[#666] transition-colors duration-200 group-hover:text-[#999]">
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
              className="flex-shrink-0 text-[#333] group-hover:text-[#DA4E24] transition-all duration-200 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* Explore all toggle */}
      <div className="mt-8 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[#555] hover:text-[#999] transition-colors underline underline-offset-4"
        >
          {showAll ? "Hide resources" : "Or explore all resources"}
        </button>

        {showAll && (
          <div className="mt-5 space-y-2 text-left">
            {allResources.map((res) => (
              <Link
                key={res.route}
                href={res.route}
                className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#222] hover:bg-[#111] transition-all duration-150 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold text-white">{res.title}</span>
                    <span className="text-xs text-[#555] font-terminal">{res.tag}</span>
                  </div>
                  <p className="text-xs text-[#555] truncate">{res.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] transition-colors flex-shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      <FounderTerminal />
    </div>
  );
}
