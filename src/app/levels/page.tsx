import type { Metadata } from "next";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The 4 Levels of AI Automation",
  description: "Most founders are stuck at Level 1. The ones pulling ahead are at Level 4. Find out where you stand and what it costs you to stay there.",
  alternates: { canonical: "/levels" },
  openGraph: {
    title: "The 4 Levels of AI Automation | Ultron",
    description: "Most founders are stuck at Level 1. The ones pulling ahead are at Level 4. Here's the difference.",
    url: "https://work.51ultron.com/levels",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    title: "The 4 Levels of AI Automation | Ultron",
    description: "Most founders are stuck at Level 1. The ones pulling ahead are at Level 4. Here's the difference.",
  },
};

const levels = [
  {
    number: "1",
    badge: "Most founders are here",
    title: "Level 1: Copy-Paste Prompting",
    description:
      "You open ChatGPT. You type a prompt. You get a response. You copy it into a doc, an email, a spreadsheet. Then you do it again. And again. Every task starts from scratch. The AI has no memory of your business, your clients, your pipeline, or what it did for you yesterday. You are the integration layer between your AI and your business. This is not automation. This is typing with extra steps.",
    looks: [
      "You prompt ChatGPT to write a cold email. It writes a generic one. You edit it for 10 minutes.",
      "You ask it to research a competitor. It gives you surface-level info from 2023.",
      "You close the tab. Tomorrow you start from zero again.",
    ],
    costs: [
      { label: "Hours/week wasted", value: "10-15" },
      { label: "Context retained between sessions", value: "0" },
      { label: "Revenue generated automatically", value: "$0" },
    ],
    tools: "ChatGPT, Gemini, Perplexity",
    style: "muted",
  },
  {
    number: "2",
    badge: "Getting started",
    title: "Level 2: One AI Tool, One Job",
    description:
      "You found one AI tool that does one thing well. Maybe it writes content. Maybe it finds leads. Maybe it summarizes meetings. But it only covers one department. Everything else is still manual. And the tool does not talk to anything else in your stack. Your content tool does not know what your sales pipeline looks like. Your lead finder does not know what content is performing. You have one smart employee in a company of manual workers.",
    looks: [
      "You use an AI writing tool. It publishes posts but has no idea what your market cares about.",
      "You use a lead scraper. It finds names but cannot score them or draft outreach.",
      "You still manually connect the dots between every tool.",
    ],
    costs: [
      { label: "Hours/week wasted", value: "8-12" },
      { label: "Tools talking to each other", value: "0" },
      { label: "Revenue impact", value: "minimal, one channel only" },
    ],
    tools: "Jasper, Copy.ai, Apollo, single-use AI tools",
    style: "dim",
  },
  {
    number: "3",
    badge: "Close but broken",
    title: "Level 3: Multiple Agents, You're the Router",
    description:
      "You have deployed more than one AI tool or agent. One does research. One does outreach. Maybe one handles content. But YOU are still the person moving information between them. You take the research output and paste it into the outreach tool. You take the lead list and manually update your CRM. You check each tool separately to see what happened. The agents work in silos. You are the glue holding the system together. Remove yourself for a week and everything stops.",
    looks: [
      "Cortex finds competitor intel. You manually tell Pulse to write about it.",
      "Specter builds a lead list. You copy it into a spreadsheet and email them yourself.",
      "You check 4 different dashboards every morning to see what each tool did.",
    ],
    costs: [
      { label: "Hours/week on coordination", value: "6-10" },
      { label: "Data flowing between agents automatically", value: "0" },
      { label: "Single point of failure", value: "you" },
    ],
    tools: "n8n + multiple AI tools, Make + ChatGPT, custom setups",
    style: "mid",
  },
  {
    number: "4",
    badge: "Where Ultron operates",
    title: "Level 4: The System Runs Without You",
    description:
      "Five agents. Five departments. One system. Cortex researches your market and feeds intel to Specter and Pulse. Specter finds and scores leads, then passes them to Striker. Striker tracks every deal in your pipeline and follows up automatically. Pulse turns market intel into content and publishes across every platform. Sentinel monitors your infrastructure and alerts the system when something breaks or a competitor moves. Every agent feeds every other agent. The system compounds. You wake up to leads found, emails drafted, content published, deals tracked, and competitors monitored. You did not touch anything. You review. You decide. You grow.",
    looks: [
      "Monday 6am: Cortex scanned 3 competitors. Specter found 8 leads. Pulse published a LinkedIn post. Striker flagged 2 stale deals. Sentinel confirmed all systems healthy.",
      "You open Telegram. Everything is done. You review and approve.",
      "You take a week off. Revenue still comes in. Content still publishes. Pipeline still fills.",
    ],
    costs: [
      { label: "Hours/week on operations", value: "2 (review only)" },
      { label: "Agents feeding each other", value: "all 5 connected" },
      { label: "Revenue generated while you sleep", value: "compounding" },
      { label: "Cost", value: "$19/month" },
    ],
    tools: null,
    style: "hero",
  },
];

