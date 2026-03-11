"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import FounderTerminal from "@/components/FounderTerminal";
import BrainOrb, { type BrainState } from "./BrainOrb";
import {
  PREBUILT_COMMANDS,
  getCommandData,
  type CommandData,
  type AgentActivation,
  type AttentionCard,
  type DecisionCard,
} from "./data";

/* ─── Speech Recognition types ──────────────────────────── */
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  const instance = new SR() as SpeechRecognitionInstance;
  instance.continuous = false;
  instance.interimResults = true;
  instance.lang = "en-US";
  return instance;
}

/* ─── Mic states ─────────────────────────────────────────── */
type MicState = "idle" | "listening" | "transcribing" | "unavailable";

/* ─── Utility: count-up animation ────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(target * progress * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function MetricCard({ label, value, suffix, active }: { label: string; value: number; suffix?: string; active: boolean }) {
  const display = useCountUp(value, active);
  return (
    <div className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-center">
      <div className="text-2xl font-bold text-[#DA4E24] font-terminal">
        {display % 1 === 0 ? Math.round(display) : display.toFixed(1)}
        {suffix}
      </div>
      <div className="text-[11px] text-[#666] mt-1">{label}</div>
    </div>
  );
}

/* ─── Urgency badge ──────────────────────────────────────── */
function UrgencyBadge({ score }: { score: number }) {
  const color = score >= 8 ? "text-red-400 border-red-400/20 bg-red-400/5" : score >= 6 ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-[#999] border-[#1a1a1a] bg-[#111]";
  return (
    <span className={`text-[9px] font-terminal font-bold px-2 py-0.5 rounded border ${color}`}>
      {score}/10
    </span>
  );
}

/* ─── State badge ────────────────────────────────────────── */
function StateBadge({ state }: { state: AttentionCard["state"] }) {
  const styles: Record<string, string> = {
    "auto-handle": "text-green-400 border-green-400/20 bg-green-400/5",
    monitor: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    escalate: "text-[#DA4E24] border-[#DA4E24]/20 bg-[#DA4E24]/5",
  };
  const labels: Record<string, string> = {
    "auto-handle": "AUTO-HANDLE",
    monitor: "MONITORING",
    escalate: "ESCALATE",
  };
  return (
    <span className={`text-[9px] font-terminal font-bold px-2 py-0.5 rounded border ${styles[state]}`}>
      {labels[state]}
    </span>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
export default function BrainPage() {
  const [brainState, setBrainState] = useState<BrainState>("idle");
  const [input, setInput] = useState("");
  const [micState, setMicState] = useState<MicState>("idle");
  const [activeCommand, setActiveCommand] = useState<CommandData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [recordMode, setRecordMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);
    const sr = getSpeechRecognition();
    if (sr) {
      recognitionRef.current = sr;
    } else {
      setMicState("unavailable");
    }
  }, []);

  const runCommand = useCallback((text: string) => {
    if (!text.trim()) return;
    const data = getCommandData(text);
    if (!data) return;

    setInput(text);
    setShowResults(false);
    setBrainState("thinking");

    setTimeout(() => {
      setBrainState("dispatching");
      setTimeout(() => {
        setActiveCommand(data);
        setShowResults(true);
        setBrainState("resolved");
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        setTimeout(() => setBrainState("idle"), 3000);
      }, 1200);
    }, 1500);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (micState === "listening") {
        recognitionRef.current?.stop();
        setMicState("idle");
      }
      runCommand(input);
    },
    [input, micState, runCommand]
  );

  const handleMicToggle = useCallback(() => {
    const sr = recognitionRef.current;
    if (!sr) return;

    if (micState === "listening") {
      sr.stop();
      setMicState("idle");
      setBrainState("idle");
      return;
    }

    setMicState("listening");
    setBrainState("listening");
    setInput("");

    sr.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[e.resultIndex][0].transcript;
      setInput(transcript);
      setMicState("transcribing");
      setBrainState("transcribing");
    };

    sr.onend = () => {
      setMicState("idle");
      // Auto-submit if we got text
      setTimeout(() => {
        const el = inputRef.current;
        if (el && el.value.trim()) {
          runCommand(el.value);
        } else {
          setBrainState("idle");
        }
      }, 300);
    };

    sr.onerror = () => {
      setMicState("idle");
      setBrainState("idle");
    };

    try {
      sr.start();
    } catch {
      setMicState("idle");
      setBrainState("idle");
    }
  }, [micState, runCommand]);

  const handleChipClick = useCallback(
    (cmd: string) => {
      setInput(cmd);
      runCommand(cmd);
    },
    [runCommand]
  );

  return (
    <div className={`min-h-screen bg-black ${recordMode ? "brain-record-mode" : ""}`}>
      {/* Record mode toggle */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setRecordMode(!recordMode)}
          className={`flex items-center gap-1.5 text-[10px] font-terminal uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-300 ${
            recordMode
              ? "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]"
              : "bg-[#0a0a0a] border-[#1a1a1a] text-[#555] hover:text-[#999] hover:border-[#333]"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${recordMode ? "bg-[#DA4E24] pulse-soft" : "bg-[#333]"}`} />
          {recordMode ? "Recording" : "Present"}
        </button>
      </div>

      {/* ─── HERO / BRAIN STAGE ─────────────────────────────── */}
      <section className={`relative overflow-hidden ${recordMode ? "min-h-screen flex flex-col items-center justify-center" : "pt-12 sm:pt-20 pb-8"}`}>
        {/* Hero glow */}
        <div className="hero-glow absolute inset-0 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-4 py-1.5 mb-6 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
            <span className="text-xs font-medium text-[#999]">Business Brain</span>
          </div>

          {/* Headline */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Attach a brain to{" "}
            <span className="gradient-text">your business.</span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-lg text-[#999] max-w-2xl mx-auto mb-8 transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Ask Ultron what matters. It routes attention, handles the repeatable
            work, and escalates only what needs your judgment.
          </p>

          {/* Brain orb */}
          <div className={`flex justify-center mb-8 transition-all duration-700 delay-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <BrainOrb state={brainState} compact={recordMode} />
          </div>

          {/* ─── COMMAND INTERFACE ─────────────────────────────── */}
          <div className={`max-w-2xl mx-auto transition-all duration-500 delay-[400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2 mb-4">
              {/* Mic button */}
              <button
                type="button"
                onClick={handleMicToggle}
                disabled={micState === "unavailable"}
                className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  micState === "listening"
                    ? "bg-[#DA4E24]/15 border-[#DA4E24]/40 text-[#DA4E24] brain-mic-pulse"
                    : micState === "unavailable"
                    ? "bg-[#0a0a0a] border-[#1a1a1a] text-[#333] cursor-not-allowed"
                    : "bg-[#0a0a0a] border-[#1a1a1a] text-[#666] hover:text-[#DA4E24] hover:border-[#DA4E24]/30"
                }`}
                title={micState === "unavailable" ? "Voice input not supported in this browser" : micState === "listening" ? "Stop listening" : "Start voice input"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {/* Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ultron what matters..."
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#DA4E24]/40 transition-colors"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!input.trim() || brainState === "thinking" || brainState === "dispatching"}
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center btn-gradient glow-accent text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            {/* Command chips */}
            <div className={`flex flex-wrap justify-center gap-2 ${recordMode ? "max-w-xl mx-auto" : ""}`}>
              {PREBUILT_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleChipClick(cmd)}
                  disabled={brainState === "thinking" || brainState === "dispatching"}
                  className="text-[11px] text-[#666] bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-3 py-1.5 hover:text-[#DA4E24] hover:border-[#DA4E24]/30 transition-all duration-200 disabled:opacity-30"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── RESULTS ─────────────────────────────────────────── */}
      {activeCommand && showResults && (
        <div ref={resultsRef} className="brain-results">
          {/* ─── INTERPRETATION STRIP ────────────────────────── */}
          <section className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-8" : "py-12"}`}>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 animate-fade-up">
              <div className="mb-4">
                <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">You asked</span>
                <p className="text-white font-semibold mt-1">&ldquo;{activeCommand.input}&rdquo;</p>
              </div>
              <div className="border-t border-[#1a1a1a] pt-4">
                <span className="text-[10px] font-terminal text-[#DA4E24] uppercase tracking-widest">Ultron interprets</span>
                <ul className="mt-2 space-y-1.5">
                  {activeCommand.interpretation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#999] animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                      <span className="text-[#DA4E24] mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── ATTENTION SURFACE ───────────────────────────── */}
          <section className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-6" : "py-12"}`}>
            {!recordMode && (
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-2">Attention Surface</h2>
                <p className="text-[#555] text-sm">What the brain is pulling into focus.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeCommand.attentionCards.map((card, i) => (
                <AttentionCardComponent key={i} card={card} index={i} />
              ))}
            </div>
          </section>

          {/* ─── AUTONOMY / ESCALATION SPLIT ─────────────────── */}
          <section className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-6" : "py-12"}`}>
            {!recordMode && (
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-2">Intelligence Routing</h2>
                <p className="text-[#555] text-sm">What Ultron handles, watches, and escalates.</p>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Handled */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-fade-up">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">Handled Automatically</h3>
                </div>
                <ul className="space-y-3">
                  {activeCommand.handledAutomatically.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#999] animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                      <svg className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Watching */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Watching</h3>
                </div>
                <ul className="space-y-3">
                  {activeCommand.watchItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#999] animate-fade-up" style={{ animationDelay: `${(i + 2) * 0.08}s` }}>
                      <svg className="flex-shrink-0 w-4 h-4 text-blue-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Needs decision */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#DA4E24]" />
                  <h3 className="text-xs font-bold text-[#DA4E24] uppercase tracking-widest">Needs Your Decision</h3>
                </div>
                <ul className="space-y-3">
                  {activeCommand.founderDecisions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#999] animate-fade-up" style={{ animationDelay: `${(i + 3) * 0.08}s` }}>
                      <svg className="flex-shrink-0 w-4 h-4 text-[#DA4E24] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── AGENT ACTIVATION STRIP ──────────────────────── */}
          <section className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-6" : "py-12"}`}>
            {!recordMode && (
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-2">Agent Activation</h2>
                <p className="text-[#555] text-sm">The brain dispatches its capabilities.</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {activeCommand.agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </section>

          {/* ─── DECISION QUEUE ──────────────────────────────── */}
          <section className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-6" : "py-12"}`}>
            {!recordMode && (
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-2">Decision Queue</h2>
                <p className="text-[#555] text-sm">What Ultron brings to the founder.</p>
              </div>
            )}
            <div className="space-y-3">
              {activeCommand.founderDecisions.map((decision, i) => (
                <DecisionCardComponent key={i} decision={decision} index={i} />
              ))}
            </div>
          </section>

          {/* ─── COMPOUNDING OUTCOME PANEL ───────────────────── */}
          <section className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${recordMode ? "py-6" : "py-12"}`}>
            {!recordMode && (
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-2">Outcome</h2>
                <p className="text-[#555] text-sm">What this command produced.</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <MetricCard label="Hours not spent" value={activeCommand.metrics.hoursNotSpent} suffix="h" active={showResults} />
              <MetricCard label="Tasks absorbed" value={activeCommand.metrics.tasksAbsorbed} active={showResults} />
              <MetricCard label="Signals watched" value={activeCommand.metrics.signalsUnderWatch} active={showResults} />
              <MetricCard label="Pipeline recovered" value={activeCommand.metrics.pipelineRiskRecovered} active={showResults} />
              <MetricCard label="Decisions simplified" value={activeCommand.metrics.decisionsSimplified} active={showResults} />
              <MetricCard label="Follow-ups queued" value={activeCommand.metrics.followUpsQueued} active={showResults} />
            </div>
          </section>
        </div>
      )}

      {/* ─── FINAL CTA ───────────────────────────────────────── */}
      {!recordMode && (
        <>
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Deploy the brain,{" "}
              <span className="gradient-text">not just the task.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#999] max-w-2xl mx-auto mb-8">
              Ultron does more than run workflows. It notices what matters, handles
              repeatable work automatically, and brings you only the decisions worth
              making.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="https://app.51ultron.com/signup"
                className="inline-flex items-center gap-2 btn-gradient glow-accent text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
              >
                Try Ultron
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/demo" className="text-[#555] hover:text-[#DA4E24] transition-colors">
                Watch the live demo →
              </Link>
              <Link href="/client-engine" className="text-[#555] hover:text-[#DA4E24] transition-colors">
                Explore the client engines →
              </Link>
              <Link href="/72hours" className="text-[#555] hover:text-[#DA4E24] transition-colors">
                Read 72 hours of real output →
              </Link>
            </div>
          </section>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FounderTerminal />
          </div>

          <Footer />
        </>
      )}

      {/* Record mode minimal CTA */}
      {recordMode && activeCommand && showResults && (
        <div className="text-center py-8">
          <Link
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-2 btn-gradient glow-accent text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            Try Ultron
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function AttentionCardComponent({ card, index }: { card: AttentionCard; index: number }) {
  return (
    <div
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#DA4E24]/20 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-terminal font-bold text-[#DA4E24] uppercase tracking-widest">{card.signal}</span>
        <div className="flex items-center gap-2">
          <UrgencyBadge score={card.urgency} />
          <StateBadge state={card.state} />
        </div>
      </div>
      <p className="text-sm text-[#ccc] mb-2">{card.observation}</p>
      <span className="text-[10px] text-[#444] font-terminal">{card.source}</span>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: AgentActivation; index: number }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition-all duration-500 animate-fade-up ${
        agent.active
          ? "bg-[#0a0a0a] border-[#DA4E24]/30 shadow-[0_0_12px_rgba(218,78,36,0.1)]"
          : "bg-[#0a0a0a] border-[#1a1a1a] opacity-40"
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${agent.active ? "bg-[#DA4E24] pulse-soft" : "bg-[#333]"}`} />
        <span className={`text-xs font-bold ${agent.active ? "text-white" : "text-[#555]"}`}>{agent.label}</span>
      </div>
      {agent.active && agent.role && (
        <p className="text-[10px] text-[#888] leading-relaxed">{agent.role}</p>
      )}
    </div>
  );
}

function DecisionCardComponent({ decision, index }: { decision: DecisionCard; index: number }) {
  return (
    <div
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-6 hover:border-[#DA4E24]/20 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#DA4E24]/10 border border-[#DA4E24]/20 flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-[#DA4E24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white mb-2">{decision.title}</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Why it matters</span>
              <p className="text-[#999] mt-0.5">{decision.why}</p>
            </div>
            <div>
              <span className="text-[10px] font-terminal text-[#DA4E24] uppercase tracking-widest">Ultron recommends</span>
              <p className="text-[#ccc] mt-0.5">{decision.recommendation}</p>
            </div>
            <div>
              <span className="text-[10px] font-terminal text-green-500 uppercase tracking-widest">If approved</span>
              <p className="text-[#888] mt-0.5">{decision.ifApproved}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
