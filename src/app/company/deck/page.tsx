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
  const [current, setCurrent] = useState(0);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestType, setRequestType] = useState<string>(REQUEST_OPTIONS[0]);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const requestRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

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
    if (!email.trim()) return;
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
    <div className="min-h-[calc(100vh-72px)] bg-[#0a0a0a] -mx-[calc((100vw-100%)/2)] w-screen relative left-1/2 right-1/2 -ml-[50vw]">
      {/* ── Top bar: Tab switcher (center) + Actions (right) ─── */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Tab switcher — centered */}
        <div className="flex-1" />
        <div className="flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.06]">
          <button
            onClick={() => setTab("summary")}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === "summary"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setTab("deck")}
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
                {/* Type selector */}
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                  Document
                </label>
                <div className="flex flex-col gap-1 mb-4">
                  {REQUEST_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setRequestType(opt)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        requestType === opt
                          ? "bg-white/[0.08] text-white"
                          : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                      }`}
                    >
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
                    disabled={!email.trim() || sending}
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
function ExecutiveSummary() {
  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-16">
      {/* Intro */}
      <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10">
        NXT Enterprises builds AI and blockchain infrastructure for the
        autonomous economy. Our flagship product, <span className="text-white">Ultron</span>,
        is an AI-powered sales automation platform that replaces manual
        prospecting with autonomous agents — delivering qualified leads,
        booked meetings, and closed deals at a fraction of the cost.
      </p>

      <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-12">
        We are raising to accelerate product development, expand our
        go-to-market, and scale infrastructure across Europe and the US.
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mb-12" />

      {/* Highlights */}
      <h2 className="text-white text-sm uppercase tracking-widest mb-8 font-medium">
        Highlights
      </h2>
      <div className="space-y-5">
        {[
          "700+ Active Companies Onboard",
          "$150,000 Monthly Recurring Revenue",
          "221% Net MRR Growth Year to Date",
          "$3.6M Monthly Trading Volume in goods and services",
          "15 European Banks natively integrated",
          "10+ Startup Programs",
          "50+ Partners and Advisors",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0" />
            <span className="text-white/80 text-base sm:text-lg">{item}</span>
          </div>
        ))}
      </div>
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
      {/* 16:9 container */}
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

      {/* Controls */}
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