const levelStyles = {
  muted: {
    card: "bg-[#080808] border-[#161616]",
    badge: "bg-[#111] border-[#1a1a1a] text-[#444]",
    title: "text-[#555]",
    body: "text-[#444]",
    looksHeader: "text-[#333]",
    look: "text-[#444]",
    dot: "text-[#333]",
    costLabel: "text-[#333]",
    costValue: "text-[#444]",
    toolLabel: "text-[#333]",
    toolValue: "text-[#333]",
    sectionLabel: "text-[#2a2a2a]",
  },
  dim: {
    card: "bg-[#080808] border-[#1e1e1e]",
    badge: "bg-[#111] border-[#222] text-[#555]",
    title: "text-[#666]",
    body: "text-[#555]",
    looksHeader: "text-[#444]",
    look: "text-[#555]",
    dot: "text-[#444]",
    costLabel: "text-[#444]",
    costValue: "text-[#555]",
    toolLabel: "text-[#444]",
    toolValue: "text-[#444]",
    sectionLabel: "text-[#333]",
  },
  mid: {
    card: "bg-[#0a0a0a] border-[#2a2a2a]",
    badge: "bg-[#DA4E24]/5 border-[#DA4E24]/15 text-[#DA4E24]/50",
    title: "text-[#ccc]",
    body: "text-[#888]",
    looksHeader: "text-[#777]",
    look: "text-[#888]",
    dot: "text-[#DA4E24]/40",
    costLabel: "text-[#666]",
    costValue: "text-[#999]",
    toolLabel: "text-[#555]",
    toolValue: "text-[#666]",
    sectionLabel: "text-[#555]",
  },
  hero: {
    card: "bg-[#0a0a0a] border-[#DA4E24]/35",
    badge: "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]",
    title: "text-white",
    body: "text-[#bbb]",
    looksHeader: "text-[#DA4E24]",
    look: "text-white",
    dot: "text-[#DA4E24]",
    costLabel: "text-[#999]",
    costValue: "text-[#DA4E24] font-bold",
    toolLabel: "",
    toolValue: "",
    sectionLabel: "text-[#DA4E24]/60",
  },
};

