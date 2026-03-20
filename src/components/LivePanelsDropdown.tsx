"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Event data (self-contained, mirrors /live) ─── */

const healthEvents = [
  { status: "green" as const, text: "API /api/agents: 200 OK (67ms)" },
  { status: "green" as const, text: "SSL cert check: Valid, 74 days left" },
  { status: "green" as const, text: "Database backup: Complete (847 MB)" },
  { status: "green" as const, text: "Cron check: 5/5 agents running" },
  { status: "green" as const, text: "Security scan: No vulnerabilities" },
  { status: "green" as const, text: "CDN edge nodes: All 12 healthy" },
  { status: "amber" as const, text: "Response time spike: 312ms on /pricing" },
  { status: "green" as const, text: "Response time normalized: 141ms" },
  { status: "green" as const, text: "Memory usage: 62% (3.1 GB / 5 GB)" },
  { status: "green" as const, text: "DNS resolution: 12ms (healthy)" },
  { status: "green" as const, text: "WebSocket connections: 847 active" },
  { status: "green" as const, text: "Error rate: 0.02% (last 1h)" },
];

const activityEntries = [
  { agent: "STRIKER", text: "Follow-up #3 sent to jonas@ki-fabrik.de" },
  { agent: "PULSE", text: "Content calendar updated: 5 posts queued for next week" },
  { agent: "SENTINEL", text: "Security scan clear: no exposed endpoints found" },
  { agent: "CORTEX", text: "Trend detected: 'agentic AI' mentions up 280% this week" },
  { agent: "SPECTER", text: "New ICP match: CloudBase (Series A, 45 employees)" },
  { agent: "STRIKER", text: "Proposal template customized for enterprise tier" },
  { agent: "PULSE", text: "Hook analysis: contrarian takes getting 4.2x engagement" },
  { agent: "SENTINEL", text: "Database backup verified: 847 MB, integrity check passed" },
  { agent: "CORTEX", text: "Weekly competitor report compiled: 4 changes detected" },
  { agent: "SPECTER", text: "Lead nurture sequence started: 8 prospects in pipeline" },
];

const outreachEvents = [
  { type: "send" as const, text: "Email sent to sarah.chen@scaleflow.io" },
  { type: "open" as const, text: "Email opened: marcus@automatede.com" },
  { type: "reply" as const, text: "Reply received: jonas@ki-fabrik.de (interested)" },
  { type: "send" as const, text: "Follow-up #2 sent to tom.liu@databridge.io" },
  { type: "meeting" as const, text: "Meeting booked: Sarah Chen, Thursday 2 PM" },
  { type: "send" as const, text: "Cold email sent to new lead: CloudBase CEO" },
  { type: "reply" as const, text: "Objection reply: 'Not the right time' from DataBridge" },
  { type: "open" as const, text: "Email opened: marcus@automatede.com (3rd time)" },
  { type: "send" as const, text: "Sequence touch #3: LinkedIn DM to Sarah Chen" },
  { type: "meeting" as const, text: "Discovery call: NovaTech, Friday 11 AM" },
];

const compEvents = [
  { comp: "Clay.com", type: "alert" as const, text: "Enterprise tier now $499/mo" },
  { comp: "Instantly.ai", type: "monitor" as const, text: "New blog post: 'AI-powered sequences'" },
  { comp: "GoHighLevel", type: "alert" as const, text: "3 new job postings: AI, ML, Data" },
  { comp: "Nexus AI", type: "alert" as const, text: "New feature: Agent marketplace" },
  { comp: "Clay.com", type: "monitor" as const, text: "Homepage A/B test detected" },
  { comp: "Instantly.ai", type: "alert" as const, text: "Pricing increased: Growth +$50/mo" },
  { comp: "GoHighLevel", type: "monitor" as const, text: "New integration: Zapier connector" },
  { comp: "Nexus AI", type: "monitor" as const, text: "Team page: +2 engineers hired" },
];

const outreachTypeColor = { send: "text-[#888]", open: "text-[#1F77F6]", reply: "text-green-400", meeting: "text-[#DA4E24]" };
const outreachTypeLabel = { send: "SENT", open: "OPEN", reply: "REPLY", meeting: "BOOKED" };

/* ─── Shared time formatter ─── */
function getTime(offset: number, interval: number) {
  const d = new Date(Date.now() - offset * interval);
  return d.toTimeString().slice(0, 8);
}

