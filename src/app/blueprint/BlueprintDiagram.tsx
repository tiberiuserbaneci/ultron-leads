"use client";

import { useState } from "react";
import Image from "next/image";

const agents = [
  {
    id: "cortex",
    name: "CORTEX",
    role: "Research & Intelligence",
    tasks: [
      "Monitors competitors daily",
      "Finds leads matching your ICP",
      "Researches prospects before calls",
      "Tracks industry trends",
    ],
    replaces: "Research assistant",
    cost: "$3,000/mo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
      </svg>
    ),
  },
  {
    id: "specter",
    name: "SPECTER",
    role: "Outreach & Lead Gen",
    tasks: [
      "Drafts personalized cold emails",
      "Finds decision-maker contacts",
      "Sequences follow-ups automatically",
      "Scores and qualifies leads",
    ],
    replaces: "SDR",
    cost: "$4,500/mo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: "striker",
    name: "STRIKER",
    role: "Sales & Deal Tracking",
    tasks: [
      "Triages your inbox for deals",
      "Drafts proposals and follow-ups",
      "Tracks pipeline and flags stale deals",
      "Researches prospects before meetings",
    ],
    replaces: "Sales ops",
    cost: "$3,500/mo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: "pulse",
    name: "PULSE",
    role: "Content & Social Media",
    tasks: [
      "Writes LinkedIn posts in your voice",
      "Creates Twitter threads, blog posts",
      "Adapts content per platform",
      "Maintains consistent publishing schedule",
    ],
    replaces: "Content marketer",
    cost: "$4,000/mo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    role: "Infrastructure & Monitoring",
    tasks: [
      "Monitors website uptime and speed",
      "Checks API health",
      "Alerts on competitor changes",
      "Runs security audits",
    ],
    replaces: "DevOps contractor",
    cost: "$5,000/mo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

// Perfect pentagon inscribed in circle with center (400,300), radius 200
// Angles: top=-90deg, upper-right=-18deg, lower-right=54deg, lower-left=126deg, upper-left=198deg
const VIEWBOX_W = 800;
const VIEWBOX_H = 580;
const CENTER = { x: 400, y: 300 };

const nodeCoords: Record<string, { x: number; y: number }> = {
  cortex:   { x: 400, y: 100 },  // top center        (-90deg)
  specter:  { x: 590, y: 238 },  // upper right       (-18deg)
  striker:  { x: 518, y: 462 },  // lower right       ( 54deg)
  pulse:    { x: 282, y: 462 },  // lower left        (126deg)
  sentinel: { x: 210, y: 238 },  // upper left        (198deg)
};

const ringEdges: [string, string][] = [
  ["cortex", "specter"],
  ["specter", "striker"],
  ["striker", "pulse"],
  ["pulse", "sentinel"],
  ["sentinel", "cortex"],
];

const pct = (val: number, total: number) => `${(val / total) * 100}%`;

export default function BlueprintDiagram() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const active = agents.find((a) => a.id === activeAgent);

  const isHighlighted = (id: string) => activeAgent === null || activeAgent === id;

  return (
    <div>
      {/* Desktop: pentagon diagram */}
      <div className="hidden lg:block">
        {/*
          Aspect-ratio-locked wrapper (800:580 = 72.5%).
          The SVG and DOM nodes share the same coordinate space so
          spokes always connect to the center of each node box.
        */}
        <div className="relative w-full" style={{ paddingTop: `${(VIEWBOX_H / VIEWBOX_W) * 100}%` }}>
          <div className="absolute inset-0">

            {/* SVG spokes + pentagon ring */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Hub spokes */}
              {agents.map((agent) => {
                const c = nodeCoords[agent.id];
                const lit = isHighlighted(agent.id);
                return (
                  <line
                    key={`spoke-${agent.id}`}
                    x1={CENTER.x} y1={CENTER.y}
                    x2={c.x} y2={c.y}
                    stroke="#DA4E24"
                    strokeWidth={lit ? "1.5" : "0.8"}
                    strokeDasharray="6,6"
                    strokeOpacity={lit ? "0.55" : "0.15"}
                    className="flow-anim"
                    style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                  />
                );
              })}

              {/* Pentagon edges */}
              {ringEdges.map(([a, b]) => {
                const ca = nodeCoords[a];
                const cb = nodeCoords[b];
                return (
                  <line
                    key={`ring-${a}-${b}`}
                    x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                    stroke="#2a2a2a" strokeWidth="1" strokeOpacity="0.9"
                  />
                );
              })}
            </svg>

            {/* Center hub — Ultron logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: pct(CENTER.x, VIEWBOX_W),
                top: pct(CENTER.y, VIEWBOX_H),
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-24 h-24 rounded-full bg-[#0a0a0a] border border-[#DA4E24]/40 flex items-center justify-center node-glow">
                <Image src="/logo.png" alt="Ultron" width={48} height={48} className="rounded-sm" />
              </div>
            </div>

            {/* Agent nodes — percentage-positioned, aligned with SVG coords */}
            {agents.map((agent) => {
              const c = nodeCoords[agent.id];
              return (
                <AgentNode
                  key={agent.id}
                  agent={agent}
                  style={{
                    left: pct(c.x, VIEWBOX_W),
                    top: pct(c.y, VIEWBOX_H),
                    transform: "translate(-50%, -50%)",
                  }}
                  active={activeAgent === agent.id}
                  dimmed={activeAgent !== null && activeAgent !== agent.id}
                  onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        {active ? (
          <div className="mt-4 p-6 rounded-xl border border-[#DA4E24]/30 bg-[#0a0a0a] transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="text-[#DA4E24] mt-0.5">{active.icon}</div>
                <div>
                  <div className="font-bold text-[#DA4E24] font-terminal">{active.name}</div>
                  <div className="text-white text-sm">{active.role}</div>
                </div>
              </div>
              <button onClick={() => setActiveAgent(null)} className="text-[#555] hover:text-[#999] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-[#555] mb-2 uppercase tracking-wider">What it does</div>
                <ul className="space-y-2">
                  {active.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#999]">
                      <span className="text-[#DA4E24] mt-0.5 flex-shrink-0">+</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center">
                <div className="bg-black rounded-xl p-5 w-full text-center border border-[#1a1a1a]">
                  <div className="text-[#555] text-xs mb-1">Replaces a</div>
                  <div className="text-white font-semibold">{active.replaces}</div>
                  <div className="text-[#DA4E24] font-bold text-2xl mt-1">{active.cost}</div>
                  <div className="text-[#555] text-xs mt-1">equivalent cost</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-[#555] text-sm mt-4">Click any agent to expand details</p>
        )}
      </div>

      {/* Mobile: vertical list with dashed connectors */}
      <div className="lg:hidden">
        {agents.map((agent, i) => (
          <div key={agent.id}>
            <button
              onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                activeAgent === agent.id
                  ? "bg-[#DA4E24]/10 border-[#DA4E24]/30"
                  : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#DA4E24] flex-shrink-0">{agent.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#DA4E24] font-terminal">{agent.name}</div>
                  <div className="text-white text-sm">{agent.role}</div>
                  {activeAgent === agent.id && (
                    <ul className="mt-3 space-y-1.5">
                      {agent.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[#999]">
                          <span className="text-[#DA4E24] mt-0.5 flex-shrink-0">+</span>
                          {task}
                        </li>
                      ))}
                      <li className="mt-2 pt-2 border-t border-[#1a1a1a] text-xs text-[#555]">
                        Replaces: <span className="text-[#999]">{agent.replaces} ({agent.cost})</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </button>

            {i < agents.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="h-7 border-l-2 border-dashed border-[#DA4E24]/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentNode({
  agent,
  style,
  active,
  dimmed,
  onClick,
}: {
  agent: typeof agents[0];
  style: React.CSSProperties;
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute w-36 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
        active
          ? "bg-[#DA4E24]/10 border-[#DA4E24]/40 scale-105 node-glow"
          : dimmed
          ? "bg-[#0a0a0a] border-[#1a1a1a] opacity-40"
          : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#DA4E24]/30 hover:scale-105"
      }`}
    >
      <div className="flex justify-center mb-2 text-[#DA4E24]">{agent.icon}</div>
      <div className="font-bold text-xs text-[#DA4E24] font-terminal">{agent.name}</div>
      <div className="text-[#999] text-xs mt-0.5 leading-tight">{agent.role}</div>
      <div className="w-1.5 h-1.5 rounded-full mx-auto mt-2 bg-[#DA4E24] pulse-soft" />
    </button>
  );
}
