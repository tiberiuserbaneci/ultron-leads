"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PromptData, AgentBranch, WorkflowNode, NodeIcon } from "./workflowData";
import { nodeCostMap } from "./workflowData";
import { trackCtaClicked, trackDemoClicked } from "@/lib/analytics";

/* ─── Icon Components ─── */
function NodeIconSvg({ icon, size = 14 }: { icon: NodeIcon; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (icon) {
    case "search":
      return <svg {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "person":
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "code":
      return <svg {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case "database":
      return <svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "chart":
      return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "content":
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case "linkedin":
      return <svg {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

/* ─── Agent Avatar Icons ─── */
function AgentAvatar({ agent, status }: { agent: string; status: "waiting" | "active" | "complete" }) {
  const size = 16;
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const color = status === "complete" ? "#22c55e" : status === "active" ? "#DA4E24" : "#333";
  const glowClass = status === "active" ? "agent-avatar-glow" : "";

  const icon = (() => {
    switch (agent) {
      case "CORTEX": // brain/lightbulb
        return <svg {...props} stroke={color}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>;
      case "SPECTER": // crosshair/target
        return <svg {...props} stroke={color}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
      case "STRIKER": // lightning bolt
        return <svg {...props} stroke={color}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
      case "PULSE": // broadcast/megaphone
        return <svg {...props} stroke={color}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>;
      case "SENTINEL": // shield/eye
        return <svg {...props} stroke={color}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2"/></svg>;
      default:
        return <svg {...props} stroke={color}><circle cx="12" cy="12" r="10"/></svg>;
    }
  })();

  return <span className={`inline-flex ${glowClass}`}>{icon}</span>;
}

/* ─── Hover Preview Tooltip ─── */
function HoverPreview({ text, visible }: { text: string; visible: boolean }) {
  if (!visible || !text) return null;
  return (
    <div className="absolute z-20 left-0 top-full mt-1 p-2.5 bg-[#111] border border-[#2a2a2a] rounded-lg shadow-xl max-w-[250px] animate-fade-in pointer-events-none">
      <pre className="text-[10px] font-terminal text-[#999] whitespace-pre-wrap leading-relaxed">{text}</pre>
    </div>
  );
}

/* ─── Single Workflow Node ─── */
function WorkflowNodeCard({ node, active, complete }: { node: WorkflowNode; active: boolean; complete: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${
        complete
          ? "bg-[#111] border-[#1a1a1a]"
          : active
          ? "bg-[#111] border-[#DA4E24] shadow-[0_0_12px_rgba(218,78,36,0.3)]"
          : "bg-[#0a0a0a] border-[#111] opacity-30"
      }`}
      onMouseEnter={() => complete && node.hoverPreview && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex-shrink-0 mt-0.5 ${active ? "text-[#DA4E24]" : complete ? "text-[#666]" : "text-[#333]"}`}>
        <NodeIconSvg icon={node.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-terminal text-[#555]">{node.tool}</span>
          {complete && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
        <p className={`text-sm leading-snug ${active || complete ? "text-[#ccc]" : "text-[#444]"}`}>{node.text}</p>
      </div>
      <HoverPreview text={node.hoverPreview || ""} visible={hovered} />
    </div>
  );
}

/* ─── Connection Line with particle trail ─── */
function ConnectionLine({ active, crossAgent }: { active: boolean; crossAgent?: boolean }) {
  const color = crossAgent ? "#1F77F6" : active ? "#DA4E24" : "#222";
  return (
    <div className="flex justify-start pl-6 py-0.5">
      <div className="relative w-0.5 h-5" style={{ background: color, opacity: active ? 1 : 0.3 }}>
        {active && (
          <div className="data-packet-container">
            <div
              className="absolute w-1.5 h-1.5 rounded-full -left-[2px]"
              style={{
                background: crossAgent ? "#1F77F6" : "#DA4E24",
                boxShadow: `0 0 6px ${crossAgent ? "#1F77F6" : "#DA4E24"}`,
                animation: "dataPacket 0.8s ease-in-out",
              }}
            />
            {/* Particle trail */}
            <div className="absolute w-1 h-1 rounded-full -left-[1px] opacity-40" style={{ background: crossAgent ? "#1F77F6" : "#DA4E24", animation: "dataPacket 0.8s ease-in-out 0.1s" }} />
            <div className="absolute w-0.5 h-0.5 rounded-full -left-[0px] opacity-20" style={{ background: crossAgent ? "#1F77F6" : "#DA4E24", animation: "dataPacket 0.8s ease-in-out 0.2s" }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Agent Branch ─── */
function AgentBranchView({
  branch,
  activeNodeIndex,
  elapsed,
}: {
  branch: AgentBranch;
  activeNodeIndex: number;
  elapsed: number;
}) {
  const branchStarted = elapsed >= branch.startDelay;
  const status: "waiting" | "active" | "complete" =
    !branchStarted ? "waiting" : activeNodeIndex >= branch.nodes.length ? "complete" : "active";

  return (
    <div className={`transition-opacity duration-500 ${branchStarted ? "opacity-100" : "opacity-40"}`}>
      {/* Agent Header */}
      <div className="flex items-center gap-2 mb-3">
        <AgentAvatar agent={branch.agent} status={status} />
        <span className="text-sm font-bold text-[#DA4E24]">{branch.agent}</span>
        <span className="text-xs text-[#555]">{branch.subtitle}</span>
      </div>

      {/* Nodes */}
      <div className="space-y-0">
        {branch.nodes.map((node, i) => {
          const nodeComplete = i < activeNodeIndex;
          const nodeActive = i === activeNodeIndex;
          return (
            <div key={node.id}>
              {i > 0 && <ConnectionLine active={nodeComplete || nodeActive} />}
              <WorkflowNodeCard node={node} active={nodeActive} complete={nodeComplete} />
            </div>
          );
        })}
      </div>

      {/* Cross-agent data flow indicator */}
      {branch.sendsDataTo && status === "complete" && (
        <div className="flex items-center gap-2 mt-2 pl-6">
          <div className="w-0.5 h-4 bg-[#1F77F6]" />
          <span className="text-xs text-[#1F77F6] font-terminal">Data sent to {branch.sendsDataTo}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Timeline Entry ─── */
function TimelineEntryView({ entry, visible }: { entry: { time: string; agent: string; text: string }; visible: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 py-2.5 border-b border-[#111] transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
      }`}
    >
      <span className="text-xs font-terminal text-[#555] flex-shrink-0 w-16 mt-0.5">{entry.time}</span>
      <span className="text-xs font-bold flex-shrink-0 w-20 mt-0.5 text-[#DA4E24]">{entry.agent}</span>
      <span className="text-sm text-[#ccc] leading-snug">{entry.text}</span>
    </div>
  );
}

/* ─── Timer Display ─── */
function Timer({ elapsed, complete }: { elapsed: number; complete: boolean }) {
  const secs = Math.floor(elapsed / 1000);
  const mins = Math.floor(secs / 60);
  const display = `${String(mins).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <div className={`flex items-center gap-1.5 text-xs font-terminal ${complete ? "text-green-500" : "text-[#555]"}`}>
      <span>&#9201;</span>
      <span>{display}</span>
    </div>
  );
}

/* ─── Output Panel ─── */
function OutputPanel({
  items,
  summary,
  complete,
  costSaved,
  elapsed,
}: {
  items: { icon: NodeIcon; text: string; count?: number }[];
  summary: PromptData["summary"];
  complete: boolean;
  costSaved: number;
  elapsed: number;
}) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${complete ? "bg-green-500" : "bg-[#DA4E24] pulse-soft"}`} />
          <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">Live Output</span>
        </div>
        <Timer elapsed={elapsed} complete={complete} />
      </div>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="text-[#DA4E24] flex-shrink-0">
              <NodeIconSvg icon={item.icon} size={12} />
            </div>
            <span className="text-sm text-[#ccc]">
              {item.count !== undefined && (
                <span className="font-terminal font-bold text-white mr-1">
                  {item.count === 14500 ? "$14,500" : item.count}
                </span>
              )}
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Cost saved counter */}
      {costSaved > 0 && (
        <div className="mt-4 pt-3 border-t border-[#111]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#555]">Money saved so far</span>
            <span className="text-sm font-terminal font-bold text-[#DA4E24]">${costSaved.toLocaleString()}</span>
          </div>
        </div>
      )}

      {complete && (
        <div className={`mt-4 pt-4 border-t border-[#1a1a1a] ${complete ? "summary-complete-anim" : ""}`}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-white font-terminal">{summary.actions}</div>
              <div className="text-xs text-[#555]">actions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white font-terminal">{Math.floor(elapsed / 1000)}s</div>
              <div className="text-xs text-[#555]">execution</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#DA4E24] font-terminal">${costSaved.toLocaleString()}</div>
              <div className="text-xs text-[#555]">saved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Summary Card ─── */
function SummaryCard({ prompt, elapsed, costSaved }: { prompt: PromptData; elapsed: number; costSaved: number }) {
  return (
    <div className="mt-8 summary-complete-anim">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 text-center">
        <p className="text-lg sm:text-xl font-semibold text-white mb-2">
          {prompt.summary.actions} actions executed across {prompt.agentNames.length} departments in {Math.floor(elapsed / 1000)} seconds.
        </p>
        <p className="text-[#999] mb-6">
          A human team would take {prompt.summary.humanTime} and cost {prompt.summary.humanCost}.
        </p>

        <a
          href="https://app.51ultron.com/signup"
          onClick={() => { trackDemoClicked("demo_workflow"); trackCtaClicked("Deploy this for your business", "demo_workflow", "https://app.51ultron.com/signup"); }}
          className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all inline-flex items-center gap-2"
        >
          Deploy this for your business
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>

        <p className="text-xs text-[#555] mt-4">Free plan. No credit card required.</p>
      </div>

      {/* Cross-page links */}
      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        {[
          { label: "See the full agent architecture", href: "/blueprint" },
          { label: "Read 72 hours of real output", href: "/72hours" },
          { label: "Calculate what you're spending manually", href: "/calculator" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center justify-between gap-2 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333] hover:bg-[#111] transition-all group text-sm text-[#999] hover:text-white"
          >
            <span>{link.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#333] group-hover:text-[#DA4E24] transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN WORKFLOW VISUALIZER ─── */
export default function WorkflowVisualizer({ prompt, onComplete }: { prompt: PromptData; onComplete: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [outputItems, setOutputItems] = useState<{ icon: NodeIcon; text: string; count?: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [costSaved, setCostSaved] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);
  const outputTracker = useRef<Set<string>>(new Set());
  const costTracker = useRef<Set<string>>(new Set());
  const completeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll state
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Calculate total workflow duration
  const getTotalDuration = useCallback(() => {
    if (prompt.type === "timeline" && prompt.timeline) {
      const lastEntry = prompt.timeline[prompt.timeline.length - 1];
      return lastEntry.delay + 1500;
    }
    if (prompt.branches) {
      let maxEnd = 0;
      for (const branch of prompt.branches) {
        const lastNode = branch.nodes[branch.nodes.length - 1];
        const branchEnd = branch.startDelay + lastNode.delay + 1500;
        if (branchEnd > maxEnd) maxEnd = branchEnd;
      }
      return maxEnd;
    }
    return 10000;
  }, [prompt]);

  // Get active node index for a branch
  const getActiveNodeIndex = useCallback((branch: AgentBranch, currentElapsed: number) => {
    if (currentElapsed < branch.startDelay) return -1;
    const branchElapsed = currentElapsed - branch.startDelay;
    let activeIndex = -1;
    for (let i = 0; i < branch.nodes.length; i++) {
      if (branchElapsed >= branch.nodes[i].delay) {
        activeIndex = i;
      }
    }
    if (activeIndex === branch.nodes.length - 1) {
      const lastNodeTime = branchElapsed - branch.nodes[activeIndex].delay;
      if (lastNodeTime > 1200) return branch.nodes.length;
    }
    return activeIndex;
  }, []);

  // Check for new output updates + cost tracking
  const checkOutputUpdates = useCallback((currentElapsed: number) => {
    if (!prompt.branches) return;
    const newItems: { icon: NodeIcon; text: string; count?: number }[] = [];
    let newCost = 0;

    for (const branch of prompt.branches) {
      const activeIdx = getActiveNodeIndex(branch, currentElapsed);

      // Cost tracking: count cost for each completed node
      for (let i = 0; i < branch.nodes.length; i++) {
        if (i < activeIdx) {
          const nodeKey = branch.nodes[i].id;
          if (!costTracker.current.has(nodeKey)) {
            costTracker.current.add(nodeKey);
            newCost += nodeCostMap[branch.nodes[i].icon] || 150;
          }
        }
      }

      for (const update of branch.outputUpdates) {
        if (outputTracker.current.has(update.afterNodeId + update.text)) continue;
        const nodeIdx = branch.nodes.findIndex((n) => n.id === update.afterNodeId);
        if (nodeIdx >= 0 && activeIdx > nodeIdx) {
          outputTracker.current.add(update.afterNodeId + update.text);
          newItems.push({ icon: update.icon, text: update.text, count: update.count });
        }
      }
    }

    if (newCost > 0) setCostSaved((prev) => prev + newCost);
    if (newItems.length > 0) setOutputItems((prev) => [...prev, ...newItems]);
  }, [prompt, getActiveNodeIndex]);

  // Auto-scroll: track user scroll
  useEffect(() => {
    const handleScroll = () => {
      userScrolledRef.current = true;
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        userScrolledRef.current = false;
      }, 2000);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    startRef.current = performance.now();
    outputTracker.current.clear();
    costTracker.current.clear();
    setOutputItems([]);
    setIsComplete(false);
    setCostSaved(0);
    completeRef.current = false;

    const totalDuration = getTotalDuration();

    const tick = (now: number) => {
      const ms = now - startRef.current;
      setElapsed(ms);
      checkOutputUpdates(ms);

      if (ms >= totalDuration + 2000 && !completeRef.current) {
        completeRef.current = true;
        setIsComplete(true);
        onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [prompt, getTotalDuration, checkOutputUpdates, onComplete]);

  // Timeline output items
  useEffect(() => {
    if (prompt.type !== "timeline" || !prompt.timeline) return;
    const parts = prompt.outputSummary.split(" | ");
    const newItems: { icon: NodeIcon; text: string }[] = [];
    for (const part of parts) {
      newItems.push({ icon: "chart", text: part });
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    newItems.forEach((item, i) => {
      timers.push(
        setTimeout(() => {
          setOutputItems((prev) => {
            if (prev.some((p) => p.text === item.text)) return prev;
            return [...prev, item];
          });
        }, (i + 1) * 1500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [prompt]);

  // Auto-scroll on mobile only — follows workflow one step at a time
  useEffect(() => {
    if (outputItems.length === 0) return;
    // Skip on desktop (lg+ has side-by-side layout, no scroll needed)
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    if (userScrolledRef.current || !containerRef.current) return;

    // Wait for layout to settle, then scroll incrementally
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        // Scroll by at most ~one card height so it follows node-by-node
        window.scrollBy({
          top: Math.min(rect.bottom - window.innerHeight + 40, 140),
          behavior: "smooth",
        });
      }
    });
  }, [outputItems.length]);

  // Timeline cost tracking
  useEffect(() => {
    if (prompt.type !== "timeline" || !prompt.timeline) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    prompt.timeline.forEach((entry, i) => {
      timers.push(
        setTimeout(() => {
          setCostSaved((prev) => prev + 150);
        }, entry.delay + 500)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [prompt]);

  return (
    <div ref={containerRef} className="animate-fade-up">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Workflow Graph */}
        <div className="flex-1 lg:w-[70%]">
          {prompt.type === "branch" && prompt.branches && (
            <div className={`grid gap-6 sm:grid-cols-2 ${isComplete ? "workflow-complete-flash" : ""}`}>
              {prompt.branches.map((branch) => (
                <AgentBranchView
                  key={branch.agent}
                  branch={branch}
                  activeNodeIndex={getActiveNodeIndex(branch, elapsed)}
                  elapsed={elapsed}
                />
              ))}
            </div>
          )}

          {prompt.type === "timeline" && prompt.timeline && (
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#DA4E24] pulse-soft" />
                <span className="text-xs font-semibold text-[#999] uppercase tracking-widest">Activity Timeline</span>
              </div>
              <div>
                {prompt.timeline.map((entry, i) => (
                  <TimelineEntryView key={i} entry={entry} visible={elapsed >= entry.delay} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Output Panel */}
        <div className="lg:w-[30%] lg:sticky lg:top-20 lg:self-start">
          <OutputPanel
            items={outputItems}
            summary={prompt.summary}
            complete={isComplete}
            costSaved={costSaved}
            elapsed={elapsed}
          />
        </div>
      </div>

      {/* Summary Card */}
      {isComplete && <SummaryCard prompt={prompt} elapsed={elapsed} costSaved={costSaved} />}
    </div>
  );
}
