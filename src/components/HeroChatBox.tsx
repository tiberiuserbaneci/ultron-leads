"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const PROMPTS = [
  "Generate weekly sales summary report for Q1",
  "Create CRM contact from emails",
  "Build a landing page for our new product launch",
  "Analyze competitor pricing and create comparison",
  "Draft outreach emails for 50 potential leads",
  "Create a social media content calendar for March",
  "Set up automated follow-up sequence for cold leads",
  "Design a referral program with tiered rewards",
];

const MODELS = [
  { label: "Claude Sonnet 4", logo: "/logo claude.png" },
  { label: "Claude Code", logo: "/logo claude code.png" },
  { label: "OpenClaw", logo: "/logo openclaw.png" },
];

const TOOLS_MENU = [
  { label: "Command Center", href: "https://work.51ultron.com/live/" },
  { label: "Client Engine", href: "https://work.51ultron.com/client-engine/" },
  { label: "Agents Map", href: "https://work.51ultron.com/agents-map/" },
  { label: "ROI Calculator", href: "https://work.51ultron.com/calculator/" },
  { label: "Resources", href: "https://catalinfetean.substack.com/" },
];

function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
        fill="#DA4E24"
      />
    </svg>
  );
}

export default function HeroChatBox({
  onSwitchToWorkMode,
  demoMode,
}: {
  onSwitchToWorkMode?: () => void;
  demoMode?: boolean;
}) {
  const [displayText, setDisplayText] = useState("");
  const [userText, setUserText] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const promptIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  const typeNext = useCallback(() => {
    const currentPrompt = PROMPTS[promptIndex.current];
    if (charIndex.current < currentPrompt.length) {
      setDisplayText(currentPrompt.slice(0, charIndex.current + 1));
      charIndex.current++;
      timeoutRef.current = setTimeout(typeNext, 40 + Math.random() * 40);
    } else {
      timeoutRef.current = setTimeout(() => {
        promptIndex.current = (promptIndex.current + 1) % PROMPTS.length;
        charIndex.current = 0;
        setDisplayText("");
        timeoutRef.current = setTimeout(typeNext, 400);
      }, 2500);
    }
  }, []);

  useEffect(() => {
    if (!isUserTyping) {
      timeoutRef.current = setTimeout(typeNext, 600);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isUserTyping, typeNext]);

  // Close menus on outside click
  useEffect(() => {
    if (!menuOpen && !modelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (modelOpen && modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, modelOpen]);

  const handleFocus = () => {
    setIsUserTyping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayText("");
  };

  const handleBlur = () => {
    if (!userText) {
      setIsUserTyping(false);
      promptIndex.current = (promptIndex.current + 1) % PROMPTS.length;
      charIndex.current = 0;
    }
  };

  return (
    <div className="relative max-w-[600px] mx-auto">
      {/* Gradient border + glow */}
      <div className="rounded-2xl p-[1.5px] bg-gradient-to-b from-[#DA4E24]/60 via-[#DA4E24]/30 to-[#1F77F6]/40 shadow-[0_0_80px_rgba(218,78,36,0.2)]">
        <div className="bg-[#0c0c0c] rounded-2xl p-5">
          {/* Top row: model selector + globe */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative" ref={modelRef}>
              <button
                onClick={() => setModelOpen(!modelOpen)}
                className="flex items-center gap-2 border border-[#333] rounded-full px-3 py-1.5 hover:border-[#555] transition-colors"
              >
                <Image
                  src={MODELS[selectedModel].logo}
                  alt=""
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="text-sm font-medium text-white">{MODELS[selectedModel].label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[#666] transition-transform ${modelOpen ? "rotate-180" : ""}`}>
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Model dropdown */}
              {modelOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#0a0a0a] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-up z-50">
                  {MODELS.map((model, i) => (
                    <button
                      key={model.label}
                      onClick={() => { setSelectedModel(i); setModelOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        i === selectedModel
                          ? "text-white bg-[#1a1a1a]"
                          : "text-[#ccc] hover:bg-[#1a1a1a] hover:text-white"
                      } ${i < MODELS.length - 1 ? "border-b border-[#1a1a1a]" : ""}`}
                    >
                      <Image src={model.logo} alt="" width={18} height={18} className="rounded-sm flex-shrink-0" />
                      {model.label}
                      {i === selectedModel && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Globe icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#555]">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Text input area */}
          <div className="relative mb-5 min-h-[32px]">
            {!isUserTyping && !userText && (
              <p className="text-[#999] text-[15px] leading-relaxed">
                {displayText}
                <span className="inline-block w-[2px] h-[16px] bg-[#DA4E24] ml-[1px] align-middle animate-pulse" />
              </p>
            )}
            {(isUserTyping || userText) && (
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-transparent text-white text-[15px] outline-none placeholder:text-[#555]"
                placeholder="Ask Ultron anything..."
                autoFocus={isUserTyping}
              />
            )}
            {!isUserTyping && (
              <input
                type="text"
                onFocus={handleFocus}
                className="absolute inset-0 w-full h-full bg-transparent opacity-0 cursor-text"
                tabIndex={0}
              />
            )}
          </div>

          {/* Bottom row: + menu + work mode */}
          <div className="flex items-center justify-between">
            {/* + Button with dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  menuOpen
                    ? "bg-[#DA4E24] text-white"
                    : "bg-[#1a1a1a] text-[#999] border border-[#333] hover:border-[#555] hover:text-white"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#0a0a0a] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-up z-50">
                  {TOOLS_MENU.map((item, i) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm text-[#ccc] hover:bg-[#1a1a1a] hover:text-white transition-colors ${
                        i < TOOLS_MENU.length - 1 ? "border-b border-[#1a1a1a]" : ""
                      }`}
                    >
                        {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Switch to Work Mode / Back to Overview */}
            {onSwitchToWorkMode && (
              <button
                onClick={onSwitchToWorkMode}
                className={`group flex items-center gap-2 text-sm font-semibold rounded-lg px-4 py-2 transition-all ${
                  demoMode
                    ? "text-[#999] border border-[#333] hover:border-[#555] hover:text-white"
                    : "text-white bg-gradient-to-r from-[#DA4E24] to-[#e8633f] shadow-[0_0_20px_rgba(218,78,36,0.4)] hover:shadow-[0_0_28px_rgba(218,78,36,0.6)] animate-pulse-soft"
                }`}
              >
                {demoMode ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to overview
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Switch to Work Mode
                  </>
                )}
              </button>
            )}

            {/* Fallback: plain Send when not on landing page */}
            {!onSwitchToWorkMode && (
              <a
                href="https://app.51ultron.com"
                className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#DA4E24]/20 to-[#DA4E24]/10 border border-[#DA4E24]/50 rounded-lg px-4 py-2 hover:from-[#DA4E24]/30 hover:to-[#DA4E24]/20 transition-all"
              >
                <SparkleIcon className="w-3.5 h-3.5" />
                Send
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
