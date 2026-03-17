"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { templates } from "./templateData";

/* ─── Badge color mapping ─── */
const badgeColors: Record<string, string> = {
  Legal: "#DA4E24",
  Finance: "#DA4E24",
  Planning: "#DA4E24",
  Sales: "#DA4E24",
  Onboarding: "#DA4E24",
  Operations: "#DA4E24",
  Reporting: "#DA4E24",
  Relationship: "#DA4E24",
  Creative: "#DA4E24",
};

/* ─── Feature badges ─── */
const features = [
  { label: "Print ready", icon: "M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" },
  { label: "Inline editable", icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" },
  { label: "Dark and light mode", icon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" },
  { label: "PDF friendly", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6" },
];

/* ─── Template Card ─── */
function TemplateCard({ slug, name, shortDescription, badge, icon }: {
  slug: string;
  name: string;
  shortDescription: string;
  badge: string;
  icon: string;
}) {
  const color = badgeColors[badge] || "#DA4E24";
  return (
    <Link
      href={`/client-kit/${slug}`}
      className="group block bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] hover:bg-[#111] transition-all card-lift"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-[10px] font-terminal px-2 py-0.5 rounded border"
          style={{ borderColor: color + "30", color }}
        >
          {badge}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-white mb-1 group-hover:text-[#DA4E24] transition-colors">
        {name}
      </h3>
      <p className="text-[12px] text-[#666] leading-relaxed">
        {shortDescription}
      </p>
      <div className="mt-4 flex items-center gap-1 text-[11px] text-[#444] group-hover:text-[#DA4E24] transition-colors">
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
        <h4 className="text-[14px] font-medium text-white mb-0.5">{title}</h4>
        <p className="text-[12px] text-[#666] leading-relaxed">{description}</p>
      </div>
    </div>
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
            <span>/</span>
            <span className="text-[#DA4E24]">client-kit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Client Kit
          </h1>
          <p className="text-[15px] text-[#999] max-w-xl mx-auto leading-relaxed mb-2">
            Free, editable templates for every stage of client work.
            Open any document, edit directly on the page, print or save as PDF.
          </p>
          <p className="text-[13px] text-[#555] max-w-lg mx-auto">
            {templates.length} templates. No signup. No paywall.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {features.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1a1a1a] text-[11px] text-[#666] font-terminal"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={f.icon} />
                </svg>
                {f.label}
              </span>
            ))}
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
                icon={t.icon}
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
              title="Print or save as PDF"
              description="Use your browser print function. The document formats cleanly for paper or PDF."
            />
            <Step
              number={4}
              title="Save your work"
              description="Click Save to store your edits locally. Come back and pick up where you left off."
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
            <p className="text-[13px] text-[#666] mb-3">
              Need the project scoped before creating documents?
            </p>
            <h3 className="text-[16px] font-semibold text-white mb-4">
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
            <p className="text-[11px] text-[#444] mt-3">
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
