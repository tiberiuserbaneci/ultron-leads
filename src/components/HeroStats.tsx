"use client";

import { useState, useEffect } from "react";

/* ───────────────────────── Live Stats ───────────────────────── */
/*
  Anchored to March 20 2026 — 2,560 founders, +90/day.
  Each founder → 5 agents, ~5 tasks/day, ~100 API calls/day, ~$30 saved/day.
*/
const STATS_BASE_DATE = new Date("2026-03-20T00:00:00Z").getTime();
const STATS_BASE = {
  founders: 2560,
  agents: 12800,
  tasks: 89600,
  apiCalls: 640000,
  saved: 256000,
};
const STATS_PER_MS = {
  founders: 90 / 86400000,
  agents: 450 / 86400000,
  tasks: 12800 / 86400000,
  apiCalls: 256000 / 86400000,
  saved: 76800 / 86400000,
};

export function useLiveStats() {
  const [stats, setStats] = useState(() => computeStats());

  function computeStats() {
    const elapsed = Date.now() - STATS_BASE_DATE;
    return {
      founders: Math.floor(STATS_BASE.founders + elapsed * STATS_PER_MS.founders),
      agents: Math.floor(STATS_BASE.agents + elapsed * STATS_PER_MS.agents),
      tasks: Math.floor(STATS_BASE.tasks + elapsed * STATS_PER_MS.tasks),
      apiCalls: Math.floor(STATS_BASE.apiCalls + elapsed * STATS_PER_MS.apiCalls),
      saved: Math.floor(STATS_BASE.saved + elapsed * STATS_PER_MS.saved),
    };
  }

  useEffect(() => {
    const id = setInterval(() => setStats(computeStats()), 3000);
    return () => clearInterval(id);
  }, []);

  return stats;
}

export default function HeroStats() {
  const live = useLiveStats();

  const stats = [
    { value: live.founders, label: "founders", format: (v: number) => v.toLocaleString(), mobileHide: false },
    { value: live.agents, label: "agents", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toLocaleString(), mobileHide: true },
    { value: live.tasks, label: "tasks", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toLocaleString(), mobileHide: false },
    { value: live.apiCalls, label: "API calls", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString(), mobileHide: true },
    { value: live.saved, label: "saved", format: (v: number) => `$${v >= 1000 ? `${Math.round(v / 1000)}K` : v}`, mobileHide: true },
  ];

  return (
    <>
      {stats.map((stat) => (
        <span key={stat.label} className={`inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] ${stat.mobileHide ? "hidden sm:inline-flex" : ""}`}>
          <span className="text-white font-semibold tabular-nums transition-all duration-700">{stat.format(stat.value)}</span>
          <span className="text-[#e0e0e0]">{stat.label}</span>
        </span>
      ))}
    </>
  );
}
