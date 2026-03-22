"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLiveStats } from "@/components/HeroStats";

/* ═══════════════════════════════════════════════════════════════ */
/*  SHARED HELPERS                                                 */
/* ═══════════════════════════════════════════════════════════════ */

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] sm:text-sm font-semibold tracking-[0.2em] uppercase text-orange-700 sm:text-white/40">
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

/* ── Problem slide task data ─────────────────── */

const TASK_COLUMNS = [
  ["Find prospects", "Enrich contacts", "Personalize outreach", "Send follow-ups", "Update pipelines"],
  ["Generate content ideas", "Draft posts", "Repurpose winners", "Write captions", "Track performance"],
  ["Build workflows", "Connect tools", "Route tasks", "Generate reports", "Fix broken steps"],
];

const TOTAL_TASKS = 15;
const STAGGER_MS = 180;
const HOLD_MS = 2200;
const RESET_MS = 600;
const BOTTOM_REVEAL_AT = 10; // reveal bottom line after this many tasks completed

/* ── Checkbox SVG (unchecked / checked) ──────── */

function TaskCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 rounded transition-colors duration-300"
      style={{ width: 16, height: 16, border: checked ? "none" : "1.5px solid rgba(255,255,255,0.12)", background: checked ? "#DA4E24" : "transparent" }}
    >
      {checked && (
        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

/* ── Single task row with animated strike-through ── */

function TaskRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-[5px] sm:py-[6px]">
      <TaskCheckbox checked={checked} />
      <span className="relative text-[14px] sm:text-[15px] text-white/60 select-none whitespace-nowrap" style={{ opacity: checked ? 0.4 : 1, transition: "opacity 0.4s ease" }}>
        {label}
        <span
          className="absolute left-0 top-1/2 h-[1px] bg-white/35 origin-left"
          style={{
            width: checked ? "100%" : "0%",
            transition: "width 0.4s ease",
          }}
        />
      </span>
    </div>
  );
}

/* ── Desktop 3-column grid ──────────────────── */

