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

const MOBILE_PHRASES = [
  "Ultron is thinking...",
  "Activating neural pathways...",
  "Processing at lightspeed...",
  "Assembling your answer...",
  "Scanning your data...",
  "Deploying agents...",
];

const MODELS = [
  { label: "Sonnet 4", logo: "/logo claude.png" },
  { label: "Code", logo: "/logo claude code.png" },
  { label: "OpenClaw", logo: "/logo openclaw.png" },
];

const TOOLS_MENU = [
  {
    label: "Command Center",
    href: "https://work.51ultron.com/live/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: "ROI Calculator",
    href: "https://work.51ultron.com/calculator/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: "Support",
    href: "#",
    isIntercom: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

/* ─── Shared + button ─── */
function PlusButton({
  menuOpen,
  onClick,
}: {
  menuOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
        menuOpen
          ? "bg-[#DA4E24] text-white"
          : "bg-transparent text-[#555] border border-[#333] hover:border-[#555] hover:text-white"
      }`}
    >
      <svg
        width="14"
        height="14"
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
  );
}

/* ─── Shared send button ─── */
function SendButton({ onClick }: { onClick?: () => void }) {
  const arrow = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-7 h-7 rounded-full bg-[#DA4E24] flex items-center justify-center hover:bg-[#e8633f] transition-colors flex-shrink-0"
      >
        {arrow}
      </button>
    );
  }

  return (
    <a
      href="https://app.51ultron.com"
      className="w-7 h-7 rounded-full bg-[#DA4E24] flex items-center justify-center hover:bg-[#e8633f] transition-colors flex-shrink-0"
    >
      {arrow}
    </a>
  );
}

/* ─── Shared tools dropdown ─── */
function ToolsDropdown({
  onClose,
  position = "bottom",
}: {
  onClose: () => void;
  position?: "top" | "bottom";
}) {
  const posClass = position === "top"
    ? "absolute bottom-full left-0 mb-2"
    : "absolute top-full left-0 mt-2";

  return (
    <div className={`${posClass} w-52 bg-[#111] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-up z-50`}>
      {TOOLS_MENU.map((item, i) => (
        <a
          key={item.label}
          href={item.href}
          target={item.isIntercom ? undefined : "_blank"}
          rel={item.isIntercom ? undefined : "noopener noreferrer"}
          onClick={(e) => {
            if (item.isIntercom) {
              e.preventDefault();
              try { (window as any).Intercom?.("show"); } catch {}
            }
            onClose();
          }}
          className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#999] hover:bg-[#1a1a1a] hover:text-white transition-colors ${
            i < TOOLS_MENU.length - 1 ? "border-b border-[#1a1a1a]" : ""
          }`}
        >
          <span className="text-[#555] flex-shrink-0">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </div>
  );
}

/* ─── Model dropdown (shared) ─── */
function ModelDropdown({
  selectedModel,
  onSelect,
  position = "bottom",
}: {
  selectedModel: number;
  onSelect: (i: number) => void;
  position?: "top" | "bottom";
}) {
  const posClass = position === "top"
    ? "absolute bottom-full mb-2"
    : "absolute top-full mt-2";

  return (
    <div className={`${posClass} left-0 w-44 bg-[#111] border border-[#222] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-up z-50`}>
      {MODELS.map((model, i) => (
        <button
          key={model.label}
          onClick={() => onSelect(i)}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${
            i === selectedModel
              ? "text-white bg-[#1a1a1a]"
              : "text-[#999] hover:bg-[#1a1a1a] hover:text-white"
          } ${i < MODELS.length - 1 ? "border-b border-[#1a1a1a]" : ""}`}
        >
          <Image src={model.logo} alt="" width={16} height={16} className="rounded-sm flex-shrink-0" />
          {model.label}
          {i === selectedModel && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                     MAIN COMPONENT                             */
/* ═══════════════════════════════════════════════════════════════ */

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
  const [mobilePhrase, setMobilePhrase] = useState(0);
  const promptIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileModelRef = useRef<HTMLDivElement>(null);

  // Desktop typewriter
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

  // Mobile rotating phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setMobilePhrase((p) => (p + 1) % MOBILE_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    if (!menuOpen && !modelOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuOpen) {
        const inMenu = menuRef.current?.contains(e.target as Node) || mobileMenuRef.current?.contains(e.target as Node);
        if (!inMenu) setMenuOpen(false);
      }
      if (modelOpen) {
        const inModel = modelRef.current?.contains(e.target as Node) || mobileModelRef.current?.contains(e.target as Node);
        if (!inModel) setModelOpen(false);
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
    <>
      {/* ═══ MOBILE: ChatGPT-style single line ═══ */}
      <div className="md:hidden relative w-full mx-auto">
        {/* Slim glow */}
        <div className="absolute -inset-[1px] rounded-full overflow-hidden z-0">
          <div
            className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.3) 72%, rgba(218,78,36,0.5) 78%, rgba(218,78,36,0.3) 84%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-10 bg-[#0c0c0c] rounded-full border border-[#1a1a1a] px-3 py-2 flex items-center gap-2">
          {/* + button */}
          <div className="relative" ref={mobileMenuRef}>
            <PlusButton menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
            {menuOpen && <ToolsDropdown onClose={() => setMenuOpen(false)} position="top" />}
          </div>

          {/* Model logo (tap to expand) — left side for clean dropdown */}
          <div className="relative" ref={mobileModelRef}>
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#1a1a1a] transition-colors flex-shrink-0"
            >
              <Image
                src={MODELS[selectedModel].logo}
                alt=""
                width={18}
                height={18}
                className="rounded-sm"
              />
            </button>
            {modelOpen && (
              <ModelDropdown
                selectedModel={selectedModel}
                onSelect={(i) => { setSelectedModel(i); setModelOpen(false); }}
                position="top"
              />
            )}
          </div>

          {/* Rotating phrase — no typing, just fade */}
          <div className="flex-1 min-w-0">
            <p
              key={mobilePhrase}
              className="text-[#888] text-[13px] truncate animate-fade-in"
            >
              {MOBILE_PHRASES[mobilePhrase]}
            </p>
          </div>

          {/* Send — triggers Work Mode on landing, links to app otherwise */}
          <SendButton onClick={onSwitchToWorkMode} />
        </div>
      </div>

      {/* ═══ DESKTOP: Full multi-row layout ═══ */}
      <div className="hidden md:block relative w-full max-w-[800px] mx-auto">
        {/* Slim animated glow border */}
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden z-0">
          <div
            className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.35) 72%, rgba(218,78,36,0.6) 78%, rgba(218,78,36,0.35) 84%, transparent 100%)",
            }}
          />
        </div>

        {/* Outer subtle glow */}
        <div className="absolute -inset-px rounded-2xl shadow-[0_0_40px_rgba(218,78,36,0.08),0_0_80px_rgba(218,78,36,0.04)] z-0" />

        <div className="relative z-10 bg-[#0c0c0c] rounded-2xl p-5 border border-[#1a1a1a]">
          {/* Top row: model selector + globe */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative" ref={modelRef}>
              <button
                onClick={() => setModelOpen(!modelOpen)}
                className="flex items-center gap-2 border border-[#262626] rounded-full px-3 py-1.5 hover:border-[#444] transition-colors"
              >
                <Image
                  src={MODELS[selectedModel].logo}
                  alt=""
                  width={14}
                  height={14}
                  className="rounded-sm"
                />
                <span className="text-[13px] font-medium text-[#ccc]">{MODELS[selectedModel].label}</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`text-[#555] transition-transform ${modelOpen ? "rotate-180" : ""}`}>
                  <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {modelOpen && (
                <ModelDropdown
                  selectedModel={selectedModel}
                  onSelect={(i) => { setSelectedModel(i); setModelOpen(false); }}
                />
              )}
            </div>
            {/* Globe icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#444]">
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

          {/* Bottom row: + menu + action */}
          <div className="flex items-center justify-between">
            {/* + Button with dropdown */}
            <div className="relative" ref={menuRef}>
              <PlusButton menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && <ToolsDropdown onClose={() => setMenuOpen(false)} position="top" />}
            </div>

            {/* Work Mode — pill with animated chevron */}
            {onSwitchToWorkMode && (
              <button
                onClick={onSwitchToWorkMode}
                className="group flex items-center gap-1.5 text-[13px] font-medium text-[#ddd] bg-[#1a1a1a] rounded-full px-4 py-1.5 border border-[#333] hover:border-[#DA4E24]/50 hover:text-white transition-all min-w-[140px] justify-center"
              >
                {demoMode ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Overview</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Work Mode</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-nudge-right">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </>
                )}
              </button>
            )}

            {/* Fallback: send arrow (when not on landing page) */}
            {!onSwitchToWorkMode && <SendButton />}

          </div>
        </div>
      </div>
    </>
  );
}
