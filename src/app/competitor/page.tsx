import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";

export const metadata: Metadata = {
  title: "Your Competitor's AI Stack in 2026",
  description: "This is what you're up against. See what an automated competitor looks like vs a manual founder. Pure urgency.",
  openGraph: {
    title: "Your Competitor's AI Stack in 2026 | Ultron",
    description: "This is what you're up against. The gap is not talent. It's infrastructure.",
    url: "https://work.51ultron.com/competitor",
    images: [{ url: "/og/competitor.png", width: 1200, height: 630 }],
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
    scoreboard: { them: "4 tasks completed", you: "0" },
  },
  {
    title: "Lead Generation",
    them: {
      headline: "Specter ran a sweep last night.",
      bullets: [
        "8 companies found matching exact ICP.",
        "Each one enriched: funding, headcount, tech stack, decision-maker contact.",
        "Every lead scored 0-100. Top lead: 85/100.",
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
    scoreboard: { them: "12 tasks completed, 8 leads found", you: "0 leads, 5 copy-paste requests" },
  },
  {
    title: "Content",
    them: {
      headline: "5 posts published this week.",
      bullets: [
        "LinkedIn, Twitter, and blog. Each formatted for the platform.",
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
    scoreboard: { them: "17 tasks, 5 posts published", you: "0 posts" },
  },
  {
    title: "Sales Follow-up",
    them: {
      headline: "Striker tracked every deal.",
      bullets: [
        "6 follow-up emails sent. Each one personalized to the last conversation.",
        "1 deal moved from Proposal Sent to Active.",
        "2 stale deals flagged with re-engagement angles.",
        "Pipeline is always current. Nothing falls through the cracks.",
      ],
    },
    you: {
      headline: "You have 3 deals you forgot about.",
      bullets: [
        "The proposal you sent 12 days ago. No follow-up.",
        "2 cold leads from last month still in a spreadsheet.",
        "You followed up on 1 deal. After the client followed up first.",
        "You don't actually know the state of your pipeline right now.",
      ],
    },
    scoreboard: { them: "21 tasks, 1 deal advanced", you: "0 deals moved" },
  },
  {
    title: "Competitive Intel",
    them: {
      headline: "Cortex runs a full audit every morning.",
      bullets: [
        "Every competitor's pricing page checked for changes.",
        "Job postings monitored for signals on product direction.",
        "GTM weaknesses identified and turned into content.",
        "Full market awareness. Always.",
      ],
    },
    you: {
      headline: "You checked their website once last quarter.",
      bullets: [
        "You don't know they dropped their prices last week.",
        "You don't know they just hired a Head of Sales.",
        "You heard a rumour they're going upmarket. You haven't confirmed it.",
        "Your positioning is based on stale data.",
      ],
    },
    scoreboard: { them: "25 tasks, full market awareness", you: "checked competitor site 0 times this month" },
  },
  {
    title: "Customer Retention",
    them: {
      headline: "Sentinel flagged 2 at-risk accounts.",
      bullets: [
        "Agents detected declining product usage on 2 accounts 3 weeks early.",
        "Proactive check-in emails sent with personalized value recap.",
        "Both accounts renewed. One upgraded to the next tier.",
        "Churn: 0. Revenue lost: $0.",
      ],
    },
    you: {
      headline: "A client churned last month.",
      bullets: [
        "You found out from a cancelled Stripe subscription notification.",
        "You never asked why. You assumed it was price.",
        "You don't know if 3 other clients are about to do the same.",
        "You're reactive, not proactive. By the time you notice, they're gone.",
      ],
    },
    scoreboard: { them: "0 accounts churned", you: "1 churned, 3 unknown risk" },
  },
];

export default function CompetitorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#DA4E24] text-sm font-medium">Reality Check</span>
        </div>
        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Your Competitor&apos;s AI Stack<br className="hidden sm:block"/> in 2026
        </h1>
        <p className="animate-fade-up-2 text-lg text-[#999] max-w-2xl mx-auto">
          This is what you&apos;re up against. Side by side. Monday morning to end of quarter.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-0 mb-0.5">
        <div className="text-center py-2.5 px-4 bg-[#DA4E24]/8 rounded-tl-2xl border border-[#DA4E24]/20 border-b-0">
          <span className="text-sm font-bold text-[#DA4E24] tracking-wide">THEM. Automated.</span>
        </div>
        <div className="text-center py-2.5 px-4 bg-[#111] rounded-tr-2xl border border-[#1a1a1a] border-b-0">
          <span className="text-sm font-bold text-[#999] tracking-wide">YOU. Manual.</span>
        </div>
      </div>

      {/* Comparison sections */}
      <div className="space-y-0 border border-[#1a1a1a] rounded-b-2xl overflow-hidden">
        {sections.map((section, idx) => (
          <div key={idx} className="border-b border-[#1a1a1a] last:border-b-0">
            <div className="px-5 py-3 bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <h2 className="font-bold text-sm text-white">{section.title}</h2>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#1a1a1a]">
              {/* THEM - slight orange warmth */}
              <div className="p-4 sm:p-6" style={{ background: "rgba(218,78,36,0.04)" }}>
                <p className="text-sm font-semibold text-white mb-3">
                  {section.them.headline}
                </p>
                <ul className="space-y-2">
                  {section.them.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white">
                      <span className="text-[#DA4E24] flex-shrink-0 mt-0.5 font-bold">+</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* YOU - dark, muted */}
              <div className="p-4 sm:p-6 bg-black">
                <p className="text-sm font-semibold text-[#999] mb-3">
                  {section.you.headline}
                </p>
                <ul className="space-y-2">
                  {section.you.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#666]">
                      <span className="text-[#999] flex-shrink-0 mt-0.5">-</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-2 divide-x divide-[#1a1a1a] border-t border-[#1a1a1a]">
              <div className="px-4 py-2 font-terminal text-xs" style={{ background: "rgba(218,78,36,0.06)" }}>
                <span className="text-[#DA4E24]">THEM: {section.scoreboard.them}</span>
              </div>
              <div className="px-4 py-2 bg-black font-terminal text-xs">
                <span className="text-[#555]">YOU: {section.scoreboard.you}</span>
              </div>
            </div>
          </div>
        ))}

        {/* End of Quarter */}
        <div className="p-6 sm:p-8 bg-[#0a0a0a]">
          <h2 className="font-bold text-sm text-[#999] mb-4 font-terminal">END OF QUARTER</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[#DA4E24] font-semibold text-sm mb-3">THEM</p>
              <ul className="space-y-1.5 text-sm text-white">
                {[
                  "47 leads qualified, 12 deals in pipeline",
                  "60 posts published across 3 platforms",
                  "Full competitive map of the market",
                  "0 client churn. Proactive on retention.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#DA4E24] font-bold mt-0.5">+</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs font-terminal text-[#DA4E24]">THEM: 47 leads, 12 deals, 60 posts</div>
            </div>
            <div>
              <p className="text-[#999] font-semibold text-sm mb-3">YOU</p>
              <ul className="space-y-1.5 text-sm text-[#666]">
                {[
                  "3 deals closed. 7 more you lost track of.",
                  "8 posts. When you found time.",
                  "No idea what competitors are doing.",
                  "1 client churned. Found out too late.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#999] mt-0.5">-</span>{item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs font-terminal text-[#555]">YOU: 3 deals, 8 posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Conclusion */}
      <div className="mt-16 space-y-6">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 sm:p-10">
          <p className="text-xl sm:text-2xl text-white leading-relaxed mb-5 font-semibold">
            The gap is not talent. It&apos;s not funding. It&apos;s not time. It&apos;s infrastructure.
          </p>
          <p className="text-lg text-[#999] leading-relaxed">
            They have 5 agents running 24/7. You have a to-do list and good intentions. The question is not whether AI agents will change your industry. It&apos;s whether you&apos;ll be the one using them or the one competing against them.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { metric: "24/7", label: "Their agents run" },
            { metric: "0 hrs", label: "Their research overhead" },
            { metric: "Daily", label: "Their content cadence" },
            { metric: "Every deal", label: "Their follow-up rate" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#DA4E24] font-terminal">{stat.metric}</div>
              <div className="text-xs text-[#555] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-page nav */}
      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        {[
          { href: "/calculator", label: "Calculate what you're losing", sub: "AI Team ROI Calculator", note: "NEXT READ" },
          { href: "/blueprint", label: "Deploy the agents", sub: "The 5-Agent Blueprint", note: "THEN DO THIS" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#DA4E24]/30 rounded-2xl transition-all duration-200">
            <div>
              <div className="text-xs text-[#555] mb-1 font-terminal">{link.note}</div>
              <div className="font-semibold text-white text-sm">{link.label}</div>
              <div className="text-xs text-[#666] mt-0.5">{link.sub}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* Share */}
      <div className="mt-8 p-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl text-center">
        <p className="text-sm font-semibold text-white mb-1">Know a founder who needs to see this?</p>
        <p className="text-xs text-[#555] mb-4">This page converts. Share it.</p>
        <ShareButtons page="competitor" />
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Close the gap.</h2>
        <p className="text-[#999] mb-8 max-w-lg mx-auto">
          5 agents. $19/month. Deploy in 10 minutes. Every day you wait is another day they&apos;re ahead.
        </p>
        <Link href="https://app.51ultron.com/signup" className="inline-flex items-center gap-2 bg-[#DA4E24] hover:bg-[#c44320] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 glow-accent text-lg">
          Deploy 5 Agents Free
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <p className="mt-3 text-[#555] text-sm">Free plan. No credit card required.</p>
      </div>
    </div>
  );
}
