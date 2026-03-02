"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#191919] bg-[#060606]/96 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="https://51ultron.com" className="flex items-center gap-2.5 group">
            {/* Ultron sphere logo */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="sphereGrad" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#2a2a3a"/>
                    <stop offset="60%" stopColor="#0d0d18"/>
                    <stop offset="100%" stopColor="#060608"/>
                  </radialGradient>
                  <radialGradient id="glowOrange" cx="50%" cy="90%" r="60%">
                    <stop offset="0%" stopColor="#E8541A" stopOpacity="0.65"/>
                    <stop offset="100%" stopColor="#E8541A" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="glowBlue" cx="70%" cy="20%" r="50%">
                    <stop offset="0%" stopColor="#4499ff" stopOpacity="0.45"/>
                    <stop offset="100%" stopColor="#4499ff" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="16" cy="16" r="15" fill="url(#sphereGrad)" stroke="#222230" strokeWidth="0.5"/>
                <circle cx="16" cy="16" r="15" fill="url(#glowOrange)"/>
                <circle cx="16" cy="16" r="15" fill="url(#glowBlue)"/>
                <ellipse cx="11" cy="10" rx="5" ry="3.5" fill="white" fillOpacity="0.06" transform="rotate(-20 11 10)"/>
                <path d="M10 10.5 L10 17.5 Q10 22 16 22 Q22 22 22 17.5 L22 10.5" stroke="#E8541A" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9"/>
                <circle cx="16" cy="16" r="14.5" stroke="#E8541A" strokeWidth="0.4" strokeOpacity="0.2" fill="none"/>
              </svg>
            </div>
            <span className="font-semibold text-white text-sm tracking-tight group-hover:text-orange-400 transition-colors">
              Ultron
            </span>
          </Link>

          <Link
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-1.5 bg-[#E8541A] hover:bg-[#F97316] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 glow-orange"
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
