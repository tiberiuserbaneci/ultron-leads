"use client";

import { Suspense } from "react";
import { DemoContent } from "@/components/DemoSection";

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#2a2a2a] rounded-full px-3 py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#999] text-xs font-medium">Interactive Demo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          See Ultron execute in real time.
        </h1>
        <p className="text-lg text-[#999] max-w-md mx-auto">Loading demo...</p>
      </div>
    }>
      <DemoContent />
    </Suspense>
  );
}
