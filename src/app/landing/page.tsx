"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroChatBox from "@/components/HeroChatBox";
import { DemoContent, LiveStatsBar } from "@/components/DemoSection";
import { BrainContent } from "@/components/BrainSection";

/* ───────────────────────── Hero Stats (count-up) ───────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function HeroStats() {
  const agents = useCountUp(224);
  const tasks = useCountUp(6747);
  const api = useCountUp(54811);
  const saved = useCountUp(109088);

  const stats = [
    { ...agents, label: "agents", format: (v: number) => v.toLocaleString(), mobileHide: true },
    { ...tasks, label: "tasks", format: (v: number) => v.toLocaleString(), mobileHide: false },
    { ...api, label: "API calls", format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString(), mobileHide: true },
    { ...saved, label: "saved", format: (v: number) => `$${v >= 1000 ? `${Math.round(v / 1000)}K` : v}`, mobileHide: false },
  ];

  return (
    <>
      {stats.map((stat) => (
        <span key={stat.label} className={`inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] ${stat.mobileHide ? "hidden sm:inline-flex" : ""}`}>
          <span ref={stat.ref} className="text-white font-semibold tabular-nums">{stat.format(stat.value)}</span>
          <span className="text-[#e0e0e0]">{stat.label}</span>
        </span>
      ))}
    </>
  );
}

/* ───────────────────────── Landing Nav ───────────────────────── */
/* ───────────────────────── Sparkle Icon ───────────────────────── */
function SparkleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#sparkle-grad)"
      />
      <defs>
        <linearGradient id="sparkle-grad" x1="2" y1="2" x2="22" y2="22">
          <stop stopColor="#DA4E24" />
          <stop offset="1" stopColor="#1F77F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ───────────────────────── Bullet Point ───────────────────────── */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <SparkleIcon className="w-5 h-5 mt-0.5 shrink-0" />
      <span className="text-white font-semibold text-[15px]">{children}</span>
    </div>
  );
}

