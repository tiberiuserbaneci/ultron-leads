"use client";

import { useState } from "react";

type StackNode = {
  id: string;
  label: string;
  sublabel: string;
  agent: string | null;
  agentColor: string;
  nodeColor: string;
  nodeBg: string;
  nodeBorder: string;
  agentActions: string[];
  example: string;
  withoutCost: string;
};

const nodes: StackNode[] = [
  {
    id: "traffic",
    label: "TRAFFIC",
    sublabel: "Instagram, LinkedIn, X",
    agent: "PULSE",
    agentColor: "text-pink-400",
    nodeColor: "text-pink-400",
    nodeBg: "bg-pink-500/10",
    nodeBorder: "border-pink-500/30",
    agentActions: [
      "Publishes content daily across all platforms",
      "Adapts format per platform (carousel vs thread vs post)",
      "Uses Cortex intel to write about trending topics",
      "Maintains consistent schedule without reminders",
    ],
    example: "5 posts published this week. LinkedIn engagement up 34% vs last month.",
    withoutCost: "Without this: you post when you remember. Which is not often enough.",
  },
  {
    id: "engagement",
    label: "ENGAGEMENT",
    sublabel: "Comments, DMs, Replies",
    agent: null,
    agentColor: "text-neutral-400",
    nodeColor: "text-neutral-300",
    nodeBg: "bg-neutral-500/10",
    nodeBorder: "border-neutral-500/20",
    agentActions: [
      "This node is manual — your authentic engagement",
      "Pulse creates the content that drives inbound",
      "Specter captures the signals and acts on them",
    ],
    example: "Inbound DMs from content viewers — warm prospects, no cold outreach needed.",
    withoutCost: "Without Pulse generating content: no inbound. You rely only on referrals.",
  },
  {
    id: "leads",
    label: "LEAD LIST",
    sublabel: "Scored, qualified, enriched",
    agent: "SPECTER",
    agentColor: "text-emerald-400",
    nodeColor: "text-emerald-400",
    nodeBg: "bg-emerald-500/10",
    nodeBorder: "border-emerald-500/30",
    agentActions: [
      "Finds companies matching your ICP from multiple sources",
      "Enriches each lead with company data, funding, tech stack",
      "Scores every lead 0–100 based on ICP fit",
      "Saves all leads to your database with full context",
    ],
    example: "8 leads added this week. Top score: 85/100. Email verified.",
    withoutCost: "Without this: manual research on LinkedIn. 2–3 leads/day at best.",
  },
  {
    id: "outreach",
    label: "OUTREACH",
    sublabel: "Personalized emails sent",
    agent: "SPECTER",
    agentColor: "text-emerald-400",
    nodeColor: "text-emerald-400",
    nodeBg: "bg-emerald-500/10",
    nodeBorder: "border-emerald-500/30",
    agentActions: [
      "Drafts personalized first email for each lead",
      "References specific signals: their posts, hiring, funding",
      "95% about them, 5% about you",
      "Sequences follow-ups automatically",
    ],
    example: "Subject: 'Your expansion to 3 new markets' — references their recent LinkedIn post.",
    withoutCost: "Without this: generic copy-paste outreach. Sub-5% reply rates.",
  },
  {
    id: "intel",
    label: "COMPETITIVE INTEL",
    sublabel: "Context for every prospect",
    agent: "CORTEX",
    agentColor: "text-indigo-400",
    nodeColor: "text-indigo-400",
    nodeBg: "bg-indigo-500/10",
    nodeBorder: "border-indigo-500/30",
    agentActions: [
      "Researches each prospect's company before contact",
      "Tracks competitor moves that affect positioning",
      "Monitors industry trends relevant to your ICP",
      "Feeds intel back to Pulse for content creation",
    ],
    example: "Pre-call brief generated: 'Sarah Chen, VP Ops — 3 recent posts about staffing. Expanding to 3 new markets.'",
    withoutCost: "Without this: you go into calls cold. Competitors who prepared will win.",
  },
  {
    id: "pipeline",
    label: "PIPELINE",
    sublabel: "Deals tracked, follow-ups automated",
    agent: "STRIKER",
    agentColor: "text-orange-400",
    nodeColor: "text-orange-400",
    nodeBg: "bg-orange-500/10",
    nodeBorder: "border-orange-500/30",
    agentActions: [
      "Triages inbox and flags deal-related emails",
      "Drafts follow-ups that reference previous conversations",
      "Tracks every deal from discovery to close",
      "Alerts when deals go stale (no contact for 7+ days)",
    ],
    example: "3 active deals. 1 flagged stale — last contact 9 days ago. Follow-up drafted.",
    withoutCost: "Without this: deals die in your inbox. That lead from 3 weeks ago? Gone.",
  },
  {
    id: "revenue",
    label: "REVENUE",
    sublabel: "$10K/month",
    agent: null,
    agentColor: "text-orange-400",
    nodeColor: "text-amber-400",
    nodeBg: "bg-amber-500/10",
    nodeBorder: "border-amber-500/30",
    agentActions: [
      "This is the output of the system",
      "Every node above contributes to getting here",
      "The system compounds — better intel, better outreach, better deals",
    ],
    example: "Q1: 3 new clients from Specter outreach. 2 from Pulse inbound. 1 referral (Striker follow-up kept warm).",
    withoutCost: "Without the system: you close deals through hustle and referrals. Ceiling is low.",
  },
  {
    id: "monitoring",
    label: "MONITORING",
    sublabel: "24/7 system health",
    agent: "SENTINEL",
    agentColor: "text-sky-400",
    nodeColor: "text-sky-400",
    nodeBg: "bg-sky-500/10",
    nodeBorder: "border-sky-500/30",
    agentActions: [
      "Checks website uptime and speed every hour",
      "Monitors competitor pricing pages for changes",
      "Alerts on competitor product launches or updates",
      "Runs weekly security and performance audits",
    ],
    example: "Alert: Nexus AI updated their pricing. New $399/mo Enterprise tier. Flagged for repositioning review.",
    withoutCost: "Without this: you find out a competitor launched something when a prospect mentions it in a call.",
  },
];

