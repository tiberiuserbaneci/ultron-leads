"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import BrainOrb, { type BrainState } from "@/app/brain/BrainOrb";
import {
  PREBUILT_COMMANDS,
  getCommandData,
  type CommandData,
  type AttentionCard,
  type AgentActivation,
  type DecisionCard,
} from "@/app/brain/data";

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

type MicState = "idle" | "listening" | "transcribing" | "unavailable";

/* ─── Count-up animation ─────────────────────────────────── */
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

/* ─── Card with clean border (black bg, gray border) ─────── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#333] bg-black overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ─── Metric card ────────────────────────────────────────── */
function MetricCard({ label, value, suffix, active }: { label: string; value: number; suffix?: string; active: boolean }) {
  const display = useCountUp(value, active);
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-white">
        {display % 1 === 0 ? Math.round(display) : display.toFixed(1)}
        <span className="text-[#DA4E24]">{suffix}</span>
      </div>
      <div className="text-xs text-[#666] mt-1.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}

/* ─── Urgency badge ──────────────────────────────────────── */
function UrgencyBadge({ score }: { score: number }) {
  const color = score >= 8
    ? "text-red-400 border-red-400/30"
    : score >= 6
    ? "text-amber-400 border-amber-400/30"
    : "text-[#999] border-[#444]";
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {score}/10
    </span>
  );
}

/* ─── State badge ────────────────────────────────────────── */
function StateBadge({ state }: { state: AttentionCard["state"] }) {
  const styles: Record<string, string> = {
    "auto-handle": "text-green-400 border-green-400/30",
    monitor: "text-blue-400 border-blue-400/30",
    escalate: "text-[#DA4E24] border-[#DA4E24]/30",
  };
  const labels: Record<string, string> = {
    "auto-handle": "AUTO-HANDLE",
    monitor: "MONITORING",
    escalate: "ESCALATE",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles[state]}`}>
      {labels[state]}
    </span>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function AttentionCardComponent({ card, index }: { card: AttentionCard; index: number }) {
  return (
    <Card>
      <div
        className="p-5 sm:p-6 animate-fade-up"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#DA4E24]">{card.signal}</span>
          <div className="flex items-center gap-2">
            <UrgencyBadge score={card.urgency} />
            <StateBadge state={card.state} />
          </div>
        </div>
        <p className="text-sm text-[#ccc] leading-relaxed mb-2">{card.observation}</p>
        <span className="text-[11px] text-[#555]">{card.source}</span>
      </div>
    </Card>
  );
}

function AgentCard({ agent, index }: { agent: AgentActivation; index: number }) {
  return (
    <Card>
      <div
        className={`p-5 text-center transition-all duration-500 animate-fade-up ${
          !agent.active ? "opacity-40" : ""
        }`}
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${agent.active ? "bg-[#DA4E24] pulse-soft" : "bg-[#333]"}`} />
          <span className={`text-xs font-bold ${agent.active ? "text-white" : "text-[#555]"}`}>{agent.label}</span>
        </div>
        {agent.active && agent.role && (
          <p className="text-[11px] text-[#888] leading-relaxed">{agent.role}</p>
        )}
      </div>
    </Card>
  );
}

