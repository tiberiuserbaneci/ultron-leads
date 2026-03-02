"use client";

import { useState } from "react";

type LogEntry = {
  time: string;
  agent: string;
  agentColor: string;
  message: string;
  type?: "error" | "warning" | "success" | "normal";
};

type LogDay = {
  day: string;
  date: string;
  entries: LogEntry[];
};

const logData: LogDay[] = [
  {
    day: "DAY 1",
    date: "Monday",
    entries: [
      { time: "06:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Health check initiated — all systems operational. Website response time: 142ms. SSL certificate valid for 89 days." },
      { time: "06:03", agent: "SENTINEL", agentColor: "text-sky-400", message: "Crawling internal links... 47 pages checked. 0 broken links detected. Mobile performance score: 94/100.", type: "success" },
      { time: "06:15", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scanning ProductHunt for new AI startups in logistics space. Filtering launches from last 72 hours..." },
      { time: "06:18", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 3 active launches: Raft (supply chain automation), Reform (process integration), LogiAI (route optimization)." },
      { time: "06:22", agent: "CORTEX", agentColor: "text-indigo-400", message: "Visiting raft.io — Pricing: $299/mo, ~12 employees (LinkedIn), Series A ($4.2M, Crunchbase). GTM issue detected: no case studies on homepage, pricing page has zero social proof." },
      { time: "06:28", agent: "CORTEX", agentColor: "text-indigo-400", message: "Visiting logiai.com — Pricing page blocked. Retrying with cached data from previous scan...", type: "warning" },
      { time: "06:29", agent: "CORTEX", agentColor: "text-indigo-400", message: "Using cached data (3 days old). LogiAI pricing: $199-$499/mo. Note: data may be stale." },
      { time: "06:35", agent: "CORTEX", agentColor: "text-indigo-400", message: "Analysis complete. Report saved: 'AI Logistics Startup Analysis — 3 Companies, 6 GTM Issues Found'. Passing intel to Pulse.", type: "success" },
      { time: "07:15", agent: "SENTINEL", agentColor: "text-sky-400", message: "Competitor monitoring: checking 4 competitor pricing pages for changes..." },
      { time: "07:18", agent: "SENTINEL", agentColor: "text-sky-400", message: "ALERT: Nexus AI updated their pricing page. New tier detected: 'Enterprise' at $399/mo. Previous max was $199/mo. Flagging for review.", type: "warning" },
      { time: "08:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing LinkedIn post based on Cortex intel: 'Why 3 AI logistics startups will fail at go-to-market'..." },
      { time: "08:12", agent: "PULSE", agentColor: "text-pink-400", message: "Post draft complete. 847 words. Hook: 'I analyzed 3 AI startups that launched this week and found the same mistake in all 3 of them.' Saved to content library.", type: "success" },
      { time: "08:20", agent: "PULSE", agentColor: "text-pink-400", message: "Adapting LinkedIn post for Twitter thread format. Splitting into 9 tweets. Optimizing hooks per platform..." },
      { time: "08:31", agent: "PULSE", agentColor: "text-pink-400", message: "Twitter thread saved. 9 tweets. Engagement prediction: High. Content library updated.", type: "success" },
      { time: "09:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Building lead list: AI automation agencies in DACH region. Searching Apollo + Brave Search..." },
      { time: "09:08", agent: "SPECTER", agentColor: "text-emerald-400", message: "Brave Search returned 0 results for 'AI automation agentur München'. Retrying with broader query: 'automation software agency Germany'...", type: "warning" },
      { time: "09:09", agent: "SPECTER", agentColor: "text-emerald-400", message: "Retry successful. Expanding to LinkedIn search..." },
      { time: "09:15", agent: "SPECTER", agentColor: "text-emerald-400", message: "Found 8 companies. Scoring leads against ICP... Top 3: AutomateDE (score: 85/100), KI-Fabrik (score: 72/100), DataBridge (score: 68/100)." },
      { time: "09:22", agent: "SPECTER", agentColor: "text-emerald-400", message: "Drafting cold outreach to AutomateDE — researching founder Marcus Weber's recent LinkedIn posts..." },
      { time: "09:30", agent: "SPECTER", agentColor: "text-emerald-400", message: "Email saved. Subject: 'Your automation stack is missing one layer'. Hook references Marcus's post about client onboarding bottlenecks from last Tuesday. 8 leads total saved to Leads table.", type: "success" },
      { time: "12:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Inbox triage initiated. Scanning last 72 hours of email... 47 emails processed." },
      { time: "12:03", agent: "STRIKER", agentColor: "text-orange-400", message: "Deal opportunity flagged: Carl Sundberg, Stonemonk Media. Previous conversation thread about marketing partnership from 11 days ago. No reply sent. Status: stale." },
      { time: "12:08", agent: "STRIKER", agentColor: "text-orange-400", message: "Researching Carl Sundberg... Founded Stonemonk Media 2015, Portland OR. LinkedIn: 1,200 followers, posts about profit acceleration models and creative agency ops. Estimated revenue: $500K-2M." },
      { time: "12:15", agent: "STRIKER", agentColor: "text-orange-400", message: "Context-aware follow-up email drafted. References his 'profit acceleration model' post from last month and connects to our trade finance ROI data. Subject: 'Circling back — the ROI piece you'd care about'.", type: "success" },
      { time: "12:18", agent: "STRIKER", agentColor: "text-orange-400", message: "Lead saved: Carl Sundberg, Stonemonk Media. Score: 60/100. Status: warm. Reason for score: strong ICP fit, intent signals present, but no recent engagement." },
      { time: "12:22", agent: "STRIKER", agentColor: "text-orange-400", message: "3 additional deal-related emails flagged for review. 2 conference invitation emails deprioritized. Inbox triage complete.", type: "success" },
      { time: "15:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scheduled task: monitoring r/entrepreneur and IndieHackers for mentions of [product category]. Scanning last 24 hours..." },
      { time: "15:06", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 3 relevant threads. One post on IndieHackers by founder with 800+ upvotes asking about AI team management tools. High relevance to ICP. Flagging for Specter." },
      { time: "18:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "End-of-day health check. All systems nominal. Website uptime: 100% for the past 24 hours. 0 alerts triggered." },
    ],
  },
  {
    day: "DAY 2",
    date: "Tuesday",
    entries: [
      { time: "06:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Morning health check. API response times: /api/users 89ms, /api/data 143ms, /api/search 312ms. ALERT: /api/search above 300ms threshold. Flagging.", type: "warning" },
      { time: "06:02", agent: "SENTINEL", agentColor: "text-sky-400", message: "SSL renewed automatically. 365 days added. No action required.", type: "success" },
      { time: "06:30", agent: "CORTEX", agentColor: "text-indigo-400", message: "Running scheduled competitor analysis. Checking 5 competitor job boards for new engineering hires — signals scale or product direction shifts..." },
      { time: "06:41", agent: "CORTEX", agentColor: "text-indigo-400", message: "Nexus AI posted 3 new jobs: Senior ML Engineer, Head of Growth, Customer Success Manager. Growth hire + CS hire suggests they're scaling a mid-market motion. Competitive intel saved.", type: "success" },
      { time: "07:00", agent: "PULSE", agentColor: "text-pink-400", message: "Running scheduled content session. Planning this week's content calendar based on recent Cortex intel..." },
      { time: "07:15", agent: "PULSE", agentColor: "text-pink-400", message: "Content plan generated: 5 posts for the week. Topics: (1) Nexus AI hiring signals, (2) logistics startup GTM mistakes, (3) founder lesson on delegation, (4) tool stack breakdown, (5) contrarian take on AI agents. All sourced from Cortex reports." },
      { time: "07:30", agent: "PULSE", agentColor: "text-pink-400", message: "Writing post #2: 'The 3 GTM mistakes I saw in 3 AI startups this week'. Full LinkedIn post with data from Cortex report. 623 words.", type: "success" },
      { time: "08:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Following up on IndieHackers lead flagged by Cortex yesterday. Researching user profile 'jordanbuilds' — looking for real name, company, and contact..." },
      { time: "08:12", agent: "SPECTER", agentColor: "text-emerald-400", message: "LinkedIn search returned no match for 'jordanbuilds'. Cross-referencing with Twitter/X handle search..." },
      { time: "08:14", agent: "SPECTER", agentColor: "text-emerald-400", message: "Match found: Jordan Fisk, founder of Buildloop (SaaS tools for indie hackers). 2,100 LinkedIn followers. Located in Austin, TX. Email confidence: 78%.", type: "success" },
      { time: "08:20", agent: "SPECTER", agentColor: "text-emerald-400", message: "Lead enrichment: Buildloop — 3 employees, bootstrapped, $8K MRR (est.). Strong ICP match. Score: 78/100. Outreach hook: references his IndieHackers post directly." },
      { time: "09:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Morning inbox triage. 31 new emails since yesterday. Scanning for deal signals..." },
      { time: "09:04", agent: "STRIKER", agentColor: "text-orange-400", message: "PRIORITY FLAG: Reply received from a prospect reached 8 days ago. Priya Sharma, VP Ops at Datalink Systems. She's interested but needs a Q2 proposal. Deal stage updated: Active.", type: "success" },
      { time: "09:10", agent: "STRIKER", agentColor: "text-orange-400", message: "Researching Datalink Systems for proposal context... Series B ($12M, 2023), 85 employees, offices in Chicago and Toronto. Priya Sharma joined 7 months ago." },
      { time: "09:18", agent: "STRIKER", agentColor: "text-orange-400", message: "Proposal draft created. Tailored to Datalink's scale (85 employees, multi-location ops). Highlighted relevant case study. Q2 framing included. Flagged for your review.", type: "success" },
      { time: "11:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Running market intelligence scan: SaaS funding news this week. Pulling from TechCrunch, Crunchbase, and startup newsletters..." },
      { time: "11:18", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 6 relevant funding announcements. 2 in your target vertical. Passing to Specter for lead list enrichment.", type: "success" },
      { time: "13:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Processing Cortex funding intel. Looking up founders of newly-funded companies..." },
      { time: "13:22", agent: "SPECTER", agentColor: "text-emerald-400", message: "2 new leads added from funding news: Amir Patel, Flowstate (Series A, $3.2M) and Clara Mendez, OpsCore (Seed, $800K). Both score 70+. Outreach drafts generated.", type: "success" },
      { time: "15:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing blog post: 'How we replaced 5 freelancers with 5 AI agents'. Long-form, 1,200 words. Based on aggregated performance data from agent logs." },
      { time: "15:32", agent: "PULSE", agentColor: "text-pink-400", message: "Blog post complete. SEO score: 87/100. Recommended keywords inserted naturally. Saved to content library. Suggested publish date: Thursday.", type: "success" },
      { time: "16:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Running weekly security audit. Checking exposed endpoints, headers, CORS configuration..." },
      { time: "16:14", agent: "SENTINEL", agentColor: "text-sky-400", message: "Security audit complete. 1 low-severity issue found: missing X-Content-Type-Options header on /api routes. Recommended fix documented.", type: "warning" },
      { time: "18:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "End-of-day check. Competitor alerts: none. Website uptime: 100%. All systems operational." },
    ],
  },
  {
    day: "DAY 3",
    date: "Wednesday",
    entries: [
      { time: "06:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Morning check. All systems operational. Website response time: 128ms (improved). SSL: 363 days remaining." },
      { time: "06:15", agent: "CORTEX", agentColor: "text-indigo-400", message: "Running deep competitor audit on Nexus AI. Visiting homepage, pricing, blog, and LinkedIn company page..." },
      { time: "06:28", agent: "CORTEX", agentColor: "text-indigo-400", message: "Nexus AI pricing page blocked by bot detection. Switching to cached snapshot from 4 days ago.", type: "warning" },
      { time: "06:29", agent: "CORTEX", agentColor: "text-indigo-400", message: "Using cached data. Cross-referencing with new Enterprise tier announced yesterday ($399/mo). Full audit complete." },
      { time: "06:45", agent: "CORTEX", agentColor: "text-indigo-400", message: "Competitive analysis saved: 'Nexus AI — Q1 2026 GTM Analysis'. 4 key weaknesses identified: weak case studies, no transparent pricing, no integration marketplace, enterprise tier lacks SSO. Positioning recommendations included.", type: "success" },
      { time: "07:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing post #3 from content calendar: 'A founder lesson on delegation'. Personal voice, story-driven format. Pulling from voice samples in profile..." },
      { time: "07:18", agent: "PULSE", agentColor: "text-pink-400", message: "Post saved. 512 words. First-person narrative. Hook: 'I hired 4 freelancers in Q3. Fired 3 of them by Q4. Here's what I learned.' Engagement prediction: High.", type: "success" },
      { time: "08:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Running scheduled ICP sweep. Searching for founders who posted about 'hiring too fast' or 'team overhead' on LinkedIn in the last 7 days..." },
      { time: "08:11", agent: "SPECTER", agentColor: "text-emerald-400", message: "Found 6 relevant posts. Authors identified. 4 match ICP (solo founders or small teams, 0-10 employees, B2B SaaS)." },
      { time: "08:20", agent: "SPECTER", agentColor: "text-emerald-400", message: "4 new outreach drafts created. Each one references the founder's specific post. No generic templates. Saved to outreach queue.", type: "success" },
      { time: "09:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Inbox triage. 28 emails processed. Scanning for deal activity..." },
      { time: "09:05", agent: "STRIKER", agentColor: "text-orange-400", message: "Update on Priya Sharma / Datalink Systems: no reply to proposal yet (sent 20 hours ago). No action needed — within normal response window." },
      { time: "09:08", agent: "STRIKER", agentColor: "text-orange-400", message: "NEW: Email from Ben Howarth, Cascade Digital. Inbound inquiry — reached out after seeing a LinkedIn post. Replied: 'Interested in a demo this week.' Flagged as HOT.", type: "success" },
      { time: "09:15", agent: "STRIKER", agentColor: "text-orange-400", message: "Researching Ben Howarth and Cascade Digital. Agency focused on B2B SaaS clients. 6 employees. Ben is the founder. Annual revenue est. $400-600K. Demo prep brief drafted." },
      { time: "09:22", agent: "STRIKER", agentColor: "text-orange-400", message: "Calendar hold placed for Ben Howarth demo. Pre-call brief saved: company background, likely objections, relevant case studies to reference. Demo suggested time slots: Thu/Fri afternoon.", type: "success" },
      { time: "11:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scanning for partnership opportunities. Looking for complementary SaaS tools used by our ICP (small B2B teams, founders, solopreneurs)..." },
      { time: "11:22", agent: "CORTEX", agentColor: "text-indigo-400", message: "Partnership targets identified: Notion (used by 70% of ICP accounts in CRM), Clay (prospecting overlap), Loom (async communication). Analysis saved: 3 integration partnership angles with contact approach recommendations.", type: "success" },
      { time: "13:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing post #4: 'My full tool stack as a solo founder in 2026'. List-based format. Fast to read. Referencing tools that integrate with our product to drive discovery..." },
      { time: "13:19", agent: "PULSE", agentColor: "text-pink-400", message: "Post complete. 340 words. Format: numbered list with 1-sentence explanation per tool. Engagement prediction: High (list posts consistently outperform in this ICP).", type: "success" },
      { time: "15:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Running conference target sweep. Searching for SaaStr Annual 2026 speaker list and attendee signals..." },
      { time: "15:18", agent: "SPECTER", agentColor: "text-emerald-400", message: "15 SaaStr speakers identified in target ICP. Cross-referenced with LinkedIn. 8 have public emails or contact forms. 4 have posted about AI automation in the last 30 days. Lead list saved: 'SaaStr 2026 — 8 speaker targets'.", type: "success" },
      { time: "16:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "72-hour monitoring summary: 0 downtime events, 1 security recommendation, 1 competitor pricing change detected, 6 scheduled health checks completed. All systems operational." },
      { time: "18:00", agent: "STRIKER", agentColor: "text-orange-400", message: "EOD pipeline summary: 2 active deals (Datalink Systems, Cascade Digital). 1 warm lead (Carl Sundberg). 12 qualified leads in table. 8 outreach drafts ready to send. Pipeline value: $47,000 estimated.", type: "success" },
    ],
  },
];

const agentBadgeColors: Record<string, string> = {
  SENTINEL: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  CORTEX: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  PULSE: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  SPECTER: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  STRIKER: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const typeStyles: Record<string, string> = {
  error: "text-red-400",
  warning: "text-yellow-400",
  success: "text-emerald-400",
  normal: "text-neutral-300",
};

export default function TerminalLog() {
  const [activeDay, setActiveDay] = useState(0);
  const [filter, setFilter] = useState<string>("ALL");

  const agents = ["ALL", "SENTINEL", "CORTEX", "SPECTER", "STRIKER", "PULSE"];

  const filteredEntries =
    filter === "ALL"
      ? logData[activeDay].entries
      : logData[activeDay].entries.filter((e) => e.agent === filter);

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111111] border-b border-[#1a1a1a]">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-neutral-500 text-xs font-mono">ultron-activity-log — session-72h</span>
      </div>

      {/* Day selector */}
      <div className="flex border-b border-[#1a1a1a] bg-[#0d0d0d]">
        {logData.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`flex-1 py-3 text-xs font-mono font-medium transition-colors ${
              activeDay === i
                ? "text-orange-400 border-b-2 border-orange-500 bg-orange-500/5"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {day.day}
            <span className="hidden sm:inline text-neutral-600 ml-1">/ {day.date}</span>
          </button>
        ))}
      </div>

      {/* Agent filter */}
      <div className="flex gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#0d0d0d] overflow-x-auto">
        {agents.map((agent) => (
          <button
            key={agent}
            onClick={() => setFilter(agent)}
            className={`flex-shrink-0 px-3 py-1 rounded text-xs font-mono font-medium border transition-colors ${
              filter === agent
                ? agent === "ALL"
                  ? "bg-white/10 text-white border-white/20"
                  : agentBadgeColors[agent] || "bg-neutral-500/15 text-neutral-400 border-neutral-500/30"
                : "text-neutral-600 border-[#262626] hover:border-[#404040] hover:text-neutral-400"
            }`}
          >
            {agent}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="p-4 space-y-0.5 max-h-[600px] overflow-y-auto font-mono text-xs">
        {filteredEntries.map((entry, i) => (
          <div key={i} className="flex gap-3 py-1.5 border-b border-[#0f0f0f] hover:bg-[#111111] transition-colors px-1 rounded">
            <span className="text-neutral-600 flex-shrink-0 w-10">{entry.time}</span>
            <span className={`flex-shrink-0 w-16 font-bold ${entry.agentColor}`}>
              {entry.agent}
            </span>
            <span className={`flex-1 leading-relaxed ${
              entry.type ? typeStyles[entry.type] : "text-neutral-400"
            }`}>
              {entry.type === "warning" && <span className="text-yellow-500 mr-1">⚠</span>}
              {entry.type === "success" && <span className="text-emerald-500 mr-1">✓</span>}
              {entry.type === "error" && <span className="text-red-500 mr-1">✗</span>}
              {entry.message}
            </span>
          </div>
        ))}
        {filteredEntries.length === 0 && (
          <div className="text-neutral-600 text-center py-8">
            No entries for {filter} on {logData[activeDay].day}
          </div>
        )}
        {/* Cursor */}
        <div className="flex gap-3 py-1.5 px-1">
          <span className="text-neutral-600 w-10" />
          <span className="text-emerald-400">
            <span className="cursor-blink">▋</span>
          </span>
        </div>
      </div>
    </div>
  );
}