export default function StackDiagram() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {nodes.map((node, i) => {
        const isExpanded = expanded === node.id;
        const isLast = i === nodes.length - 1;

        return (
          <div key={node.id}>
            <button
              onClick={() => setExpanded(isExpanded ? null : node.id)}
              className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                isExpanded ? `${node.nodeBg} ${node.nodeBorder}` : "bg-[#111111] border-[#262626] hover:border-[#404040]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg ${node.nodeBg} border ${node.nodeBorder} flex items-center justify-center flex-shrink-0`}>
                    <span className={`font-mono font-bold text-xs ${node.nodeColor}`}>{i + 1}</span>
                  </div>
                  <div>
                    <div className={`font-bold text-sm sm:text-base ${node.nodeColor}`}>{node.label}</div>
                    <div className="text-neutral-500 text-xs sm:text-sm">{node.sublabel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {node.agent && (
                    <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium ${node.nodeBg} ${node.nodeBorder} ${node.agentColor}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {node.agent}
                    </div>
                  )}
                  <svg
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-neutral-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#1a1a1a] grid sm:grid-cols-2 gap-4 text-left" onClick={(e) => e.stopPropagation()}>
                  <div>
                    {node.agent && (
                      <div className={`flex items-center gap-2 mb-3 text-sm font-medium ${node.agentColor}`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        Handled by {node.agent}
                      </div>
                    )}
                    <ul className="space-y-1.5">
                      {node.agentActions.map((action, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-neutral-400">
                          <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#0A0A0A] rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1.5 font-mono">EXAMPLE OUTPUT</div>
                      <p className="text-sm text-neutral-300 italic">{node.example}</p>
                    </div>
                    <div className="bg-[#100808] border border-red-900/20 rounded-xl p-4">
                      <div className="text-xs text-red-500/70 mb-1.5 font-mono">WITHOUT THIS NODE</div>
                      <p className="text-sm text-neutral-500">{node.withoutCost}</p>
                    </div>
                  </div>
                </div>
              )}
            </button>

            {!isLast && (
              <div className="flex justify-center py-1">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-3 bg-gradient-to-b from-neutral-700 to-transparent" />
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-neutral-700">
                    <path d="M6 7L1 1h10L6 7z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Loop back arrow */}
      <div className="mt-4 flex items-center gap-3 text-xs text-neutral-600 font-mono p-3 border border-[#1a1a1a] rounded-xl">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500/50 flex-shrink-0">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 1 0 .49-3.45"/>
        </svg>
        SENTINEL and CORTEX feed intel back to PULSE — competitor moves become content, market shifts become positioning. The system gets smarter every week.
      </div>
    </div>
  );
}
