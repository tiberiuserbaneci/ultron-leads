"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cheatsheets } from "./cheatsheetData";

export default function CheatsheetsPage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Hero */}
        <div className={`text-center mb-14 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#555] mb-6 font-terminal">
            <Link href="/" className="hover:text-[#999] transition-colors">ultron</Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#DA4E24]">cheatsheets</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Claude Cheatsheets
          </h1>
          <p className="text-[15px] text-[#999] max-w-xl mx-auto leading-relaxed mb-2">
            Visual reference guides for getting the most out of Claude.
            Each cheatsheet covers one topic in depth.
          </p>
          <p className="text-[13px] text-[#555]">
            {cheatsheets.length} {cheatsheets.length === 1 ? "cheatsheet" : "cheatsheets"} available. Free and printable.
          </p>
        </div>

        {/* Grid */}
        <div className={`transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cheatsheets.map((cs) => (
              <Link
                key={cs.slug}
                href={`/cheatsheets/${cs.slug}`}
                className="group block bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] hover:bg-[#111] transition-all card-lift"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center group-hover:border-[#DA4E24]/30 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={cs.iconPath} />
                    </svg>
                  </div>
                  <span className="text-[10px] font-terminal px-2 py-0.5 rounded border border-[#1a1a1a] text-[#555]">
                    {cs.badge}
                  </span>
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-1.5 group-hover:text-[#DA4E24] transition-colors">
                  {cs.title}
                </h3>
                <p className="text-[12px] text-[#777] leading-relaxed mb-1">
                  {cs.subtitle}
                </p>
                <p className="text-[12px] text-[#555] leading-relaxed">
                  {cs.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#444] group-hover:text-[#DA4E24] transition-colors">
                  View cheatsheet
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cross-links */}
        <div className="grid sm:grid-cols-3 gap-3 mt-14">
          {[
            { label: "Scope a workflow first", href: "/rfp" },
            { label: "Client document templates", href: "/client-kit" },
            { label: "Browse Claude Skills", href: "/claude-skills" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-2 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333] hover:bg-[#111] transition-all group text-sm text-[#999] hover:text-white"
            >
              <span>{link.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#333] group-hover:text-[#DA4E24] transition-colors">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
