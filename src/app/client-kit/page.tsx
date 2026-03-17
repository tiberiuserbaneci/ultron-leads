"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { templates } from "./templateData";

/* ─── SVG icon paths (Lucide-style, matching /rfp) ─── */
const iconPaths: Record<string, string> = {
  "client-agreement": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  "invoice": "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  "project-brief": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M12 12h4M12 16h4M8 12h.01M8 16h.01",
  "discovery-call": "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  "welcome-doc": "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  "package-menu": "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  "delivery-guide": "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z",
  "task-list": "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  "monthly-report": "M18 20V10M12 20V4M6 20v-6",
  "feedback-request": "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  "thank-you": "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  "broll-checklist": "M23 7l-7 5 7 5zM1 5h15v14H1z",
  "creative-brief": "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586M11 13a2 2 0 11-4 0 2 2 0 014 0z",
  "handoff-notes": "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
};

/* ─── Template Card ─── */
function TemplateCard({ slug, name, shortDescription, badge }: {
  slug: string;
  name: string;
  shortDescription: string;
  badge: string;
}) {
  return (
    <Link
      href={`/client-kit/${slug}`}
      className="group block bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] hover:bg-[#111] transition-all card-lift"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center group-hover:border-[#DA4E24]/30 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={iconPaths[slug] || iconPaths["client-agreement"]} />
          </svg>
        </div>
        <span className="text-[10px] font-terminal px-2 py-0.5 rounded border border-[#1a1a1a] text-[#555]">
          {badge}
        </span>
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-1.5 group-hover:text-[#DA4E24] transition-colors">
        {name}
      </h3>
      <p className="text-[12px] text-[#777] leading-relaxed">
        {shortDescription}
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#444] group-hover:text-[#DA4E24] transition-colors">
        Open template
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

/* ─── How It Works Step ─── */
function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex items-center justify-center w-7 h-7 rounded-full border border-[#DA4E24]/30 text-[#DA4E24] text-[12px] font-terminal flex-shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <h4 className="text-[13px] font-medium text-white mb-0.5">{title}</h4>
        <p className="text-[12px] text-[#777] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ─── Feature pill ─── */
function FeaturePill({ label, iconPath }: { label: string; iconPath: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1a1a1a] text-[11px] text-[#777] font-terminal">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath} />
      </svg>
      {label}
    </span>
  );
}

/* ─── MAIN PAGE ─── */
export default function ClientKitPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* Hero */}
        <div
          className={`text-center mb-14 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#555] mb-6 font-terminal">
            <Link href="/" className="hover:text-[#999] transition-colors">ultron</Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#DA4E24]">client-kit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Client Kit
          </h1>
          <p className="text-[15px] text-[#999] max-w-xl mx-auto leading-relaxed mb-2">
            Free, editable templates for every stage of client work.
            Open any document, edit inline, send or save as PDF.
          </p>
          <p className="text-[13px] text-[#555] max-w-lg mx-auto">
            {templates.length} templates. No signup. No paywall.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <FeaturePill label="Print ready" iconPath="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
            <FeaturePill label="Inline editable" iconPath="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            <FeaturePill label="Send via email" iconPath="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
            <FeaturePill label="PDF friendly" iconPath="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" />
          </div>
        </div>

        {/* Template Grid */}
        <div
          className={`transition-all duration-500 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <TemplateCard
                key={t.slug}
                slug={t.slug}
                name={t.name}
                shortDescription={t.shortDescription}
                badge={t.badge}
              />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div
          className={`mt-16 transition-all duration-500 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-[11px] font-bold text-[#555] uppercase tracking-widest mb-6 text-center font-terminal">
            How it works
          </h2>
          <div className="max-w-md mx-auto space-y-5">
            <Step
              number={1}
              title="Open any template"
              description="Browse the library and click into the document you need."
            />
            <Step
              number={2}
              title="Edit text directly"
              description="Click any field and type. Your content replaces the placeholder."
            />
            <Step
              number={3}
              title="Send, print, or save"
              description="Email the document directly, print to PDF, or save your edits locally."
            />
          </div>
        </div>

        {/* RFP Cross-link */}
        <div
          className={`mt-16 transition-all duration-500 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 sm:p-8 text-center">
            <p className="text-[13px] text-[#777] mb-3">
              Need the project scoped before creating documents?
            </p>
            <h3 className="text-[15px] font-semibold text-white mb-4">
              Start with the AI Workflow Intake
            </h3>
            <Link
              href="/rfp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white btn-gradient glow-accent transition-all"
            >
              Go to Workflow Intake
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-[11px] text-[#555] mt-3">
              Define the scope first. Then use these templates to deliver the work.
            </p>
          </div>
        </div>

        {/* Cross-page links */}
        <div className="grid sm:grid-cols-3 gap-3 mt-10">
          {[
            { label: "Scope a workflow first", href: "/rfp" },
            { label: "See the agent architecture", href: "/agents-map" },
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
