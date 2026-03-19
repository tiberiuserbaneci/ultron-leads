"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FounderTerminal from "@/components/FounderTerminal";
import ShareButtons from "@/components/ShareButtons";
import {
  departments,
  totalAgents,
  totalDepartments,
  ultronMapping,
  type Agent,
  type Department,
} from "./agentData";

/* ─── Tool icon helper ─── */
const toolColors: Record<string, string> = {
  "Brave Search": "#FF7A28",
  Apollo: "#6C5CE7",
  LinkedIn: "#0A66C2",
  Gmail: "#EA4335",
  Calendar: "#4285F4",
  "Internal DB": "#22c55e",
  Telegram: "#0088cc",
  "Twitter API": "#1DA1F2",
  "Reddit API": "#FF4500",
};

function ToolBadge({ name }: { name: string }) {
  const color = toolColors[name] || "#666";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-terminal border"
      style={{ borderColor: color + "40", color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {name}
    </span>
  );
}

/* ─── Ultron agent badge ─── */
function UltronBadge({ agent }: { agent: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DA4E24]/10 border border-[#DA4E24]/30 text-[#DA4E24] text-xs font-bold font-terminal">
      <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24]" />
      {agent}
    </span>
  );
}

/* ─── Connection badge ─── */
function ConnectionBadge({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#111] border border-[#222] text-[10px] font-terminal text-[#999]">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
      {id}
    </span>
  );
}

