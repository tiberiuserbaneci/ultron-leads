"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
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

    // Store node positions as ratios (0-1) so they scale with resize
    const layers = 6;
    const nodesPerLayer = [3, 5, 7, 7, 5, 3];
    interface Node { rx: number; ry: number; r: number; energy: number; targetEnergy: number }
    const nodes: Node[][] = [];

    for (let l = 0; l < layers; l++) {
      const col: Node[] = [];
      const count = nodesPerLayer[l];
      const rx = (l + 1) / (layers + 1);
      for (let n = 0; n < count; n++) {
        const ry = (n + 1) / (count + 1);
        col.push({ rx, ry, r: 3, energy: Math.random() * 0.3, targetEnergy: 0 });
      }
      nodes.push(col);
    }

    // Connections between adjacent layers
    interface Conn { from: Node; to: Node; signal: number; speed: number; active: boolean }
    const conns: Conn[] = [];
    for (let l = 0; l < layers - 1; l++) {
      for (const from of nodes[l]) {
        for (const to of nodes[l + 1]) {
          if (Math.random() < 0.6) {
            conns.push({ from, to, signal: -1, speed: 0.008 + Math.random() * 0.012, active: false });
          }
        }
      }
    }

    let W = 0, H = 0;
    const syncSize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    syncSize();

    // Fire signals constantly
    let lastFire = 0;
    const fireInterval = 120;

    let raf: number;
    let prevTime = performance.now();

    const draw = (now: number) => {
      const dt = now - prevTime;
      prevTime = now;

      // Fire new signals
      if (now - lastFire > fireInterval) {
        lastFire = now;
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

      // Draw connections using ratio-based positions
      for (const c of conns) {
        const fx = c.from.rx * W, fy = c.from.ry * H;
        const tx = c.to.rx * W, ty = c.to.ry * H;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = c.active ? `rgba(218,78,36,${0.15 + c.signal * 0.3})` : "rgba(26,26,26,0.5)";
        ctx.lineWidth = c.active ? 1.5 : 0.5;
        ctx.stroke();

        if (c.active) {
          c.signal += c.speed * dt * 0.06;
          if (c.signal >= 1) {
            c.active = false;
            c.signal = -1;
            c.to.targetEnergy = 1;
          } else {
            const sx = fx + (tx - fx) * c.signal;
            const sy = fy + (ty - fy) * c.signal;
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

          const nx = node.rx * W, ny = node.ry * H;
          const glow = node.energy;
          ctx.beginPath();
          ctx.arc(nx, ny, node.r + glow * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(218,78,36,${0.2 + glow * 0.8})`;
          if (glow > 0.3) {
            ctx.shadowColor = "#DA4E24";
            ctx.shadowBlur = 12 * glow;
          }
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.arc(nx, ny, node.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${glow * 0.6})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const handleResize = () => syncSize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HudCard fullWidth>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">Agent Activity</h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="font-terminal text-[9px] text-[#DA4E24]">LIVE</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: "clamp(140px, 25vw, 200px)", background: "#050505" }}
      />
      <p className="text-[10px] text-[#444] mt-3">5 agents processing data across 30 pathways. Running 24/7.</p>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3H: SYSTEM HEALTH
   ═══════════════════════════════════════════════ */

const healthEvents = [
  { status: "green" as const, text: "Website ping: 200 OK (138ms)" },
  { status: "green" as const, text: "API /api/leads: 200 OK (92ms)" },
  { status: "green" as const, text: "API /api/agents: 200 OK (67ms)" },
  { status: "green" as const, text: "SSL cert check: Valid, 74 days left" },
  { status: "green" as const, text: "Database backup: Complete (847 MB)" },
  { status: "green" as const, text: "Cron check: 5/5 agents running" },
  { status: "green" as const, text: "Security scan: No vulnerabilities" },
  { status: "green" as const, text: "CDN edge nodes: All 12 healthy" },
  { status: "amber" as const, text: "Response time spike: 312ms on /pricing" },
  { status: "green" as const, text: "Response time normalized: 141ms" },
  { status: "green" as const, text: "Memory usage: 62% (3.1 GB / 5 GB)" },
  { status: "green" as const, text: "Disk I/O: Normal (45 MB/s read)" },
  { status: "green" as const, text: "DNS resolution: 12ms (healthy)" },
  { status: "green" as const, text: "WebSocket connections: 847 active" },
  { status: "green" as const, text: "Error rate: 0.02% (last 1h)" },
  { status: "green" as const, text: "API /api/metrics: 200 OK (54ms)" },
  { status: "amber" as const, text: "Slow query detected: 890ms (auto-optimized)" },
  { status: "green" as const, text: "Queue depth: 12 jobs (processing)" },
  { status: "green" as const, text: "Rate limiter: 0 blocked requests" },
  { status: "green" as const, text: "Competitor monitor: 4 sites checked" },
];

function SystemHealthCard() {
  const [logs, setLogs] = useState(() =>
    healthEvents.slice(0, 8).map((e, i) => ({ ...e, id: i }))
  );
  const idRef = useRef(8);
  const eventIdxRef = useRef(8);

  useEffect(() => {
    const i = setInterval(() => {
      eventIdxRef.current = (eventIdxRef.current + 1) % healthEvents.length;
      const event = healthEvents[eventIdxRef.current];
      idRef.current += 1;
      setLogs((prev) => [{ ...event, id: idRef.current }, ...prev.slice(0, 11)]);
    }, 1200);
    return () => clearInterval(i);
  }, []);

  const getTime = (offset: number) => {
    const d = new Date(Date.now() - offset * 1200);
    return d.toTimeString().slice(0, 8);
  };

  return (
    <HudCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">System Health</h3>
        <span className="font-terminal text-[9px] text-green-500">99.97% uptime</span>
      </div>
      <div className="h-[320px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-2 py-1.5 border-b border-[#0A0A0A] ${i === 0 ? "animate-fade-in" : ""}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.status === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14">{getTime(i)}</span>
            <span className={`text-[10px] leading-snug truncate ${log.status === "amber" ? "text-amber-400" : "text-[#ccc]"}`}>{log.text}</span>
          </div>
        ))}
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

const outreachEvents = [
  { type: "send" as const, text: "Email sent to sarah.chen@scaleflow.io" },
  { type: "open" as const, text: "Email opened: marcus@automatede.com (2nd time)" },
  { type: "reply" as const, text: "Reply received: jonas@ki-fabrik.de (interested)" },
  { type: "send" as const, text: "Follow-up #2 sent to tom.liu@databridge.io" },
  { type: "open" as const, text: "Email opened: lisa@novacorp.com" },
  { type: "meeting" as const, text: "Meeting booked: Sarah Chen, Thursday 2 PM" },
  { type: "send" as const, text: "Cold email sent to new lead: CloudBase CEO" },
  { type: "reply" as const, text: "Objection reply: 'Not the right time' from DataBridge" },
  { type: "open" as const, text: "Email opened: marcus@automatede.com (3rd time)" },
  { type: "send" as const, text: "Sequence touch #3: LinkedIn DM to Sarah Chen" },
  { type: "send" as const, text: "Email sent to alex@buildstack.io (new lead)" },
  { type: "open" as const, text: "Email opened: jonas@ki-fabrik.de" },
  { type: "meeting" as const, text: "Discovery call confirmed: NovaTech, Friday 11 AM" },
  { type: "reply" as const, text: "Positive reply: 'Send me the case study' from CloudBase" },
  { type: "send" as const, text: "Case study auto-sent to CloudBase CEO" },
  { type: "open" as const, text: "Link clicked: /pricing by tom.liu@databridge.io" },
  { type: "send" as const, text: "Follow-up email drafted for stale deal: BuildStack" },
  { type: "reply" as const, text: "Reply: 'Let's loop in my CTO' from Meridian Labs" },
  { type: "open" as const, text: "Email opened: new-lead@enterprise.co" },
  { type: "send" as const, text: "Outreach sequence started: 8 new prospects" },
];

const outreachTypeColor = { send: "text-[#ccc]", open: "text-[#1F77F6]", reply: "text-green-400", meeting: "text-[#DA4E24]" };
const outreachTypeLabel = { send: "SENT", open: "OPEN", reply: "REPLY", meeting: "BOOKED" };

function OutreachCard() {
  const [logs, setLogs] = useState(() =>
    outreachEvents.slice(0, 8).map((e, i) => ({ ...e, id: i }))
  );
  const idRef = useRef(8);
  const eventIdxRef = useRef(8);
  const [emails, setEmails] = useState(outreachStats.emailsSent);
  const [meetings, setMeetings] = useState(outreachStats.meetingsBooked);

  useEffect(() => {
    const i = setInterval(() => {
      eventIdxRef.current = (eventIdxRef.current + 1) % outreachEvents.length;
      const event = outreachEvents[eventIdxRef.current];
      idRef.current += 1;
      setLogs((prev) => [{ ...event, id: idRef.current }, ...prev.slice(0, 11)]);
      if (event.type === "send") setEmails((p) => p + 1);
      if (event.type === "meeting") setMeetings((p) => p + 1);
    }, 1400);
    return () => clearInterval(i);
  }, []);

  const getTime = (offset: number) => {
    const d = new Date(Date.now() - offset * 1400);
    return d.toTimeString().slice(0, 8);
  };

  return (
    <HudCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">Outreach Performance</h3>
        <div className="flex gap-3">
          <span className="font-terminal text-[9px] text-white"><span className="text-[#DA4E24]">{emails}</span> sent</span>
          <span className="font-terminal text-[9px] text-white"><span className="text-green-500">{meetings}</span> booked</span>
        </div>
      </div>
      <div className="h-[280px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-2 py-1.5 border-b border-[#0A0A0A] ${i === 0 ? "animate-fade-in" : ""}`}
          >
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14">{getTime(i)}</span>
            <span className={`font-terminal text-[9px] font-bold flex-shrink-0 w-12 ${outreachTypeColor[log.type]}`}>{outreachTypeLabel[log.type]}</span>
            <span className="text-[10px] text-[#ccc] leading-snug truncate">{log.text}</span>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ═══════════════════════════════════════════════
   SECTION 3K: COMPETITOR TRACKING
   ═══════════════════════════════════════════════ */

const compIntelEvents = [
  { comp: "Clay.com", type: "alert" as const, text: "Pricing page updated: Enterprise tier now $499/mo" },
  { comp: "Instantly.ai", type: "monitor" as const, text: "New blog post: 'AI-powered sequences'" },
  { comp: "GoHighLevel", type: "alert" as const, text: "3 new job postings: AI Engineer, ML Ops, Data Lead" },
  { comp: "Nexus AI", type: "alert" as const, text: "New feature detected: Agent marketplace" },
  { comp: "Clay.com", type: "monitor" as const, text: "Homepage A/B test detected (variant B live)" },
  { comp: "Instantly.ai", type: "alert" as const, text: "Pricing increased: Growth plan +$50/mo" },
  { comp: "GoHighLevel", type: "monitor" as const, text: "New integration: Zapier connector launched" },
  { comp: "Nexus AI", type: "monitor" as const, text: "Team page: +2 engineers hired this week" },
  { comp: "Clay.com", type: "monitor" as const, text: "New case study published: 'Enterprise Scaling'" },
  { comp: "Instantly.ai", type: "alert" as const, text: "Product Hunt launch detected: v3.0" },
  { comp: "GoHighLevel", type: "monitor" as const, text: "Changelog updated: 6 new features" },
  { comp: "Nexus AI", type: "alert" as const, text: "LinkedIn ad campaign detected: targeting SaaS founders" },
  { comp: "Clay.com", type: "monitor" as const, text: "API docs updated: new webhook endpoints" },
  { comp: "Instantly.ai", type: "monitor" as const, text: "G2 review: 4.2 stars (down from 4.4)" },
  { comp: "GoHighLevel", type: "alert" as const, text: "Competitor acquisition rumor: TechCrunch mention" },
  { comp: "Nexus AI", type: "monitor" as const, text: "SSL certificate renewed (auto-detected)" },
];

function CompetitorCard() {
  const [logs, setLogs] = useState(() =>
    compIntelEvents.slice(0, 6).map((e, i) => ({ ...e, id: i }))
  );
  const idRef = useRef(6);
  const eventIdxRef = useRef(6);

  useEffect(() => {
    const i = setInterval(() => {
      eventIdxRef.current = (eventIdxRef.current + 1) % compIntelEvents.length;
      const event = compIntelEvents[eventIdxRef.current];
      idRef.current += 1;
      setLogs((prev) => [{ ...event, id: idRef.current }, ...prev.slice(0, 9)]);
    }, 1800);
    return () => clearInterval(i);
  }, []);

  const getTime = (offset: number) => {
    const d = new Date(Date.now() - offset * 1800);
    return d.toTimeString().slice(0, 8);
  };

  return (
    <HudCard>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">Competitor Intelligence</h3>
        <span className="font-terminal text-[9px] text-[#555]">4 tracked</span>
      </div>
      <div className="h-[280px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-start gap-2 py-1.5 border-b border-[#0A0A0A] ${i === 0 ? "animate-fade-in" : ""}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${log.type === "alert" ? "bg-amber-500" : "bg-green-500"}`} />
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14 mt-0.5">{getTime(i)}</span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-white font-medium">{log.comp}</span>
              <span className="text-[10px] text-[#666] ml-1.5">{log.text}</span>
            </div>
          </div>
        ))}
      </div>
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
        <div key={runKey} className={`pt-4 sm:pt-6 transition-opacity duration-500 ${dashVisible ? "opacity-100" : "opacity-0"}`}>
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
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://app.51ultron.com/signup"
                className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
              >
                Try for free
              </a>
              <Link href="/demo" className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors">
                Watch the demo
              </Link>
            </div>

            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}