/* ───────────────────────── Section Badge ───────────────────────── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#ccc] border border-[#333] rounded-full px-4 py-1.5">
      {children}
    </span>
  );
}

/* ───────────────────────── Feature Card Wrapper ───────────────────────── */
function FeatureCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden ${className}`}>
      {/* Animated orange glow border */}
      <div className="absolute -inset-[1.5px] rounded-2xl z-0 overflow-hidden">
        <div
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.6) 72%, rgba(218,78,36,1) 80%, rgba(218,78,36,0.6) 88%, transparent 100%)",
          }}
        />
      </div>
      {/* Outer glow shadow */}
      <div className="absolute -inset-px rounded-2xl shadow-[0_0_30px_rgba(218,78,36,0.06),0_0_60px_rgba(218,78,36,0.03)] z-0" />
      {/* Card content */}
      <div className="relative z-10 rounded-2xl border border-[#333] bg-black overflow-hidden h-full">
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                        MAIN PAGE                               */
/* ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [demoMode, setDemoMode] = useState(false);

  return (
    <div className="bg-black text-white">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen pt-40 sm:pt-48 pb-32 overflow-hidden">
        {/* Background image — diagonal light streaks */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/hero-background.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Vector color accent — blended onto dark bg to enhance warm glow */}
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[70%] pointer-events-none"
          style={{ mixBlendMode: "darken" }}
        >
          <Image
            src="/hero-vector.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            priority
          />
        </div>

        {/* Grok-inspired glowing "ULTRON" watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="relative">
            <span
              className="text-[20vw] font-black tracking-tighter text-transparent hero-glow-text"
              style={{
                WebkitTextStroke: "1px rgba(218,78,36,0.06)",
              }}
            >
              ULTRON
            </span>
            {/* Radial light burst behind text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60%] h-[60%] rounded-full bg-[#DA4E24]/[0.03] blur-[100px] animate-hero-pulse" />
            </div>
          </div>
        </div>

        {/* Floating ambient particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#DA4E24] hero-particle"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
                opacity: 0.15 + (i % 3) * 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Hero copy — LEFT aligned */}
          <div className="max-w-[800px]">
            {/* Desktop heading */}
            <h1 className="hidden sm:block text-5xl lg:text-[64px] font-semibold leading-[1.12] tracking-tight text-white">
              Scale your founder-led growth,
              <br />
              without scaling headcount
            </h1>
            {/* Mobile heading — different copy, BIG */}
            <h1 className="sm:hidden text-[52px] font-bold leading-[1.08] tracking-tight text-white">
              100x Your
              <br />
              Founder-Led
              <br />
              Growth
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-[#e0e0e0] text-[15px] sm:text-[18px] leading-relaxed max-w-[540px]">
              Hire AI employees, set goals and go from zero to autonomous company in one command.
            </p>

            {/* Stats bar — transparent box with clean border, no separators */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-5 sm:gap-7 border border-[#333] rounded-full px-6 py-2.5">
              <span className="text-[14px] sm:text-[15px] text-[#e0e0e0]">
                <span className="text-white font-semibold">2,000+</span> founders
              </span>
              <HeroStats />
            </div>
          </div>

          {/* Animated chat box with ambient glow */}
          <div className="relative mt-20 sm:mt-36">
            {/* Orange ambient glow behind chatbox */}
            <div className="absolute -inset-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#DA4E24]/[0.12] blur-[150px]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#1F77F6]/[0.05] blur-[120px]" />
            </div>
            <div className="relative">
              <HeroChatBox
                onSwitchToWorkMode={() => {
                  const next = !demoMode;
                  setDemoMode(next);
                  if (next) {
                    setTimeout(() => {
                      document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
                demoMode={demoMode}
              />
            </div>
          </div>
        </div>

        {/* Bottom gradient fade mask — smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
      </section>

      {/* ─── DEMO MODE vs MARKETING SECTIONS ─── */}
      {demoMode ? (
        <section id="demo-section" className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#2a2a2a] rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
                <span className="text-[#999] text-xs font-medium">Interactive Demo</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                See Ultron execute in real time.
              </h2>
              <p className="text-lg text-[#999] max-w-md mx-auto">
                Pick a command. Watch every agent work.
              </p>
            </div>
            <Suspense fallback={<div className="text-center text-[#555] py-12">Loading demo...</div>}>
              <DemoContent embedded />
            </Suspense>
          </div>
        </section>
      ) : (
        <>
          {/* ─── FOUNDER-LED GROWTH FEATURES ─── */}
          <section className="py-24 lg:py-32">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
              {/* Header */}
              <div className="text-center mb-16">
                <Badge>FOUNDER-LED GROWTH</Badge>
                <h2 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1]">
                  Everything You&apos;d Hire For.
                  <br />
                  Already Built.
                </h2>
                <p className="mt-5 text-[#999] text-lg max-w-[500px] mx-auto leading-relaxed">
                  Founder-led growth used to mean doing things alone.
                  <br />
                  Now you have Ultron with you.
                </p>
              </div>

              {/* Top row: 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* OpenClaw Mission Control */}
                <FeatureCard>
                  <div className="p-3">
                    <div className="aspect-[16/10] relative rounded-xl overflow-hidden">
                      <Image
                        src="/Group 2147204318@3x.png"
                        alt="OpenClaw Mission Control"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">OpenClaw Mission Control</h3>
                    <p className="text-[#999] text-sm leading-relaxed">
                      Ultron runs autonomously 24/7 across Telegram, WhatsApp and native dashboard.
                    </p>
                  </div>
                </FeatureCard>

                {/* AI Sales Engine */}
                <FeatureCard>
                  <div className="p-3">
                    <div className="aspect-[16/10] relative rounded-xl overflow-hidden">
                      <Image
                        src="/Group 1321314679@3x.png"
                        alt="AI Sales Engine"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">AI Sales Engine</h3>
                    <p className="text-[#999] text-sm leading-relaxed">
                      Ultron finds, researches, and reaches out to your ideal customers autonomously. You wake up to booked meetings.
                    </p>
                  </div>
                </FeatureCard>
              </div>

              {/* Bottom row: 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Automation Empire Builder */}
                <FeatureCard>
                  <div className="p-3">
                    <div className="aspect-[16/9] md:aspect-[2/1] relative rounded-xl overflow-hidden">
                      <Image
                        src="/Group 1321314678@3x.png"
                        alt="Automation Empire Builder"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Automation Empire Builder</h3>
                    <p className="text-[#999] text-sm leading-relaxed">
                      Deploys unlimited AI agents internally to scale your ops or externally as a product your clients pay for.
                    </p>
                  </div>
                </FeatureCard>

                {/* Viral-Ready Playbooks */}
                <FeatureCard>
                  <div className="p-3">
                    <div className="aspect-[16/9] md:aspect-[2/1] relative rounded-xl overflow-hidden">
                      <Image
                        src="/Group 1321314677@3x.png"
                        alt="Viral-Ready Playbooks"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Viral-Ready Playbooks</h3>
                    <p className="text-[#999] text-sm leading-relaxed">
                      Scrapes viral strategies, extracts what works, and generates winning content.
                    </p>
                  </div>
                </FeatureCard>
              </div>
            </div>
          </section>

          {/* ─── BRAIN: Interactive Command Section ─── */}
          <section className="py-24 lg:py-32">
            <BrainContent embedded />
          </section>

          {/* ─── YOUR ENTIRE WORK LIFE ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge>SEE THE POTENTIAL AND MAKE IT HAPPEN</Badge>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1]">
              Your entire work life,
              <br />
              one text away
            </h2>
            <p className="mt-5 text-[#999] text-lg max-w-[560px] mx-auto leading-relaxed">
              Tell Ultron what you need in plain English. It executes across all departments, 24/7 from one conversation.
            </p>
          </div>

          {/* Delegate Sales card */}
          <FeatureCard className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: text */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">Delegate Sales</h3>
                <p className="text-[#999] text-[15px] leading-relaxed mb-8">
                  Find your ideal customers, write personalized outreach, and close deals. All from one chat.
                </p>
                <div className="flex flex-col gap-4">
                  <Bullet>Find and score leads in seconds</Bullet>
                  <Bullet>Personalized cold emails that convert</Bullet>
                  <Bullet>Automated follow-ups until they book</Bullet>
                </div>
              </div>

              {/* Right: Actions menu mockup */}
              <div className="relative">
                <div
                  className="rounded-2xl overflow-hidden border border-[#222]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(218,78,36,0.08) 0%, #0a0a0a 40%, rgba(31,119,246,0.06) 100%)",
                  }}
                >
                  <div className="p-6">
                    {/* Search bar */}
                    <div className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 mb-4">
                      <span className="text-sm text-[#666]">
                        <span className="text-[#444] mr-1">|</span> Actions
                      </span>
                    </div>
                    {/* Action items */}
                    <div className="flex flex-col gap-1">
                      {[
                        { icon: "🟦", label: "Create Email Draft", color: "#1F77F6" },
                        { icon: "💬", label: "Send WhatsApp", color: "#25D366" },
                        { icon: "🔶", label: "Create Hubspot Contact", color: "#FF7A59" },
                        { icon: "📅", label: "Cancel Meeting", color: "#4285F4" },
                        { icon: "🔴", label: "Create Issue", color: "#DA4E24" },
                      ].map((action) => (
                        <div
                          key={action.label}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                        >
                          <span className="text-base">{action.icon}</span>
                          <span className="text-sm text-[#ccc]">{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* ─── BUILD WORKFORCES + GO VIRAL ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 space-y-5">
          {/* Build Workforces */}
          <FeatureCard className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: Workflow diagram */}
              <div
                className="rounded-2xl overflow-hidden border border-[#222] p-8 relative"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(31,119,246,0.1) 0%, #0a0a0a 30%, rgba(218,78,36,0.08) 70%, rgba(218,78,36,0.15) 100%)",
                }}
              >
                {/* Ultron logo orb */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#111] border border-[#333] flex items-center justify-center">
                    <Image src="/logo.png" alt="" width={28} height={28} className="rounded-sm" />
                  </div>
                </div>

                {/* Workflow steps */}
                <div className="flex flex-col items-center gap-3">
                  {[
                    { label: "Ultron", accent: true },
                    { label: "Workflows", accent: false },
                    { label: "Execution schedule", accent: false },
                    { label: "Deployment", accent: false },
                  ].map((step) => (
                    <div
                      key={step.label}
                      className={`w-full max-w-[280px] text-center py-3 px-6 rounded-xl border text-sm font-medium ${
                        step.accent
                          ? "bg-gradient-to-r from-[#DA4E24] to-[#1F77F6] border-transparent text-white"
                          : "bg-[#111] border-[#333] text-[#ccc]"
                      }`}
                    >
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Text */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">Build Workforces</h3>
                <p className="text-[#999] text-[15px] leading-relaxed mb-8">
                  Deploy AI agents and automation workflows. Use them to run your business or sell them to clients.
                </p>
                <div className="flex flex-col gap-4">
                  <Bullet>Deploy unlimited AI agents</Bullet>
                  <Bullet>Pre-built automation templates</Bullet>
                  <Bullet>Sell agents as a product</Bullet>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Go Viral */}
          <FeatureCard className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left: Text */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-4">Go Viral</h3>
                <p className="text-[#999] text-[15px] leading-relaxed mb-8">
                  Scrape viral content, extract what works, and generate original posts in your voice. Every platform. Every day.
                </p>
                <div className="flex flex-col gap-4">
                  <Bullet>Viral content research on autopilot</Bullet>
                  <Bullet>Original posts in your voice</Bullet>
                  <Bullet>Multi-platform publishing</Bullet>
                </div>
              </div>

              {/* Right: Chat image */}
              <div className="relative aspect-square max-h-[400px]">
                <Image
                  src="/Group 1321314683@3x.png"
                  alt="Go Viral conversation"
                  fill
                  className="object-contain rounded-2xl"
                />
              </div>
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* ─── HOW TO DEPLOY ─── */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge>HOW TO DEPLOY IN 2 MINUTES</Badge>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.1]">
              AI that actually creates
              <br />
              value for your business
            </h2>
          </div>

          {/* 3 Step cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Step 1: You talk to Ultron */}
            <FeatureCard>
              <div
                className="aspect-[4/3] relative p-6 flex flex-col justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(218,78,36,0.1) 0%, #0a0a0a 60%, rgba(31,119,246,0.06) 100%)",
                }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 max-w-[220px]">
                    <span className="text-amber-400">⚡</span>
                    <span className="text-sm text-[#ccc]">When this happen</span>
                  </div>
                  <div className="w-px h-6 bg-[#333] ml-6" />
                  <div className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 max-w-[220px]">
                    <span className="text-white">🌑</span>
                    <span className="text-sm text-[#ccc]">Do this</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  <span className="text-[#DA4E24]">1.</span>  You talk to Ultron
                </h3>
                <p className="text-[#999] text-sm leading-relaxed">
                  Via the web dashboard, Telegram, Slack, or WhatsApp.
                </p>
              </div>
            </FeatureCard>

            {/* Step 2: Connect your apps */}
            <FeatureCard>
              <div
                className="aspect-[4/3] relative p-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(31,119,246,0.08) 0%, #0a0a0a 60%, rgba(218,78,36,0.06) 100%)",
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {["🟣", "🦋", "❇️", "🔷", "✦", "🔶"].map((icon, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xl"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  <span className="text-[#DA4E24]">2.</span>  Connect your apps
                </h3>
                <p className="text-[#999] text-sm leading-relaxed">
                  Sync Ultron with your tools for sales, marketing and ops.
                </p>
              </div>
            </FeatureCard>

            {/* Step 3: Ultron executes 24/7 */}
            <FeatureCard>
              <div
                className="aspect-[4/3] relative p-6 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(218,78,36,0.06) 0%, #0a0a0a 60%, rgba(31,119,246,0.1) 100%)",
                }}
              >
                <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#333] flex items-center justify-center shadow-lg shadow-[#DA4E24]/10">
                  <svg className="w-10 h-10 text-[#DA4E24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">
                  <span className="text-[#DA4E24]">3.</span>  Ultron executes 24/7
                </h3>
                <p className="text-[#999] text-sm leading-relaxed">
                  Let Ultron do the work for you autonomously.
                </p>
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="Ultron" width={56} height={56} className="rounded-lg" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Your AI Automation Journey Today
          </h2>
          <p className="text-[#999] text-lg mb-8 max-w-[500px] mx-auto">
            Sign up for Ultron to let AI handle your routine operations so you can focus on what matters.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="https://app.51ultron.com/signup"
              className="text-sm font-semibold text-white btn-gradient glow-accent rounded-full px-8 py-3 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="https://docs.51ultron.com"
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>

        </>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#1a1a1a] py-10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Ultron" width={24} height={24} className="rounded-sm" />
              <span className="text-sm text-[#666]">© 2025 Ultron. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#666]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="https://docs.51ultron.com" className="hover:text-white transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
