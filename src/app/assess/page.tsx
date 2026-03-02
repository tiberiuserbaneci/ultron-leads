import type { Metadata } from "next";
import AssessmentQuiz from "./AssessmentQuiz";
import FounderTerminal from "@/components/FounderTerminal";

export const metadata: Metadata = {
  title: "Business Automation Assessment",
  description: "10 questions. Find out exactly how automated your business is and where AI agents would make the biggest impact.",
  openGraph: {
    title: "How Automated Is Your Business?",
    description: "10 questions. Find out exactly how automated your business is and where AI agents would make the biggest impact.",
    images: [{ url: "/og/assess.png", width: 1200, height: 630 }],
  },
};

export default function AssessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-10">
        <p className="text-xs text-[#DA4E24] font-terminal tracking-widest uppercase mb-3">Assessment</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
          How automated is your business?
        </h1>
        <p className="text-[#999] text-base sm:text-lg">
          10 questions. Find out exactly where manual work is costing you time and deals.
        </p>
      </div>

      <AssessmentQuiz />

      <FounderTerminal />
    </div>
  );
}
