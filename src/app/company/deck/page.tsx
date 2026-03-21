"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useLiveStats } from "@/components/HeroStats";
import Link from "next/link";
import Image from "next/image";
import { DECK_SLIDES } from "./DeckSlides";

/* ── Tab type ──────────────────────────────────────────────── */
type Tab = "summary" | "deck";

/* ── Slides from DeckSlides ────────────────────────────────── */
const slides = DECK_SLIDES;

/* ── Request dropdown options ──────────────────────────────── */
const REQUEST_OPTIONS = ["Updates", "Financial Report", "Data Room"] as const;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function DeckPage() {
  const [tab, setTab] = useState<Tab>("summary");

  /* read tab from URL on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "deck") setTab("deck");
  }, []);
  const [current, setCurrent] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const requestRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  /* update URL when tab changes */
  const switchTab = (t: Tab) => {
    setTab(t);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", t);
    window.history.replaceState({}, "", url.toString());
  };

  /* toggle request option */
  const toggleRequest = (opt: string) => {
    setSelectedRequests((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  /* slide nav */
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  /* Lock body scroll on deck tab */
  useEffect(() => {
    if (tab === "deck") {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [tab]);

  /* keyboard nav (only in deck tab) */
  useEffect(() => {
    if (tab !== "deck") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, tab]);

  /* close request dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (requestRef.current && !requestRef.current.contains(e.target as Node)) {
        setRequestOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* handle send request */
  const handleSend = async () => {
    if (!email.trim() || selectedRequests.size === 0) return;
    setSending(true);
    try {
      const res = await fetch("/api/deck-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          documents: Array.from(selectedRequests),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setRequestOpen(false);
        setEmail("");
      }, 2000);
    } catch {
      setSending(false);
      setSent(false);
    }
  };

  return (
    <div className={`bg-[#0a0a0a] -mt-16 -mx-[calc((100vw-100%)/2)] w-screen relative left-1/2 right-1/2 -ml-[50vw] flex flex-col ${tab === "deck" ? "h-[calc(100dvh-64px)] overflow-hidden" : "min-h-screen"}`}>
      {/* ── Top bar: Tab switcher + More menu ────────────────── */}
      <div className="shrink-0 max-w-[1920px] mx-auto px-6 sm:px-8 pt-2 pb-2 flex items-center justify-center gap-3">
        {/* Tab switcher */}
        <div className="flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
          <button
            onClick={() => switchTab("summary")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              tab === "summary"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => switchTab("deck")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              tab === "deck"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Investment Deck
          </button>
        </div>

        {/* More (3-dot) dropdown — Download + Request */}
        <div ref={requestRef} className="relative">
          <button
            onClick={() => setRequestOpen(!requestOpen)}
            className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors"
            aria-label="More options"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {requestOpen && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-48px)] sm:w-80 max-w-80 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
              {/* Download option */}
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors mb-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Deck
              </button>

              <div className="h-px bg-white/[0.06] my-2" />

              {/* Request documents */}
              <label className="block text-white/30 text-xs uppercase tracking-wider mb-2 px-3">
                Request Documents
              </label>
              <div className="flex flex-col gap-1 mb-4">
                {REQUEST_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleRequest(opt)}
                    className={`flex items-center gap-3 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedRequests.has(opt)
                        ? "bg-white/[0.08] text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      selectedRequests.has(opt) ? "bg-white border-white" : "border-white/20"
                    }`}>
                      {selectedRequests.has(opt) && (
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Email input + send */}
              <label className="block text-white/30 text-xs uppercase tracking-wider mb-2 px-3">
                Email
              </label>
              <div className="flex gap-2 px-3">
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
                  disabled={!email.trim() || sending || selectedRequests.size === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sent
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed"
                  }`}
                >
                  {sent ? "Sent" : sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content area ───────────────────────────────────────── */}
      <div className={`flex-1 min-h-0 max-w-[1920px] mx-auto w-full ${tab === "deck" ? "px-0 sm:px-8 md:px-12 pt-0 sm:pt-4 pb-0 sm:pb-6" : "px-4 sm:px-8 md:px-12 pt-3 sm:pt-4 pb-4 sm:pb-6"}`}>
        {tab === "summary" ? (
          <ExecutiveSummary />
        ) : (
          <InvestmentDeck
            slides={slides}
            current={current}
            setCurrent={setCurrent}
            total={total}
            prev={prev}
            next={next}
          />
        )}
      </div>

      {/* ── Dark Footer — hidden on deck tab to maximize slide space ── */}
      {tab === "summary" && <DeckFooter />}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Executive Summary                                            */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const INTRO_P1 =
  "Ultron turns founder-led growth into a system that executes every day. No more waiting on more hires, more tools, or more coordination.";

const INTRO_P2 =
  "Instead of treating AI like a chat window, Ultron turns it into an execution layer across lead generation, outreach, content, research, and monitoring, working through OpenClaw as the control layer and Claude Code for parallel agent execution.";

const SECTION_1_ROWS = [
  {
    without: "Growth work stays manual, fragmented, and dependent on constant supervision.",
    with: "Core execution runs inside one system that keeps work moving across research, outreach, content, and follow-up.",
  },
  {
    without: "AI is used as an assistant. Someone still has to drive every task forward.",
    with: "AI agents execute work in parallel, with management, visibility, and control built in.",
  },
  {
    without: "Teams jump between tools, prompts, tabs, and workflows that break under pressure.",
    with: "OpenClaw coordinates the system and Claude Code drives parallel execution, so work moves through one operating model instead of scattered tools.",
  },
  {
    without: "More output usually means more headcount, more software, and more overhead.",
    with: "More output comes from better execution density across the same team.",
  },
  {
    without: "Important work stalls when no one is pushing it.",
    with: "Execution continues daily through an agent layer that does not depend on manual follow-through.",
  },
  {
    without: "AI adoption looks interesting in demos but weak in real operations.",
    with: "AI becomes part of how the company runs.",
  },
];

const SECTION_2_PARAGRAPHS = [
  "Ultron is not packaging prompts. It is packaging execution.",
  "It combines control and output in one product. OpenClaw gives structure, oversight, and coordination. Claude Code enables parallel agent work behind it. The result is a system that feels operational, not experimental.",
  "It is built around the reality that companies do not need another AI interface. They need work to happen reliably, repeatedly, and at scale.",
  "The advantage is not a single feature. It is the shift from using AI occasionally to running a larger share of the business through it.",
  "Ultron also sits in a cleaner position than most AI products. It is not trying to be a chatbot, a lightweight wrapper, or a visual automation toy. It is building the operating layer for agentic companies.",
  "That makes the product easier to understand, harder to replace, and better aligned with where the market is going.",
];

const SECTION_3_ITEMS = [
  { label: "Not a chatbot", desc: "Ultron is not built around conversation. It is built around execution." },
  { label: "Not another prompt layer", desc: "The value is not better wording. The value is getting real work done through agents." },
  { label: "Not a pile of disconnected automations", desc: "Ultron is one system for running execution across functions, not scattered workflows stitched together." },
  { label: "Not a demo product", desc: "It is designed for recurring use, operational visibility, and daily throughput." },
  { label: "Not a single-use AI assistant", desc: "Ultron is meant to support a company-level shift in how work gets done." },
  { label: "Not a replacement for judgment", desc: "Management still sets direction. Ultron increases execution capacity." },
];

const SECTION_TITLES = [
  "What Changes with Ultron",
  "Why Ultron Is Special",
  "What Ultron Is Not",
];

/* ── Streaming text hook ─────────────────────────────────────── */
function useStreamText(text: string, speed: number, startDelay: number, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const startTimer = setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          const chunk = Math.min(text.length - i, Math.floor(Math.random() * 2) + 1);
          i += chunk;
          setDisplayed(text.slice(0, i));
          timer = setTimeout(tick, speed + Math.random() * speed * 0.5);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
}

/* ── Animated loading dots ───────────────────────────────────── */
function LoadingDots() {
  return (
    <span className="inline-flex gap-[3px] ml-2 align-middle">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-[4px] h-[4px] rounded-full bg-white/60"
          style={{ animation: `loadingDot 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

/* ── Section icons (clean white SVGs) ─────────────────────────── */
const SECTION_ICONS: Record<string, React.ReactNode> = {
  "What Changes with Ultron": (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5} className="shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  "Why Ultron Is Special": (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5} className="shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  "What Ultron Is Not": (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5} className="shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
};

/* ── Collapsible section (Claude Code style) ─────────────────── */
function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="border-l-2 border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors group"
      >
        <svg
          width="10"
          height="10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          className={`text-white/40 shrink-0 transition-transform duration-150 ${
            open ? "rotate-90" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {SECTION_ICONS[title]}
        <span className="text-white text-sm sm:text-base font-medium">
          {title}
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-[height,opacity] duration-300 ease-in-out"
        style={{
          height: `${height}px`,
          opacity: open ? 1 : 0,
        }}
      >
        <div className="pl-8 pr-4 pb-6 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}

function ExecutiveSummary() {
  const p1 = useStreamText(INTRO_P1, 35, 400, true);
  const p2 = useStreamText(INTRO_P2, 28, 200, p1.done);
  const live = useLiveStats();

  const [bulletCount, setBulletCount] = useState(0);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  const fmtK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toLocaleString();

  const liveStats = [
    { value: live.founders.toLocaleString(), label: "founders joined" },
    { value: fmtK(live.agents), label: "agents deployed" },
    { value: fmtK(live.tasks), label: "tasks completed" },
    { value: fmtK(live.apiCalls), label: "API calls executed" },
    { value: `$${Math.round(live.saved / 1000)}K`, label: "saved" },
  ];

  useEffect(() => {
    if (!p2.done) return;
    if (bulletCount >= liveStats.length) {
      const t = setTimeout(() => setSectionsVisible(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBulletCount((c) => c + 1), 350);
    return () => clearTimeout(t);
  }, [p2.done, bulletCount, liveStats.length]);

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-16 font-[Inter,system-ui,sans-serif]">
      {/* ── Streaming intro ──────────────────────────────────── */}
      <p className="text-white text-base sm:text-xl leading-relaxed mb-6 sm:mb-8 min-h-[2em]">
        {p1.displayed}
        {!p1.done && <span className="inline-block w-[2px] h-[1.1em] bg-white/50 ml-0.5 align-text-bottom animate-pulse" />}
      </p>

      {p1.done && (
        <p className="text-white/80 text-sm sm:text-lg leading-relaxed mb-10 sm:mb-14 min-h-[2em]">
          {p2.displayed}
          {!p2.done && <span className="inline-block w-[2px] h-[1.1em] bg-white/50 ml-0.5 align-text-bottom animate-pulse" />}
        </p>
      )}

      {/* ── Live stats bullets ───────────────────────────────── */}
      {p2.done && (
        <div className="mb-12 sm:mb-16">
          <div className="h-px bg-white/[0.08] mb-8 sm:mb-10" />
          <div className="space-y-3 sm:space-y-4">
            {liveStats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 transition-all duration-300"
                style={{
                  opacity: i < bulletCount ? 1 : 0,
                  transform: i < bulletCount ? "translateY(0)" : "translateY(6px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                <span className="text-white text-sm sm:text-base tabular-nums transition-all duration-700">
                  {stat.value}
                </span>
                <span className="text-white/60 text-sm sm:text-base">
                  {stat.label}
                </span>
                <LoadingDots />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Subtitle + Collapsible sections ───────────────────── */}
      {sectionsVisible && (
        <>
        <p className="text-white/50 text-sm sm:text-base italic mb-8 transition-all duration-500">
          A system built for continuous execution, not isolated prompts
        </p>

        <div
          className="space-y-1 transition-all duration-500"
          style={{ opacity: sectionsVisible ? 1 : 0 }}
        >
          {/* Section 1: What Changes with Ultron */}
          <CollapsibleSection
            title={SECTION_TITLES[0]}
            open={openSection === 0}
            onToggle={() => setOpenSection(openSection === 0 ? null : 0)}
          >
            <div className="space-y-6">
              {SECTION_1_ROWS.map((row, ri) => (
                <div key={ri}>
                  <p className="text-white/40 text-sm leading-relaxed mb-2">
                    <span className="text-white/30 text-xs uppercase tracking-wider mr-2">Without</span>
                    {row.without}
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    <span className="text-white/50 text-xs uppercase tracking-wider mr-2">With Ultron</span>
                    {row.with}
                  </p>
                  {ri < SECTION_1_ROWS.length - 1 && (
                    <div className="h-px bg-white/[0.06] mt-6" />
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 2: Why Ultron Is Special */}
          <CollapsibleSection
            title={SECTION_TITLES[1]}
            open={openSection === 1}
            onToggle={() => setOpenSection(openSection === 1 ? null : 1)}
          >
            <div className="space-y-4">
              {SECTION_2_PARAGRAPHS.map((p, pi) => (
                <p key={pi} className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </CollapsibleSection>

          {/* Section 3: What Ultron Is Not */}
          <CollapsibleSection
            title={SECTION_TITLES[2]}
            open={openSection === 2}
            onToggle={() => setOpenSection(openSection === 2 ? null : 2)}
          >
            <div className="space-y-3">
              {SECTION_3_ITEMS.map((item, ii) => (
                <p key={ii} className="text-sm leading-relaxed">
                  <span className="text-white font-medium">{item.label}.</span>{" "}
                  <span className="text-white/70">{item.desc}</span>
                </p>
              ))}
            </div>
          </CollapsibleSection>
        </div>
        </>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Investment Deck (slide viewer)                               */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function InvestmentDeck({
  slides,
  current,
  setCurrent,
  total,
  prev,
  next,
}: {
  slides: typeof DECK_SLIDES;
  current: number;
  setCurrent: (i: number) => void;
  total: number;
  prev: () => void;
  next: () => void;
}) {
  /* Touch swipe support for mobile */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const slideRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe if horizontal movement > 50px and > vertical movement
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Slide area — fills remaining space */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {/* Desktop: 16:9 aspect, Mobile: full width no border */}
        <div
          ref={slideRef}
          className="relative w-full sm:rounded-xl overflow-hidden bg-black sm:border sm:border-white/[0.06] sm:shadow-2xl sm:aspect-video h-full sm:h-auto sm:max-h-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => {
            const SlideComponent = slide.component;
            return (
              <div
                key={slide.id}
                className="absolute inset-0 transition-opacity duration-300"
                style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
              >
                <SlideComponent />
              </div>
            );
          })}

          {/* Mobile: dot indicators overlay at bottom */}
          <div className="sm:hidden absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/30"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls — desktop only */}
      <div className="hidden sm:block shrink-0 pt-3 sm:pt-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={prev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
            aria-label="Next slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-1.5 sm:mt-2 text-white/30 text-xs sm:text-sm font-mono">
          {current + 1} / {total}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Dark Footer (matches deck aesthetic)                         */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function DeckFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/nxt-enterprises.png" alt="NXT" width={32} height={32} />
              <span className="text-xl font-bold text-white">NXT Enterprises</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              AI and blockchain infrastructure
              <br />
              for the autonomous economy.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white/30 mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Interactive Demo", href: "/demo" },
                { label: "Agent Blueprint", href: "/blueprint" },
                { label: "Dashboard", href: "/live" },
                { label: "Pricing", href: "/pricing" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white/30 mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Library", href: "/library" },
                { label: "ROI Calculator", href: "/calculator" },
                { label: "Documentation", href: "https://docs.51ultron.com/get-started/introduction", external: true },
                { label: "Automation Quiz", href: "/assess" },
              ].map((item) => (
                <li key={item.label}>
                  {"external" in item && item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white/30 mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "Contact Sales", href: "/contact" },
                { label: "Playbooks", href: "https://catalinfetean.substack.com/", external: true },
                { label: "DealMaker", href: "https://dealmaker.nexitynetwork.org/", external: true },
              ].map((item) => (
                <li key={item.label}>
                  {"external" in item && item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <span className="text-sm text-white/30">&copy; 2026 NXT Enterprises</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-white/30 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-white/30 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
