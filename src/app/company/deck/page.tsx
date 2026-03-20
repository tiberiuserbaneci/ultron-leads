"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

const TOTAL_SLIDES = 1; // placeholder — increase as slides are added

export default function DeckPage() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + TOTAL_SLIDES) % TOTAL_SLIDES),
    [],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % TOTAL_SLIDES),
    [],
  );

  /* keyboard nav */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-8 -mx-[calc((100vw-100%)/2)] w-screen relative left-1/2 right-1/2 -ml-[50vw]">
      {/* Slide area — 16:9 aspect ratio, max 1920px */}
      <div className="w-full max-w-[1920px]">
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#111] border border-white/[0.06] shadow-2xl">
            {/* Slide content — replace with actual slides */}
            <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-medium select-none">
              Slide {current + 1}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current
                    ? "bg-white"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors"
            aria-label="Next slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide counter */}
        <div className="text-center mt-3 text-white/30 text-sm font-mono">
          {current + 1} / {TOTAL_SLIDES}
        </div>
      </div>
    </div>
  );
}
