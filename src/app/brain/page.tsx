"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { BrainContent } from "@/components/BrainSection";

export default function BrainPage() {
  const [recordMode, setRecordMode] = useState(false);

  return (
    <div className={`min-h-screen bg-black ${recordMode ? "brain-record-mode" : ""}`}>
      {/* Record mode toggle */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setRecordMode(!recordMode)}
          className={`flex items-center gap-1.5 text-[10px] font-terminal uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-300 ${
            recordMode
              ? "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]"
              : "bg-[#0a0a0a] border-[#1a1a1a] text-[#555] hover:text-[#999] hover:border-[#333]"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${recordMode ? "bg-[#DA4E24] pulse-soft" : "bg-[#333]"}`} />
          {recordMode ? "Recording" : "Present"}
        </button>
      </div>

      <div className={recordMode ? "min-h-screen flex flex-col items-center justify-center" : "pt-12 sm:pt-20 pb-8"}>
        <BrainContent />
      </div>

      {/* ─── FINAL CTA ───────────────────────────────────────── */}
      {!recordMode && (
        <>
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Deploy the brain,{" "}
              <span className="gradient-text">not just the task.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#999] max-w-2xl mx-auto mb-8">
              Ultron does more than run workflows. It notices what matters, handles
              repeatable work automatically, and brings you only the decisions worth
              making.
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <Link
                href="https://app.51ultron.com/signup"
                className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
              >
                Try for free
              </Link>
              <Link
                href="/demo"
                className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
              >
                Watch the demo
              </Link>
            </div>
          </section>

          <Footer />
        </>
      )}

      {/* Record mode minimal CTA */}
      {recordMode && (
        <div className="text-center py-8">
          <Link
            href="https://app.51ultron.com/signup"
            className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-6 py-2.5 hover:bg-[#DA4E24]/10 transition-all"
          >
            Try Ultron
          </Link>
        </div>
      )}
    </div>
  );
}
