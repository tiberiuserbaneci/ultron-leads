"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

const TOOLS_MENU = [
  {
    label: "Command Center",
    href: "https://work.51ultron.com/live/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Client Engine",
    href: "https://work.51ultron.com/client-engine/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Agents Map",
    href: "https://work.51ultron.com/agents-map/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: "ROI Calculator",
    href: "https://work.51ultron.com/calculator/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="10" y2="10" />
        <line x1="14" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="10" y2="14" />
        <line x1="14" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="16" y2="18" />
      </svg>
    ),
  },
  {
    label: "Resources",
    href: "https://catalinfetean.substack.com/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
      </svg>
    ),
  },
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
  const promptIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

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
            <div className="flex items-center gap-2 border border-[#333] rounded-full px-3 py-1.5">
              <SparkleIcon className="w-3.5 h-3.5" />
              <span className="text-sm font-medium text-white">Sonnet 4</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#666]">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
                      <span className="text-[#888] flex-shrink-0">{item.icon}</span>
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
