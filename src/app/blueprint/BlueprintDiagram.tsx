"use client";

import { useState } from "react";

const agents = [
  {
    id: "cortex",
    name: "CORTEX",
    role: "Research & Intelligence",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/40",
    bgColor: "bg-indigo-500/10",
    dotColor: "bg-indigo-400",
    position: "top",
    tasks: [
      "Monitors competitors daily",
      "Finds leads matching your ICP",
      "Researches prospects before calls",
      "Tracks industry trends",
    ],
    replaces: "Research assistant",
    cost: "$3,000/mo",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
      </svg>
    ),
  },
  {
    id: "specter",
    name: "SPECTER",
    role: "Outreach & Lead Gen",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-500/10",
    dotColor: "bg-emerald-400",
    position: "right-top",
    tasks: [
      "Drafts personalized cold emails",
      "Finds decision-maker contacts",
      "Sequences follow-ups automatically",
      "Scores and qualifies leads",
    ],
    replaces: "SDR",
    cost: "$4,500/mo",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
  },
  {
    id: "striker",
    name: "STRIKER",
    role: "Sales & Deal Tracking",
    color: "text-orange-400",
    borderColor: "border-orange-500/40",
    bgColor: "bg-orange-500/10",
    dotColor: "bg-orange-400",
    position: "right-bottom",
    tasks: [
      "Triages your inbox for deals",
      "Drafts proposals and follow-ups",
      "Tracks pipeline and flags stale deals",
      "Researches prospects before meetings",
    ],
    replaces: "Sales ops",
    cost: "$3,500/mo",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: "pulse",
    name: "PULSE",
    role: "Content & Social Media",
    color: "text-pink-400",
    borderColor: "border-pink-500/40",
    bgColor: "bg-pink-500/10",
    dotColor: "bg-pink-400",
    position: "left-bottom",
    tasks: [
      "Writes LinkedIn posts in your voice",
      "Creates Twitter threads, blog posts",
      "Adapts content per platform",
      "Maintains consistent publishing schedule",
    ],
    replaces: "Content marketer",
    cost: "$4,000/mo",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    id: "sentinel",
    name: "SENTINEL",
    role: "Infrastructure & Monitoring",
    color: "text-sky-400",
    borderColor: "border-sky-500/40",
    bgColor: "bg-sky-500/10",
    dotColor: "bg-sky-400",
    position: "left-top",
    tasks: [
      "Monitors website uptime and speed",
      "Checks API health",
      "Alerts on competitor changes",
      "Runs security audits",
    ],
    replaces: "DevOps contractor",
    cost: "$5,000/mo",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

export default function BlueprintDiagram() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const active = agents.find((a) => a.id === activeAgent);

  return (
    <div>
      {/* Desktop: Pentagon layout */}
      <div className="hidden lg:block">
        <div className="relative" style={{ height: "600px" }}>
          {/* Center hub */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex flex-col items-center justify-center text-center">
              <div className="text-orange-400 font-bold text-sm">ULTRON</div>
              <div className="text-neutral-500 text-xs mt-0.5">OS</div>
            </div>
          </div>

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
            {/* Center connections */}
            <line x1="400" y1="300" x2="400" y2="80" stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3"/>
            <line x1="400" y1="300" x2="650" y2="165" stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3"/>
            <line x1="400" y1="300" x2="560" y2="460" stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3"/>
            <line x1="400" y1="300" x2="240" y2="460" stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3"/>
            <line x1="400" y1="300" x2="150" y2="165" stroke="#F97316" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.3"/>
            {/* Ring connections */}
            <line x1="400" y1="80" x2="650" y2="165" stroke="#404040" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1="650" y1="165" x2="560" y2="460" stroke="#404040" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1="560" y1="460" x2="240" y2="460" stroke="#404040" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1="240" y1="460" x2="150" y2="165" stroke="#404040" strokeWidth="1" strokeOpacity="0.5"/>
            <line x1="150" y1="165" x2="400" y2="80" stroke="#404040" strokeWidth="1" strokeOpacity="0.5"/>
          </svg>

          {/* Cortex — top */}
          <AgentNode agent={agents[0]} style={{ top: "20px", left: "50%", transform: "translateX(-50%)" }} active={activeAgent === agents[0].id} onClick={() => setActiveAgent(activeAgent === agents[0].id ? null : agents[0].id)} />
          {/* Specter — right top */}
          <AgentNode agent={agents[1]} style={{ top: "100px", right: "80px" }} active={activeAgent === agents[1].id} onClick={() => setActiveAgent(activeAgent === agents[1].id ? null : agents[1].id)} />
          {/* Striker — right bottom */}
          <AgentNode agent={agents[2]} style={{ bottom: "80px", right: "120px" }} active={activeAgent === agents[2].id} onClick={() => setActiveAgent(activeAgent === agents[2].id ? null : agents[2].id)} />
          {/* Pulse — left bottom */}
          <AgentNode agent={agents[3]} style={{ bottom: "80px", left: "120px" }} active={activeAgent === agents[3].id} onClick={() => setActiveAgent(activeAgent === agents[3].id ? null : agents[3].id)} />
          {/* Sentinel — left top */}
          <AgentNode agent={agents[4]} style={{ top: "100px", left: "80px" }} active={activeAgent === agents[4].id} onClick={() => setActiveAgent(activeAgent === agents[4].id ? null : agents[4].id)} />
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="lg:hidden grid sm:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
            className={`text-left p-5 rounded-xl border transition-all duration-200 ${
              activeAgent === agent.id
                ? `${agent.bgColor} ${agent.borderColor}`
                : "bg-[#111111] border-[#262626] hover:border-[#404040]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${agent.color}`}>{agent.icon}</div>
              <div className="flex-1">
                <div className={`font-mono font-bold text-sm ${agent.color}`}>{agent.name}</div>
                <div className="text-neutral-300 text-sm mt-0.5">{agent.role}</div>
                {activeAgent === agent.id && (
                  <ul className="mt-3 space-y-1.5">
                    {agent.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                        <span className="text-orange-400 mt-0.5">→</span>
                        {task}
                      </li>
                    ))}
                    <li className="mt-2 pt-2 border-t border-[#262626] text-sm">
                      <span className="text-neutral-500">Replaces: </span>
                      <span className="text-red-400 font-medium">{agent.replaces} ({agent.cost})</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded detail panel (desktop) */}
      {active && (
        <div className={`hidden lg:block mt-6 p-6 rounded-xl border ${active.bgColor} ${active.borderColor} transition-all duration-300`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`${active.color}`}>{active.icon}</div>
              <div>
                <div className={`font-mono font-bold text-lg ${active.color}`}>{active.name}</div>
                <div className="text-neutral-300 font-medium">{active.role}</div>
              </div>
            </div>
            <button
              onClick={() => setActiveAgent(null)}
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-neutral-500 mb-2">What it does</div>
              <ul className="space-y-2">
                {active.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center">
              <div className="bg-[#0A0A0A]/50 rounded-xl p-5 w-full text-center">
                <div className="text-neutral-500 text-sm mb-1">Replaces a</div>
                <div className="text-white font-semibold text-lg">{active.replaces}</div>
                <div className="text-red-400 font-bold text-2xl mt-1">{active.cost}</div>
                <div className="text-neutral-600 text-xs mt-2">equivalent salary/contractor cost</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-neutral-600 text-sm mt-4 lg:block hidden">
        Click any agent to expand details
      </p>
    </div>
  );
}

function AgentNode({
  agent,
  style,
  active,
  onClick,
}: {
  agent: typeof agents[0];
  style: React.CSSProperties;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute w-36 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
        active
          ? `${agent.bgColor} ${agent.borderColor} scale-105`
          : "bg-[#111111] border-[#262626] hover:border-[#404040] hover:scale-105"
      }`}
    >
      <div className={`flex justify-center mb-2 ${agent.color}`}>{agent.icon}</div>
      <div className={`font-mono font-bold text-xs ${agent.color}`}>{agent.name}</div>
      <div className="text-neutral-400 text-xs mt-0.5 leading-tight">{agent.role}</div>
      <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-2 ${agent.dotColor} animate-pulse`} />
    </button>
  );
}
