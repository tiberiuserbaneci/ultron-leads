"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PROMPTS = [
  "Generate weekly sales summary report for Q1...",
  "Build a landing page for our new product launch...",
  "Analyze competitor pricing and create comparison chart...",
  "Draft outreach emails for 50 potential leads...",
  "Create a social media content calendar for March...",
  "Set up automated follow-up sequence for cold leads...",
  "Design a referral program with tiered rewards...",
  "Write SEO-optimized blog posts for our top keywords...",
];

const TABS = ["Sales", "Creates", "Builds"];

export default function HeroChatBox() {
  const [displayText, setDisplayText] = useState("");
  const [userText, setUserText] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const promptIndex = useRef(0);
  const charIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typeNext = useCallback(() => {
    const currentPrompt = PROMPTS[promptIndex.current];
    if (charIndex.current < currentPrompt.length) {
      setDisplayText(currentPrompt.slice(0, charIndex.current + 1));
      charIndex.current++;
      timeoutRef.current = setTimeout(typeNext, 40 + Math.random() * 40);
    } else {
      // Pause then clear and move to next prompt
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

  const shownText = isUserTyping ? userText : displayText;

  return (
    <div className="relative max-w-[680px] mx-auto">
      {/* Outer glow border */}
      <div className="rounded-2xl p-[1px] bg-gradient-to-b from-[#DA4E24]/40 via-[#DA4E24]/20 to-[#1F77F6]/30 shadow-[0_0_60px_rgba(218,78,36,0.15)]">
        <div className="bg-[#0c0c0c] rounded-2xl p-5">
          {/* Top row: model selector */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 border border-[#333] rounded-full px-3 py-1.5">
              {/* Sparkle icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
                  fill="#DA4E24"
                />
              </svg>
              <span className="text-sm font-medium text-white">Sonnet 4.6</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-[#666]"
              >
                <path
                  d="M3 5L6 8L9 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Text input area */}
          <div className="relative mb-4 min-h-[40px]">
            {!isUserTyping && !userText && (
              <p className="text-[#888] text-base leading-relaxed">
                {shownText}
                <span className="inline-block w-[2px] h-[18px] bg-[#DA4E24] ml-[1px] align-middle animate-pulse" />
              </p>
            )}
            {(isUserTyping || userText) && (
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full bg-transparent text-white text-base outline-none placeholder:text-[#555]"
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

          {/* Bottom row: tabs + send */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === i
                      ? "bg-[#1a1a1a] text-white border border-[#333]"
                      : "text-[#666] hover:text-[#999]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <a
              href="https://app.51ultron.com"
              className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-[#DA4E24]/20 to-[#DA4E24]/10 border border-[#DA4E24]/50 rounded-lg px-4 py-2 hover:from-[#DA4E24]/30 hover:to-[#DA4E24]/20 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 0L9.4 6.6L16 8L9.4 9.4L8 16L6.6 9.4L0 8L6.6 6.6L8 0Z"
                  fill="#DA4E24"
                />
              </svg>
              Start building
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
