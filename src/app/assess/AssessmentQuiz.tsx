"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    text: "Do you have a system that automatically finds and qualifies new leads while you sleep?",
    agent: "SPECTER",
    agentRoute: "/blueprint",
  },
  {
    id: 2,
    text: "Can you get a full prospect profile (company, role, recent news) in under 60 seconds without Googling?",
    agent: "SPECTER",
    agentRoute: "/blueprint",
  },
  {
    id: 3,
    text: "Does your business publish content consistently without you writing it yourself?",
    agent: "PULSE",
    agentRoute: "/blueprint",
  },
  {
    id: 4,
    text: "Do your best leads get a personalized follow-up within 5 minutes of showing interest?",
    agent: "STRIKER",
    agentRoute: "/blueprint",
  },
  {
    id: 5,
    text: "Do you get a weekly intelligence brief on your competitors and market shifts?",
    agent: "CORTEX",
    agentRoute: "/blueprint",
  },
  {
    id: 6,
    text: "Are you alerted immediately when something breaks in your stack, before a customer notices?",
    agent: "SENTINEL",
    agentRoute: "/blueprint",
  },
  {
    id: 7,
    text: "Does your CRM update itself based on prospect behavior, or do you update it manually?",
    agent: "STRIKER",
    agentRoute: "/blueprint",
  },
  {
    id: 8,
    text: "Can you see which leads opened your emails, visited your site, or went cold, without checking manually?",
    agent: "SPECTER",
    agentRoute: "/blueprint",
  },
  {
    id: 9,
    text: "Could you take a 2-week vacation today without your pipeline drying up?",
    agent: "ALL AGENTS",
    agentRoute: "/blueprint",
  },
  {
    id: 10,
    text: "Does your business generate revenue from actions taken while you were offline?",
    agent: "ALL AGENTS",
    agentRoute: "/blueprint",
  },
];

type ScoreResult = {
  label: string;
  sub: string;
  color: string;
};

function getResult(score: number): ScoreResult {
  if (score <= 2) return {
    label: "Manual Mode",
    sub: "You're doing this all by hand. Every hour you work is an hour the business works. When you stop, it stops.",
    color: "#999999",
  };
  if (score <= 4) return {
    label: "Partially Automated",
    sub: "You have some tools in place, but they're not connected. You're still the glue holding it together.",
    color: "#DA4E24",
  };
  if (score <= 7) return {
    label: "Getting There",
    sub: "Good foundation. But there are clear gaps where manual work is costing you time and deals.",
    color: "#DA4E24",
  };
  return {
    label: "Mostly Automated",
    sub: "You're ahead of most. A few targeted additions would close the remaining gaps and compound your advantage.",
    color: "#1F77F6",
  };
}

export default function AssessmentQuiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const score = answers.filter(Boolean).length;
  const result = getResult(score);
  const missed = questions.filter((_, i) => answers[i] === false);

  function answer(yes: boolean) {
    const next = [...answers, yes];
    setAnswers(next);
    if (next.length === questions.length) {
      setDone(true);
    } else {
      setCurrent(current + 1);
    }
  }

  function restart() {
    setAnswers([]);
    setCurrent(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="animate-fade-in">
        {/* Score reveal */}
        <div className="gradient-special rounded-2xl p-8 sm:p-10 mb-8 text-center">
          <p className="text-sm text-[#999] font-terminal mb-3 tracking-widest uppercase">Your Score</p>
          <div className="text-7xl sm:text-8xl font-bold text-white mb-1">{score}</div>
          <div className="text-sm text-[#999] mb-6">out of 10</div>
          <div className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: result.color }}>
            {result.label}
          </div>
          <p className="text-[#999] max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            {result.sub}
          </p>
        </div>

        {/* Gaps section */}
        {missed.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-white">
              Where you&apos;re losing time
            </h2>
            <div className="space-y-3">
              {missed.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[#999] mt-0.5 flex-shrink-0 font-terminal text-sm">x</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#999] mb-1">{q.text}</p>
                      <p className="text-xs">
                        <span className="text-[#DA4E24] font-semibold">{q.agent}</span>
                        <span className="text-[#555]"> handles this</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="p-6 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] text-center mb-6">
          <p className="text-white font-semibold mb-1">
            {missed.length === 0
              ? "You're running lean. Here's how to go further."
              : `${missed.length} gap${missed.length > 1 ? "s" : ""} the 5-agent stack closes automatically.`}
          </p>
          <p className="text-sm text-[#999] mb-5">
            See how each agent maps to what you&apos;re missing.
          </p>
          <a
            href="https://app.51ultron.com/signup"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black bg-white rounded-full px-8 py-3 hover:bg-[#e0e0e0] transition-colors"
          >
            Try Ultron Free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Cross-page nav */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link href="/blueprint" className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] card-lift">
            <div>
              <p className="text-sm font-semibold text-white">The 5-Agent Blueprint</p>
              <p className="text-xs text-[#555]">See how each agent closes your gaps</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] transition-colors flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link href="/calculator" className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] card-lift">
            <div>
              <p className="text-sm font-semibold text-white">ROI Calculator</p>
              <p className="text-xs text-[#555]">Put a dollar figure on those gaps</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] transition-colors flex-shrink-0">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <button
          onClick={restart}
          className="text-sm text-[#555] hover:text-[#999] transition-colors underline underline-offset-4 block mx-auto"
        >
          Retake the assessment
        </button>
      </div>
    );
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[#555] font-terminal">Question {current + 1} of {questions.length}</span>
          <span className="text-xs text-[#555] font-terminal">{current} / {questions.length}</span>
        </div>
        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#DA4E24] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="mb-8">
        <div className="p-6 sm:p-8 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
          <p className="text-xs text-[#555] font-terminal mb-5 tracking-wider uppercase">
            Automation Check
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-white leading-snug">
            {q.text}
          </p>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => answer(true)}
          className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#DA4E24] hover:bg-[#0f0f0f] transition-all duration-150 group card-lift"
        >
          <div className="text-2xl font-bold text-[#DA4E24] mb-1">Yes</div>
          <div className="text-xs text-[#555] group-hover:text-[#999] transition-colors">This is handled</div>
        </button>
        <button
          onClick={() => answer(false)}
          className="p-5 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#333] hover:bg-[#0f0f0f] transition-all duration-150 group card-lift"
        >
          <div className="text-2xl font-bold text-[#999] mb-1">No</div>
          <div className="text-xs text-[#555] group-hover:text-[#999] transition-colors">Still a gap</div>
        </button>
      </div>
    </div>
  );
}
