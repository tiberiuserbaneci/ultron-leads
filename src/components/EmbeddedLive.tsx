"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
} from "@/app/live/liveData";

/* ===============================================
   UTILITY HOOKS
   =============================================== */

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

/* ===============================================
   HUD CARD (corner bracket decoration)
   =============================================== */

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
      className={`relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-none p-4 sm:p-5 ${
        fullWidth ? "col-span-1 lg:col-span-2" : ""
      } ${className}`}
    >
      <span
        className="absolute top-0 left-0 w-4 h-4 transition-colors duration-500"
        style={{
          borderTop: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <span
        className="absolute top-0 right-0 w-4 h-4 transition-colors duration-500"
        style={{
          borderTop: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />
      <span
        className="absolute bottom-0 left-0 w-4 h-4 transition-colors duration-500"
        style={{
          borderBottom: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <span
        className="absolute bottom-0 right-0 w-4 h-4 transition-colors duration-500"
        style={{
          borderBottom: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />
      {children}
    </div>
  );
}

/* ===============================================
   SPARKLINE
   =============================================== */

function Sparkline({
  data,
  color = "#DA4E24",
  width = 60,
  height = 24,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * width},${
          height - ((v - min) / range) * height
        }`
    )
    .join(" ");
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ===============================================
   AGENT ICONS & PROGRESS RING
   =============================================== */

function AgentIcon({ id, size = 20 }: { id: AgentId; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#DA4E24",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "CORTEX":
      return (
        <svg {...props}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "SPECTER":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "STRIKER":
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "PULSE":
      return (
        <svg {...props}>
          <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
          <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
          <circle cx="12" cy="12" r="2" />
          <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
          <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
        </svg>
      );
    case "SENTINEL":
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}

function ProgressRing({ pct, size = 44 }: { pct: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="3"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#DA4E24"
        strokeWidth="3"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000"
      />
    </svg>
  );
}

/* ===============================================
   AGENT STATUS CARD
   =============================================== */

function AgentStatusCard({
  agent,
  active,
}: {
  agent: (typeof agents)[0];
  active: boolean;
}) {
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
      style={
        active
          ? { boxShadow: "0 0 20px rgba(218,78,36,0.08)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2 rounded-lg bg-[#111] border border-[#1A1A1A]"
          style={{ boxShadow: "0 0 12px rgba(218,78,36,0.1)" }}
        >
          <AgentIcon id={agent.id} />
        </div>
        <ProgressRing pct={agent.completionRate} size={38} />
      </div>
      <h3 className="text-sm font-bold text-[#DA4E24] font-terminal">
        {agent.name}
      </h3>
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
          <div className="font-terminal text-xs font-bold text-white">
            {agent.tasksToday}
          </div>
          <div className="text-[9px] text-[#444]">today</div>
        </div>
        <div className="text-right">
          <div className="font-terminal text-[10px] text-[#666]">
            {agent.lastCompleted}
          </div>
          <div className="text-[9px] text-[#444]">last task</div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================
   REVENUE CHART
   =============================================== */

function RevenueChart({ range }: { range: TimeRange }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const { ultron, manual } = useMemo(() => getRevenueData(range), [range]);
  const max = Math.max(...ultron) * 1.1;
  const w = 100;
  const h = 40;

  const toPath = (data: number[]) =>
    data
      .map(
        (v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`
      )
      .join(" ");

  return (
    <HudCard fullWidth>
      <div ref={ref}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">
            Revenue Impact
          </h3>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#DA4E24] inline-block" />
              With Ultron
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#333] inline-block" />
              Manual
            </span>
          </div>
        </div>
        <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line
                key={p}
                x1="0"
                y1={h * p}
                x2={w}
                y2={h * p}
                stroke="#1A1A1A"
                strokeWidth="0.2"
              />
            ))}
            {inView && (
              <polygon
                points={`${toPath(ultron)} ${ultron
                  .map(
                    (_, i) =>
                      `${
                        ((ultron.length - 1 - i) / (manual.length - 1)) * w
                      },${
                        h - (manual[ultron.length - 1 - i] / max) * h
                      }`
                  )
                  .join(" ")}`}
                fill="rgba(218,78,36,0.05)"
              />
            )}
            <polyline
              points={toPath(manual)}
              fill="none"
              stroke="#333"
              strokeWidth="0.4"
              className={inView ? "animate-draw" : "opacity-0"}
              style={{
                strokeDasharray: 300,
                strokeDashoffset: inView ? 0 : 300,
                transition: "stroke-dashoffset 2s ease",
              }}
            />
            <polyline
              points={toPath(ultron)}
              fill="none"
              stroke="#DA4E24"
              strokeWidth="0.5"
              className={inView ? "animate-draw" : "opacity-0"}
              style={{
                strokeDasharray: 300,
                strokeDashoffset: inView ? 0 : 300,
                transition: "stroke-dashoffset 2s ease 0.3s",
                filter: "drop-shadow(0 0 2px rgba(218,78,36,0.4))",
              }}
            />
          </svg>
          {inView && (
            <>
              <span
                className="absolute right-0 font-terminal text-xs text-[#DA4E24] font-bold"
                style={{
                  top: `${
                    (1 - ultron[ultron.length - 1] / max) * 100
                  }%`,
                  transform: "translateY(-50%)",
                }}
              >
                ${ultron[ultron.length - 1].toLocaleString()}
              </span>
              <span
                className="absolute right-0 font-terminal text-xs text-[#555]"
                style={{
                  top: `${
                    (1 - manual[manual.length - 1] / max) * 100
                  }%`,
                  transform: "translateY(-50%)",
                }}
              >
                ${manual[manual.length - 1].toLocaleString()}
              </span>
            </>
          )}
        </div>
        <p className="text-[10px] text-[#444] mt-2">
          12-week projected impact based on current agent performance.
        </p>
      </div>
    </HudCard>
  );
}

/* ===============================================
   SYSTEM HEALTH (live scrolling log)
   =============================================== */

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
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">
          System Health
        </h3>
        <span className="font-terminal text-[9px] text-green-500">
          99.97% uptime
        </span>
      </div>
      <div className="h-[320px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-2 py-1.5 border-b border-[#0A0A0A] ${
              i === 0 ? "animate-fade-in" : ""
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                log.status === "amber" ? "bg-amber-500" : "bg-green-500"
              }`}
            />
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14">
              {getTime(i)}
            </span>
            <span
              className={`text-[10px] leading-snug truncate ${
                log.status === "amber" ? "text-amber-400" : "text-[#ccc]"
              }`}
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ===============================================
   LIVE ACTIVITY FEED
   =============================================== */

function LiveFeed({ activeAgents }: { activeAgents: Set<AgentId> }) {
  const [entries, setEntries] = useState(() => feedEntries.slice(0, 12));
  const feedIdxRef = useRef(12);

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
      <div className="h-[320px] overflow-y-auto overflow-x-hidden space-y-0 scrollbar-none">
        {filtered.map((entry, i) => (
          <div
            key={`${entry.agent}-${i}`}
            className={`flex items-start gap-2 py-1.5 border-b border-[#0A0A0A] ${
              i === 0 ? "animate-fade-in" : ""
            }`}
          >
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14 mt-0.5">
              {getTimeStr(i)}
            </span>
            <span className="font-terminal text-[9px] text-[#DA4E24] flex-shrink-0 w-16 mt-0.5 font-bold">
              {entry.agent}
            </span>
            <span className="text-[10px] text-[#ccc] leading-snug">
              {entry.text}
            </span>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ===============================================
   OUTREACH PERFORMANCE
   =============================================== */

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

const outreachTypeColor = {
  send: "text-[#ccc]",
  open: "text-[#1F77F6]",
  reply: "text-green-400",
  meeting: "text-[#DA4E24]",
};
const outreachTypeLabel = {
  send: "SENT",
  open: "OPEN",
  reply: "REPLY",
  meeting: "BOOKED",
};

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
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">
          Outreach Performance
        </h3>
        <div className="flex gap-3">
          <span className="font-terminal text-[9px] text-white">
            <span className="text-[#DA4E24]">{emails}</span> sent
          </span>
          <span className="font-terminal text-[9px] text-white">
            <span className="text-green-500">{meetings}</span> booked
          </span>
        </div>
      </div>
      <div className="h-[280px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-center gap-2 py-1.5 border-b border-[#0A0A0A] ${
              i === 0 ? "animate-fade-in" : ""
            }`}
          >
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14">
              {getTime(i)}
            </span>
            <span
              className={`font-terminal text-[9px] font-bold flex-shrink-0 w-12 ${
                outreachTypeColor[log.type]
              }`}
            >
              {outreachTypeLabel[log.type]}
            </span>
            <span className="text-[10px] text-[#ccc] leading-snug truncate">
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ===============================================
   COMPETITOR INTELLIGENCE
   =============================================== */

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
        <h3 className="text-xs font-bold text-[#999] uppercase tracking-widest">
          Competitor Intelligence
        </h3>
        <span className="font-terminal text-[9px] text-[#555]">4 tracked</span>
      </div>
      <div className="h-[280px] overflow-hidden space-y-0">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={`flex items-start gap-2 py-1.5 border-b border-[#0A0A0A] ${
              i === 0 ? "animate-fade-in" : ""
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
                log.type === "alert" ? "bg-amber-500" : "bg-green-500"
              }`}
            />
            <span className="font-terminal text-[9px] text-[#333] flex-shrink-0 w-14 mt-0.5">
              {getTime(i)}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-white font-medium">
                {log.comp}
              </span>
              <span className="text-[10px] text-[#666] ml-1.5">{log.text}</span>
            </div>
          </div>
        ))}
      </div>
    </HudCard>
  );
}

