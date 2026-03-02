import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Competitor's AI Stack in 2026",
  description: "This is what you're up against. See what an automated competitor looks like vs a manual founder. Pure urgency.",
  openGraph: {
    title: "Your Competitor's AI Stack in 2026 | Ultron",
    description: "This is what you're up against. The gap is not talent. It's infrastructure.",
    url: "https://work.51ultron.com/competitor",
  },
  twitter: {
    title: "Your Competitor's AI Stack in 2026 | Ultron",
    description: "This is what you're up against. The gap is not talent. It's infrastructure.",
  },
};

const sections = [
  {
    title: "Monday Morning",
    them: {
      headline: "System ran overnight.",
      bullets: [
        "Inbox triaged. 3 priority deals flagged.",
        "3 new leads scored and added to pipeline.",
        "LinkedIn post published at 7:02am.",
        "Competitor pricing change detected and flagged at 6:18am.",
      ],
    },
    you: {
      headline: "Alarm goes off.",
      bullets: [
        "47 unread emails. No triage.",
        "No content prepared. The post you planned is still a draft.",
        "A competitor launched a new feature last week. You found out from a customer.",
        "You open Slack and spend 40 minutes catching up.",
      ],
    },
  },
  {
    title: "Lead Generation",
    them: {
      headline: "Specter ran a sweep last night.",
      bullets: [
        "8 companies found matching exact ICP.",
        "Each one enriched: funding, headcount, tech stack, decision-maker contact.",
        "Every lead scored 0–100. Top lead: 85/100.",
        "Personalized outreach drafted for all 8. Ready to send.",
      ],
    },
    you: {
      headline: "You open LinkedIn.",
      bullets: [
        "Scroll for 20 minutes. Save 2 company pages.",
        "Copy-paste the same connection request to 5 people.",
        "Forget to follow up on last week's 4 prospects.",
        "Wonder why your pipeline is always dry.",
      ],
    },
  },
  {
    title: "Content",
    them: {
      headline: "5 posts published this week.",
      bullets: [
        "LinkedIn, Twitter, and blog — each formatted for the platform.",
        "Posts written using Cortex competitor intel as source material.",
        "Engagement is compounding. Week 8 of consistent publishing.",
        "Inbound DM from a potential client: 'Your post on Monday nailed it. Can we talk?'",
      ],
    },
    you: {
      headline: "You meant to write a post on Tuesday.",
      bullets: [
        "It's Friday. You still haven't posted.",
        "Your last LinkedIn post was 17 days ago.",
        "You have 3 half-written drafts in a notes app.",
        "Your competitor just crossed 5,000 followers. You have 480.",
      ],
    },
  },
  {
    title: "Sales",
    them: {
      headline: "Striker flagged a warm lead.",
      bullets: [
        "Old email thread from 11 days ago — re-opened.",
        "Striker researched the prospect, updated the context.",
        "Follow-up drafted. References their specific pain point from the thread.",
        "Deal moved to proposal stage. 2 minutes of their time spent on review.",
      ],
    },
    you: {
      headline: "That lead emailed you 4 days ago.",
      bullets: [
        "It's still sitting in your inbox under 43 other emails.",
        "You keep meaning to reply when you 'have time to do it right.'",
        "By the time you respond, they've already talked to your competitor.",
        "Another deal dies in email.",
      ],
    },
  },
  {
    title: "Competitive Intel",
    them: {
      headline: "Cortex runs daily scans.",
      bullets: [
        "Competitor pricing pages checked every morning.",
        "New job postings analyzed for product direction signals.",
        "Competitor's blog posts summarized and saved as positioning intel.",
        "They knew about a competitor's new Enterprise tier 6 hours after it launched.",
      ],
    },
    you: {
      headline: "You check a competitor's site once a month. Maybe.",
      bullets: [
        "You found out they raised a Series A from a tweet — 3 weeks after it happened.",
        "They've changed their pricing twice this year. You noticed once.",
        "Their messaging now directly counters your main selling point. You hadn't noticed.",
        "You're going into every sales call without knowing what they were just told.",
      ],
    },
  },
  {
    title: "End of Quarter",
    them: {
      headline: "System output, Q1:",
      bullets: [
        "47 qualified leads generated.",
        "12 deals closed.",
        "60 pieces of content published.",
        "Full competitive analysis updated weekly.",
        "Total human hours spent: ~10/month reviewing agent output.",
      ],
    },
    you: {
      headline: "Your Q1:",
      bullets: [
        "3 deals closed — all through referrals.",
        "8 posts published total.",
        "No clear picture of what competitors are doing.",
        "Worked 60-hour weeks and still feel behind.",
        "Told yourself Q2 would be different.",
      ],
    },
  },
];

export default function CompetitorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm font-medium">Competitive Reality Check</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Your Competitor's AI Stack in 2026
        </h1>
        <p className="text-xl text-neutral-400 max-w-xl mx-auto">
          This is what you're up against.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4 mb-4 sticky top-14 z-10 bg-[#0A0A0A]/95 backdrop-blur-sm py-3">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-bold text-sm">THEM</span>
            <span className="text-neutral-600 text-xs hidden sm:inline">/ Automated</span>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-400 font-bold text-sm">YOU</span>
            <span className="text-neutral-600 text-xs hidden sm:inline">/ Manual</span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section, i) => (
          <div key={i} className="border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {/* Section header */}
            <div className="bg-[#111111] px-5 py-3 border-b border-[#1a1a1a]">
              <h2 className="font-semibold text-sm text-neutral-400 uppercase tracking-wider">{section.title}</h2>
            </div>

            {/* Split content */}
            <div className="grid grid-cols-2 divide-x divide-[#1a1a1a]">
              {/* THEM */}
              <div className="p-4 sm:p-6 bg-[#0a130a]">
                <p className="text-sm font-semibold text-emerald-400 mb-3">{section.them.headline}</p>
                <ul className="space-y-2">
                  {section.them.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-neutral-300">
                      <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* YOU */}
              <div className="p-4 sm:p-6 bg-[#130a0a]">
                <p className="text-sm font-semibold text-red-400 mb-3">{section.you.headline}</p>
                <ul className="space-y-2">
                  {section.you.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-neutral-400">
                      <span className="text-red-500/70 flex-shrink-0 mt-0.5">✗</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The conclusion */}
      <div className="mt-16 space-y-6">
        <div className="bg-[#111111] border border-[#262626] rounded-2xl p-8 sm:p-10">
          <p className="text-xl sm:text-2xl text-neutral-300 leading-relaxed mb-4">
            "The gap is not talent. It's not funding. It's not time. It's infrastructure. They have 5 agents running 24/7. You have a to-do list and good intentions."
          </p>
          <p className="text-lg text-neutral-400">
            "The question is not whether AI agents will change your industry. It's whether you'll be the one using them or the one competing against them."
          </p>
        </div>

        {/* Urgency stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { metric: "24/7", label: "Their agents run" },
            { metric: "0 hrs", label: "Their research overhead" },
            { metric: "Daily", label: "Their content cadence" },
            { metric: "Every deal", label: "Their follow-up rate" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#111111] border border-[#262626] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">{stat.metric}</div>
              <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Close the gap.</h2>
        <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
          5 agents. $19/month. Deploy in 10 minutes. Every day you wait is another day they're ahead.
        </p>
        <Link
          href="https://app.51ultron.com/signup"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 glow-orange text-lg"
        >
          Deploy 5 Agents Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-neutral-600 text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
