"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AssessmentQuiz from "../assess/AssessmentQuiz";
import Footer from "@/components/Footer";

/* ───────────────────────── Sparkle Icon ───────────────────────── */
function Sparkle() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#sp)"
      />
      <defs>
        <linearGradient id="sp" x1="2" y1="2" x2="22" y2="22">
          <stop stopColor="#DA4E24" />
          <stop offset="1" stopColor="#1F77F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ───────────────────────── Plan Data ───────────────────────── */
type Plan = {
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  cta: string;
  ctaHref: string;
  highlight: boolean;
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "See what Ultron can do.",
    monthly: null,
    yearly: null,
    cta: "Get Started",
    ctaHref: "https://app.51ultron.com/signup",
    highlight: false,
    features: [
      "10 conversations per day",
      "Planning & Evaluation",
      "Command Center",
      "Tools & Integrations",
    ],
  },
  {
    name: "Max",
    tagline: "Full power. No limits.",
    monthly: 19,
    yearly: 15,
    cta: "Get Started",
    ctaHref: "https://app.51ultron.com/signup",
    highlight: true,
    features: [
      "Everything in Free",
      "Execution & deployment",
      "Access to Agent Squad",
      "Unlimited conversations",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For agencies and teams at scale.",
    monthly: 297,
    yearly: 249,
    cta: "Schedule call",
    ctaHref: "https://calendly.com/catalinfetean/30min",
    highlight: false,
    features: [
      "Custom AI skills",
      "White-label agent deployment",
      "Custom integrations",
      "Up to 1,000 agents",
    ],
  },
];

/* ───────────────────────── Plan Card ───────────────────────── */
function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly;
  const isFree = price === null;
  const period = yearly ? "year" : "month";
  const isExternal = plan.ctaHref.startsWith("http");

  return (
    <div className="relative rounded-2xl h-full">
      {/* Animated glow border for highlighted plan */}
      {plan.highlight && (
        <>
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden z-0">
            <div
              className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.4) 72%, rgba(218,78,36,0.7) 78%, rgba(218,78,36,0.4) 84%, transparent 100%)",
              }}
            />
          </div>
          <div className="absolute -inset-px rounded-2xl shadow-[0_0_40px_rgba(218,78,36,0.1),0_0_80px_rgba(218,78,36,0.05)] z-0" />
        </>
      )}

      {/* Card body */}
      <div className={`relative z-10 rounded-2xl border bg-black h-full flex flex-col p-6 sm:p-8 ${
        plan.highlight ? "border-[#333]" : "border-[#1a1a1a]"
      }`}>
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
          <p className="text-sm text-[#777]">{plan.tagline}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          {isFree ? (
            <span className="text-4xl font-bold text-white">Free</span>
          ) : (
            <div>
              <span className="text-4xl font-bold text-white">${price}</span>
              <span className="text-sm text-[#666] ml-1">/{period}, per user</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {isExternal ? (
          <a
            href={plan.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center text-sm font-semibold rounded-full py-3 transition-colors mb-8 ${
              plan.highlight
                ? "bg-[#DA4E24] text-white hover:bg-[#c44420]"
                : "border border-[#333] text-white hover:border-[#555]"
            }`}
          >
            {plan.cta}
          </a>
        ) : (
          <Link
            href={plan.ctaHref}
            className={`block w-full text-center text-sm font-semibold rounded-full py-3 transition-colors mb-8 ${
              plan.highlight
                ? "bg-[#DA4E24] text-white hover:bg-[#c44420]"
                : "border border-[#333] text-white hover:border-[#555]"
            }`}
          >
            {plan.cta}
          </Link>
        )}

        {/* Divider */}
        <div className="border-t border-[#1a1a1a] mb-6" />

        {/* Features */}
        <p className="text-xs text-[#666] font-medium tracking-wide uppercase mb-4">
          What&apos;s Included
        </p>
        <div className="space-y-3">
          {plan.features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <Sparkle />
              <span className="text-[14px] text-[#ccc]">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                       PRICING PAGE                              */
/* ═══════════════════════════════════════════════════════════════ */

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className="bg-black text-white">

      {/* ─── HERO + PLANS SECTION ─── */}
      <section className="relative overflow-hidden">
        {/* Background image — scaled way up to kill edge borders */}
        <div className="absolute inset-0 z-0 scale-[1.4]">
          <Image
            src="/footer-background.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        {/* Top fade: black → transparent */}
        <div className="absolute inset-x-0 top-0 h-72 z-[1] bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />
        {/* Bottom fade: transparent → black */}
        <div className="absolute inset-x-0 bottom-0 h-72 z-[1] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-[2] max-w-[1200px] mx-auto px-6 lg:px-8 pt-28 sm:pt-36 pb-24 sm:pb-32">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5 mb-6">
              Pricing & Plans
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              20h back per week for
              <br />
              less than a coffee a day
            </h1>
          </div>

          {/* Toggle */}
          <div
            className={`flex justify-center mb-12 transition-all duration-500 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center bg-[#111] border border-[#222] rounded-full p-1">
              <button
                onClick={() => setYearly(false)}
                className={`text-sm font-medium rounded-full px-5 py-2 transition-all duration-200 ${
                  !yearly ? "bg-white text-black" : "text-[#999] hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`text-sm font-medium rounded-full px-5 py-2 transition-all duration-200 ${
                  yearly ? "bg-white text-black" : "text-[#999] hover:text-white"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div
            className={`grid md:grid-cols-3 gap-5 transition-all duration-500 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} yearly={yearly} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUTOMATION QUIZ ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
            {/* Left: intro */}
            <div className="lg:sticky lg:top-24">
              <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5 mb-5">
                Automation Assessment
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] mb-5">
                How automated
                <br />
                is your business?
              </h2>
              <p className="text-[#999] text-[15px] leading-relaxed mb-6">
                10 questions. Find out exactly where manual work is costing you
                time and deals, and which Ultron agents close the gap.
              </p>
              <p className="text-[#666] text-sm mb-8">
                Most founders score 2-4 out of 10. The ones using Ultron Max
                score 8+.
              </p>
              <Link
                href="/contact"
                className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors underline underline-offset-4"
              >
                Got questions? Talk to our team
              </Link>
            </div>

            {/* Right: quiz */}
            <div>
              <AssessmentQuiz />
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA + FOOTER ─── */}
      <section className="relative mt-24 lg:mt-32 overflow-hidden">
        <div className="absolute inset-0 z-0 scale-[1.4]">
          <Image
            src="/footer-background.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-40 z-[1] bg-gradient-to-b from-black to-transparent" />

        <div className="relative z-10 pt-24 lg:pt-40 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Ultron"
              width={64}
              height={64}
              className="rounded-lg animate-logo-spin"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] mb-4">
            Scale quality of your work
            <br />
            not size of your team
          </h2>
          <p className="text-[#999] text-lg mb-8">Run your business on autopilot</p>

          <div className="flex items-center justify-center gap-4 mb-16 lg:mb-24">
            <Link
              href="https://app.51ultron.com/signup"
              className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
            >
              Try for free
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <Footer />
        </div>
      </section>
    </div>
  );
}
