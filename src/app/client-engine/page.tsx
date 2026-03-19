"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FounderTerminal from "@/components/FounderTerminal";
import {
  engines,
  agentMeta,
  type Engine,
  type Horizon,
  type Mode,
  type AgentId,
  type Signal,
} from "./engineData";

/* ═══════════════════════════════════════════════
   UTILITY HOOKS
   ═══════════════════════════════════════════════ */

function useCountUp(target: number, duration = 1200, trigger = true) {
  const [val, setVal] = useState(0);
  const prevTarget = useRef(0);
  useEffect(() => {
    if (!trigger) return;
    const from = prevTarget.current;
    prevTarget.current = target;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, trigger]);
  return val;
}

function useVisible(delay = 50) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setV(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return v;
}

/* ═══════════════════════════════════════════════
   AGENT ICON (inline SVG)
   ═══════════════════════════════════════════════ */

function AgentIcon({ id, size = 16 }: { id: AgentId; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "CORTEX": return <svg {...props}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>;
    case "SPECTER": return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "STRIKER": return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "PULSE": return <svg {...props}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>;
    case "SENTINEL": return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  }
}

/* ═══════════════════════════════════════════════
   SECTION 1: HERO
   ═══════════════════════════════════════════════ */

function Hero({ reelMode }: { reelMode: boolean }) {
  const visible = useVisible();
  if (reelMode) return null;
  return (
    <div className="relative text-center mb-10 sm:mb-14">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div
        className={`inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
        <span className="text-[#DA4E24] text-sm font-medium">Client Engine</span>
      </div>
      <h1
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 transition-all duration-500 delay-75 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        Build the growth engine<br className="hidden sm:block" /> Ultron should deploy.
      </h1>
      <p
        className={`text-base sm:text-lg text-[#999] max-w-2xl mx-auto mb-8 transition-all duration-500 delay-150 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        Choose a founder-led growth engine. See where the opportunity comes from, which agents activate, what roles get replaced, and how the system compounds over time.
      </p>
      <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <a
          href="https://app.51ultron.com/signup"
          className="btn-gradient glow-accent text-white font-semibold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 transition-all"
        >
          Deploy this in Ultron
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
        <Link href="/demo" className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors">
          See Ultron execute in real time &rarr;
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2: ENGINE SELECTOR
   ═══════════════════════════════════════════════ */

function EngineSelector({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
      {engines.map((e, i) => {
        const active = selected === e.id;
        return (
          <button
            key={e.id}
            onClick={() => onSelect(e.id)}
            className={`text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 group ${
              active
                ? "bg-[#0a0a0a] border-[#DA4E24]/40 shadow-[0_0_24px_rgba(218,78,36,0.12)]"
                : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333] opacity-60 hover:opacity-90"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-sm font-bold transition-colors ${active ? "text-[#DA4E24]" : "text-white"}`}>
                {e.title}
              </h3>
              {active && <span className="w-2 h-2 rounded-full bg-[#DA4E24] pulse-soft flex-shrink-0 mt-1" />}
            </div>
            <p className="text-[11px] text-[#666] mb-3 leading-relaxed">{e.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {e.signalTags.map((t) => (
                <span key={t} className="text-[9px] font-terminal text-[#555] bg-[#111] border border-[#1a1a1a] rounded px-1.5 py-0.5">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#444]">Best for: {e.bestFor.split(" ").slice(0, 4).join(" ")}...</span>
              <span className="font-terminal text-[10px] text-[#DA4E24] font-bold">{e.teaserStat}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3: CONTROL STRIP
   ═══════════════════════════════════════════════ */

function ControlStrip({
  mode,
  onModeChange,
  horizon,
  onHorizonChange,
  chips,
  onRemoveChip,
  onAddChip,
  onReset,
  reelMode,
  onReelToggle,
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  horizon: Horizon;
  onHorizonChange: (h: Horizon) => void;
  chips: Signal[];
  onRemoveChip: (id: string) => void;
  onAddChip: () => void;
  onReset: () => void;
  reelMode: boolean;
  onReelToggle: () => void;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Mode toggle */}
        <div className="flex bg-[#111] rounded-lg p-0.5 border border-[#1a1a1a]">
          {(["founder", "agency"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-3 py-1.5 text-[11px] font-terminal rounded-md transition-all ${
                mode === m ? "bg-[#DA4E24]/15 text-[#DA4E24] shadow-[0_0_8px_rgba(218,78,36,0.15)]" : "text-[#555] hover:text-white"
              }`}
            >
              {m === "founder" ? "Use for my business" : "Sell this to clients"}
            </button>
          ))}
        </div>

        {/* Horizon toggle */}
        <div className="flex bg-[#111] rounded-lg p-0.5 border border-[#1a1a1a]">
          {([["week1", "Week 1"], ["month1", "Month 1"], ["quarter1", "Quarter 1"]] as [Horizon, string][]).map(([h, label]) => (
            <button
              key={h}
              onClick={() => onHorizonChange(h)}
              className={`px-3 py-1.5 text-[11px] font-terminal rounded-md transition-all ${
                horizon === h ? "bg-[#DA4E24]/15 text-[#DA4E24] shadow-[0_0_8px_rgba(218,78,36,0.15)]" : "text-[#555] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Reel mode toggle */}
        <button
          onClick={onReelToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-terminal rounded-lg border transition-all ${
            reelMode
              ? "border-[#DA4E24]/40 text-[#DA4E24] bg-[#DA4E24]/10"
              : "border-[#1a1a1a] text-[#555] hover:text-white hover:border-[#333]"
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
          {reelMode ? "EXIT REEL" : "REEL MODE"}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-[10px] font-terminal text-[#444] hover:text-[#999] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Editable chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="inline-flex items-center gap-1.5 bg-[#111] border border-[#1a1a1a] rounded-full px-3 py-1 text-[11px] text-[#ccc] font-terminal group"
          >
            {chip.label}
            {chip.removable && (
              <button
                onClick={() => onRemoveChip(chip.id)}
                className="text-[#444] hover:text-[#DA4E24] transition-colors ml-0.5"
              >
                &times;
              </button>
            )}
          </span>
        ))}
        <button
          onClick={onAddChip}
          className="inline-flex items-center gap-1 bg-[#111] border border-dashed border-[#333] rounded-full px-3 py-1 text-[11px] text-[#444] hover:text-[#DA4E24] hover:border-[#DA4E24]/30 font-terminal transition-all"
        >
          + Add filter
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 4: OPPORTUNITY SURFACE
   ═══════════════════════════════════════════════ */

function OpportunitySurface({ engine, mode, animKey }: { engine: Engine; mode: Mode; animKey: number }) {
  const cards = mode === "agency" ? engine.agencyOpportunityCards : engine.opportunityCards;
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    cards.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), 120 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [animKey, cards]);

  const urgencyColor = (u: number) => {
    if (u >= 9) return "text-[#DA4E24]";
    if (u >= 7) return "text-amber-400";
    return "text-[#666]";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest">Opportunity Surface</h2>
        <span className="font-terminal text-[10px] text-[#DA4E24]">{cards.length} signals detected</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <div
            key={`${engine.id}-${mode}-${i}`}
            className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 transition-all duration-400 ${
              i < revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-terminal text-[#444]">{card.timestamp}</span>
              <span className={`font-terminal text-[10px] font-bold ${urgencyColor(card.urgency)}`}>
                {card.urgency}/10
              </span>
            </div>
            <div className="mb-1.5">
              <span className="text-xs font-bold text-white">{card.company}</span>
            </div>
            <p className="text-[11px] text-[#DA4E24] font-medium mb-1.5">{card.signal}</p>
            <p className="text-[10px] text-[#666] leading-relaxed mb-2">{card.observation}</p>
            <span className="text-[9px] font-terminal text-[#333] bg-[#111] border border-[#1a1a1a] rounded px-1.5 py-0.5">
              {card.source}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 5: ENGINE ARCHITECTURE PANEL
   ═══════════════════════════════════════════════ */

function ArchitecturePanel({ engine, animKey }: { engine: Engine; animKey: number }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    setActiveStage(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    engine.architecture.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStage(i), 600 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [animKey, engine.architecture]);

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-4">Engine Architecture</h2>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 sm:p-6">
        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex items-stretch gap-0">
          {engine.architecture.map((stage, i) => (
            <div key={i} className="flex items-stretch flex-1">
              <div
                className={`flex-1 border border-[#1a1a1a] rounded-lg p-4 transition-all duration-500 ${
                  i <= activeStage ? "bg-[#111] border-[#DA4E24]/20 shadow-[0_0_16px_rgba(218,78,36,0.06)]" : "opacity-30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[#DA4E24] transition-opacity duration-300 ${i <= activeStage ? "opacity-100" : "opacity-30"}`}>
                    <AgentIcon id={stage.agent} size={16} />
                  </span>
                  <span className="font-terminal text-[9px] text-[#DA4E24]">{stage.agent}</span>
                </div>
                <h3 className="text-xs font-bold text-white mb-2">{stage.label}</h3>
                {stage.outputs.map((o, j) => (
                  <div key={j} className="text-[10px] text-[#666] flex items-center gap-1.5 mb-1">
                    <span className="w-1 h-1 rounded-full bg-[#DA4E24]/40" />
                    {o}
                  </div>
                ))}
              </div>
              {i < engine.architecture.length - 1 && (
                <div className="flex items-center px-1">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={i < activeStage ? "#DA4E24" : "#1a1a1a"} strokeWidth="1.5" className="transition-colors duration-500">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical flow */}
        <div className="lg:hidden space-y-2">
          {engine.architecture.map((stage, i) => (
            <div key={i}>
              <div
                className={`border border-[#1a1a1a] rounded-lg p-4 transition-all duration-500 ${
                  i <= activeStage ? "bg-[#111] border-[#DA4E24]/20" : "opacity-30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#DA4E24]"><AgentIcon id={stage.agent} size={16} /></span>
                  <span className="font-terminal text-[9px] text-[#DA4E24]">{stage.agent}</span>
                  <span className="text-xs font-bold text-white ml-1">{stage.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stage.outputs.map((o, j) => (
                    <span key={j} className="text-[10px] text-[#666] bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-0.5">{o}</span>
                  ))}
                </div>
              </div>
              {i < engine.architecture.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i < activeStage ? "#DA4E24" : "#1a1a1a"} strokeWidth="1.5" className="transition-colors duration-500">
                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 6: REPLACEMENT MAP
   ═══════════════════════════════════════════════ */

function ReplacementMap({ engine, animKey }: { engine: Engine; animKey: number }) {
  const [revealed, setRevealed] = useState(0);
  const totalCost = engine.replacedRoles.reduce((s, r) => s + r.monthlyCost, 0);

  useEffect(() => {
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    engine.replacedRoles.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), 200 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [animKey, engine.replacedRoles]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest">Replacement Map</h2>
        <span className="font-terminal text-[10px] text-[#DA4E24]">${totalCost.toLocaleString()}/mo replaced</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Manual team */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-terminal text-[#555] uppercase tracking-wider">Manual Team</span>
            <span className="font-terminal text-xs text-[#DA4E24] font-bold">${totalCost.toLocaleString()}/mo</span>
          </div>
          <div className="space-y-2">
            {engine.replacedRoles.map((role, i) => (
              <div
                key={role.role}
                className={`flex items-center justify-between p-3 bg-[#111] border border-[#1a1a1a] rounded-lg transition-all duration-400 ${
                  i < revealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div>
                  <div className="text-xs font-bold text-white">{role.role}</div>
                  <div className="text-[10px] text-[#555]">{role.handles}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="font-terminal text-xs text-[#DA4E24] line-through opacity-60">${role.monthlyCost.toLocaleString()}</div>
                  <div className="text-[9px] text-[#444]">/month</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ultron agents */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-terminal text-[#555] uppercase tracking-wider">Ultron Engine</span>
            <span className="font-terminal text-xs text-green-500 font-bold">$19/mo</span>
          </div>
          <div className="space-y-2">
            {engine.agentsActivated.map((agentId, i) => {
              const roles = engine.replacedRoles.filter((r) => {
                const stageForAgent = engine.architecture.find((a) => a.agent === agentId);
                return stageForAgent !== undefined;
              });
              return (
                <div
                  key={agentId}
                  className={`flex items-center gap-3 p-3 bg-[#111] border border-[#DA4E24]/10 rounded-lg transition-all duration-400 ${
                    i < revealed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <span className="text-[#DA4E24]"><AgentIcon id={agentId} size={20} /></span>
                  <div>
                    <div className="text-xs font-bold text-[#DA4E24] font-terminal">{agentMeta[agentId].name}</div>
                    <div className="text-[10px] text-[#555]">
                      {engine.architecture.find((a) => a.agent === agentId)?.label || "Active"}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[9px] font-terminal text-green-500/60 bg-green-500/5 border border-green-500/10 rounded px-1.5 py-0.5">ACTIVE</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-[#1a1a1a] text-center">
            <span className="text-[10px] text-[#444]">That is a </span>
            <span className="font-terminal text-sm text-[#DA4E24] font-bold">{Math.floor(totalCost / 19).toLocaleString()}x</span>
            <span className="text-[10px] text-[#444]"> return on $19/month.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 7: EXECUTION CADENCE
   ═══════════════════════════════════════════════ */

const frequencyColors: Record<string, string> = {
  overnight: "text-[#1F77F6] bg-[#1F77F6]/10 border-[#1F77F6]/20",
  daily: "text-[#DA4E24] bg-[#DA4E24]/10 border-[#DA4E24]/20",
  "event-triggered": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  weekly: "text-green-400 bg-green-400/10 border-green-400/20",
};

const frequencyLabels: Record<string, string> = {
  overnight: "OVERNIGHT",
  daily: "DAILY",
  "event-triggered": "EVENT",
  weekly: "WEEKLY",
};

function ExecutionCadence({ engine, horizon, animKey }: { engine: Engine; horizon: Horizon; animKey: number }) {
  const items = engine.cadence[horizon];
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    items.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), 150 * (i + 1)));
    });
    return () => timers.forEach(clearTimeout);
  }, [animKey, items, horizon]);

  const horizonLabel = horizon === "week1" ? "Week 1" : horizon === "month1" ? "Month 1" : "Quarter 1";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest">Execution Cadence</h2>
        <span className="font-terminal text-[10px] text-[#DA4E24]">{horizonLabel}</span>
      </div>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 sm:p-5">
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={`${horizon}-${i}`}
              className={`flex items-center gap-3 p-3 bg-[#111] border border-[#1a1a1a] rounded-lg transition-all duration-400 ${
                i < revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className={`text-[9px] font-terminal font-bold px-2 py-0.5 rounded border flex-shrink-0 ${frequencyColors[item.frequency]}`}>
                {frequencyLabels[item.frequency]}
              </span>
              <span className="text-[11px] text-[#ccc]">{item.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 8: OUTCOME PANEL
   ═══════════════════════════════════════════════ */

function OutcomePanel({ engine, mode, horizon }: { engine: Engine; mode: Mode; horizon: Horizon }) {
  const m = engine.metrics[mode][horizon];
  const pipeline = useCountUp(m.pipelineValue);
  const hours = useCountUp(m.hoursReplaced, 800);
  const cost = useCountUp(m.costReplaced);
  const leads = useCountUp(m.leadsIdentified, 800);
  const content = useCountUp(m.contentAssets, 600);
  const followUps = useCountUp(m.followUpsSaved, 800);

  const stats = [
    { label: "Pipeline Surfaced", value: `$${pipeline.toLocaleString()}`, accent: true },
    { label: "Hours Replaced", value: hours.toLocaleString(), accent: false },
    { label: "Cost Replaced", value: `$${cost.toLocaleString()}`, accent: false },
    { label: "Leads Identified", value: leads.toLocaleString(), accent: false },
    { label: "Content Assets", value: content.toLocaleString(), accent: false },
    { label: "Follow-ups Saved", value: followUps.toLocaleString(), accent: false },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-4">Projected Outcomes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-center"
          >
            <div
              className={`font-terminal text-lg sm:text-xl font-bold mb-1 ${s.accent ? "text-[#DA4E24]" : "text-white"}`}
              style={s.accent ? { textShadow: "0 0 20px rgba(218,78,36,0.2)" } : undefined}
            >
              {s.value}
            </div>
            <div className="text-[9px] text-[#555] uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 9: BEFORE / AFTER STRIP
   ═══════════════════════════════════════════════ */

function BeforeAfterStrip({ engine }: { engine: Engine }) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-4">Before &amp; After</h2>
      <div className="space-y-2">
        {engine.beforeAfter.map((ba, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 flex items-start gap-2">
              <span className="text-[#444] flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
              <span className="text-[11px] text-[#666]">{ba.before}</span>
            </div>
            <div className="bg-[#0a0a0a] border border-[#DA4E24]/10 rounded-lg p-3 flex items-start gap-2">
              <span className="text-[#DA4E24] flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span className="text-[11px] text-[#ccc]">{ba.after}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 11: FINAL CTA
   ═══════════════════════════════════════════════ */

function FinalCTA({ engine, reelMode }: { engine: Engine; reelMode: boolean }) {
  if (reelMode) return null;
  return (
    <div className="text-center py-12 sm:py-16 border-t border-[#1a1a1a]">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Deploy this engine in your business.
      </h2>
      <p className="text-[#999] max-w-xl mx-auto mb-8 text-sm sm:text-base">
        Ultron turns founder-led growth into a system that runs across research, acquisition, content, pipeline, and monitoring — without adding headcount.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
        <a
          href="https://app.51ultron.com/signup"
          className="btn-gradient glow-accent text-white font-semibold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 transition-all"
        >
          {engine.ctaLine}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link href="/demo" className="text-[#555] hover:text-[#DA4E24] transition-colors">Watch the live demo &rarr;</Link>
        <Link href="/blueprint" className="text-[#555] hover:text-[#DA4E24] transition-colors">See the full blueprint &rarr;</Link>
        <Link href="/72hours" className="text-[#555] hover:text-[#DA4E24] transition-colors">Read 72 hours of real output &rarr;</Link>
      </div>

      <div className="mt-12">
        <FounderTerminal />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 12: RELATED ENGINES
   ═══════════════════════════════════════════════ */

function RelatedEngines({ engine, onSelect }: { engine: Engine; onSelect: (id: string) => void }) {
  const related = engine.relatedEngines
    .map((id) => engines.find((e) => e.id === id))
    .filter(Boolean) as Engine[];

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-[#999] uppercase tracking-widest mb-4">Related Engines</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {related.map((e) => (
          <button
            key={e.id}
            onClick={() => onSelect(e.id)}
            className="text-left bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#333] transition-all group"
          >
            <h3 className="text-xs font-bold text-white group-hover:text-[#DA4E24] transition-colors mb-1">{e.title}</h3>
            <p className="text-[10px] text-[#555] mb-2">{e.subtitle}</p>
            <span className="font-terminal text-[10px] text-[#DA4E24]">{e.teaserStat}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

const defaultChipLabels = [
  "Custom signal", "New target", "Custom niche", "Extra filter", "Additional market",
];

export default function ClientEnginePage() {
  return (
    <Suspense>
      <ClientEngineInner />
    </Suspense>
  );
}

function ClientEngineInner() {
  const searchParams = useSearchParams();
  const initialEngine = searchParams.get("engine") || "hire-signal";

  const [selectedId, setSelectedId] = useState(initialEngine);
  const [mode, setMode] = useState<Mode>("founder");
  const [horizon, setHorizon] = useState<Horizon>("month1");
  const [reelMode, setReelMode] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [chips, setChips] = useState<Signal[]>([]);
  const chipIdRef = useRef(100);

  const engine = useMemo(() => engines.find((e) => e.id === selectedId) || engines[0], [selectedId]);

  // Sync chips when engine or mode changes
  useEffect(() => {
    setChips(mode === "agency" ? [...engine.agencySignals] : [...engine.signals]);
  }, [engine, mode]);

  const handleSelectEngine = useCallback((id: string) => {
    setSelectedId(id);
    setAnimKey((k) => k + 1);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("engine", id);
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleReset = useCallback(() => {
    setMode("founder");
    setHorizon("month1");
    setChips([...engine.signals]);
    setAnimKey((k) => k + 1);
  }, [engine]);

  const handleRemoveChip = useCallback((id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleAddChip = useCallback(() => {
    chipIdRef.current += 1;
    const label = defaultChipLabels[chipIdRef.current % defaultChipLabels.length];
    setChips((prev) => [...prev, { id: `custom-${chipIdRef.current}`, label, removable: true }]);
  }, []);

  const handleModeChange = useCallback((m: Mode) => {
    setMode(m);
    setAnimKey((k) => k + 1);
  }, []);

  const handleHorizonChange = useCallback((h: Horizon) => {
    setHorizon(h);
  }, []);

  return (
    <div className={`min-h-screen bg-black ${reelMode ? "reel-mode" : ""}`}>
      <div className={`max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 ${reelMode ? "py-6" : "py-10 sm:py-16"}`}>
        {/* 1. Hero */}
        <Hero reelMode={reelMode} />

        {/* 2. Engine Selector */}
        <EngineSelector selected={selectedId} onSelect={handleSelectEngine} />

        {/* 3. Control Strip */}
        <ControlStrip
          mode={mode}
          onModeChange={handleModeChange}
          horizon={horizon}
          onHorizonChange={handleHorizonChange}
          chips={chips}
          onRemoveChip={handleRemoveChip}
          onAddChip={handleAddChip}
          onReset={handleReset}
          reelMode={reelMode}
          onReelToggle={() => setReelMode(!reelMode)}
        />

        {/* 4. Opportunity Surface */}
        <OpportunitySurface engine={engine} mode={mode} animKey={animKey} />

        {/* 5. Engine Architecture */}
        <ArchitecturePanel engine={engine} animKey={animKey} />

        {/* 6. Replacement Map */}
        <ReplacementMap engine={engine} animKey={animKey} />

        {/* 7. Execution Cadence */}
        <ExecutionCadence engine={engine} horizon={horizon} animKey={animKey} />

        {/* 8. Outcome Panel */}
        <OutcomePanel engine={engine} mode={mode} horizon={horizon} />

        {/* 9. Before / After */}
        <BeforeAfterStrip engine={engine} />

        {/* 12. Related Engines */}
        <RelatedEngines engine={engine} onSelect={handleSelectEngine} />

        {/* 11. Final CTA */}
        <FinalCTA engine={engine} reelMode={reelMode} />
      </div>
    </div>
  );
}
