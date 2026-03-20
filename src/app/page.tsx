"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import HeroChatBox, { type ViewId } from "@/components/HeroChatBox";
import { DemoContent } from "@/components/DemoSection";
import Footer from "@/components/Footer";
import ROICalculator from "@/app/calculator/ROICalculator";

/* Lazy-loaded embedded views */
const EmbeddedLive = dynamic(() => import("@/components/EmbeddedLive"), { ssr: false });
const EmbeddedClientEngine = dynamic(() => import("@/components/EmbeddedClientEngine"), { ssr: false });
const EmbeddedAgentsMap = dynamic(() => import("@/components/EmbeddedAgentsMap"), { ssr: false });

/* ───────────────────────── Live Stats ───────────────────────── */

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

/* ─── Dynamic titles per view ─── */
const VIEW_TITLES: Record<string, { line1: string; line2: string }> = {
  demo:            { line1: "See Ultron In Action",          line2: "Your AI Workforce, Live" },
  live:            { line1: "Real-Time Control Over",        line2: "Every Moving Part" },
  "client-engine": { line1: "Turn Strangers Into",           line2: "Revenue On Autopilot" },
  "agents-map":    { line1: "Five AI Agents Working",        line2: "Around The Clock" },
  calculator:      { line1: "See How Much You Save",         line2: "When AI Does The Work" },
};

export default function HomePage() {
  const [activeView, setActiveView] = useState<ViewId>(null);
  const [isThinking, setIsThinking] = useState(false);
  const prevView = useRef<ViewId>(null);

  const handleSetView = (view: ViewId) => {
    if (view === activeView) {
      // Toggle off — back to homepage
      setActiveView(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (view != null) {
      setIsThinking(true);
      setActiveView(null); // clear old content
      setTimeout(() => {
        setActiveView(view);
        setIsThinking(false);
        setTimeout(() => {
          document.getElementById("view-content")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, 600);
    } else {
      setActiveView(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const title = activeView ? VIEW_TITLES[activeView] : null;

  return (
    <div className="bg-black text-white">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen pt-28 sm:pt-32 pb-32 overflow-hidden">
        {/* Background video — diagonal light streaks with glow animation */}
        <div className="absolute inset-0 pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-background-video.mp4" type="video/mp4" />
          </video>
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
            {/* Desktop heading — dynamic per view */}
            <h1 className="hidden sm:block leading-[1.1] tracking-tight text-white transition-opacity duration-300" key={activeView ?? "home"}>
              <span className="block text-[48px] lg:text-[56px] font-light text-[#e0e0e0]">
                {title ? title.line1 : "The Growth Engine Behind"}
              </span>
              <span className="block text-6xl lg:text-[72px] font-semibold">
                {title ? title.line2 : "100X Founder-Led Businesses"}
              </span>
            </h1>
            {/* Mobile heading — different copy, BIG */}
            <h1 className="sm:hidden text-[52px] font-bold leading-[1.08] tracking-tight text-white">
              100x Your
              <br />
              Founder-Led
              <br />
              Growth
            </h1>

            {/* Subtitle — mobile only */}
            <p className="sm:hidden mt-6 text-[#e0e0e0] text-[15px] leading-relaxed max-w-[540px]">
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
                activeView={activeView}
                onSetView={handleSetView}
              />
            </div>

            {/* Mobile scroll-down arrow — centered below chatbox */}
            <div className="sm:hidden flex justify-center mt-20">
              <button
                onClick={() => window.scrollBy({ top: window.innerHeight * 0.4, behavior: "smooth" })}
                aria-label="Scroll down"
                className="p-2 active:scale-90 transition-transform duration-150"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#555]">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom gradient fade mask — smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
      </section>

      {/* ─── THINKING ANIMATION ─── */}
      {isThinking && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* ─── ACTIVE VIEW CONTENT ─── */}
      {activeView != null && !isThinking && (
        <section id="view-content" className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <Suspense fallback={<div className="text-center text-[#555] py-12">Loading...</div>}>
              {activeView === "demo" && (
                <DemoContent embedded onBackToOverview={() => handleSetView(null)} />
              )}
              {activeView === "live" && <EmbeddedLive />}
              {activeView === "client-engine" && <EmbeddedClientEngine />}
              {activeView === "agents-map" && <EmbeddedAgentsMap />}
              {activeView === "calculator" && <ROICalculator />}
            </Suspense>
          </div>
        </section>
      )}

      {/* ─── MARKETING SECTIONS (shown when no view active) ─── */}
      {activeView == null && !isThinking && (
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
      <section className="relative mt-24 lg:mt-32 overflow-hidden">
        {/* Footer background image — scaled up to eliminate borders */}
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
        {/* Gradient fade from black at top for smooth transition */}
        <div className="absolute inset-x-0 top-0 h-40 z-[1] bg-gradient-to-b from-black to-transparent" />

        {/* CTA content */}
        <div className="relative z-10 pt-24 lg:pt-40 text-center">
          {/* Rotating logo — gentle spin then pause */}
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
              href="/pricing"
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Footer box — sits on top of the bg image */}
        <div className="relative z-10">
          <Footer />
        </div>
      </section>

        </>
      )}
    </div>
  );
}
