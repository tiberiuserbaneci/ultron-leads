"use client";

import Image from "next/image";
import { useState } from "react";

/* ───────────────────────── Arrow Icon ───────────────────────── */
function ArrowUpRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/* ───────────────────────── Badge ───────────────────────── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#888] border border-[#ddd] rounded-full px-4 py-1.5">
      {children}
    </span>
  );
}

/* ───────────────────────── Product Card ───────────────────────── */
function ProductCard({
  title,
  description,
  cta,
  href,
  icon,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl border border-[#e5e5e5] bg-white p-8 lg:p-10 flex flex-col hover:border-[#ccc] hover:shadow-lg hover:shadow-black/5 transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-xl bg-[#f5f3f0] flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{title}</h3>
      <p className="text-[#777] text-[15px] leading-relaxed flex-1 mb-6">{description}</p>
      <div className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a] group-hover:gap-3 transition-all">
        {cta}
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </a>
  );
}

/* ───────────────────────── News Card ───────────────────────── */
function NewsCard({
  category,
  date,
  title,
  description,
}: {
  category: string;
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-semibold tracking-wide uppercase text-[#888] bg-[#f5f3f0] rounded-full px-3 py-1">
          {category}
        </span>
        <span className="text-xs text-[#aaa]">{date}</span>
      </div>
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-[#777] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

/* ───────────────────────── Slim Chat Bar ───────────────────────── */
function SlimChatBar() {
  const [query, setQuery] = useState("");

  const handleSend = () => {
    window.open("https://51ultron.com", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-[560px] mx-auto rounded-xl bg-[#1a1a1a] overflow-hidden shadow-lg shadow-black/10">
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-0">
        <span className="w-2 h-2 rounded-full bg-[#444]" />
        <span className="w-2 h-2 rounded-full bg-[#444]" />
        <span className="w-2 h-2 rounded-full bg-[#444]" />
      </div>
      <div className="px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Ultron anything..."
          className="flex-1 bg-transparent text-white/80 text-sm placeholder:text-white/25 outline-none font-mono"
        />
        <button
          onClick={handleSend}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
          aria-label="Send"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12m0 0l-5.25-5.25M18 12l-5.25 5.25" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                    NEXITY LANDING PAGE                          */
/* ═══════════════════════════════════════════════════════════════ */

export default function NexityPage() {
  return (
    <div className="bg-[#faf8f5]">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden -mt-[72px] pt-[72px]">
        {/* Video background — hidden on mobile */}
        <div className="absolute inset-0 hidden md:block">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden"
          >
            <source src="/hero-background-nxt.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/85" />
        </div>

        {/* Mobile: plain white bg */}
        <div className="absolute inset-0 bg-white md:hidden" />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#faf8f5] to-transparent z-10 pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 max-w-[1200px] mx-auto px-6 lg:px-8 text-center py-32">
          <Badge>NXT ENTERPRISES</Badge>
          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight text-[#1a1a1a]">
            AI and Blockchain Infrastructure
            <br />
            <span className="text-[#888]">for the Autonomous Economy</span>
          </h1>
          <p className="mt-6 text-[#777] text-lg max-w-[600px] mx-auto leading-relaxed">
            The ultimate business brain for more than 2,500 founders.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://51ultron.com"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#1a1a1a] rounded-full px-8 py-3 hover:bg-[#333] transition-colors"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="https://investors.nexitynetwork.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#1a1a1a] border border-[#ddd] rounded-full px-8 py-3 hover:border-[#999] transition-colors"
            >
              Investor Relations
            </a>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge>PRODUCTS</Badge>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.1] text-[#1a1a1a]">
              The Full Stack
            </h2>
            <p className="mt-4 text-[#888] text-lg max-w-[500px] mx-auto">
              Three products. One mission. Autonomous business infrastructure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <ProductCard
              title="Ultron"
              description="AI employees for founder-led growth. Research, leads, sales, content, and monitoring running 24/7."
              cta="Explore Ultron"
              href="https://51ultron.com"
              icon={
                <Image src="/logo.png" alt="Ultron" width={24} height={24} className="rounded-sm" />
              }
            />
            <ProductCard
              title="Trade OS"
              description="The operating system for on-chain trade to coordinate orders, contracts and payments."
              cta="Explore Trade OS"
              href="https://os.nexitynetwork.org"
              icon={
                <Image src="/nxt-enterprises.png" alt="NXT" width={24} height={24} />
              }
            />
            <ProductCard
              title="Founder Terminal"
              description="An open source hub for founders with systems, frameworks and execution models."
              cta="Open Terminal"
              href="https://catalinfetean.substack.com"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17l6-6-6-6" />
                  <path d="M12 19h8" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ─── NEWS ─── */}
      <section id="news" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge>NEWS</Badge>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[48px] font-bold leading-[1.1] text-[#1a1a1a]">
              Latest Updates
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <NewsCard
              category="Product"
              date="March 2026"
              title="Ultron Launch"
              description="5 AI agents that replace a full team. Research, leads, sales, content, and monitoring running 24/7 for founder-led businesses."
            />
            <NewsCard
              category="Infrastructure"
              date="March 2026"
              title="Trade OS"
              description="The operating system for on-chain trade is live. Coordinate contracts, payments, and liquidity on a single programmable layer."
            />
            <NewsCard
              category="Platform"
              date="March 2026"
              title="Founder Terminal"
              description="An open source hub for founders with systems, frameworks and execution models. Built for operators, not observers."
            />
          </div>
        </div>
      </section>

      {/* ─── ULTRON CTA ─── */}
      <section className="py-24 lg:py-32 bg-[#faf8f5]">
        <div className="max-w-[700px] mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#999] border border-[#ddd] rounded-full px-4 py-1.5 mb-6">
            Get started
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.15] text-[#1a1a1a] mb-5">
            From zero to autonomous company<br className="hidden sm:block" /> in one platform.
          </h2>
          <p className="text-[#888] text-base sm:text-lg leading-relaxed mb-10 max-w-[520px] mx-auto">
            Ultron deploys AI agents that handle research, outreach, sales, and monitoring so you can focus on building.
          </p>

          {/* Slim chat bar */}
          <SlimChatBar />
        </div>
      </section>
    </div>
  );
}
