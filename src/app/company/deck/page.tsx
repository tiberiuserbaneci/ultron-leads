"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/* ── Tab type ──────────────────────────────────────────────── */
type Tab = "summary" | "deck";

/* ── Slide data (test placeholders) ────────────────────────── */
const slides = [
  { id: 1, content: "Test" },
  { id: 2, content: "Test" },
  { id: 3, content: "Test" },
  { id: 4, content: "Test" },
  { id: 5, content: "Test" },
];

/* ── Request dropdown options ──────────────────────────────── */
const REQUEST_OPTIONS = ["Financial Report", "Data Room", "Updates"] as const;

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
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set([REQUEST_OPTIONS[0]]));
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
      if (next.has(opt)) {
        if (next.size > 1) next.delete(opt);
      } else {
        next.add(opt);
      }
      return next;
    });
  };

  /* slide nav */
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

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
    // TODO: wire up to actual API
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setRequestOpen(false);
      setEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0a0a0a] -mt-[72px] pt-[72px] -mx-[calc((100vw-100%)/2)] w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-x-hidden">
      {/* ── Top bar: Tab switcher (center) + Actions (right) ─── */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Tab switcher — centered */}
        <div className="flex-1" />
        <div className="flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
          <button
            onClick={() => switchTab("summary")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === "summary"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => switchTab("deck")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === "deck"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Investment Deck
          </button>
        </div>

        {/* Action buttons — right */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          {/* Download */}
          <button
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors text-sm"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Request dropdown */}
          <div ref={requestRef} className="relative">
            <button
              onClick={() => setRequestOpen(!requestOpen)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors text-sm"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="hidden sm:inline">Request</span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className={`transition-transform duration-200 ${requestOpen ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {requestOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#141414] border border-white/[0.08] rounded-xl shadow-2xl p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
                {/* Multi-select type selector */}
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                  Documents
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
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="flex gap-2">
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
      </div>

      {/* ── Content area ───────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4 md:px-8 pt-6 sm:pt-8 pb-8 sm:pb-12">
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

const STATS = [
  "2,646 founders joined",
  "13.2K agents deployed",
  "101.9K tasks completed",
  "885.2K API calls executed",
  "$330K saved",
  "A system built for continuous execution, not isolated prompts",
];

const EXPANDABLE_SECTIONS = [
  {
    title: "What Changes with Ultron",
    rows: [
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
    ],
  },
  {
    title: "Why Ultron Is Special",
    paragraphs: [
      "Ultron is not packaging prompts. It is packaging execution.",
      "It combines control and output in one product. OpenClaw gives structure, oversight, and coordination. Claude Code enables parallel agent work behind it. The result is a system that feels operational, not experimental.",
      "It is built around the reality that companies do not need another AI interface. They need work to happen reliably, repeatedly, and at scale.",
      "The advantage is not a single feature. It is the shift from using AI occasionally to running a larger share of the business through it.",
      "Ultron also sits in a cleaner position than most AI products. It is not trying to be a chatbot, a lightweight wrapper, or a visual automation toy. It is building the operating layer for agentic companies.",
      "That makes the product easier to understand, harder to replace, and better aligned with where the market is going.",
    ],
  },
  {
    title: "What Ultron Is Not",
    items: [
      { label: "Not a chatbot", desc: "Ultron is not built around conversation. It is built around execution." },
      { label: "Not another prompt layer", desc: "The value is not better wording. The value is getting real work done through agents." },
      { label: "Not a pile of disconnected automations", desc: "Ultron is one system for running execution across functions, not scattered workflows stitched together." },
      { label: "Not a demo product", desc: "It is designed for recurring use, operational visibility, and daily throughput." },
      { label: "Not a single-use AI assistant", desc: "Ultron is meant to support a company-level shift in how work gets done." },
      { label: "Not a replacement for judgment", desc: "Management still sets direction. Ultron increases execution capacity." },
    ],
  },
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
          // Stream 2-4 chars at a time for natural feel
          const chunk = Math.min(text.length - i, Math.floor(Math.random() * 3) + 2);
          i += chunk;
          setDisplayed(text.slice(0, i));
          timer = setTimeout(tick, speed);
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

function ExecutiveSummary() {
  const p1 = useStreamText(INTRO_P1, 18, 300, true);
  const p2 = useStreamText(INTRO_P2, 14, 0, p1.done);

  const [bulletCount, setBulletCount] = useState(0);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  // Reveal bullets one by one after p2 finishes
  useEffect(() => {
    if (!p2.done) return;
    if (bulletCount >= STATS.length) {
      // After all bullets, reveal expandable sections
      const t = setTimeout(() => setSectionsVisible(true), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBulletCount((c) => c + 1), 250);
    return () => clearTimeout(t);
  }, [p2.done, bulletCount]);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-16">
      {/* ── Streaming intro ──────────────────────────────────── */}
      <p className="text-white/70 text-lg sm:text-xl leading-relaxed mb-8 min-h-[2em]">
        {p1.displayed}
        {!p1.done && <span className="inline-block w-[2px] h-[1.1em] bg-white/40 ml-0.5 align-text-bottom animate-pulse" />}
      </p>

      {p1.done && (
        <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-14 min-h-[2em]">
          {p2.displayed}
          {!p2.done && <span className="inline-block w-[2px] h-[1.1em] bg-white/40 ml-0.5 align-text-bottom animate-pulse" />}
        </p>
      )}

      {/* ── Stats bullets ────────────────────────────────────── */}
      {p2.done && (
        <div className="mb-16">
          <div className="h-px bg-white/[0.06] mb-10" />
          <div className="space-y-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex items-start gap-4 transition-all duration-300"
                style={{
                  opacity: i < bulletCount ? 1 : 0,
                  transform: i < bulletCount ? "translateY(0)" : "translateY(6px)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0" />
                <span className="text-white/80 text-base sm:text-lg font-mono">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Expandable sections ──────────────────────────────── */}
      {sectionsVisible && (
        <div
          className="space-y-3 transition-all duration-500"
          style={{ opacity: sectionsVisible ? 1 : 0 }}
        >
          {EXPANDABLE_SECTIONS.map((section, idx) => (
            <div
              key={idx}
              className="border border-white/[0.08] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenSection(openSection === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-white/90 text-base sm:text-lg font-medium">
                  {section.title}
                </span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={`text-white/30 shrink-0 transition-transform duration-200 ${
                    openSection === idx ? "rotate-180" : ""
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: openSection === idx ? "2000px" : "0",
                  opacity: openSection === idx ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-white/[0.06] mb-6" />

                  {/* Section 1: comparison rows */}
                  {"rows" in section && section.rows && (
                    <div className="space-y-5">
                      {section.rows.map((row, ri) => (
                        <div key={ri} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-4">
                            <span className="text-white/30 text-xs uppercase tracking-wider font-medium block mb-2">
                              Without Ultron
                            </span>
                            <p className="text-white/50 text-sm leading-relaxed">{row.without}</p>
                          </div>
                          <div className="rounded-lg bg-white/[0.04] border border-white/[0.08] p-4">
                            <span className="text-white/60 text-xs uppercase tracking-wider font-medium block mb-2">
                              With Ultron
                            </span>
                            <p className="text-white/80 text-sm leading-relaxed">{row.with}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section 2: paragraphs */}
                  {"paragraphs" in section && section.paragraphs && (
                    <div className="space-y-4">
                      {section.paragraphs.map((p, pi) => (
                        <p key={pi} className="text-white/60 text-sm sm:text-base leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Section 3: labeled items */}
                  {"items" in section && section.items && (
                    <div className="space-y-4">
                      {section.items.map((item, ii) => (
                        <div key={ii} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full bg-white/20 mt-2.5 shrink-0" />
                          <div>
                            <span className="text-white/80 text-sm font-medium">{item.label}.</span>{" "}
                            <span className="text-white/50 text-sm">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
  slides: { id: number; content: string }[];
  current: number;
  setCurrent: (i: number) => void;
  total: number;
  prev: () => void;
  next: () => void;
}) {
  return (
    <>
      <div className="relative w-full pb-[56.25%]">
        <div className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden bg-[#111] border border-white/[0.06] shadow-2xl">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
            >
              <span className="text-white/20 text-lg sm:text-2xl md:text-4xl font-medium select-none">
                {slide.content}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
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
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
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

      <div className="text-center mt-2 sm:mt-3 text-white/30 text-xs sm:text-sm font-mono">
        {current + 1} / {total}
      </div>
    </>
  );
}
