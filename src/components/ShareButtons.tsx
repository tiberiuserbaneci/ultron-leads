"use client";

import { useState } from "react";

export default function ShareButtons({ page }: { page: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://work.51ultron.com/${page}?ref=share_${page}`;
  const message = `This broke my brain. Look at what AI agents can do for a business. `;

  const handleShare = async () => {
    // Try native share first (mobile)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Ultron AI Agents", text: message, url });
        return;
      } catch {
        // User cancelled or not supported - fall through to copy
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {/* Mobile: native share button */}
      <button
        onClick={handleShare}
        className="sm:hidden inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#DA4E24] hover:bg-[#c44320] text-white rounded-lg transition-colors font-semibold"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
        Share
      </button>

      {/* Desktop: copy + social */}
      <button
        onClick={copy}
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#0a0a0a] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#333] rounded-lg text-white transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#0a0a0a] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#333] rounded-lg text-white transition-colors"
      >
        Share on X
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(message + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#0a0a0a] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#333] rounded-lg text-white transition-colors"
      >
        WhatsApp
      </a>
    </div>
  );
}