export default function LevelsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Hero */}
      <div className="mb-14">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#DA4E24] text-sm font-medium">Where Do You Stand?</span>
        </div>
        <h1 className="animate-fade-up-1 text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
          The 4 Levels of AI Automation
        </h1>
        <p className="animate-fade-up-2 text-lg text-[#999] max-w-xl">
          Most founders are stuck at Level 1. The ones pulling ahead are at Level 4. Here&apos;s the difference.
        </p>
      </div>

      {/* The Ladder */}
      <div className="space-y-0">
        {levels.map((level, i) => {
          const s = levelStyles[level.style as keyof typeof levelStyles];
          const isHero = level.style === "hero";

          return (
            <div key={level.number}>
              {/* Connector between levels */}
              {i > 0 && (
                <div className="flex items-center gap-3 py-3 pl-6">
                  <div className={`h-8 border-l-2 border-dashed ${isHero ? "border-[#DA4E24]/40" : "border-[#222]"}`} />
                  <span className={`text-xs font-terminal ${isHero ? "text-[#DA4E24]/50" : "text-[#333]"}`}>STEP UP</span>
                </div>
              )}

              <div
                className={`rounded-2xl border p-6 sm:p-8 ${s.card} ${isHero ? "shadow-[0_0_48px_rgba(218,78,36,0.12)]" : ""}`}
              >
                {/* Level header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-bold text-lg ${s.badge}`}>
                    {level.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-terminal tracking-widest uppercase mb-1 ${s.badge.split(" ").at(-1)}`}>
                      {level.badge}
                    </div>
                    <h2 className={`text-xl sm:text-2xl font-bold leading-tight ${s.title}`}>
                      {level.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${s.body}`}>
                  {level.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* What it looks like */}
                  <div>
                    <div className={`text-xs uppercase tracking-wider font-terminal mb-3 ${s.sectionLabel}`}>
                      What it looks like
                    </div>
                    <ul className="space-y-2">
                      {level.looks.map((look, j) => (
                        <li key={j} className={`flex items-start gap-2 text-sm ${s.look}`}>
                          <span className={`mt-0.5 flex-shrink-0 font-bold ${s.dot}`}>+</span>
                          {look}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* The cost / numbers */}
                  <div>
                    <div className={`text-xs uppercase tracking-wider font-terminal mb-3 ${s.sectionLabel}`}>
                      The numbers
                    </div>
                    <ul className="space-y-2">
                      {level.costs.map((cost, j) => (
                        <li key={j} className="flex items-start justify-between gap-3">
                          <span className={`text-xs ${s.costLabel}`}>{cost.label}</span>
                          <span className={`text-xs font-terminal text-right ${s.costValue}`}>{cost.value}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tools */}
                    {level.tools && (
                      <div className="mt-4 pt-4 border-t border-[#111]">
                        <div className={`text-xs uppercase tracking-wider font-terminal mb-1.5 ${s.sectionLabel}`}>
                          Tools at this level
                        </div>
                        <p className={`text-xs ${s.costLabel}`}>{level.tools}</p>
                      </div>
                    )}

                    {/* L4: Ultron badge */}
                    {isHero && (
                      <div className="mt-4 pt-4 border-t border-[#DA4E24]/20">
                        <div className="inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-lg px-3 py-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
                          <span className="text-[#DA4E24] text-xs font-semibold">This is Ultron.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-6 text-center">Where you stand at a glance</h2>
        <div className="overflow-x-auto rounded-2xl border border-[#1a1a1a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-3 text-[#555] font-medium bg-[#0a0a0a] w-44"></th>
                {["L1", "L2", "L3", "L4"].map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-center font-bold font-terminal ${
                      col === "L4"
                        ? "text-[#DA4E24] bg-[#DA4E24]/8"
                        : "text-[#555] bg-[#0a0a0a]"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Agents working", values: ["0", "1", "3-4", "5"] },
                { label: "Connected to each other", values: ["No", "No", "No", "Yes"] },
                { label: "Runs without you", values: ["No", "No", "No", "Yes"] },
                { label: "Revenue on autopilot", values: ["No", "No", "Partial", "Yes"] },
                { label: "Monthly cost", values: ["Free", "$50-200", "$300-500", "$19"] },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#111] last:border-b-0">
                  <td className="px-4 py-3 text-[#666] bg-[#0a0a0a] text-xs">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 text-center font-terminal text-xs ${
                        j === 3
                          ? val === "Yes" || val === "$19"
                            ? "text-[#DA4E24] font-bold bg-[#DA4E24]/5"
                            : "text-[#DA4E24] bg-[#DA4E24]/5"
                          : "text-[#444] bg-black"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[#444] text-center">
          People at Level 3 are spending more on disconnected tools than Ultron costs. That math hits hard.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Stop routing. Start deploying.</h2>
        <p className="text-[#999] mb-8 max-w-md mx-auto">
          5 agents. All connected. $19/month. Deploy in 10 minutes.
        </p>
        <Link
          href="https://app.51ultron.com/signup"
          className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
        >
          Try for free
        </Link>
        <p className="mt-3 text-[#555] text-sm">Free plan. No credit card required.</p>
      </div>

      {/* Cross-page navigation */}
      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        <Link href="/blueprint" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#DA4E24]/30 rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#555] mb-1 font-terminal">SEE THE ARCHITECTURE</div>
            <div className="font-semibold text-white text-sm">See the full agent architecture</div>
            <div className="text-xs text-[#999] mt-0.5">The 5-Agent Blueprint</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link href="/72hours" className="group flex items-center justify-between gap-3 p-5 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#DA4E24]/30 rounded-2xl transition-all duration-200">
          <div>
            <div className="text-xs text-[#555] mb-1 font-terminal">SEE LEVEL 4 IN ACTION</div>
            <div className="font-semibold text-white text-sm">See 72 hours of Level 4 output</div>
            <div className="text-xs text-[#999] mt-0.5">72 Hours of Ultron</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333] group-hover:text-[#DA4E24] flex-shrink-0 transition-colors">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Share */}
      <div className="mt-8 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl text-center">
        <p className="text-sm font-semibold text-white mb-1">Know a founder stuck at Level 1?</p>
        <p className="text-xs text-[#555] mb-4">Send them this. It will change how they think about automation.</p>
        <ShareButtons page="levels" />
      </div>

      <Footer />
    </div>
  );
}