function TaskGridDesktop({ completed }: { completed: number }) {
  // Row-by-row across columns: row0-col0, row0-col1, row0-col2, row1-col0, ...
  const isChecked = (col: number, row: number) => {
    const index = row * 3 + col;
    return index < completed;
  };

  return (
    <div className="hidden md:grid grid-cols-3 gap-x-8 lg:gap-x-12">
      {TASK_COLUMNS.map((tasks, colIdx) => (
        <div key={colIdx}>
          {tasks.map((task, rowIdx) => (
            <TaskRow key={task} label={task} checked={isChecked(colIdx, rowIdx)} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Mobile: 4-column grid showing all 15 tasks ── */

const ALL_TASKS = TASK_COLUMNS.flat();

function TaskGridMobile({ completed }: { completed: number; blockIndex: number }) {
  return (
    <div className="md:hidden grid grid-cols-2 gap-x-6 gap-y-[6px]">
      {ALL_TASKS.map((task, i) => {
        const checked = i < completed;
        return (
          <div key={task} className="flex items-center gap-2">
            <TaskCheckbox checked={checked} />
            <span
              className="relative text-[13px] text-white/60 select-none whitespace-nowrap"
              style={{ opacity: checked ? 0.4 : 1, transition: "opacity 0.4s ease" }}
            >
              {task}
              <span
                className="absolute left-0 top-1/2 h-[1px] bg-white/35 origin-left"
                style={{ width: checked ? "100%" : "0%", transition: "width 0.4s ease" }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Slide 2: The Problem ───────────────────── */

function Slide2() {
  const [gridVisible, setGridVisible] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [mobileCompleted, setMobileCompleted] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop animation loop
  const runDesktopLoop = useCallback(() => {
    let count = 0;

    const tick = () => {
      count++;
      setCompleted(count);

      if (count >= BOTTOM_REVEAL_AT && !bottomVisible) {
        setBottomVisible(true);
      }

      if (count < TOTAL_TASKS) {
        timerRef.current = setTimeout(tick, STAGGER_MS);
      } else {
        // All done — hold, then reset and repeat
        timerRef.current = setTimeout(() => {
          setCompleted(0);
          timerRef.current = setTimeout(() => {
            runDesktopLoop();
          }, RESET_MS);
        }, HOLD_MS);
      }
    };

    timerRef.current = setTimeout(tick, STAGGER_MS);
  }, []); // bottomVisible intentionally omitted — we set it once

  // Mobile animation loop: all 15 tasks
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runMobileLoop = useCallback(() => {
    let count = 0;

    const tick = () => {
      count++;
      setMobileCompleted(count);

      if (count >= BOTTOM_REVEAL_AT && !bottomVisible) {
        setBottomVisible(true);
      }

      if (count < TOTAL_TASKS) {
        mobileTimerRef.current = setTimeout(tick, STAGGER_MS);
      } else {
        mobileTimerRef.current = setTimeout(() => {
          setMobileCompleted(0);
          mobileTimerRef.current = setTimeout(() => {
            runMobileLoop();
          }, RESET_MS);
        }, HOLD_MS);
      }
    };

    mobileTimerRef.current = setTimeout(tick, STAGGER_MS);
  }, []);

  useEffect(() => {
    // Fade in grid shortly after mount
    const initTimer = setTimeout(() => {
      setGridVisible(true);
      // Start both loops — CSS will show/hide the right one
      runDesktopLoop();
      runMobileLoop();
    }, 400);

    return () => {
      clearTimeout(initTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    };
  }, [runDesktopLoop, runMobileLoop]);

  return (
    <div className="flex flex-col h-full px-5 sm:px-10 lg:px-14 max-w-5xl mx-auto w-full pt-5 sm:pt-0 sm:justify-center overflow-hidden">
      {/* Pill — mobile only */}
      <div className="sm:hidden mb-3">
        <SlideLabel>The Problem</SlideLabel>
      </div>
      {/* Title */}
      <div className="sm:text-center mb-4 sm:mb-10">
        {/* Mobile: left-aligned */}
        <h2 className="sm:hidden text-xl font-bold text-white leading-tight">
          Most growing businesses are buried in work humans shouldn&apos;t do anymore.
        </h2>
        {/* Desktop: centered, 2 lines */}
        <h2 className="hidden sm:block text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-white leading-[1.2] tracking-tight">
          Most growing businesses are buried in work
          <br />
          humans shouldn&apos;t do anymore.
        </h2>
      </div>

      {/* Task grid — centered block, columns left-aligned inside */}
      <div
        className="flex justify-center"
        style={{
          opacity: gridVisible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div className="w-full max-w-3xl">
          <TaskGridDesktop completed={completed} />
          <TaskGridMobile completed={mobileCompleted} blockIndex={0} />
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="text-center mt-8 sm:mt-10"
        style={{
          opacity: bottomVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Mobile: 2 lines */}
        <p className="sm:hidden text-[15px] font-medium text-white/50 leading-snug">
          Founders can delegate 90% of it
          <br />
          to Ultron within 24 hours&nbsp;&rarr;
        </p>
        {/* Desktop: 1 line */}
        <p className="hidden sm:block text-base lg:text-lg font-medium text-white/50">
          Founders can delegate 90% of it to Ultron within 24 hours&nbsp;&rarr;
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 3: THE SOLUTION                                          */
/* ═══════════════════════════════════════════════════════════════ */

/* ── Workflow transcript data ──────────────────── */

const TRANSCRIPT_LINES: { type: "action" | "sub" | "gap"; text: string; accent?: boolean; logo?: string }[] = [
  { type: "action", text: "Identifying the tools needed for this workflow" },
  { type: "action", text: "Checking Apollo, HubSpot, and scoring capabilities" },
  { type: "action", text: "Creating Lead Enrichment & Router" },
  { type: "sub", text: "Agent created successfully", logo: "/logo.png" },
  { type: "gap", text: "" },
  { type: "action", text: "Attaching workflow tools" },
  { type: "sub", text: "Apollo enrichment attached", logo: "/apollo.png" },
  { type: "sub", text: "ICP scoring attached" },
  { type: "sub", text: "HubSpot routing attached", logo: "/hubspot.png" },
  { type: "gap", text: "" },
  { type: "action", text: "Configuring trigger" },
  { type: "sub", text: "New HubSpot contact", logo: "/hubspot.png" },
  { type: "gap", text: "" },
  { type: "action", text: "Testing the workflow" },
  { type: "sub", text: "Apollo enrichment", logo: "/apollo.png" },
  { type: "sub", text: "ICP scoring" },
  { type: "sub", text: "HubSpot routing", logo: "/hubspot.png" },
  { type: "sub", text: "All tests passed", accent: true },
  { type: "gap", text: "" },
  { type: "action", text: "Publishing workflow" },
  { type: "sub", text: "Lead Enrichment & Router is now live", accent: true },
];

const TRANSCRIPT_STATUS = [
  { label: "Name", value: "Lead Enrichment & Router" },
  { label: "Status", value: "Live", accent: true },
  { label: "Trigger", value: "New HubSpot contact" },
];

/* ── Architecture data ─────────────────────────── */

const AGENT_FLEET_CARDS = [
  { title: "Research", body: "Scans public data, news, and firmographics to build deep prospect profiles automatically.", logos: ["/logo openclaw.png", "/logo claude.png"] },
  { title: "Enrichment", body: "Cross-references Apollo, HubSpot, and internal data to score and qualify every lead.", logos: ["/logo openclaw.png", "/logo claude.png"] },
  { title: "Outreach", body: "Generates personalized sequences and follows up based on engagement signals.", logos: ["/logo openclaw.png", "/logo claude.png"] },
  { title: "Content", body: "Creates targeted posts and lead magnets that feed the viral distribution loop.", logos: ["/logo openclaw.png", "/logo claude.png"] },
];

/* ── Workflow panel (left box) ─────────────────── */

function WorkflowPanel() {
  return (
    <div className="flex flex-col border border-white/[0.12] rounded-xl bg-white/[0.03] overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-white/[0.10]">
        <span className="text-[10px] font-semibold text-white/70 tracking-[0.15em] uppercase">Workflow</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
        <div className="space-y-[3px]">
          {TRANSCRIPT_LINES.map((line, i) => {
            if (line.type === "gap") return <div key={i} className="h-3" />;
            if (line.type === "sub") {
              return (
                <div key={i} className="flex items-center gap-1.5 pl-5">
                  <span className="text-white/35 text-[13px] leading-[22px] select-none">└</span>
                  {line.logo && <Image src={line.logo} alt="" width={12} height={12} className="rounded-sm shrink-0" />}
                  <span className={`text-[13px] leading-[22px] ${line.accent ? "text-green-400" : "text-white/70"}`}>
                    {line.text}
                  </span>
                </div>
              );
            }
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-[5px] h-[5px] rounded-full bg-white/60 mt-[9px] shrink-0" />
                <span className="text-[13px] leading-[22px] text-white/90">{line.text}</span>
              </div>
            );
          })}
        </div>

        {/* Status table */}
        <div className="mt-4 border border-white/[0.12] rounded-lg overflow-hidden">
          {TRANSCRIPT_STATUS.map((row) => (
            <div key={row.label} className="flex border-b border-white/[0.08] last:border-b-0">
              <span className="text-[12px] font-semibold text-white/70 px-3 py-2 w-[72px] shrink-0">{row.label}</span>
              <span className={`text-[12px] px-3 py-2 ${row.accent ? "text-green-400 font-semibold" : "text-white/80"}`}>{row.value}</span>
            </div>
          ))}
        </div>

        <p className="text-[12px] text-white/55 mt-3 leading-relaxed">
          New leads are automatically enriched, scored, and routed to the right rep.
        </p>
      </div>
    </div>
  );
}

/* ── Agent Fleet panel (right box — stacked cards) ── */

function AgentFleetPanel() {
  return (
    <div className="flex flex-col gap-2.5 h-full">
      {AGENT_FLEET_CARDS.map((card) => (
        <div key={card.title} className="border border-white/[0.08] rounded-xl px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-[13px] font-semibold text-white">{card.title}</h3>
            {card.logos.map((logo, i) => (
              <Image key={i} src={logo} alt="" width={13} height={13} className="rounded-sm" />
            ))}
          </div>
          <p className="text-[12px] text-white/50 leading-relaxed">{card.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 3 — EXACT same layout shell as Slide 2 (Problem) ── */

function Slide3() {
  return (
    <div className="flex flex-col h-full px-5 sm:px-10 lg:px-14 max-w-5xl mx-auto w-full overflow-hidden pt-5 sm:pt-[7%]">
      {/* Pill — mobile only */}
      <div className="sm:hidden mb-3">
        <SlideLabel>The Solution</SlideLabel>
      </div>
      {/* Title */}
      <div className="sm:text-center mb-4 sm:mb-10">
        <h2 className="sm:hidden text-xl font-bold text-white leading-tight">
          Built for companies that want to scale results not headcount
        </h2>
        <h2 className="hidden sm:block text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-white leading-[1.2] tracking-tight">
          Built for companies that want to scale results
          <br />
          not headcount
        </h2>
      </div>

      {/* Content area — centered, max-w-3xl like Problem slide grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Desktop: two panels side by side */}
          <div className="hidden md:grid grid-cols-2 gap-4" style={{ height: 280 }}>
            <WorkflowPanel />
            <AgentFleetPanel />
          </div>

          {/* Mobile: agent fleet on top, then taller workflow (no scroll) */}
          <div className="md:hidden space-y-3">
            {/* Agent Fleet — always open, just the two lines */}
            <div className="border border-white/[0.12] rounded-xl bg-white/[0.03] px-5 py-3">
              <p className="text-[10px] font-semibold text-white/70 tracking-[0.15em] uppercase mb-2">Agent Fleet</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Image src="/logo openclaw.png" alt="OpenClaw" width={14} height={14} className="rounded-sm shrink-0" />
                  <span className="text-[13px] text-white/80">OpenClaw as the control layer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/logo claude.png" alt="Claude" width={14} height={14} className="rounded-sm shrink-0" />
                  <span className="text-[13px] text-white/80">Claude Code for parallel execution</span>
                </div>
              </div>
            </div>
            {/* Workflow — tall enough to show full transcript, no scroll */}
            <div className="flex flex-col border border-white/[0.12] rounded-xl bg-white/[0.03] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.10]">
                <span className="text-[10px] font-semibold text-white/70 tracking-[0.15em] uppercase">Workflow</span>
              </div>
              <div className="px-5 py-4">
                <div className="space-y-[3px]">
                  {TRANSCRIPT_LINES.map((line, i) => {
                    if (line.type === "gap") return <div key={i} className="h-2" />;
                    if (line.type === "sub") {
                      if (line.text === "All tests passed") {
                        return (
                          <div key={i} className="flex items-center gap-1.5 pl-5">
                            <span className="text-white/35 text-[11px] leading-[18px] select-none">└</span>
                            {line.logo && <Image src={line.logo} alt="" width={10} height={10} className="rounded-sm shrink-0" />}
                            <span className="text-[11px] leading-[18px] text-green-400">{line.text}</span>
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="flex items-center gap-1.5 pl-5">
                          <span className="text-white/35 text-[11px] leading-[18px] select-none">└</span>
                          {line.logo && <Image src={line.logo} alt="" width={10} height={10} className="rounded-sm shrink-0" />}
                          <span className={`text-[11px] leading-[18px] ${line.accent ? "text-green-400" : "text-white/70"}`}>{line.text}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-[4px] h-[4px] rounded-full bg-white/60 mt-[7px] shrink-0" />
                        <span className="text-[11px] leading-[18px] text-white/90">{line.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 4: TRACTION AND GTM                                     */
/* ═══════════════════════════════════════════════════════════════ */

const FLOW_STEPS = ["Viral post", "Comment CTA", "Lead magnet", "Free trial", "Paying customer"];

const ENTERPRISE_POINTS = [
  { title: "Higher ACV entry point", body: "Custom automation projects start at higher contract values, creating a stronger revenue base from fewer accounts." },
  { title: "Faster learning from real customer workflows", body: "Every enterprise engagement surfaces real operational patterns that feed back into the core product." },
  { title: "Expands product depth through real use cases", body: "Each deployment adds new workflow coverage, making the platform more capable over time." },
];

function Slide4() {
  const live = useLiveStats();
  const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toLocaleString();

  const stats = [
    { value: live.founders.toLocaleString(), label: "Founders" },
    { value: fmtK(live.tasks), label: "Tasks" },
    { value: `$${Math.round(live.saved / 1000)}K`, label: "Saved" },
  ];

  return (
    <div className="flex flex-col h-full px-5 sm:px-10 lg:px-14 max-w-5xl mx-auto w-full overflow-hidden pt-5 sm:pt-[7%]">
      {/* Pill — mobile only */}
      <div className="sm:hidden mb-3">
        <SlideLabel>Traction</SlideLabel>
      </div>
      {/* Main line */}
      <div className="sm:text-center mb-4 sm:mb-6">
        <h2 className="sm:hidden text-xl font-bold text-white leading-tight">
          Content-driven distribution and network effect
        </h2>
        <h2 className="hidden sm:block text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-white leading-[1.2] tracking-tight">
          Content-driven distribution engine
          <br />
          and network effect
        </h2>
      </div>

      {/* KPI row — 3 metrics, balanced sizing */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="flex items-center gap-8 sm:gap-14">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white tabular-nums">{s.value}</p>
              <p className="text-xs sm:text-sm text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two panels */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Left: Viral Distribution */}
          <div className="flex flex-col border border-white/[0.12] rounded-xl bg-white/[0.03] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.10]">
              <span className="text-[10px] font-semibold text-white/70 tracking-[0.15em] uppercase">Viral Distribution</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-[14px] text-white/80 leading-snug mb-3">A content engine designed to turn attention into product entry</p>

              {/* Compact vertical flow */}
              <div className="space-y-1">
                {FLOW_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-2.5 animate-slide-up" style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}>
                    <span className="w-[5px] h-[5px] rounded-full bg-white/50 shrink-0" />
                    <span className="text-[13px] text-white/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 3 stacked cards */}
          <div className="flex flex-col gap-2 md:gap-2.5">
            {ENTERPRISE_POINTS.map((point) => (
              <div key={point.title} className="border border-white/[0.08] rounded-xl px-4 py-2.5 md:py-3">
                <h3 className="text-[13px] font-semibold text-white mb-0.5 md:mb-1">{point.title}</h3>
                <p className="text-[12px] text-white/50 leading-snug md:leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 6: COMPETITION                                           */
/* ═══════════════════════════════════════════════════════════════ */

const COMPARISON_PAIRS = [
  { old: "Work moves between people", neo: "Work is handled by specialized agents" },
  { old: "Scaling requires more headcount", neo: "Scaling runs on parallel execution" },
  { old: "Knowledge is spread everywhere", neo: "Knowledge becomes shared memory" },
  { old: "More tools create more confusion", neo: "Tools are coordinated natively" },
  { old: "Output depends on incentives", neo: "Output compounds exponentially" },
];

type CompRow = { label: string; ultron: string; n8n: string; zapier: string; gumloop: string };

const COMP_ROWS: CompRow[] = [
  { label: "Primary mode", ultron: "Execution system", n8n: "Workflow builder", zapier: "Orchestration platform", gumloop: "No-code automation builder" },
  { label: "Core user", ultron: "Founder-led GTM teams", n8n: "Technical operators", zapier: "Broad business teams", gumloop: "No-code AI operators" },
  { label: "Product shape", ultron: "Opinionated", n8n: "Modular", zapier: "Horizontal", gumloop: "Visual builder" },
  { label: "Best fit", ultron: "Output, distribution, and execution in one layer", n8n: "Deep workflow control", zapier: "Automating across many apps", gumloop: "Building AI workflows without code" },
];

const COMP_EDGES = [
  "Packaged execution over general automation",
  "Designed around GTM throughput",
  "Agents, integrations, and distribution combined",
  "Clear path from attention to execution",
];

const COMP_STAGGER = 400;
const COMP_HOLD = 2400;
const COMP_RESET = 800;

/* ── Desktop comparison row — orange checkbox left, left-aligned ── */

function ComparisonRowDesktop({ old, neo, scratched }: { old: string; neo: string; scratched: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6 py-[7px]">
      {/* Left — old model with orange checkbox, left-aligned text */}
      <div className="flex items-center gap-2.5 justify-end">
        <span
          className="relative inline text-[14px] lg:text-[15px] text-white/60 select-none text-left"
          style={{ opacity: scratched ? 0.35 : 1, transition: "opacity 0.4s ease" }}
        >
          {old}
          <span
            className="absolute left-0 top-1/2 h-[1px] bg-white/40 origin-left"
            style={{ width: scratched ? "100%" : "0%", transition: "width 0.4s ease" }}
          />
        </span>
        <TaskCheckbox checked={scratched} />
      </div>
      {/* Arrow */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} className="shrink-0 opacity-30">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
      {/* Right — new model, stays clean */}
      <span className="text-[14px] lg:text-[15px] text-white/90 select-none">{neo}</span>
    </div>
  );
}

/* ── Matrix overlay (desktop only, full slide) ─────────── */

function CompMatrixOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 bg-black flex items-center justify-center px-10 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Matrix table */}
        <div className="border border-white/[0.10] rounded-xl overflow-hidden mb-5">
          <div className="grid grid-cols-5 bg-white/[0.03]">
            <div className="p-4" />
            {["Ultron", "n8n", "Zapier", "Gumloop"].map((name) => (
              <div key={name} className={`p-4 border-l border-white/[0.08] ${name === "Ultron" ? "bg-white/[0.05]" : ""}`}>
                <span className={`text-sm font-semibold ${name === "Ultron" ? "text-white" : "text-white/60"}`}>{name}</span>
              </div>
            ))}
          </div>
          {COMP_ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-5 border-t border-white/[0.08]">
              <div className="p-4">
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-medium">{row.label}</span>
              </div>
              <div className="p-4 border-l border-white/[0.08] bg-white/[0.05]">
                <span className="text-sm text-white">{row.ultron}</span>
              </div>
              <div className="p-4 border-l border-white/[0.08]">
                <span className="text-sm text-white/70">{row.n8n}</span>
              </div>
              <div className="p-4 border-l border-white/[0.08]">
                <span className="text-sm text-white/70">{row.zapier}</span>
              </div>
              <div className="p-4 border-l border-white/[0.08]">
                <span className="text-sm text-white/70">{row.gumloop}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Edge statements */}
        <div className="grid grid-cols-4 gap-3">
          {COMP_EDGES.map((edge) => (
            <div key={edge} className="flex items-start gap-2 p-3">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} className="shrink-0 mt-0.5 opacity-60">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-white/60">{edge}</span>
            </div>
          ))}
        </div>
        {/* Close hint */}
        <div className="text-center mt-4">
          <button onClick={onClose} className="text-[13px] text-white/40 hover:text-white/60 transition-colors">
            Close matrix
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── The slide ─────────────────────────────── */

function Slide6() {
  const [scratched, setScratched] = useState(0);
  const [visible, setVisible] = useState(false);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile state — same pattern as Slide 2
  // Phase 1: show all old lines, scratch them one by one
  // Phase 2: hold scratched state, then show new lines
  const [mobileCompleted, setMobileCompleted] = useState(0);
  const [mobileShowNew, setMobileShowNew] = useState(false);
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runDesktopLoop = useCallback(() => {
    let count = 0;
    const tick = () => {
      count++;
      setScratched(count);
      if (count < COMPARISON_PAIRS.length) {
        timerRef.current = setTimeout(tick, COMP_STAGGER);
      } else {
        timerRef.current = setTimeout(() => {
          setScratched(0);
          timerRef.current = setTimeout(runDesktopLoop, COMP_RESET);
        }, COMP_HOLD);
      }
    };
    timerRef.current = setTimeout(tick, COMP_STAGGER);
  }, []);

  // Mobile: scratch old lines one by one, then reveal new lines, then loop
  const runMobileLoop = useCallback(() => {
    let count = 0;
    setMobileCompleted(0);
    setMobileShowNew(false);

    const tick = () => {
      count++;
      setMobileCompleted(count);

      if (count < COMPARISON_PAIRS.length) {
        mobileTimerRef.current = setTimeout(tick, STAGGER_MS);
      } else {
        // All scratched — reveal new lines
        mobileTimerRef.current = setTimeout(() => {
          setMobileShowNew(true);
          // Hold the new lines, then reset and loop
          mobileTimerRef.current = setTimeout(() => {
            setMobileCompleted(0);
            setMobileShowNew(false);
            mobileTimerRef.current = setTimeout(runMobileLoop, COMP_RESET);
          }, COMP_HOLD);
        }, 400);
      }
    };

    mobileTimerRef.current = setTimeout(tick, STAGGER_MS);
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setVisible(true);
      runDesktopLoop();
      runMobileLoop();
    }, 400);
    return () => {
      clearTimeout(initTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
    };
  }, [runDesktopLoop, runMobileLoop]);

  return (
    <div className="relative flex flex-col h-full px-5 sm:px-10 lg:px-14 max-w-5xl mx-auto w-full pt-5 sm:pt-0 sm:justify-center overflow-hidden">
      {/* Pill — mobile only */}
      <div className="sm:hidden mb-3">
        <SlideLabel>Competition</SlideLabel>
      </div>
      {/* Title */}
      <div className="sm:text-center mb-4 sm:mb-10">
        <h2 className="sm:hidden text-xl font-bold text-white leading-tight">
          We are living through the final cycle of the corporate machine.
        </h2>
        <h2 className="hidden sm:block text-[28px] lg:text-[36px] xl:text-[40px] font-bold text-white leading-[1.2] tracking-tight">
          We are living through the final cycle
          <br />
          of the corporate machine.
        </h2>
      </div>

      {/* Comparison block */}
      <div
        className="flex justify-center"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        <div className="w-full max-w-3xl">
          {/* Desktop: two columns + arrows */}
          <div className="hidden md:block">
            {COMPARISON_PAIRS.map((pair, i) => (
              <ComparisonRowDesktop key={i} old={pair.old} neo={pair.neo} scratched={i < scratched} />
            ))}
          </div>

          {/* Mobile: all old lines with scratch animation, then new lines */}
          <div className="md:hidden flex justify-center">
            <div className="space-y-[2px]">
              {COMPARISON_PAIRS.map((pair, i) => {
                const isScratched = i < mobileCompleted;
                return (
                  <div key={i} className="flex items-center gap-2.5 py-[5px]">
                    <TaskCheckbox checked={isScratched} />
                    <span
                      className="relative text-[14px] text-white/60 select-none"
                      style={{ opacity: isScratched ? 0.35 : 1, transition: "opacity 0.4s ease" }}
                    >
                      {mobileShowNew ? pair.neo : pair.old}
                      {!mobileShowNew && (
                        <span
                          className="absolute left-0 top-1/2 h-[1px] bg-white/40 origin-left"
                          style={{ width: isScratched ? "100%" : "0%", transition: "width 0.4s ease" }}
                        />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: competitor matrix — Ultron + n8n visible, scroll right for Zapier/Gumloop */}
      <div className="md:hidden mt-4" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <div className="border border-white/[0.10] rounded-xl overflow-x-auto">
          <div style={{ minWidth: 480 }}>
            {/* Header row */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] bg-white/[0.03]">
              <div className="px-3 py-2.5" />
              {["Ultron", "n8n", "Zapier", "Gumloop"].map((name) => (
                <div key={name} className={`px-3 py-2.5 border-l border-white/[0.08] ${name === "Ultron" ? "bg-white/[0.05]" : ""}`}>
                  <span className={`text-[11px] font-semibold ${name === "Ultron" ? "text-white" : "text-white/50"}`}>{name}</span>
                </div>
              ))}
            </div>
            {/* Data rows */}
            {COMP_ROWS.map((row) => (
              <div key={row.label} className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] border-t border-white/[0.08]">
                <div className="px-3 py-2.5">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{row.label}</span>
                </div>
                <div className="px-3 py-2.5 border-l border-white/[0.08] bg-white/[0.05]">
                  <span className="text-[11px] text-white leading-snug">{row.ultron}</span>
                </div>
                <div className="px-3 py-2.5 border-l border-white/[0.08]">
                  <span className="text-[11px] text-white/60 leading-snug">{row.n8n}</span>
                </div>
                <div className="px-3 py-2.5 border-l border-white/[0.08]">
                  <span className="text-[11px] text-white/60 leading-snug">{row.zapier}</span>
                </div>
                <div className="px-3 py-2.5 border-l border-white/[0.08]">
                  <span className="text-[11px] text-white/60 leading-snug">{row.gumloop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom area — matrix trigger (desktop only) */}
      <div
        className="hidden md:flex justify-center mt-8 sm:mt-10"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <button
          onClick={() => setMatrixOpen(true)}
          className="text-[13px] text-white/40 hover:text-white/60 transition-colors flex items-center gap-1.5"
        >
          <span>See competitive matrix</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Matrix overlay */}
      <CompMatrixOverlay open={matrixOpen} onClose={() => setMatrixOpen(false)} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SLIDE 7: BUSINESS MODEL                                        */
/* ═══════════════════════════════════════════════════════════════ */

function Slide7() {
  return (
    <SlideLayout
      pill="Business Model"
      title="Simple entry point and usage aligned with value."
    >
      <div className="grid md:grid-cols-3 gap-3 sm:gap-5">
        {/* Entry */}
        <div className="border border-white/[0.08] rounded-xl p-5 sm:p-6 min-h-[130px] sm:min-h-0">
          <p className="text-[10px] text-white/30 font-semibold tracking-wider uppercase mb-2 sm:mb-3">Entry</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">$19<span className="text-base font-normal text-white/40">/mo</span></p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            Low-friction entry into the Ultron product and distribution ecosystem
          </p>
        </div>

        {/* Usage */}
        <div className="border border-white/[0.08] rounded-xl p-5 sm:p-6 min-h-[130px] sm:min-h-0">
          <p className="text-[10px] text-white/30 font-semibold tracking-wider uppercase mb-2 sm:mb-3">Usage</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">5%<span className="text-base font-normal text-white/40"> fee</span></p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            On consumed API tokens. Revenue scales with actual execution volume.
          </p>
        </div>

        {/* Expansion */}
        <div className="border border-white/[0.08] rounded-xl p-5 sm:p-6 min-h-[130px] sm:min-h-0">
          <p className="text-[10px] text-white/30 font-semibold tracking-wider uppercase mb-2 sm:mb-3">Expansion</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Custom</p>
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">
            Operational builds for companies with larger internal automation needs
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
    title: "Distribution",
    body: "Expand the content engine, account network, and traffic systems that drive top-of-funnel growth",
  },
  {
    title: "Product",
    body: "Improve core product quality, add more use cases, and strengthen the execution layer across GTM and operations",
  },
  {
    title: "Capacity",
    body: "Support engineering, product iteration, and the systems required to handle increased usage and customer demand",
  },
];

function Slide8() {
  return (
    <SlideLayout
      pill="The Ask"
      title="Raising $1.5M at a $7M pre-money valuation"
    >
      <div className="h-px bg-white/[0.08] mb-6" />

      {/* Use of funds */}
      <div className="grid md:grid-cols-3 gap-3 sm:gap-5">
        {USE_OF_FUNDS.map((item) => (
          <div key={item.title} className="border border-white/[0.08] rounded-xl p-5 min-h-[130px] sm:min-h-0">
            <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
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
  { id: 5, component: Slide6 },
  { id: 6, component: Slide7 },
  { id: 7, component: Slide8 },
  { id: 8, component: Slide9 },
];