/* ─── Mini panel wrapper ─── */
function MiniPanel({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[9px] font-bold text-[#666] uppercase tracking-widest">{title}</h4>
        {badge}
      </div>
      <div className="space-y-0 max-h-[140px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ─── System Health mini ─── */
function MiniHealth() {
  const [logs, setLogs] = useState(() => healthEvents.slice(0, 5).map((e, i) => ({ ...e, id: i })));
  const idRef = useRef(5);
  const idxRef = useRef(5);

  useEffect(() => {
    const i = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % healthEvents.length;
      idRef.current += 1;
      setLogs((prev) => [{ ...healthEvents[idxRef.current], id: idRef.current }, ...prev.slice(0, 4)]);
    }, 1200);
    return () => clearInterval(i);
  }, []);

  return (
    <MiniPanel title="System Health" badge={<span className="text-[8px] text-green-500 font-mono">99.97%</span>}>
      {logs.map((log, i) => (
        <div key={log.id} className={`flex items-center gap-1.5 py-1 ${i === 0 ? "animate-fade-in" : ""}`}>
          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${log.status === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
          <span className="font-mono text-[8px] text-[#333] flex-shrink-0 w-12">{getTime(i, 1200)}</span>
          <span className={`text-[8px] leading-tight truncate ${log.status === "amber" ? "text-amber-400" : "text-[#999]"}`}>{log.text}</span>
        </div>
      ))}
    </MiniPanel>
  );
}

/* ─── Live Activity mini ─── */
function MiniActivity() {
  const [entries, setEntries] = useState(() => activityEntries.slice(0, 5));
  const idxRef = useRef(5);

  useEffect(() => {
    const i = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % activityEntries.length;
      setEntries((prev) => [activityEntries[idxRef.current], ...prev.slice(0, 4)]);
    }, 1200);
    return () => clearInterval(i);
  }, []);

  return (
    <MiniPanel
      title="Live Activity"
      badge={<span className="inline-flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /></span>}
    >
      {entries.map((entry, i) => (
        <div key={`${entry.agent}-${i}`} className={`flex items-start gap-1.5 py-1 ${i === 0 ? "animate-fade-in" : ""}`}>
          <span className="font-mono text-[8px] text-[#333] flex-shrink-0 w-12 mt-px">{getTime(i, 1200)}</span>
          <span className="font-mono text-[8px] text-[#DA4E24] flex-shrink-0 w-14 mt-px font-bold">{entry.agent}</span>
          <span className="text-[8px] text-[#999] leading-tight truncate">{entry.text}</span>
        </div>
      ))}
    </MiniPanel>
  );
}

/* ─── Outreach mini ─── */
function MiniOutreach() {
  const [logs, setLogs] = useState(() => outreachEvents.slice(0, 5).map((e, i) => ({ ...e, id: i })));
  const idRef = useRef(5);
  const idxRef = useRef(5);
  const [emails, setEmails] = useState(321);
  const [meetings, setMeetings] = useState(43);

  useEffect(() => {
    const i = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % outreachEvents.length;
      idRef.current += 1;
      const event = outreachEvents[idxRef.current];
      setLogs((prev) => [{ ...event, id: idRef.current }, ...prev.slice(0, 4)]);
      if (event.type === "send") setEmails((p) => p + 1);
      if (event.type === "meeting") setMeetings((p) => p + 1);
    }, 1400);
    return () => clearInterval(i);
  }, []);

  return (
    <MiniPanel
      title="Outreach"
      badge={
        <div className="flex gap-2">
          <span className="text-[8px] font-mono text-white"><span className="text-[#DA4E24]">{emails}</span> sent</span>
          <span className="text-[8px] font-mono text-white"><span className="text-green-500">{meetings}</span> booked</span>
        </div>
      }
    >
      {logs.map((log, i) => (
        <div key={log.id} className={`flex items-center gap-1.5 py-1 ${i === 0 ? "animate-fade-in" : ""}`}>
          <span className="font-mono text-[8px] text-[#333] flex-shrink-0 w-12">{getTime(i, 1400)}</span>
          <span className={`font-mono text-[8px] font-bold flex-shrink-0 w-10 ${outreachTypeColor[log.type]}`}>{outreachTypeLabel[log.type]}</span>
          <span className="text-[8px] text-[#999] leading-tight truncate">{log.text}</span>
        </div>
      ))}
    </MiniPanel>
  );
}

/* ─── Competitor mini ─── */
function MiniCompetitor() {
  const [logs, setLogs] = useState(() => compEvents.slice(0, 5).map((e, i) => ({ ...e, id: i })));
  const idRef = useRef(5);
  const idxRef = useRef(5);

  useEffect(() => {
    const i = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % compEvents.length;
      idRef.current += 1;
      setLogs((prev) => [{ ...compEvents[idxRef.current], id: idRef.current }, ...prev.slice(0, 4)]);
    }, 1800);
    return () => clearInterval(i);
  }, []);

  return (
    <MiniPanel title="Competitors" badge={<span className="text-[8px] text-[#555] font-mono">4 tracked</span>}>
      {logs.map((log, i) => (
        <div key={log.id} className={`flex items-start gap-1.5 py-1 ${i === 0 ? "animate-fade-in" : ""}`}>
          <span className={`w-1 h-1 rounded-full flex-shrink-0 mt-1 ${log.type === "alert" ? "bg-amber-500" : "bg-green-500"}`} />
          <span className="font-mono text-[8px] text-[#333] flex-shrink-0 w-12 mt-px">{getTime(i, 1800)}</span>
          <span className="text-[8px] text-white font-medium flex-shrink-0">{log.comp}</span>
          <span className="text-[8px] text-[#666] leading-tight truncate">{log.text}</span>
        </div>
      ))}
    </MiniPanel>
  );
}

/* ═══ Main dropdown ═══ */
export default function LivePanelsDropdown() {
  return (
    <div className="absolute top-full left-0 mt-2 w-[520px] bg-[#111] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-3 animate-fade-up z-50">
      <div className="grid grid-cols-2 gap-2">
        <MiniHealth />
        <MiniActivity />
        <MiniOutreach />
        <MiniCompetitor />
      </div>
      <a
        href="https://work.51ultron.com/live/"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-[10px] text-[#555] hover:text-[#999] mt-2.5 transition-colors"
      >
        Open full Command Center →
      </a>
    </div>
  );
}
