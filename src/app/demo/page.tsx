"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { prompts, getPromptBySlug, categories, type PromptData, type Category } from "./workflowData";
import FounderTerminal from "@/components/FounderTerminal";

const WorkflowVisualizer = dynamic(() => import("./WorkflowVisualizer"), { ssr: false });

/* ─── Haptic helper ─── */
function haptic(ms = 15) {
  try { navigator?.vibrate?.(ms); } catch {}
}

/* ─── Chat Simulation ─── */
function ChatInput({
  promptText,
  brainResponse,
  onTypingComplete,
}: {
  promptText: string;
  brainResponse: string;
  onTypingComplete: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [sendPulse, setSendPulse] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayedText("");
    setShowThinking(false);
    setShowResponse(false);
    setSendPulse(false);

    if (!promptText) return;

    let i = 0;
    const typeChar = () => {
      if (i < promptText.length) {
        setDisplayedText(promptText.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(typeChar, 30 + Math.random() * 30);
      } else {
        setSendPulse(true);
        setTimeout(() => {
          setShowThinking(true);
          setTimeout(() => {
            setShowThinking(false);
            setShowResponse(true);
            setTimeout(onTypingComplete, 800);
          }, 1200);
        }, 500);
      }
    };
    typingRef.current = setTimeout(typeChar, 300);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [promptText, brainResponse, onTypingComplete]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${displayedText ? "text-white" : "text-[#444]"} truncate`}>
            {displayedText || "Tell Ultron what you need..."}
            {displayedText && displayedText.length < (promptText?.length || 0) && (
              <span className="cursor-blink text-[#DA4E24]">|</span>
            )}
          </p>
        </div>
        <button
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
            sendPulse
              ? "bg-[#DA4E24] shadow-[0_0_12px_rgba(218,78,36,0.5)]"
              : "bg-[#111] border border-[#222]"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sendPulse ? "white" : "#555"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {(showThinking || showResponse) && (
        <div className="mt-3 pl-11">
          {showThinking && !showResponse && (
            <div className="flex items-center gap-2 text-sm text-[#555]">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
              Analyzing...
            </div>
          )}
          {showResponse && (
            <p className="text-sm text-[#ccc] animate-fade-in">{brainResponse}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Share Modal ─── */
function ShareModal({ prompt, onClose }: { prompt: PromptData; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://work.51ultron.com/demo?prompt=${prompt.slug}`;
  const tweetText = `Watch 5 AI agents execute "${prompt.prompt}" in real time. This is insane.`;
  const whatsappText = `This broke my brain. Watch AI agents execute "${prompt.prompt}" in real time: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 max-w-md w-full animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#555] hover:text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h3 className="text-lg font-bold text-white mb-4">Share this demo</h3>

        {/* URL with copy */}
        <div className="flex items-center gap-2 mb-4">
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs font-terminal text-[#999] outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#222] rounded-lg text-xs text-white transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Social buttons */}
        <div className="space-y-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl text-sm text-white transition-colors"
          >
            <span className="text-[#999]">X</span>
            <span className="text-xs text-[#666] truncate">{tweetText}</span>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl text-sm text-white transition-colors"
          >
            <span className="text-[#25D366]">WhatsApp</span>
            <span className="text-xs text-[#666]">Share via WhatsApp</span>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(tweetText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3 bg-[#111] hover:bg-[#1a1a1a] border border-[#1a1a1a] rounded-xl text-sm text-white transition-colors"
          >
            <span className="text-[#0088cc]">Telegram</span>
            <span className="text-xs text-[#666]">Share via Telegram</span>
          </a>
        </div>

        <p className="text-xs text-[#444] mt-4 text-center">Pro tip: Screen record this demo for maximum impact</p>
      </div>
    </div>
  );
}

/* ─── Prompt Card ─── */
function PromptCard({
  prompt,
  onClick,
  selected,
}: {
  prompt: PromptData;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => { haptic(); onClick(); }}
      className={`relative text-left w-full p-4 sm:p-5 rounded-xl border transition-all duration-200 group ${
        selected
          ? "bg-[#111] border-[#DA4E24] shadow-[0_0_16px_rgba(218,78,36,0.2)]"
          : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#DA4E24]/40 hover:shadow-[0_0_12px_rgba(218,78,36,0.1)] hover:-translate-y-[3px]"
      }`}
    >
      {/* Most Popular badge */}
      {prompt.popular && (
        <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#DA4E24] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
          Most Popular
        </span>
      )}

      <p className="text-sm sm:text-base font-semibold text-white leading-snug mb-2 pr-6">
        &ldquo;{prompt.prompt}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1a1a] text-[10px] font-terminal text-[#DA4E24] uppercase tracking-wider group-hover:shadow-[0_0_8px_rgba(218,78,36,0.15)]">
          {prompt.tags}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#222] group-hover:text-[#DA4E24] transition-colors opacity-0 group-hover:opacity-100">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  );
}

/* ─── Category Tabs ─── */
function CategoryTabs({ active, onChange }: { active: Category; onChange: (c: Category) => void }) {
  return (
    <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            active === cat.id
              ? "bg-[#DA4E24] text-white"
              : "bg-[#111] text-[#666] hover:text-[#999] border border-[#1a1a1a] hover:border-[#333]"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Live Stats Bar ─── */
const LAUNCH_DATE = new Date("2025-12-15").getTime();

function getBaseStats() {
  const daysSinceLaunch = (Date.now() - LAUNCH_DATE) / (1000 * 60 * 60 * 24);
  return {
    agentsDeployed: Math.floor(47 + daysSinceLaunch * 1.8),
    tasksCompleted: Math.floor(840 + daysSinceLaunch * 62),
    apiCalls: Math.floor(9200 + daysSinceLaunch * 480),
    moneySaved: Math.floor(18500 + daysSinceLaunch * 950),
  };
}

function LiveStatsBar() {
  const [stats, setStats] = useState(getBaseStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        agentsDeployed: prev.agentsDeployed + (Math.random() > 0.92 ? 1 : 0),
        tasksCompleted: prev.tasksCompleted + (Math.random() > 0.7 ? 1 : 0),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 3),
        moneySaved: prev.moneySaved + (Math.random() > 0.6 ? Math.floor(Math.random() * 18) + 5 : 0),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Agents Deployed", value: stats.agentsDeployed.toLocaleString() },
    { label: "Tasks Completed", value: stats.tasksCompleted.toLocaleString() },
    { label: "API Calls", value: stats.apiCalls.toLocaleString() },
    { label: "Money Saved", value: `$${stats.moneySaved.toLocaleString()}` },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-soft" />
        <span className="text-[10px] font-medium text-green-600 uppercase tracking-widest">Live</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#1a1a1a]">
        {items.map((item) => (
          <div key={item.label} className="bg-[#0A0A0A] p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-white font-terminal transition-all duration-700">{item.value}</div>
            <div className="text-[11px] text-[#555] mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Inner content that uses useSearchParams ─── */
function DemoContent() {
  const searchParams = useSearchParams();
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [showShareModal, setShowShareModal] = useState(false);
  const workflowRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const filteredPrompts = activeCategory === "all"
    ? prompts
    : prompts.filter((p) => p.category === activeCategory);

  // URL parameter handling
  useEffect(() => {
    const slug = searchParams.get("prompt");
    if (slug) {
      const found = getPromptBySlug(slug);
      if (found) {
        setSelectedPrompt(found);
        setTimeout(() => {
          setWorkflowStarted(true);
          haptic(20);
          setTimeout(() => {
            workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }, 500);
      }
    }
  }, [searchParams]);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Escape: back to grid
      if (e.key === "Escape" && workflowStarted) {
        handleReset();
        return;
      }

      // R: replay
      if (e.key === "r" && workflowComplete && selectedPrompt) {
        handleReplay();
        return;
      }

      // Number keys for prompt selection
      let promptIndex = -1;
      if (e.shiftKey) {
        // Shift+1-0 = prompts 11-20
        const shiftMap: Record<string, number> = { "!": 10, "@": 11, "#": 12, "$": 13, "%": 14, "^": 15, "&": 16, "*": 17, "(": 18, ")": 19 };
        if (shiftMap[e.key] !== undefined) promptIndex = shiftMap[e.key];
      } else {
        // 1-9, 0 = prompts 1-10
        if (e.key >= "1" && e.key <= "9") promptIndex = parseInt(e.key) - 1;
        if (e.key === "0") promptIndex = 9;
      }

      if (promptIndex >= 0 && promptIndex < prompts.length && !workflowStarted) {
        handlePromptSelect(prompts[promptIndex]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [workflowStarted, workflowComplete, selectedPrompt]);

  const handlePromptSelect = useCallback((prompt: PromptData) => {
    setSelectedPrompt(prompt);
    setWorkflowStarted(false);
    setWorkflowComplete(false);
    haptic();
    // Scroll to chat bar so user sees the typewriter animation
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setWorkflowStarted(true);
    haptic(20);
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, []);

  const handleWorkflowComplete = useCallback(() => {
    setWorkflowComplete(true);
    haptic(20);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPrompt(null);
    setWorkflowStarted(false);
    setWorkflowComplete(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState({}, "", "/demo");
  }, []);

  const handleReplay = useCallback(() => {
    if (!selectedPrompt) return;
    setWorkflowStarted(false);
    setWorkflowComplete(false);
    // Re-trigger after a tick
    setTimeout(() => {
      setWorkflowStarted(true);
      haptic(20);
      setTimeout(() => {
        workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }, 100);
  }, [selectedPrompt]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Live Stats */}
      <LiveStatsBar />

      {/* Hero */}
      <div
        className={`text-center mb-10 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#2a2a2a] rounded-full px-3 py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#999] text-xs font-medium">Interactive Demo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          See Ultron execute in real time.
        </h1>
        <p className="text-lg text-[#999] max-w-md mx-auto">
          Pick a command. Watch every agent work.
        </p>
        <p className="text-xs text-[#444] mt-2">{prompts.length} workflows available</p>
      </div>

      {/* Chat Input */}
      <div
        ref={chatRef}
        className={`mb-10 transition-all duration-500 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <ChatInput
          promptText={selectedPrompt?.prompt || ""}
          brainResponse={selectedPrompt?.brainResponse || ""}
          onTypingComplete={handleTypingComplete}
        />
      </div>

      {/* Prompt Grid */}
      {!workflowStarted && (
        <div
          className={`transition-all duration-500 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredPrompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onClick={() => handlePromptSelect(p)}
                selected={selectedPrompt?.id === p.id}
              />
            ))}
          </div>
          <p className="text-center text-[10px] text-[#333] mt-4">Press 1-0 to quick-select prompts. Shift+1-0 for 11-20.</p>
        </div>
      )}

      {/* Controls when workflow is running */}
      {workflowStarted && (
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-[#999] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Try another prompt
          </button>
          {workflowComplete && (
            <>
              <button
                onClick={handleReplay}
                className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-[#DA4E24] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Replay
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="inline-flex items-center gap-2 text-xs text-[#555] hover:text-[#1F77F6] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share this demo
              </button>
            </>
          )}
        </div>
      )}

      {/* Workflow Visualizer */}
      {workflowStarted && selectedPrompt && (
        <div ref={workflowRef} className="scroll-mt-20">
          <WorkflowVisualizer
            key={selectedPrompt.id}
            prompt={selectedPrompt}
            onComplete={handleWorkflowComplete}
          />
        </div>
      )}

      {/* Try Another Prompt */}
      {workflowComplete && (
        <div className="mt-16 text-center animate-fade-up">
          <p className="text-sm text-[#555] mb-3">Want to see more?</p>
          <button
            onClick={handleReset}
            className="text-[#DA4E24] hover:text-[#e8633f] text-sm font-medium transition-colors"
          >
            Try another prompt &rarr;
          </button>
        </div>
      )}

      {/* Founder Terminal */}
      <div className="mt-12">
        <FounderTerminal />
      </div>

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center">
        <p className="text-[#555] text-xs">&copy; 2026 Powered by NXT Enterprises</p>
      </footer>

      {/* Share Modal */}
      {showShareModal && selectedPrompt && (
        <ShareModal prompt={selectedPrompt} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}

/* ─── Page wrapper with Suspense for useSearchParams ─── */
export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#2a2a2a] rounded-full px-3 py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#999] text-xs font-medium">Interactive Demo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          See Ultron execute in real time.
        </h1>
        <p className="text-lg text-[#999] max-w-md mx-auto">Loading demo...</p>
      </div>
    }>
      <DemoContent />
    </Suspense>
  );
}
