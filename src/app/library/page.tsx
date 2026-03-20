"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const RESOURCES = [
  {
    title: "Claude Skills Library",
    desc: "12 production-ready skills for Claude Code. Browse, inspect, and download the full pack.",
    href: "/claude-skills",
    tag: "Skills",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "Claude Cheatsheets",
    desc: "Visual reference guides for getting the most out of Claude. Each cheatsheet covers one topic in depth.",
    href: "/cheatsheets",
    tag: "Guides",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "Client Kit",
    desc: "Professional templates for client work — agreements, invoices, project briefs, reports, and more.",
    href: "/client-kit",
    tag: "Templates",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "RFP Builder",
    desc: "Generate a professional AI automation proposal in minutes. Guided form, live preview, export-ready.",
    href: "/rfp",
    tag: "Tool",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function LibraryPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Hero */}
        <div className={`text-center mb-14 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#555] mb-6 font-terminal">
            <Link href="/" className="hover:text-[#999] transition-colors">ultron</Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#DA4E24]">library</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Resource Library
          </h1>
          <p className="text-[15px] text-[#999] max-w-xl mx-auto leading-relaxed">
            Skills, cheatsheets, templates, and tools to accelerate your AI-powered business.
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {RESOURCES.map((res, i) => (
            <Link
              key={res.href}
              href={res.href}
              className={`group flex flex-col gap-4 p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333] hover:bg-[#111] transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${100 + i * 80}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#161616] border border-[#222] flex items-center justify-center text-[#DA4E24] group-hover:border-[#DA4E24]/30 transition-colors">
                  {res.icon}
                </div>
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#555] border border-[#222] rounded-full px-2.5 py-1">
                  {res.tag}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#DA4E24] transition-colors">
                  {res.title}
                </h2>
                <p className="text-sm text-[#666] leading-relaxed group-hover:text-[#888] transition-colors">
                  {res.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[13px] text-[#555] group-hover:text-[#DA4E24] transition-colors mt-auto">
                <span>Explore</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
