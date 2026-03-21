"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLiveStats } from "@/components/HeroStats";

/* ═══════════════════════════════════════════════════════════════ */
/*  SHARED HELPERS                                                 */
/* ═══════════════════════════════════════════════════════════════ */

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/40">
      {children}
    </span>
  );
}

function SlideTabSwitcher({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(i)}
          className={`text-xs sm:text-[13px] rounded-full px-3 sm:px-4 py-1.5 transition-colors whitespace-nowrap ${
            active === i
              ? "text-white border border-white/20 bg-white/[0.08]"
              : "text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/15"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/**
 * Consistent slide layout for slides 2-8.
 * Pill centered at top → title below → content below.
 * Keeps vertical positioning identical across all content slides.
 */
function SlideLayout({
  pill,
  title,
  children,
}: {
  pill: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full px-5 sm:px-10 lg:px-14 max-w-6xl mx-auto w-full pt-5 sm:pt-6 pb-3 sm:pb-5 overflow-hidden">
      {/* Label — always top left */}
      <div className="mb-3 sm:mb-4">
        <SlideLabel>{pill}</SlideLabel>
      </div>

      {/* Title — bigger on mobile */}
      {title && (
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight max-w-3xl mb-4 sm:mb-5">
          {title}
        </h2>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 1: MEET ULTRON                                           */
/* ═══════════════════════════════════════════════════════════════ */

function Slide1() {
  return (
    <div className="flex items-center justify-center h-full px-6">
      {/* Desktop: logo left of text, horizontal */}
      <div className="hidden sm:flex items-center gap-8">
        <Image
          src="/logo.png"
          alt="Ultron"
          width={120}
          height={120}
          className="rounded-2xl animate-logo-spin"
        />
        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight">
          meet Ultron
        </h1>
      </div>
      {/* Mobile: stacked, bigger */}
      <div className="flex sm:hidden flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Ultron"
          width={96}
          height={96}
          className="rounded-2xl animate-logo-spin mb-6"
        />
        <h1 className="text-5xl font-bold text-white tracking-tight">
          meet Ultron
        </h1>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 2: THE PROBLEM                                           */
/* ═══════════════════════════════════════════════════════════════ */

const PROBLEMS = [
  {
    title: "Manual handoffs slow everything down",
    body: "Work moves through Slack, email, and follow-ups instead of one clear system.",
  },
  {
    title: "Leaders see problems too late",
    body: "By the time teams piece together what happened, the moment to fix it has already passed.",
  },
  {
    title: "Broken processes stay hidden until they hurt",
    body: "Most teams do not catch bottlenecks early. They find them after output drops, customers wait, or revenue slips.",
  },
];

function Slide2() {
  return (
    <SlideLayout
      pill="The Problem"
      title="Growth breaks when execution depends on people chasing people."
    >
      <div className="h-px bg-white/[0.08] mb-6" />
      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {PROBLEMS.map((p) => (
          <div key={p.title} className="border border-white/[0.08] rounded-xl p-5">
            <h3 className="text-sm sm:text-[15px] font-semibold text-white mb-2">{p.title}</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 3: THE SOLUTION                                          */
/* ═══════════════════════════════════════════════════════════════ */

const AGENTS = [
  { name: "Research", desc: "Market and competitor intelligence" },
  { name: "Outreach", desc: "Sequenced email and LinkedIn" },
  { name: "Content", desc: "Articles, posts, and distribution" },
  { name: "Monitoring", desc: "Alerts, signals, and tracking" },
  { name: "Enrichment", desc: "Lead scoring and data routing" },
];

const INTEGRATIONS_GRID = [
  { name: "Apollo", logo: "/apollo.png" },
  { name: "HubSpot", logo: "/hubspot.png" },
  { name: "Gmail", logo: "/gmail.png" },
  { name: "Notion", logo: "/notion.png" },
  { name: "Calendly", logo: "/calendly.png" },
  { name: "Apify", logo: "/apify.png" },
  { name: "Airtable", logo: "/airtable.png" },
  { name: "ClickUp", logo: "/clickup.png" },
  { name: "Instagram", logo: "/instagram.png" },
  { name: "Brave", logo: "/brave.png" },
  { name: "Google Meet", logo: "/meet.png" },
  { name: "Google Maps", logo: "/maps.png" },
];

const EXECUTION_BLOCKS = [
  { title: "Runs in parallel", body: "Multiple agents execute simultaneously across different functions." },
  { title: "Works across your stack", body: "Reads, writes, and acts inside the tools you already use." },
  { title: "Keeps output moving daily", body: "Work continues through an agent layer that does not wait for manual follow-through." },
  { title: "Replaces manual coordination", body: "No more chasing updates. The system moves work forward on its own." },
];

function SolutionTab1() {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-x-8 lg:gap-x-14 gap-y-4 mb-5">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
          Deploy OpenClaw and Claude Code agent fleets in minutes
        </h3>
        <p className="text-sm text-white/50 leading-relaxed self-end">
          OpenClaw coordinates the system. Claude Code handles parallel execution. Together they deploy agents, wire integrations, test pipelines, fix issues, and keep work moving without constant manual supervision.
        </p>
      </div>

      <div className="border border-white/[0.08] rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.06]">
          <Image src="/logo openclaw.png" alt="OpenClaw" width={18} height={18} className="rounded" />
          <span className="text-[10px] font-semibold text-white/60 tracking-wider uppercase">Control Layer</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
          <Image src="/logo claude code.png" alt="Claude Code" width={18} height={18} className="rounded" />
          <span className="text-[10px] font-semibold text-white/60 tracking-wider uppercase">Execution</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AGENTS.map((a) => (
            <div key={a.name} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
              <p className="text-xs sm:text-sm font-medium text-white mb-0.5">{a.name}</p>
              <p className="text-[10px] text-white/40">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SolutionTab2() {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-x-8 lg:gap-x-14 gap-y-4 mb-5">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
          100+ GTM integrations. One subscription, access to the apps you need.
        </h3>
        <p className="text-sm text-white/50 leading-relaxed self-end">
          CRMs, email, calendars, enrichment tools, scraping tools, and outbound systems. Ultron agents can read, write, and act across the GTM stack while we handle vendor complexity, billing, and testing.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {INTEGRATIONS_GRID.map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5">
            <Image src={item.logo} alt={item.name} width={22} height={22} className="rounded shrink-0" />
            <span className="text-xs text-white/70 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SolutionTab3() {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-x-8 lg:gap-x-14 gap-y-4 mb-5">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
          From prompt-driven work to system-driven execution
        </h3>
        <p className="text-sm text-white/50 leading-relaxed self-end">
          Most AI products stop at assistance. Ultron is built for repeatable execution across research, lead generation, outreach, content, and follow-up, inside one operating layer.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {EXECUTION_BLOCKS.map((b) => (
          <div key={b.title} className="border border-white/[0.08] rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-1.5">{b.title}</h4>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function Slide3() {
  const [solutionTab, setSolutionTab] = useState(0);
  const tabs = ["Agent Fleet", "Integrations", "Execution"];

  return (
    <SlideLayout
      pill="The Solution"
      title="Built for 100x founder-led businesses"
    >
      <div className="mb-5">
        <SlideTabSwitcher tabs={tabs} active={solutionTab} onChange={setSolutionTab} />
      </div>

      {solutionTab === 0 && <SolutionTab1 />}
      {solutionTab === 1 && <SolutionTab2 />}
      {solutionTab === 2 && <SolutionTab3 />}
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 4: TRACTION AND GTM                                     */
/* ═══════════════════════════════════════════════════════════════ */

function TractionStats() {
  const live = useLiveStats();
  const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toLocaleString();

  const stats = [
    { value: live.founders.toLocaleString(), label: "founders" },
    { value: fmtK(live.agents), label: "agents" },
    { value: fmtK(live.tasks), label: "tasks" },
    { value: fmtK(live.apiCalls), label: "API calls" },
    { value: `$${Math.round(live.saved / 1000)}K`, label: "saved" },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tabular-nums">{s.value}</p>
          <p className="text-[10px] sm:text-xs text-white/40 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function GtmViral() {
  return (
    <div>
      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
        A distribution system built for interest-based reach
      </h4>
      <p className="text-sm text-white/50 leading-relaxed mb-4">
        We are building a network of 9 Instagram accounts that funnel attention from viral content into comments, lead magnets, and product entry points.
      </p>
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-3">
        {["Viral post", "Comment CTA", "Lead magnet", "Product"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm text-white/70 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5">{step}</span>
            {i < 3 && <span className="text-white/20 text-xs">&rarr;</span>}
          </div>
        ))}
      </div>
      <p className="text-xs text-white/40">
        The system is designed to scale into roughly 45,000 individual content pieces per month.
      </p>
    </div>
  );
}

function GtmEnterprise() {
  return (
    <div>
      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
        Custom agentic automation for operations teams
      </h4>
      <p className="text-sm text-white/50 leading-relaxed mb-4">
        Alongside self-serve growth, Ultron sells tailored automation systems for companies that want agentic workflows across operations, reporting, coordination, and internal execution.
      </p>
      <div className="space-y-2">
        {[
          "Higher ACV entry point",
          "Faster learning from real customer workflows",
          "Expands product depth through real use cases",
        ].map((point) => (
          <div key={point} className="flex items-start gap-2.5">
            <div className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />
            <span className="text-sm text-white/60">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide4() {
  const [gtmTab, setGtmTab] = useState(0);

  return (
    <SlideLayout pill="Traction and GTM">
      {/* Live stats in title position */}
      <div className="mb-6 sm:mb-8">
        <TractionStats />
      </div>

      <div className="h-px bg-white/[0.08] mb-5" />

      {/* GTM switcher */}
      <div className="mb-4">
        <SlideTabSwitcher
          tabs={["Viral Marketing", "Enterprise Sales"]}
          active={gtmTab}
          onChange={setGtmTab}
        />
      </div>

      {gtmTab === 0 ? <GtmViral /> : <GtmEnterprise />}
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 5: WHY NOW                                               */
/* ═══════════════════════════════════════════════════════════════ */

const WHY_NOW_REASONS = [
  {
    title: "Interest-based distribution is now real",
    body: "Instagram recommendations already push content through Reels, Explore, Feed, and reposts beyond direct follower relationships.",
  },
  {
    title: "AI is moving from assistant to operator",
    body: "The market is shifting from simple chat interfaces to systems that can act across tools, workflows, and business processes.",
  },
  {
    title: "The category is still open",
    body: "Most products today are still horizontal builders, automation tools, or chat layers. There is room for a focused execution product built around founder-led GTM.",
  },
];

function Slide5() {
  return (
    <SlideLayout
      pill="Why Now"
      title="Distribution has changed faster than most companies have adapted."
    >
      <p className="text-sm text-white/50 leading-relaxed max-w-2xl mb-6">
        Social feeds are increasingly driven by recommendations, not just follower graphs. That creates a window where strong content can earn reach on interest alone. Ultron is building for that shift with a distribution network designed to scale to roughly 45,000 pieces of content per month while the market is still early.
      </p>

      <div className="h-px bg-white/[0.08] mb-6" />

      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {WHY_NOW_REASONS.map((r) => (
          <div key={r.title} className="border border-white/[0.08] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">{r.title}</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 6: COMPETITION                                           */
/* ═══════════════════════════════════════════════════════════════ */

type CompRow = { label: string; ultron: string; n8n: string; zapier: string; gumloop: string };

const COMP_ROWS: CompRow[] = [
  { label: "Primary mode", ultron: "Execution system", n8n: "Workflow builder", zapier: "Orchestration platform", gumloop: "No-code automation builder" },
  { label: "Core user", ultron: "Founder-led GTM teams", n8n: "Technical operators", zapier: "Broad business teams", gumloop: "No-code AI operators" },
  { label: "Product shape", ultron: "Opinionated", n8n: "Modular", zapier: "Horizontal", gumloop: "Visual builder" },
  { label: "Best fit", ultron: "Output, distribution, and execution in one layer", n8n: "Deep workflow control", zapier: "Automating across many apps", gumloop: "Building AI workflows without code" },
];

function Slide6() {
  return (
    <SlideLayout
      pill="Competition"
      title="The market has builders. Ultron is building an execution company."
    >
      {/* Matrix */}
      <div className="border border-white/[0.08] rounded-xl overflow-hidden mb-5">
        {/* Header */}
        <div className="grid grid-cols-5 bg-white/[0.03]">
          <div className="p-3" />
          {["Ultron", "n8n", "Zapier", "Gumloop"].map((name) => (
            <div key={name} className={`p-3 border-l border-white/[0.06] ${name === "Ultron" ? "bg-white/[0.04]" : ""}`}>
              <span className={`text-xs sm:text-sm font-semibold ${name === "Ultron" ? "text-white" : "text-white/50"}`}>{name}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {COMP_ROWS.map((row) => (
          <div key={row.label} className="grid grid-cols-5 border-t border-white/[0.06]">
            <div className="p-3">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{row.label}</span>
            </div>
            <div className="p-3 border-l border-white/[0.06] bg-white/[0.04]">
              <span className="text-xs sm:text-sm text-white">{row.ultron}</span>
            </div>
            <div className="p-3 border-l border-white/[0.06]">
              <span className="text-xs sm:text-sm text-white/50">{row.n8n}</span>
            </div>
            <div className="p-3 border-l border-white/[0.06]">
              <span className="text-xs sm:text-sm text-white/50">{row.zapier}</span>
            </div>
            <div className="p-3 border-l border-white/[0.06]">
              <span className="text-xs sm:text-sm text-white/50">{row.gumloop}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ultron edge */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          "Packaged execution over general automation",
          "Designed around GTM throughput",
          "Agents, integrations, and distribution combined",
          "Clear path from attention to execution",
        ].map((edge) => (
          <div key={edge} className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} className="shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[10px] sm:text-xs text-white/60">{edge}</span>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 7: BUSINESS MODEL                                        */
/* ═══════════════════════════════════════════════════════════════ */

function Slide7() {
  return (
    <SlideLayout
      pill="Business Model"
      title="Simple entry point. Usage aligned with value."
    >
      <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
        {/* Subscription */}
        <div className="border border-white/[0.08] rounded-xl p-6">
          <p className="text-3xl sm:text-4xl font-bold text-white mb-2">$19<span className="text-base font-normal text-white/40">/mo</span></p>
          <p className="text-sm font-medium text-white/80 mb-2">Base subscription</p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            Low-friction onboarding into the Ultron product and distribution ecosystem
          </p>
        </div>

        {/* Usage */}
        <div className="border border-white/[0.08] rounded-xl p-6">
          <p className="text-3xl sm:text-4xl font-bold text-white mb-2">5%<span className="text-base font-normal text-white/40"> fee</span></p>
          <p className="text-sm font-medium text-white/80 mb-2">On consumed API tokens</p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            Usage-based monetization aligned with actual execution volume. Revenue scales with product usage.
          </p>
        </div>

        {/* Expansion */}
        <div className="border border-white/[0.08] rounded-xl p-6">
          <p className="text-3xl sm:text-4xl font-bold text-white mb-2">Custom</p>
          <p className="text-sm font-medium text-white/80 mb-2">Expansion builds</p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            Custom builds and operational deployments for companies with larger internal automation needs
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 8: THE ASK                                               */
/* ═══════════════════════════════════════════════════════════════ */

const USE_OF_FUNDS = [
  {
    title: "Scale distribution",
    body: "Expand the content engine, account network, and traffic systems that drive top-of-funnel growth",
  },
  {
    title: "Deepen product",
    body: "Improve core product quality, add more use cases, and strengthen the execution layer across GTM and operations",
  },
  {
    title: "Grow capacity",
    body: "Support engineering, product iteration, and the systems required to handle increased usage and customer demand",
  },
];

const MILESTONES = [
  "Scale the distribution network",
  "Expand supported workflows and integrations",
  "Improve product reliability and throughput",
  "Increase self-serve adoption",
  "Grow enterprise deployments",
];

function Slide8() {
  return (
    <SlideLayout
      pill="The Ask"
      title="Raising $1.5M at a $7M pre-money valuation"
    >
      <div className="h-px bg-white/[0.08] mb-6" />

      {/* Use of funds */}
      <div className="grid md:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {USE_OF_FUNDS.map((item, i) => (
          <div key={item.title} className="border border-white/[0.08] rounded-xl p-5">
            <span className="text-[10px] text-white/30 font-medium tracking-wider uppercase">{`0${i + 1}`}</span>
            <h3 className="text-sm font-semibold text-white mt-2 mb-2">{item.title}</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Milestones */}
      <div className="border border-white/[0.08] rounded-xl p-5">
        <p className="text-[10px] text-white/30 font-semibold tracking-wider uppercase mb-3">Milestones</p>
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map((m) => (
            <span key={m} className="text-xs text-white/60 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
              {m}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-white/40 leading-relaxed">
        The goal is to turn Ultron from an early execution system into the default operating layer for founder-led growth.
      </p>
    </SlideLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 9: CLOSING — CTA                                        */
/* ═══════════════════════════════════════════════════════════════ */

function Slide9() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openIntercom = () => {
    try { (window as any).Intercom?.("show"); } catch { /* silent */ }
  };

  /* Close on click outside */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const toggle = (doc: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(doc)) next.delete(doc);
      else next.add(doc);
      return next;
    });
  };

  const handleSend = async () => {
    if (!email.trim() || selected.size === 0) return;
    setSending(true);
    try {
      const res = await fetch("/api/deck-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, documents: Array.from(selected) }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      setTimeout(() => { setSent(false); setEmail(""); setDropdownOpen(false); }, 2000);
    } catch { /* silent */ } finally { setSending(false); }
  };

  const dropdown = dropdownOpen && (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl p-4 z-50 text-left">
      <label className="block text-white/30 text-xs uppercase tracking-wider mb-2 px-1">Request Documents</label>
      <div className="flex flex-col gap-1 mb-3">
        {["Updates", "Financial Report", "Data Room"].map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selected.has(opt) ? "bg-white/[0.08] text-white" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
            }`}
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selected.has(opt) ? "bg-white border-white" : "border-white/20"}`}>
              {selected.has(opt) && (
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        ))}
      </div>
      <label className="block text-white/30 text-xs uppercase tracking-wider mb-2 px-1">Email</label>
      <div className="flex gap-2 px-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="investor@email.com"
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!email.trim() || sending || selected.size === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            sent ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed"
          }`}
        >
          {sent ? "Sent" : sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <Image
        src="/logo.png"
        alt="Ultron"
        width={100}
        height={100}
        className="rounded-xl animate-logo-spin mb-10"
      />

      {/* CTAs — both buttons same height */}
      <div ref={dropdownRef} className="relative flex items-stretch gap-3">
        <button
          onClick={openIntercom}
          className="inline-flex items-center gap-2.5 bg-white text-black font-semibold text-sm sm:text-base rounded-full px-6 sm:px-8 py-3.5 hover:bg-white/90 transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Schedule a Call
        </button>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-2 text-white/70 border border-white/15 font-medium text-sm sm:text-base rounded-full px-5 sm:px-6 py-3.5 hover:text-white hover:border-white/30 transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="shrink-0 sm:hidden">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="hidden sm:inline">Request Documents</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {dropdown}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  EXPORT: ALL SLIDES                                             */
/* ═══════════════════════════════════════════════════════════════ */

export const DECK_SLIDES = [
  { id: 1, component: Slide1 },
  { id: 2, component: Slide2 },
  { id: 3, component: Slide3 },
  { id: 4, component: Slide4 },
  { id: 5, component: Slide5 },
  { id: 6, component: Slide6 },
  { id: 7, component: Slide7 },
  { id: 8, component: Slide8 },
  { id: 9, component: Slide9 },
];
