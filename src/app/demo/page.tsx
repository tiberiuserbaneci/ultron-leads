"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { prompts, getPromptBySlug, type PromptData } from "./workflowData";
import ShareButtons from "@/components/ShareButtons";
import FounderTerminal from "@/components/FounderTerminal";

const WorkflowVisualizer = dynamic(() => import("./WorkflowVisualizer"), { ssr: false });

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
    // Reset
    setDisplayedText("");
    setShowThinking(false);
    setShowResponse(false);
    setSendPulse(false);

    if (!promptText) return;

    // Typewriter effect
    let i = 0;
    const typeChar = () => {
      if (i < promptText.length) {
        setDisplayedText(promptText.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(typeChar, 30 + Math.random() * 30);
      } else {
        // Typing complete
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
      {/* Chat input bar */}
      <div className="flex items-center gap-3 p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
        {/* Ultron logo placeholder */}
        <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>

        {/* Text field */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${displayedText ? "text-white" : "text-[#444]"} truncate`}>
            {displayedText || "Tell Ultron what you need..."}
            {displayedText && displayedText.length < (promptText?.length || 0) && (
              <span className="cursor-blink text-[#DA4E24]">|</span>
            )}
          </p>
        </div>

        {/* Send button */}
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

      {/* Brain response */}
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
      onClick={onClick}
      className={`text-left w-full p-4 sm:p-5 rounded-xl border transition-all duration-200 group ${
        selected
          ? "bg-[#111] border-[#DA4E24] shadow-[0_0_16px_rgba(218,78,36,0.2)]"
          : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#DA4E24]/40 hover:shadow-[0_0_12px_rgba(218,78,36,0.1)]"
      }`}
    >
      <p className="text-sm sm:text-base font-semibold text-white leading-snug mb-2">
        &ldquo;{prompt.prompt}&rdquo;
      </p>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a1a1a] text-[10px] font-terminal text-[#DA4E24] uppercase tracking-wider">
        {prompt.tags}
      </span>
    </button>
  );
}

/* ─── Inner content that uses useSearchParams ─── */
function DemoContent() {
  const searchParams = useSearchParams();
  const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);
  const [workflowStarted, setWorkflowStarted] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const workflowRef = useRef<HTMLDivElement>(null);

  // URL parameter handling
  useEffect(() => {
    const slug = searchParams.get("prompt");
    if (slug) {
      const found = getPromptBySlug(slug);
      if (found) {
        setSelectedPrompt(found);
        // Auto-start after short delay
        setTimeout(() => {
          setWorkflowStarted(true);
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

  const handlePromptSelect = useCallback((prompt: PromptData) => {
    setSelectedPrompt(prompt);
    setWorkflowStarted(false);
    setWorkflowComplete(false);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setWorkflowStarted(true);
    setTimeout(() => {
      workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, []);

  const handleWorkflowComplete = useCallback(() => {
    setWorkflowComplete(true);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPrompt(null);
    setWorkflowStarted(false);
    setWorkflowComplete(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Clean URL
    window.history.replaceState({}, "", "/demo");
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
      </div>

      {/* Chat Input */}
      <div
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
          <div className="grid sm:grid-cols-2 gap-3">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onClick={() => handlePromptSelect(p)}
                selected={selectedPrompt?.id === p.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reset button when workflow is running */}
      {workflowStarted && (
        <div className="flex justify-center mb-6">
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

      {/* Share Section */}
      {workflowComplete && (
        <div className="mt-12 text-center animate-fade-up">
          <p className="text-sm text-[#666] mb-4">Know a founder who needs to see this?</p>
          <ShareButtons page="demo" />
        </div>
      )}

      {/* Founder Terminal */}
      <div className="mt-12">
        <FounderTerminal />
      </div>
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