function DecisionCardComponent({ decision, index }: { decision: DecisionCard; index: number }) {
  return (
    <Card>
      <div
        className="p-6 sm:p-8 animate-fade-up"
        style={{ animationDelay: `${index * 0.12}s` }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center mt-0.5">
            <svg className="w-5 h-5 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white mb-3">{decision.title}</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#555]">Why it matters</span>
                <p className="text-[#999] mt-1 leading-relaxed">{decision.why}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#DA4E24]">Ultron recommends</span>
                <p className="text-[#ccc] mt-1 leading-relaxed">{decision.recommendation}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-green-500">If approved</span>
                <p className="text-[#888] mt-1 leading-relaxed">{decision.ifApproved}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ─── Routing column card ────────────────────────────────── */
function RoutingColumn({
  dotColor,
  titleColor,
  title,
  icon,
  items,
  delayOffset = 0,
}: {
  dotColor: string;
  titleColor: string;
  title: string;
  icon: React.ReactNode;
  items: (string | { title: string })[];
  delayOffset?: number;
}) {
  return (
    <Card>
      <div className="p-6 animate-fade-up">
        <div className="flex items-center gap-2.5 mb-5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <h3 className={`text-xs font-bold uppercase tracking-[0.12em] ${titleColor}`}>{title}</h3>
        </div>
        <ul className="space-y-3.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm text-[#999] leading-relaxed animate-fade-up"
              style={{ animationDelay: `${(i + delayOffset) * 0.08}s` }}
            >
              <span className="flex-shrink-0 mt-0.5">{icon}</span>
              {typeof item === "string" ? item : item.title}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                    BRAIN CONTENT (shared)                       */
/* ═══════════════════════════════════════════════════════════════ */

export function BrainContent({ embedded }: { embedded?: boolean }) {
  const [brainState, setBrainState] = useState<BrainState>("idle");
  const [input, setInput] = useState("");
  const [micState, setMicState] = useState<MicState>("idle");
  const [activeCommand, setActiveCommand] = useState<CommandData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [chipsOpen, setChipsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    setChipsOpen(false);
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
      setChipsOpen(false);
      runCommand(cmd);
    },
    [runCommand]
  );

  const isProcessing = brainState === "thinking" || brainState === "dispatching";

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
      {/* ─── HEADER: Badge + Headline + Subtitle ─────────── */}
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
          BUSINESS BRAIN
        </span>
        <h2 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1]">
          Attach a brain to
          <br />
          your business.
        </h2>
        <p className="mt-5 text-[#999] text-lg max-w-[560px] mx-auto leading-relaxed">
          Ask Ultron what matters. It routes attention, handles the repeatable
          work, and escalates only what needs your judgment.
        </p>
      </div>

      {/* ─── BRAIN ORB (full size, not compact) ──────────── */}
      <div className="flex justify-center mb-10">
        <BrainOrb state={brainState} />
      </div>

      {/* ─── CHAT BAR ────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto mb-6 relative">
        <form onSubmit={handleSubmit} className="relative w-full">
          {/* Animated glow border */}
          <div className="absolute -inset-[1px] rounded-full overflow-hidden z-0">
            <div
              className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
              style={{
                background:
                  micState === "listening"
                    ? "conic-gradient(from 0deg, transparent 0%, transparent 50%, rgba(218,78,36,0.5) 65%, rgba(218,78,36,0.8) 75%, rgba(218,78,36,0.5) 85%, transparent 100%)"
                    : "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.3) 72%, rgba(218,78,36,0.5) 78%, rgba(218,78,36,0.3) 84%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative z-10 bg-[#0c0c0c] rounded-full border border-[#1a1a1a] px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3">
            {/* Mic button */}
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={micState === "unavailable"}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                micState === "listening"
                  ? "bg-[#DA4E24] text-white"
                  : micState === "unavailable"
                  ? "bg-transparent text-[#333] cursor-not-allowed"
                  : "bg-transparent text-[#555] hover:text-[#DA4E24] transition-colors"
              }`}
              title={micState === "unavailable" ? "Voice input not supported" : micState === "listening" ? "Stop listening" : "Start voice input"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setChipsOpen(true)}
              placeholder="Ask Ultron what matters..."
              className="flex-1 min-w-0 bg-transparent text-white text-[14px] sm:text-[15px] outline-none placeholder:text-[#555]"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="w-7 h-7 rounded-full bg-[#DA4E24] flex items-center justify-center hover:bg-[#e8633f] transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </form>

        {/* ─── MOBILE: Chips dropdown under chat bar ─────── */}
        <div className="sm:hidden relative z-20">
          {/* Toggle button */}
          <button
            onClick={() => setChipsOpen(!chipsOpen)}
            className="w-full flex items-center justify-center gap-1.5 mt-3 py-2 text-[12px] text-[#666] hover:text-[#999] transition-colors"
          >
            <span>{chipsOpen ? "Hide" : "Show"} suggestions</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className={`text-[#555] transition-transform duration-200 ${chipsOpen ? "rotate-180" : ""}`}
            >
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dropdown panel */}
          {chipsOpen && (
            <div className="mt-1 rounded-2xl border border-[#333] bg-black p-3 animate-fade-up">
              <div className="flex flex-col gap-1.5">
                {PREBUILT_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleChipClick(cmd)}
                    disabled={isProcessing}
                    className="text-left text-[13px] text-[#999] px-3.5 py-2.5 rounded-xl hover:bg-[#111] hover:text-white transition-colors disabled:opacity-30"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── DESKTOP: Chips scattered ────────────────────── */}
      <div className="hidden sm:flex flex-wrap justify-center gap-3 max-w-[900px] mx-auto">
        {PREBUILT_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleChipClick(cmd)}
            disabled={isProcessing}
            className="text-[13px] text-[#888] border border-[#333] rounded-full px-4 py-1.5 hover:text-white hover:border-[#555] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* ─── RESULTS ─────────────────────────────────────── */}
      {activeCommand && showResults && (
        <div ref={resultsRef} className="mt-20">
          {/* ─── INTERPRETATION ────────────────────────────── */}
          <div className="max-w-[900px] mx-auto mb-16">
            <Card>
              <div className="p-6 sm:p-8 animate-fade-up">
                <div className="mb-5">
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#555]">You asked</span>
                  <p className="text-white font-bold text-lg mt-1">&ldquo;{activeCommand.input}&rdquo;</p>
                </div>
                <div className="border-t border-[#333] pt-5">
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#DA4E24]">Ultron interprets</span>
                  <ul className="mt-3 space-y-2">
                    {activeCommand.interpretation.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#999] leading-relaxed animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                        <span className="text-[#DA4E24] mt-0.5 flex-shrink-0">&rarr;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* ─── ATTENTION SURFACE ─────────────────────────── */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
                ATTENTION SURFACE
              </span>
              <p className="mt-4 text-[#999] text-lg leading-relaxed">What the brain is pulling into focus.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {activeCommand.attentionCards.map((card, i) => (
                <AttentionCardComponent key={i} card={card} index={i} />
              ))}
            </div>
          </div>

          {/* ─── INTELLIGENCE ROUTING ──────────────────────── */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
                INTELLIGENCE ROUTING
              </span>
              <p className="mt-4 text-[#999] text-lg leading-relaxed">What Ultron handles, watches, and escalates.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <RoutingColumn
                dotColor="bg-green-500"
                titleColor="text-green-400"
                title="Handled Automatically"
                icon={
                  <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                }
                items={activeCommand.handledAutomatically}
              />
              <RoutingColumn
                dotColor="bg-blue-500"
                titleColor="text-blue-400"
                title="Watching"
                delayOffset={2}
                icon={
                  <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                }
                items={activeCommand.watchItems}
              />
              <RoutingColumn
                dotColor="bg-[#DA4E24]"
                titleColor="text-[#DA4E24]"
                title="Needs Your Decision"
                delayOffset={3}
                icon={
                  <svg className="w-4 h-4 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                }
                items={activeCommand.founderDecisions}
              />
            </div>
          </div>

          {/* ─── AGENT ACTIVATION ──────────────────────────── */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
                AGENT ACTIVATION
              </span>
              <p className="mt-4 text-[#999] text-lg leading-relaxed">The brain dispatches its capabilities.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {activeCommand.agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </div>

          {/* ─── DECISION QUEUE ────────────────────────────── */}
          <div className="max-w-[900px] mx-auto mb-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
                DECISION QUEUE
              </span>
              <p className="mt-4 text-[#999] text-lg leading-relaxed">What Ultron brings to the founder.</p>
            </div>
            <div className="space-y-5">
              {activeCommand.founderDecisions.map((decision, i) => (
                <DecisionCardComponent key={i} decision={decision} index={i} />
              ))}
            </div>
          </div>

          {/* ─── OUTCOME METRICS ───────────────────────────── */}
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
                OUTCOME
              </span>
              <p className="mt-4 text-[#999] text-lg leading-relaxed">What this command produced.</p>
            </div>
            <Card>
              <div className="p-8 sm:p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                  <MetricCard label="Hours saved" value={activeCommand.metrics.hoursNotSpent} suffix="h" active={showResults} />
                  <MetricCard label="Tasks absorbed" value={activeCommand.metrics.tasksAbsorbed} active={showResults} />
                  <MetricCard label="Signals watched" value={activeCommand.metrics.signalsUnderWatch} active={showResults} />
                  <MetricCard label="Pipeline recovered" value={activeCommand.metrics.pipelineRiskRecovered} active={showResults} />
                  <MetricCard label="Decisions simplified" value={activeCommand.metrics.decisionsSimplified} active={showResults} />
                  <MetricCard label="Follow-ups queued" value={activeCommand.metrics.followUpsQueued} active={showResults} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
