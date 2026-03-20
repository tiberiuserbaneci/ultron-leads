"use client";

import { useState, useCallback, useEffect } from "react";

/* ── Slide data ────────────────────────────────────────────── */
const slides = [
  { id: 1, content: "Test" },
  { id: 2, content: "Test" },
  { id: 3, content: "Test" },
  { id: 4, content: "Test" },
  { id: 5, content: "Test" },
];

export default function DeckPage() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % total),
    [total],
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
    <div className="min-h-[calc(100vh-72px)] bg-[#0a0a0a] flex flex-col items-center justify-center px-2 sm:px-4 md:px-8 py-4 sm:py-8 -mx-[calc((100vw-100%)/2)] w-screen relative left-1/2 right-1/2 -ml-[50vw]">
      {/* Slide area — responsive 16:9, scales down on small screens */}
      <div className="w-full max-w-[1920px]">
        {/* 16:9 container using padding-bottom trick for full browser support */}
        <div className="relative w-full pb-[56.25%]">
          {/* Slide track — clips overflow, holds all slides */}
          <div className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden bg-[#111] border border-white/[0.06] shadow-2xl">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
              >
                <span className="text-white/20 text-lg sm:text-2xl md:text-4xl font-medium select-none">
                  {slide.content}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <button
            onClick={prev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.1] transition-colors shrink-0"
            aria-label="Next slide"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide counter */}
        <div className="text-center mt-2 sm:mt-3 text-white/30 text-xs sm:text-sm font-mono">
          {current + 1} / {total}
        </div>
      </div>
    </div>
  );
}