/* ─── Agent Detail Panel ─── */
function AgentDetail({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="animate-fade-in">
      {/* Mobile close */}
      <button
        onClick={onClose}
        className="lg:hidden flex items-center gap-1.5 text-xs text-[#555] hover:text-white mb-4 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to tree
      </button>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-terminal">{agent.name}</h3>
            <p className="text-sm text-[#999] mt-0.5">{agent.oneLiner}</p>
          </div>
          <button
            onClick={onClose}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-[#111] border border-[#222] text-[#555] hover:text-white transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* What it does */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">What it does</h4>
          <p className="text-sm text-[#ccc] leading-relaxed">{agent.description}</p>
        </div>

        {/* Replaces */}
        <div className="mb-5 p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-1.5">Replaces</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white font-medium">{agent.replaces}</span>
            <span className="text-sm font-terminal font-bold text-[#DA4E24]">{agent.replaceCost}</span>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Tools</h4>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools.map((t) => (
              <ToolBadge key={t} name={t} />
            ))}
          </div>
        </div>

        {/* Example output */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Example output</h4>
          <div className="p-3 rounded-xl bg-black border border-[#1a1a1a]">
            <pre className="text-xs font-terminal text-[#ccc] whitespace-pre-wrap leading-relaxed">{agent.exampleOutput}</pre>
          </div>
        </div>

        {/* Connected to */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Connected to</h4>
          <div className="flex flex-wrap gap-1.5">
            {agent.connectedTo.map((c) => (
              <ConnectionBadge key={c} id={c} />
            ))}
          </div>
        </div>

        {/* Ultron agent */}
        <div>
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Runs inside</h4>
          <UltronBadge agent={agent.ultronAgent} />
        </div>
      </div>
    </div>
  );
}

/* ─── File Tree Item (Agent) ─── */
function AgentFileItem({
  agent,
  selected,
  onClick,
  index,
  isLast,
  connectedNext,
}: {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
  index: number;
  isLast: boolean;
  connectedNext: boolean;
}) {
  return (
    <div className="relative">
      {/* Connection dotted line to next agent */}
      {connectedNext && !isLast && (
        <div className="absolute left-[22px] top-[28px] bottom-[-4px] w-px border-l border-dashed border-[#DA4E24]/20" />
      )}
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 py-1.5 pl-10 pr-3 text-left transition-all duration-150 rounded-lg group ${
          selected
            ? "bg-[#DA4E24]/10 text-[#DA4E24]"
            : "text-[#999] hover:text-white hover:bg-[#111]"
        }`}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        {/* Tree connector */}
        <span className="text-[#333] text-xs flex-shrink-0">{isLast ? "\u2514" : "\u251C"}</span>
        {/* Agent icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={selected ? "#DA4E24" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 transition-colors group-hover:stroke-[#DA4E24]">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
        <span className="text-sm font-terminal truncate">{agent.name}</span>
      </button>
    </div>
  );
}

/* ─── Department Folder ─── */
function DepartmentFolder({
  dept,
  expanded,
  onToggle,
  selectedAgent,
  onSelectAgent,
}: {
  dept: Department;
  expanded: boolean;
  onToggle: () => void;
  selectedAgent: string | null;
  onSelectAgent: (agent: Agent) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2.5 py-2 px-3 text-left rounded-lg transition-all duration-150 group ${
          expanded ? "bg-[#111] text-white" : "text-[#999] hover:text-white hover:bg-[#0d0d0d]"
        }`}
      >
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 transition-transform duration-200 text-[#555] ${expanded ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {/* Folder icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill={expanded ? "#DA4E24" : "none"} stroke={expanded ? "#DA4E24" : "#555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 transition-colors">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-sm font-terminal font-medium">{dept.name}/</span>
        <span className="text-[10px] text-[#444] ml-auto">{dept.agents.length} agents</span>
      </button>

      {/* Agents */}
      {expanded && (
        <div className="ml-2 mt-0.5 mb-1">
          {dept.agents.map((agent, i) => {
            const nextAgent = dept.agents[i + 1];
            const isConnected = nextAgent ? agent.connectedTo.includes(nextAgent.id) : false;
            return (
              <AgentFileItem
                key={agent.id}
                agent={agent}
                selected={selectedAgent === agent.id}
                onClick={() => onSelectAgent(agent)}
                index={i}
                isLast={i === dept.agents.length - 1}
                connectedNext={isConnected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Ultron Mapping Section ─── */
function MappingSection() {
  return (
    <div className="mt-16">
      {/* Summary */}
      <div className="text-center mb-10">
        <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {totalDepartments} departments. {totalAgents} agents. Every repeating task covered.
        </p>
        <p className="text-[#999] max-w-lg mx-auto">
          You don't need to build {totalAgents} separate agents. Ultron bundles them into 5 that cover every department.
        </p>
      </div>

      {/* Mapping cards */}
      <div className="space-y-3 max-w-2xl mx-auto">
        {ultronMapping.map((m) => (
          <div
            key={m.label}
            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]"
          >
            <div className="flex items-center gap-3 sm:w-[200px] flex-shrink-0">
              <span className="text-sm font-terminal text-[#555]">{m.departments}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DA4E24]/10 border border-[#DA4E24]/30 text-[#DA4E24] text-xs font-bold font-terminal mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24]" />
                {m.label}
              </span>
              <p className="text-xs text-[#666] mt-1">{m.agents}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href="https://app.51ultron.com/signup"
          className="btn-gradient glow-accent text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all inline-flex items-center gap-2"
        >
          Deploy all {totalAgents} capabilities in 10 minutes
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <p className="text-xs text-[#555] mt-3">Free plan. No credit card required.</p>
      </div>

      {/* Cross-page links */}
      <div className="grid sm:grid-cols-2 gap-3 mt-10">
        {[
          { label: "See the 5 agents that run all of this", href: "/blueprint" },
          { label: "Watch them execute in real time", href: "/demo" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between gap-2 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333] hover:bg-[#111] transition-all group text-sm text-[#999] hover:text-white"
          >
            <span>{link.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#333] group-hover:text-[#DA4E24] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AgentsMapPage() {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [visible, setVisible] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleDept = (deptId: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    // On mobile, scroll to detail
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleExpandAll = () => {
    if (expandedDepts.size === departments.length) {
      setExpandedDepts(new Set());
    } else {
      setExpandedDepts(new Set(departments.map((d) => d.id)));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div
        className={`text-center mb-10 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#DA4E24] text-sm font-medium">Agent Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          The Complete AI Agent Map
        </h1>
        <p className="text-lg text-[#999] max-w-xl mx-auto">
          Every agent a business needs, organized by department. Click any agent to see what it does, what it replaces, and how it connects to the system.
        </p>
        <p className="text-xs text-[#444] mt-3">{totalDepartments} departments / {totalAgents} agents</p>
      </div>

      {/* File Tree + Detail Panel */}
      <div
        className={`transition-all duration-500 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: File Tree */}
          <div className="lg:w-[45%]">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Tree header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-terminal font-bold text-[#DA4E24]">ultron/</span>
                </div>
                <button
                  onClick={handleExpandAll}
                  className="text-[10px] text-[#555] hover:text-white font-terminal transition-colors"
                >
                  {expandedDepts.size === departments.length ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {/* Departments */}
              <div className="p-2 space-y-0.5">
                {departments.map((dept) => (
                  <DepartmentFolder
                    key={dept.id}
                    dept={dept}
                    expanded={expandedDepts.has(dept.id)}
                    onToggle={() => toggleDept(dept.id)}
                    selectedAgent={selectedAgent?.id || null}
                    onSelectAgent={handleSelectAgent}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div ref={detailRef} className="lg:w-[55%] lg:sticky lg:top-20 lg:self-start scroll-mt-20">
            {selectedAgent ? (
              <AgentDetail agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
                <p className="text-sm text-[#555]">Click any agent to see full details</p>
                <p className="text-xs text-[#333] mt-1">What it does, what it replaces, example output</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mapping Section */}
      <MappingSection />

      {/* Share */}
      <div className="mt-12 text-center">
        <ShareButtons page="agents-map" />
      </div>

      {/* Founder Terminal */}
      <div className="mt-12">
        <FounderTerminal />
      </div>
    </div>
  );
}
