"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0A0A0A]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="https://51ultron.com"
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-white text-sm tracking-tight group-hover:text-orange-400 transition-colors">
              Ultron
            </span>
          </Link>

          <Link
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-1.5 rounded transition-all duration-200 glow-orange"
          >
            Try Ultron Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
