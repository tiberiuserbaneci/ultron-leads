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
    <div className={`group relative rounded-2xl ${className}`}>
      {/* Animated orange glow border — same as hero chatbox */}
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden z-0">
        <div
          className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] animate-glow-spin"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(218,78,36,0.35) 72%, rgba(218,78,36,0.6) 78%, rgba(218,78,36,0.35) 84%, transparent 100%)",
          }}
        />
      </div>
      {/* Outer subtle glow */}
      <div className="absolute -inset-px rounded-2xl shadow-[0_0_40px_rgba(218,78,36,0.08),0_0_80px_rgba(218,78,36,0.04)] z-0" />
      {/* Card content */}
      <div className="relative z-10 rounded-2xl bg-black border border-[#222] overflow-hidden h-full flex flex-col">
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
            <h1 className="hidden sm:block text-6xl lg:text-[72px] font-semibold leading-[1.1] tracking-tight text-white">
              100x Founder-Led Growth,
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

            {/* Stats bar — under chat box */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-5 sm:gap-7 border border-[#333] rounded-full px-6 py-2.5">
                <span className="text-[14px] sm:text-[15px] text-[#e0e0e0]">
                  <span className="text-white font-semibold">2,000+</span> founders
                </span>
                <HeroStats />
              </div>
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

              {/* Top row: 2 cards — Framer: 455px / 661px, height ~492px */}
              <div className="grid grid-cols-1 md:grid-cols-[455fr_661fr] md:grid-rows-[492px] gap-5 mb-5">
                {/* OpenClaw Mission Control */}
                <FeatureCard>
                  <div className="flex-1 p-3">
                    <div className="aspect-[16/10] md:aspect-auto relative rounded-xl overflow-hidden md:h-full">
                      <Image
                        src="/Group 2147204318@3x.png"
                        alt="OpenClaw Mission Control"
                        fill
                        className="object-cover md:object-contain md:object-top"
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
                  <div className="flex-1 p-3">
                    <div className="aspect-[16/10] md:aspect-auto relative rounded-xl overflow-hidden md:h-full">
                      <Image
                        src="/Group 1321314679@3x.png"
                        alt="AI Sales Engine"
                        fill
                        className="object-cover md:object-contain md:object-top"
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

              {/* Bottom row: 2 cards — Framer: 739px / 375px, height ~492px */}
              <div className="grid grid-cols-1 md:grid-cols-[739fr_375fr] md:grid-rows-[492px] gap-5">
                {/* Automation Empire Builder */}
                <FeatureCard>
                  <div className="flex-1 p-3">
                    <div className="aspect-[16/10] md:aspect-auto relative rounded-xl overflow-hidden md:h-full">
                      <Image
                        src="/Group 1321314678@3x.png"
                        alt="Automation Empire Builder"
                        fill
                        className="object-cover md:object-contain md:object-top"
                      />
                    </div>
                  </div>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Automation Empire Builder</h3>
                    <p className="text-[#999] text-sm leading-relaxed">
                      Deploys unlimited AI agents internally to scale your<br className="hidden md:inline" /> ops or externally as a product your clients pay for.
                    </p>
                  </div>
                </FeatureCard>

                {/* Viral-Ready Playbooks */}
                <FeatureCard>
                  <div className="flex-1 p-3">
                    <div className="aspect-[16/10] md:aspect-auto relative rounded-xl overflow-hidden md:h-full">
                      <Image
                        src="/Group 1321314677@3x.png"
                        alt="Viral-Ready Playbooks"
                        fill
                        className="object-cover md:object-contain md:object-top"
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

          {/* Sticky stacking cards */}
          <div className="space-y-12">
            {/* Delegate Sales */}
            <div className="lg:sticky lg:top-24" style={{ zIndex: 10 }}>
              <FeatureCard>
                <div className="grid lg:grid-cols-2 gap-0 lg:min-h-[526px]">
                  {/* Left: text */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
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
                  {/* Right: Image */}
                  <div className="relative min-h-[300px]">
                    <Image
                      src="/delegate-sales.png"
                      alt="Delegate Sales"
                      fill
                      className="object-cover rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl"
                    />
                  </div>
                </div>
              </FeatureCard>
            </div>

            {/* Build Workforces */}
            <div className="lg:sticky lg:top-28" style={{ zIndex: 11 }}>
              <FeatureCard>
                <div className="grid lg:grid-cols-2 gap-0 lg:min-h-[526px]">
                  {/* Left: Image */}
                  <div className="relative min-h-[300px] order-2 lg:order-1">
                    <Image
                      src="/build-workforces.png"
                      alt="Build Workforces"
                      fill
                      className="object-cover rounded-b-2xl lg:rounded-br-none lg:rounded-l-2xl"
                    />
                  </div>
                  {/* Right: Text */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
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
            </div>

            {/* Go Viral */}
            <div className="lg:sticky lg:top-32" style={{ zIndex: 12 }}>
              <FeatureCard>
                <div className="grid lg:grid-cols-2 gap-0 lg:min-h-[526px]">
                  {/* Left: text */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
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
                  {/* Right: Image */}
                  <div className="relative min-h-[300px]">
                    <Image
                      src="/go-viral.png"
                      alt="Go Viral"
                      fill
                      className="object-cover rounded-b-2xl lg:rounded-bl-none lg:rounded-r-2xl"
                    />
                  </div>
                </div>
              </FeatureCard>
            </div>
          </div>
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
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                <Image
                  src="/youtalktoultron.png"
                  alt="You talk to Ultron"
                  fill
                  className="object-cover"
                />
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
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                <Image
                  src="/connectyourapps.png"
                  alt="Connect your apps"
                  fill
                  className="object-cover"
                />
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
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl">
                <Image
                  src="/ultronexecutes24:7.png"
                  alt="Ultron executes 24/7"
                  fill
                  className="object-cover"
                />
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

      {/* ─── BOTTOM CTA + FOOTER ─── */}
      <section className="relative mt-24 lg:mt-32">
        {/* Footer background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer-background.png"
            alt=""
            fill
            className="object-cover object-top"
            priority={false}
          />
        </div>

        {/* CTA content */}
        <div className="relative z-10 pt-24 lg:pt-40 text-center">
          {/* Rotating logo */}
          <div className="flex justify-center mb-8" style={{ perspective: "600px" }}>
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

          <div className="flex items-center justify-center gap-4 mb-32 lg:mb-48">
            <Link
              href="https://app.51ultron.com/signup"
              className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
            >
              Try for free
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Footer box */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="rounded-2xl border border-[#222] bg-black/80 backdrop-blur-sm">
            {/* Footer main content */}
            <div className="p-8 lg:p-10">
              <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 lg:gap-12">
                {/* Brand column */}
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/logo.png" alt="Ultron" width={32} height={32} className="rounded-sm" />
                    <span className="text-lg font-semibold">Ultron</span>
                  </div>
                  <p className="text-[#999] text-sm leading-relaxed">
                    The growth engine behind
                    <br />
                    founder-led businesses.
                  </p>
                </div>

                {/* Product */}
                <div>
                  <h4 className="text-sm font-semibold text-[#999] mb-4">Product</h4>
                  <ul className="space-y-3">
                    {[
                      { label: "Agent Blueprint", href: "#" },
                      { label: "Classified Log", href: "#" },
                      { label: "ROI Calculator", href: "#" },
                      { label: "$10K Stack", href: "/stack" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-sm font-semibold text-[#999] mb-4">Quick Links</h4>
                  <ul className="space-y-3">
                    {[
                      { label: "Integrations", href: "#" },
                      { label: "Contact", href: "#" },
                      { label: "Resources", href: "#" },
                      { label: "DealMaker", href: "#" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Others */}
                <div>
                  <h4 className="text-sm font-semibold text-[#999] mb-4">Others</h4>
                  <ul className="space-y-3">
                    {[
                      { label: "Privacy Policy", href: "#" },
                      { label: "Terms & Condition", href: "#" },
                      { label: "OpenClaw", href: "#" },
                      { label: "NXT Enterprises", href: "#" },
                    ].map((item) => (
                      <li key={item.label}>
                        <Link href={item.href} className="text-sm text-[#ccc] hover:text-white transition-colors">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer bottom bar */}
            <div className="border-t border-[#222] px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-[#666]">© 2026 Powered by NXT Enterprises</span>
              <div className="flex items-center gap-5">
                {/* Instagram */}
                <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="text-[#999] hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

        </>
      )}
    </div>
  );
}
