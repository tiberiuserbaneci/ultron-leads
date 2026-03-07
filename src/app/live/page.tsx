"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import FounderTerminal from "@/components/FounderTerminal";
import {
  getBaseMetrics,
  getSparkline,
  getRevenueData,
  getPipelineData,
  getDonutData,
  getTaskBars,
  getHeatmapData,
  contentStats,
  moneySaved,
  totalSaved,
  systemHealth,
  feedEntries,
  outreachStats,
  competitors,
  agents,
  type AgentId,
  type TimeRange,
} from "./liveData";

/* ═══════════════════════════════════════════════
   UTILITY HOOKS
   ═══════════════════════════════════════════════ */

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function useCountUp(target: number, duration = 1500, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, trigger]);
  return val;
}

/* ═══════════════════════════════════════════════
   CORNER BRACKETS (HUD decoration)
   ═══════════════════════════════════════════════ */

function HudCard({
  children,
  className = "",
  fullWidth = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const borderColor = inView ? "#DA4E24" : "#1A1A1A";

  return (
    <div
      ref={ref}
      className={`relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-none p-4 sm:p-5 ${fullWidth ? "col-span-1 lg:col-span-2" : ""} ${className}`}
    >
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-4 h-4 transition-colors duration-500" style={{ borderTop: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
      <span className="absolute top-0 right-0 w-4 h-4 transition-colors duration-500" style={{ borderTop: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />
      <span className="absolute bottom-0 left-0 w-4 h-4 transition-colors duration-500" style={{ borderBottom: `2px solid ${borderColor}`, borderLeft: `2px solid ${borderColor}` }} />
      <span className="absolute bottom-0 right-0 w-4 h-4 transition-colors duration-500" style={{ borderBottom: `2px solid ${borderColor}`, borderRight: `2px solid ${borderColor}` }} />
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 0: BOOT SEQUENCE
   ═══════════════════════════════════════════════ */

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),   // logo
      setTimeout(() => setPhase(2), 400),   // title
      setTimeout(() => setPhase(3), 900),   // initializing
      setTimeout(() => setPhase(4), 1200),  // flash
      setTimeout(() => { setPhase(5); onComplete(); }, 1500), // done
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase >= 5) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {phase >= 1 && (
        <div className="text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          {phase >= 2 && (
            <p className="font-terminal text-sm text-[#DA4E24] tracking-[0.3em] mb-2">
              ULTRON COMMAND CENTER
            </p>
          )}
          {phase >= 3 && (
            <p className="font-terminal text-xs text-[#555]">
              INITIALIZING SYSTEMS...
            </p>
          )}
          {phase >= 4 && (
            <div className="absolute inset-0 bg-[#DA4E24]/5 animate-ping" style={{ animationDuration: "0.3s", animationIterationCount: 1 }} />
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 1: TOP STATUS BAR
   ═══════════════════════════════════════════════ */

function Sparkline({ data, color = "#DA4E24", width = 60, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopStatusBar({
  range,
  onRangeChange,
  activeAgents,
  onToggleAgent,
  onRun,
}: {
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
  activeAgents: Set<AgentId>;
  onToggleAgent: (id: AgentId) => void;
  onRun: () => void;
}) {
  const [time, setTime] = useState("");
  const [metrics, setMetrics] = useState(getBaseMetrics);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setMetrics((prev) => ({
        agents: prev.agents + (Math.random() > 0.92 ? 1 : 0),
        tasks: prev.tasks + (Math.random() > 0.7 ? 1 : 0),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 3),
        revenue: prev.revenue + (Math.random() > 0.6 ? Math.floor(Math.random() * 18) + 5 : 0),
      }));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const stats = [
    { label: "AGENTS DEPLOYED", value: metrics.agents.toLocaleString(), sparkline: getSparkline(metrics.agents, 5) },
    { label: "TASKS COMPLETED", value: metrics.tasks.toLocaleString(), sparkline: getSparkline(metrics.tasks, 200) },
    { label: "API CALLS", value: metrics.apiCalls.toLocaleString(), sparkline: getSparkline(metrics.apiCalls, 1000) },
    { label: "REVENUE IMPACT", value: `$${metrics.revenue.toLocaleString()}`, sparkline: getSparkline(metrics.revenue, 3000) },
  ];

  const ranges: TimeRange[] = ["7D", "30D", "90D", "ALL"];
  const agentKeys: { id: AgentId; short: string }[] = [
    { id: "CORTEX", short: "C" },
    { id: "SPECTER", short: "Sp" },
    { id: "STRIKER", short: "St" },
    { id: "PULSE", short: "P" },
    { id: "SENTINEL", short: "Se" },
  ];

  return (
    <div className="border-b border-[#1A1A1A] bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex flex-wrap items-center gap-4 lg:gap-0">
        {/* Left */}
        <div className="flex items-center gap-3 lg:w-[20%]">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-soft" />
          <span className="font-terminal text-[10px] text-green-500 tracking-wider hidden sm:inline">ALL SYSTEMS OPERATIONAL</span>
          <span className="font-terminal text-[10px] text-[#444] hidden lg:inline">{time}</span>
        </div>

        {/* Center stats */}
        <div className="flex-1 flex justify-center gap-6 lg:gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-terminal text-base sm:text-lg font-bold text-white" style={{ textShadow: "0 0 20px rgba(218,78,36,0.15)" }}>
                {s.value}
              </div>
              <div className="text-[9px] text-[#555] tracking-wider">{s.label}</div>
              <Sparkline data={s.sparkline} width={50} height={16} />
            </div>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 lg:w-[20%] lg:justify-end">
          {/* Run button */}
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 text-[10px] font-terminal text-green-500 border border-green-500/30 px-2.5 py-1 rounded hover:bg-green-500/10 transition-colors"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            RUN
          </button>
          {/* Time range */}
          <div className="flex items-center gap-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-2 py-0.5 text-[10px] font-terminal rounded transition-all ${
                  range === r ? "text-[#DA4E24] bg-[#DA4E24]/10 shadow-[0_0_8px_rgba(218,78,36,0.2)]" : "text-[#555] hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {/* Agent filter */}
          <div className="flex items-center gap-1 ml-2">
            {agentKeys.map((a) => (
              <button
                key={a.id}
                onClick={() => onToggleAgent(a.id)}
                className={`w-6 h-6 rounded-full text-[9px] font-terminal font-bold transition-all ${
                  activeAgents.has(a.id) ? "bg-[#DA4E24]/20 text-[#DA4E24] border border-[#DA4E24]/40" : "bg-[#111] text-[#333] border border-[#222]"
                }`}
                title={a.id}
              >
                {a.short}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 2: AGENT STATUS CARDS
   ═══════════════════════════════════════════════ */

function AgentIcon({ id, size = 20 }: { id: AgentId; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "#DA4E24", strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "CORTEX": return <svg {...props}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>;
    case "SPECTER": return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "STRIKER": return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "PULSE": return <svg {...props}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>;
    case "SENTINEL": return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  }
}

function ProgressRing({ pct, size = 44 }: { pct: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1A1A1A" strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#DA4E24" strokeWidth="3" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
    </svg>
  );
}

function AgentStatusCard({ agent, active }: { agent: typeof agents[0]; active: boolean }) {
  const [taskIdx, setTaskIdx] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setTaskIdx((prev) => (prev + 1) % agent.tasks.length);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(i);
  }, [agent.tasks.length]);

  return (
    <div
      className={`flex-shrink-0 w-[220px] lg:w-auto bg-[#0A0A0A] border border-[#1A1A1A] p-4 transition-all duration-300 ${
        active ? "opacity-100" : "opacity-30 grayscale"
      }`}
      style={active ? { boxShadow: "0 0 20px rgba(218,78,36,0.08)" } : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A]" style={{ boxShadow: "0 0 12px rgba(218,78,36,0.1)" }}>
          <AgentIcon id={agent.id} />
        </div>
        <ProgressRing pct={agent.completionRate} size={38} />
      </div>
      <h3 className="text-sm font-bold text-[#DA4E24] font-terminal">{agent.name}</h3>
      <p className="text-[10px] text-[#555] mb-2">{agent.role}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-soft" />
        <span className="font-terminal text-[10px] text-green-500">ACTIVE</span>
      </div>
      <p className="font-terminal text-[10px] text-[#999] h-8 overflow-hidden transition-opacity duration-300">
        {agent.tasks[taskIdx]}
      </p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#111]">
        <div>
          <div className="font-terminal text-xs font-bold text-white">{agent.tasksToday}</div>
          <div className="text-[9px] text-[#444]">today</div>
        </div>
        <div className="text-right">
          <div className="font-terminal text-[10px] text-[#666]">{agent.lastCompleted}</div>
          <div className="text-[9px] text-[#444]">last task</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3A: REVENUE LINE CHART
   ═══════════════════════════════════════════════ */

function RevenueChart({ range }: { range: TimeRange }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { ultron, manual } = useMemo(() => getRevenueData(range), [range]);
  const max = Math.max(...ultron) * 1.1;
  const w = 100;
  const h = 40;

  const toPath = (data: number[]) =>
    data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");

  return (
    <HudCard fullWidth>
      <div ref={ref}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">Revenue Impact</h3>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#DA4E24] inline-block" />With Ultron</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#333] inline-block" />Manual</span>
          </div>
        </div>
        <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line key={p} x1="0" y1={h * p} x2={w} y2={h * p} stroke="#1A1A1A" strokeWidth="0.2" />
            ))}
            {/* Fill between */}
            {inView && (
              <polygon
                points={`${toPath(ultron)} ${ultron.map((_, i) => `${((ultron.length - 1 - i) / (manual.length - 1)) * w},${h - (manual[ultron.length - 1 - i] / max) * h}`).join(" ")}`}
                fill="rgba(218,78,36,0.05)"
              />
            )}
            {/* Manual line */}
            <polyline
              points={toPath(manual)}
              fill="none"
              stroke="#333"
              strokeWidth="0.4"
              className={inView ? "animate-draw" : "opacity-0"}
              style={{ strokeDasharray: 300, strokeDashoffset: inView ? 0 : 300, transition: "stroke-dashoffset 2s ease" }}
            />
            {/* Ultron line */}
            <polyline
              points={toPath(ultron)}
              fill="none"
              stroke="#DA4E24"
              strokeWidth="0.5"
              className={inView ? "animate-draw" : "opacity-0"}
              style={{ strokeDasharray: 300, strokeDashoffset: inView ? 0 : 300, transition: "stroke-dashoffset 2s ease 0.3s", filter: "drop-shadow(0 0 2px rgba(218,78,36,0.4))" }}
            />
          </svg>
          {/* End labels */}
          {inView && (
            <>
              <span className="absolute right-0 font-terminal text-xs text-[#DA4E24] font-bold" style={{ top: `${(1 - ultron[ultron.length - 1] / max) * 100}%`, transform: "translateY(-50%)" }}>
                ${ultron[ultron.length - 1].toLocaleString()}
              </span>
              <span className="absolute right-0 font-terminal text-xs text-[#555]" style={{ top: `${(1 - manual[manual.length - 1] / max) * 100}%`, transform: "translateY(-50%)" }}>
                ${manual[manual.length - 1].toLocaleString()}
              </span>
            </>
          )}
        </div>
        <p className="text-[10px] text-[#444] mt-2">12-week projected impact based on current agent performance.</p>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3B: PIPELINE FUNNEL
   ═══════════════════════════════════════════════ */

function PipelineFunnel({ range }: { range: TimeRange }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const data = useMemo(() => getPipelineData(range), [range]);
  const maxVal = data[0].value;

  return (
    <HudCard>
      <div ref={ref}>
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Pipeline Funnel</h3>
        <div className="space-y-1.5">
          {data.map((d, i) => (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-terminal text-[#666]">{d.label}</span>
                <span className="text-[10px] font-terminal text-white font-bold">{d.value.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-[#111] rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: inView ? `${(d.value / maxVal) * 100}%` : "0%",
                    background: `rgba(218,78,36,${1 - i * 0.12})`,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
              {d.rate && <span className="text-[9px] text-[#555] font-terminal">{d.rate}% conversion</span>}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#444] mt-3">Managed by SPECTER + STRIKER. Zero manual prospecting.</p>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3C: DONUT CHART
   ═══════════════════════════════════════════════ */

function DonutChart({ range, activeAgents }: { range: TimeRange; activeAgents: Set<AgentId> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const data = useMemo(() => getDonutData(range, activeAgents), [range, activeAgents]);
  const total = data.reduce((s, d) => s + d.tasks, 0);
  const [hovered, setHovered] = useState<string | null>(null);

  const r = 40;
  const circ = 2 * Math.PI * r;
  let cumOffset = 0;

  return (
    <HudCard>
      <div ref={ref}>
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Agent Task Distribution</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle cx="60" cy="60" r={r} fill="none" stroke="#111" strokeWidth="12" />
              {data.map((d, i) => {
                const pct = d.tasks / total;
                const dashLen = pct * circ;
                const offset = cumOffset;
                cumOffset += dashLen;
                return (
                  <circle
                    key={d.agent}
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke={`rgba(218,78,36,${1 - i * 0.15})`}
                    strokeWidth={hovered === d.agent ? "16" : "12"}
                    strokeDasharray={`${inView ? dashLen : 0} ${circ}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-1000"
                    style={{ transitionDelay: `${i * 150}ms` }}
                    onMouseEnter={() => setHovered(d.agent)}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-terminal text-lg font-bold text-white">{total.toLocaleString()}</div>
                <div className="text-[9px] text-[#555]">tasks</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {data.map((d, i) => (
            <div
              key={d.agent}
              className={`flex items-center justify-between text-[10px] px-2 py-1 rounded cursor-pointer transition-colors ${hovered === d.agent ? "bg-[#111]" : ""}`}
              onMouseEnter={() => setHovered(d.agent)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm" style={{ background: `rgba(218,78,36,${1 - i * 0.15})` }} />
                <span className="font-terminal text-[#999]">{d.agent}</span>
              </span>
              <span className="font-terminal text-white font-bold">{d.tasks.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3D: TASKS PER AGENT (horizontal bars)
   ═══════════════════════════════════════════════ */

function TaskBarsChart({ range, activeAgents }: { range: TimeRange; activeAgents: Set<AgentId> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const data = useMemo(() => getTaskBars(range).filter((d) => activeAgents.has(d.agent)), [range, activeAgents]);
  const maxTasks = data.length > 0 ? data[0].tasks : 1;

  return (
    <HudCard>
      <div ref={ref}>
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Tasks per Agent</h3>
        <div className="space-y-3">
          {data.map((d, i) => (
            <div key={d.agent}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-terminal text-[10px] text-[#999]">{d.agent}</span>
                <span className="font-terminal text-xs text-white font-bold">{d.tasks.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-[#111] rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: inView ? `${(d.tasks / maxTasks) * 100}%` : "0%",
                    background: "#DA4E24",
                    transitionDelay: `${i * 100}ms`,
                    boxShadow: inView ? "2px 0 8px rgba(218,78,36,0.3)" : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3E: CONTENT PERFORMANCE (3 mini cards)
   ═══════════════════════════════════════════════ */

function ContentPerformance() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <HudCard>
      <div ref={ref}>
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Content Performance</h3>
        <div className="space-y-4">
          {/* Posts published */}
          <div className="p-3 bg-[#111] rounded-lg">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="font-terminal text-2xl font-bold text-white">{contentStats.postsThisMonth}</div>
                <div className="text-[9px] text-[#555]">posts this month</div>
              </div>
              <div className="flex items-end gap-0.5 h-6">
                {contentStats.dailyPosts.map((v, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[#DA4E24] rounded-sm transition-all duration-500"
                    style={{ height: inView ? `${(v / 4) * 100}%` : "0%", transitionDelay: `${i * 50}ms`, opacity: 0.5 + (v / 4) * 0.5 }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Platform distribution */}
          <div className="p-3 bg-[#111] rounded-lg">
            <div className="text-[10px] text-[#555] mb-2">Platforms</div>
            <div className="space-y-1.5">
              {contentStats.platforms.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="text-[10px] font-terminal text-[#666] w-14">{p.name}</span>
                  <div className="flex-1 h-2 bg-[#0A0A0A] rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[#DA4E24] rounded-sm transition-all duration-700"
                      style={{ width: inView ? `${(p.count / 18) * 100}%` : "0%", transitionDelay: `${i * 80}ms`, opacity: 1 - i * 0.15 }}
                    />
                  </div>
                  <span className="font-terminal text-[10px] text-white w-4 text-right">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Engagement trend */}
          <div className="p-3 bg-[#111] rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#555]">Engagement Rate</span>
              <span className="flex items-center gap-1 text-green-500 text-[10px] font-terminal">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                {contentStats.engagementRate}%
              </span>
            </div>
            <Sparkline data={contentStats.engagementTrend} color="#1F77F6" width={200} height={24} />
          </div>
        </div>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3F: MONEY SAVED
   ═══════════════════════════════════════════════ */

function MoneySavedBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <HudCard fullWidth>
      <div ref={ref}>
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Monthly Cost Replaced</h3>
        <div className="flex h-8 rounded-sm overflow-hidden mb-3">
          {moneySaved.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-center text-[10px] font-terminal text-white transition-all duration-700"
              style={{
                width: inView ? `${(s.amount / totalSaved) * 100}%` : "0%",
                background: `rgba(218,78,36,${1 - i * 0.12})`,
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <span className="hidden sm:inline truncate px-1">{s.label} ${s.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        {/* Mobile labels */}
        <div className="flex flex-wrap gap-2 sm:hidden mb-3">
          {moneySaved.map((s, i) => (
            <span key={s.label} className="text-[9px] font-terminal" style={{ color: `rgba(218,78,36,${1 - i * 0.12})` }}>
              {s.label}: ${s.amount.toLocaleString()}
            </span>
          ))}
        </div>
        <div className="text-center">
          <span className="font-terminal text-lg font-bold text-white">${totalSaved.toLocaleString()}/month</span>
          <span className="text-xs text-[#555] ml-2">replaced</span>
        </div>
        <p className="text-center text-sm text-[#666] mt-1">
          Ultron cost: <span className="text-[#DA4E24] font-bold" style={{ textShadow: "0 0 12px rgba(218,78,36,0.3)" }}>$19/month</span>
        </p>
        <p className="text-center text-[10px] text-[#444] mt-1">That is a {Math.floor(totalSaved / 19).toLocaleString()}x return.</p>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3G: ACTIVITY HEATMAP
   ═══════════════════════════════════════════════ */

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Create nodes in 6 layers
    const layers = 6;
    const nodesPerLayer = [3, 5, 7, 7, 5, 3];
    interface Node { x: number; y: number; r: number; energy: number; targetEnergy: number }
    const nodes: Node[][] = [];

    for (let l = 0; l < layers; l++) {
      const col: Node[] = [];
      const count = nodesPerLayer[l];
      const x = (W / (layers + 1)) * (l + 1);
      for (let n = 0; n < count; n++) {
        const y = (H / (count + 1)) * (n + 1);
        col.push({ x, y, r: 3, energy: Math.random() * 0.3, targetEnergy: 0 });
      }
      nodes.push(col);
    }

    // Connections between adjacent layers
    interface Conn { from: Node; to: Node; signal: number; speed: number; active: boolean }
    const conns: Conn[] = [];
    for (let l = 0; l < layers - 1; l++) {
      for (const from of nodes[l]) {
        for (const to of nodes[l + 1]) {
          // Connect ~60% of possible connections
          if (Math.random() < 0.6) {
            conns.push({ from, to, signal: -1, speed: 0.008 + Math.random() * 0.012, active: false });
          }
        }
      }
    }

    // Fire signals constantly
    let lastFire = 0;
    const fireInterval = 120; // ms between fires

    let raf: number;
    let prevTime = performance.now();

    const draw = (now: number) => {
      const dt = now - prevTime;
      prevTime = now;

      // Fire new signals
      if (now - lastFire > fireInterval) {
        lastFire = now;
        // Pick 2-4 random connections to fire
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const c = conns[Math.floor(Math.random() * conns.length)];
          if (!c.active) {
            c.active = true;
            c.signal = 0;
            c.from.targetEnergy = 1;
          }
        }
      }

      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (const c of conns) {
        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.lineTo(c.to.x, c.to.y);
        ctx.strokeStyle = c.active ? `rgba(218,78,36,${0.15 + c.signal * 0.3})` : "rgba(26,26,26,0.5)";
        ctx.lineWidth = c.active ? 1.5 : 0.5;
        ctx.stroke();

        // Draw traveling signal
        if (c.active) {
          c.signal += c.speed * dt * 0.06;
          if (c.signal >= 1) {
            c.active = false;
            c.signal = -1;
            c.to.targetEnergy = 1;
          } else {
            const sx = c.from.x + (c.to.x - c.from.x) * c.signal;
            const sy = c.from.y + (c.to.y - c.from.y) * c.signal;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = "#DA4E24";
            ctx.shadowColor = "#DA4E24";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw nodes
      for (const layer of nodes) {
        for (const node of layer) {
          node.energy += (node.targetEnergy - node.energy) * 0.08;
          node.targetEnergy *= 0.97;

          const glow = node.energy;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + glow * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(218,78,36,${0.2 + glow * 0.8})`;
          if (glow > 0.3) {
            ctx.shadowColor = "#DA4E24";
            ctx.shadowBlur = 12 * glow;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner bright core
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${glow * 0.6})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const handleResize = () => {
      const newW = canvas.offsetWidth;
      const newH = canvas.offsetHeight;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HudCard fullWidth>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">Agent Neural Network</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="font-terminal text-[9px] text-[#DA4E24]">LIVE</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: 200, background: "#050505" }}
      />
      <p className="text-[10px] text-[#444] mt-3">5 agents processing data across 30 neural pathways. Running 24/7.</p>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3H: SYSTEM HEALTH
   ═══════════════════════════════════════════════ */

function SystemHealthCard() {
  const [responseTime, setResponseTime] = useState(142);
  const [dbSize, setDbSize] = useState(847);
  const [lastScan, setLastScan] = useState("2h ago");
  const scanTimesRef = useRef(0);

  useEffect(() => {
    const i = setInterval(() => {
      setResponseTime(120 + Math.floor(Math.random() * 80));
      setDbSize((prev) => prev + (Math.random() > 0.5 ? 1 : 0));
      scanTimesRef.current += 1;
      if (scanTimesRef.current % 3 === 0) {
        const mins = Math.floor(scanTimesRef.current / 3);
        setLastScan(mins < 1 ? "just now" : `${mins}m ago`);
      }
    }, 1500);
    return () => clearInterval(i);
  }, []);

  const rows = [
    { label: "Website Uptime", value: "99.97%", detail: undefined, status: "green" as const },
    { label: "Avg Response Time", value: `${responseTime}ms`, detail: undefined, status: responseTime > 180 ? ("amber" as const) : ("green" as const) },
    { label: "SSL Certificate", value: "Valid", detail: "74 days remaining", status: "green" as const },
    { label: "API Health", value: "Operational", detail: "All 12 endpoints", status: "green" as const },
    { label: "Security Audit", value: "Clear", detail: `Last run: ${lastScan}`, status: "green" as const },
    { label: "Competitor Monitor", value: "Active", detail: "4 competitors tracked", status: "green" as const },
    { label: "Database", value: "Healthy", detail: `${dbSize} MB / 5 GB`, status: "green" as const },
    { label: "Cron Jobs", value: "Running", detail: "5/5 agents scheduled", status: "green" as const },
  ];

  return (
    <HudCard>
      <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">System Health</h3>
      <div className="space-y-2">
        {rows.map((h) => (
          <div key={h.label} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${h.status === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
            <span className="text-[10px] text-[#666] flex-1 truncate">{h.label}</span>
            <span className="font-terminal text-[10px] text-white font-bold transition-all duration-300">{h.value}</span>
            {h.detail && <span className="font-terminal text-[9px] text-[#444] hidden sm:inline">{h.detail}</span>}
          </div>
        ))}
        <div className="flex items-start gap-2 pt-2 mt-2 border-t border-[#111]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
          <div>
            <span className="text-[10px] text-amber-500 font-terminal">Alerts This Week: 1</span>
            <p className="text-[9px] text-[#444]">Pricing page mobile CTA overlap. Detected and fixed.</p>
          </div>
        </div>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3I: LIVE ACTIVITY FEED
   ═══════════════════════════════════════════════ */

function LiveFeed({ activeAgents }: { activeAgents: Set<AgentId> }) {
  const [entries, setEntries] = useState(() => feedEntries.slice(0, 12));
  const feedIdxRef = useRef(12);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = setInterval(() => {
      feedIdxRef.current = (feedIdxRef.current + 1) % feedEntries.length;
      const next = feedEntries[feedIdxRef.current];
      setEntries((prev) => [next, ...prev.slice(0, 30)]);
    }, 1200);
    return () => clearInterval(i);
  }, []);

  const filtered = entries.filter((e) => activeAgents.has(e.agent));

  const getTimeStr = (offset: number) => {
    const d = new Date(Date.now() - offset * 30000);
    return d.toTimeString().slice(0, 8);
  };

  return (
    <HudCard>
      <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-soft" />
          Live Activity
        </span>
      </h3>
      <div ref={feedRef} className="h-[320px] overflow-y-auto overflow-x-hidden space-y-0 scrollbar-none">
        {filtered.map((entry, i) => (
          <div
            key={`${entry.agent}-${i}`}
            className={`flex items-start gap-2 py-1.5 border-b border-[#0A0A0A] ${i === 0 ? "animate-fade-in" : ""}`}
          >
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14 mt-0.5">{getTimeStr(i)}</span>
            <span className="font-terminal text-[9px] text-[#DA4E24] flex-shrink-0 w-16 mt-0.5 font-bold">{entry.agent}</span>
            <span className="text-[10px] text-[#ccc] leading-snug">{entry.text}</span>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3J: OUTREACH PERFORMANCE
   ═══════════════════════════════════════════════ */

const bestSubjects = [
  "Your automation stack is missing one layer",
  "Saw your post about scaling bottlenecks",
  "The real cost of doing everything manually",
  "Quick question about your ops team",
  "3 things your competitors automated this month",
];

function OutreachCard() {
  const [emails, setEmails] = useState(outreachStats.emailsSent);
  const [openRate, setOpenRate] = useState(outreachStats.openRate.value);
  const [replyRate, setReplyRate] = useState(outreachStats.replyRate.value);
  const [meetings, setMeetings] = useState(outreachStats.meetingsBooked);
  const [bestSubject, setBestSubject] = useState(bestSubjects[0]);
  const subjectIdxRef = useRef(0);

  useEffect(() => {
    const i = setInterval(() => {
      setEmails((prev) => prev + (Math.random() > 0.3 ? 1 : 0));
      setOpenRate((prev) => Math.min(65, +(prev + (Math.random() - 0.4) * 0.4).toFixed(1)));
      setReplyRate((prev) => Math.min(25, +(prev + (Math.random() - 0.45) * 0.2).toFixed(1)));
      setMeetings((prev) => prev + (Math.random() > 0.75 ? 1 : 0));
    }, 1500);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      subjectIdxRef.current = (subjectIdxRef.current + 1) % bestSubjects.length;
      setBestSubject(bestSubjects[subjectIdxRef.current]);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const rows = [
    { label: "Emails Sent This Month", value: emails.toString(), change: null },
    { label: "Open Rate", value: `${openRate}%`, change: { change: 3.1, up: true } },
    { label: "Reply Rate", value: `${replyRate}%`, change: { change: 1.4, up: true } },
    { label: "Meetings Booked", value: meetings.toString(), change: null },
    { label: "Avg Response Time", value: outreachStats.avgResponseTime, change: null },
  ];

  return (
    <HudCard>
      <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Outreach Performance</h3>
      <div className="space-y-3">
        {rows.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-[10px] text-[#666]">{s.label}</span>
            <span className="flex items-center gap-1.5">
              <span className="font-terminal text-xs text-white font-bold transition-all duration-300">{s.value}</span>
              {s.change && (
                <span className={`flex items-center gap-0.5 text-[9px] font-terminal ${s.change.up ? "text-green-500" : "text-red-500"}`}>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points={s.change.up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                  </svg>
                  {s.change.change}%
                </span>
              )}
            </span>
          </div>
        ))}
        <div className="pt-2 mt-1 border-t border-[#111]">
          <div className="text-[9px] text-[#555] mb-1">Best Performing Subject</div>
          <p className="font-terminal text-[10px] text-[#DA4E24] transition-opacity duration-300">&ldquo;{bestSubject}&rdquo;</p>
        </div>
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3K: COMPETITOR TRACKING
   ═══════════════════════════════════════════════ */

const competitorEvents = [
  "Pricing update detected",
  "New feature page added",
  "Job posting spike",
  "Enterprise tier added",
  "Blog post published",
  "Homepage redesigned",
  "New integration launched",
  "Pricing page changed",
  "Team page updated: +3 hires",
  "New case study published",
  "API docs updated",
  "Changelog: 4 new features",
];

function CompetitorCard() {
  const [compState, setCompState] = useState(competitors.map((c) => ({ ...c })));
  const eventIdxRef = useRef(0);

  useEffect(() => {
    const i = setInterval(() => {
      setCompState((prev) => {
        const next = prev.map((c) => ({ ...c }));
        // Update a random competitor
        const idx = Math.floor(Math.random() * next.length);
        eventIdxRef.current = (eventIdxRef.current + 1) % competitorEvents.length;
        const event = competitorEvents[eventIdxRef.current];
        next[idx].change = event;
        next[idx].status = Math.random() > 0.6 ? "alert" : "monitoring";
        return next;
      });
    }, 2500);
    return () => clearInterval(i);
  }, []);

  return (
    <HudCard>
      <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest mb-4">Competitor Tracking</h3>
      <div className="space-y-3">
        {compState.map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${c.status === "monitoring" ? "bg-green-500" : "bg-amber-500"}`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white font-medium truncate">{c.name}</div>
              <div className="text-[9px] text-[#555] transition-all duration-300">{c.change}</div>
            </div>
            <span className={`text-[9px] font-terminal transition-colors duration-300 ${c.status === "monitoring" ? "text-green-600" : "text-amber-500"}`}>
              {c.status === "monitoring" ? "Monitoring" : "Alert"}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-[#444] mt-3 pt-2 border-t border-[#111]">CORTEX scans all competitors daily at 6:00 AM UTC.</p>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function LivePage() {
  const [booted, setBooted] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [range, setRange] = useState<TimeRange>("30D");
  const [activeAgents, setActiveAgents] = useState<Set<AgentId>>(() => new Set<AgentId>(["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"]));
  const [dashVisible, setDashVisible] = useState(false);
  const [runKey, setRunKey] = useState(0);

  // Check session storage for boot animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasBooted = sessionStorage.getItem("ultron-booted");
      if (hasBooted) {
        setShowBoot(false);
        setBooted(true);
        setDashVisible(true);
      }
    }
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    sessionStorage.setItem("ultron-booted", "1");
    setTimeout(() => {
      setShowBoot(false);
      setDashVisible(true);
    }, 200);
  }, []);

  const handleRun = useCallback(() => {
    window.scrollTo({ top: 0 });
    setDashVisible(false);
    setBooted(false);
    setShowBoot(true);
    sessionStorage.removeItem("ultron-booted");
    // bump key so all chart components re-mount and replay animations
    setRunKey((k) => k + 1);
  }, []);

  const toggleAgent = useCallback((id: AgentId) => {
    setActiveAgents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleRangeChange = useCallback((r: TimeRange) => {
    setRange(r);
  }, []);

  return (
    <div className="min-h-screen bg-black live-grid-bg">
      {/* Scan line */}
      <div className="live-scanline" />

      {/* Boot sequence */}
      {showBoot && <BootSequence onComplete={handleBootComplete} />}

      {/* Main content */}
      {booted && (
        <div key={runKey} className={`transition-opacity duration-500 ${dashVisible ? "opacity-100" : "opacity-0"}`}>
          {/* Status Bar */}
          <TopStatusBar range={range} onRangeChange={handleRangeChange} activeAgents={activeAgents} onToggleAgent={toggleAgent} onRun={handleRun} />

          {/* Agent Cards */}
          <div className="max-w-[1600px] mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:grid lg:grid-cols-5 lg:overflow-visible">
              {agents.map((a) => (
                <AgentStatusCard key={a.id} agent={a} active={activeAgents.has(a.id)} />
              ))}
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="max-w-[1600px] mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* 3A: Revenue */}
              <RevenueChart range={range} />

              {/* 3B: Pipeline */}
              <PipelineFunnel range={range} />

              {/* 3C: Donut */}
              <DonutChart range={range} activeAgents={activeAgents} />

              {/* 3D: Task bars */}
              <TaskBarsChart range={range} activeAgents={activeAgents} />

              {/* 3E: Content */}
              <ContentPerformance />

              {/* 3F: Money saved */}
              <MoneySavedBar />

              {/* 3G: Heatmap */}
              <NeuralNetwork />

              {/* 3H: System health */}
              <SystemHealthCard />

              {/* 3I: Live feed */}
              <LiveFeed activeAgents={activeAgents} />

              {/* 3J: Outreach */}
              <OutreachCard />

              {/* 3K: Competitor */}
              <CompetitorCard />
            </div>
          </div>

          {/* Bottom conversion */}
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              This is what your business looks like after deploying Ultron.
            </h2>
            <p className="text-[#999] mb-8">
              Every chart. Every metric. Every insight. Generated automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://app.51ultron.com/signup"
                className="btn-gradient glow-accent text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all inline-flex items-center gap-2"
              >
                Deploy Ultron and see your own numbers
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <Link href="/demo" className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors">
                Watch the live demo &rarr;
              </Link>
            </div>

            <div className="mt-12">
              <FounderTerminal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