/* ===============================================
   MAIN EMBEDDED COMPONENT
   =============================================== */

export default function EmbeddedLive() {
  const [range, setRange] = useState<TimeRange>("30D");
  const [activeAgents, setActiveAgents] = useState<Set<AgentId>>(
    () => new Set<AgentId>(["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"])
  );

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

  const ranges: TimeRange[] = ["7D", "30D", "90D", "ALL"];
  const agentKeys: { id: AgentId; short: string }[] = [
    { id: "CORTEX", short: "C" },
    { id: "SPECTER", short: "Sp" },
    { id: "STRIKER", short: "St" },
    { id: "PULSE", short: "P" },
    { id: "SENTINEL", short: "Se" },
  ];

  return (
    <div className="font-terminal">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
        {/* Time range selector */}
        <div className="flex items-center gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-[10px] font-terminal rounded transition-all ${
                range === r
                  ? "text-[#DA4E24] bg-[#DA4E24]/10 shadow-[0_0_8px_rgba(218,78,36,0.2)]"
                  : "text-[#555] hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Agent filter circles */}
        <div className="flex items-center gap-1.5">
          {agentKeys.map((a) => (
            <button
              key={a.id}
              onClick={() => toggleAgent(a.id)}
              className={`w-7 h-7 rounded-full text-[9px] font-terminal font-bold transition-all ${
                activeAgents.has(a.id)
                  ? "bg-[#DA4E24]/20 text-[#DA4E24] border border-[#DA4E24]/40"
                  : "bg-[#111] text-[#333] border border-[#222]"
              }`}
              title={a.id}
            >
              {a.short}
            </button>
          ))}
        </div>
      </div>

      {/* Agent status cards - horizontal scroll / grid */}
      <div className="mb-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:grid lg:grid-cols-5 lg:overflow-visible">
          {agents.map((a) => (
            <AgentStatusCard
              key={a.id}
              agent={a}
              active={activeAgents.has(a.id)}
            />
          ))}
        </div>
      </div>

      {/* 2-column dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RevenueChart range={range} />
        <SystemHealthCard />
        <LiveFeed activeAgents={activeAgents} />
        <OutreachCard />
        <CompetitorCard />
      </div>
    </div>
  );
}
