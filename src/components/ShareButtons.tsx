"use client";

import { useState } from "react";

export default function ShareButtons({ page }: { page: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://work.51ultron.com/${page}?ref=share_${page}`;
  const message = encodeURIComponent(`This broke my brain. Look at what AI agents can do for a business → `);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <button
        onClick={copy}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#191919] hover:bg-[#222] border border-[#2a2a2a] rounded-lg text-neutral-300 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        {copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#191919] hover:bg-[#222] border border-[#2a2a2a] rounded-lg text-neutral-300 transition-colors"
      >
        Share on X
      </a>
      <a
        href={`https://wa.me/?text=${message}${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#191919] hover:bg-[#222] border border-[#2a2a2a] rounded-lg text-neutral-300 transition-colors"
      >
        WhatsApp
      </a>
    </div>
  );
}
