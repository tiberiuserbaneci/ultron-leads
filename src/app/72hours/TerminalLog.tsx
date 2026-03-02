"use client";

import { useState, useEffect, useRef } from "react";

type LogEntry = {
  time: string;
  agent: string;
  agentColor: string;
  message: string;
  type?: "error" | "warning" | "success" | "normal";
  counters?: { leads?: number; emails?: number; posts?: number; companies?: number };
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
      { time: "06:15", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scanning ProductHunt for new AI startups in logistics space. Filtering launches from last 72 hours...", counters: { companies: 1 } },
      { time: "06:18", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 3 active launches: Raft (supply chain automation), Reform (process integration), LogiAI (route optimization).", counters: { companies: 3 } },
      { time: "06:22", agent: "CORTEX", agentColor: "text-indigo-400", message: "Visiting raft.io — Pricing: $299/mo, ~12 employees (LinkedIn), Series A ($4.2M, Crunchbase). GTM issue detected: no case studies on homepage, pricing page has zero social proof.", counters: { companies: 4 } },
      { time: "06:28", agent: "CORTEX", agentColor: "text-indigo-400", message: "Visiting logiai.com — Pricing page blocked. Retrying with cached data from previous scan...", type: "warning" },
      { time: "06:29", agent: "CORTEX", agentColor: "text-indigo-400", message: "Using cached data (3 days old). LogiAI pricing: $199-$499/mo. Note: data may be stale." },
      { time: "06:35", agent: "CORTEX", agentColor: "text-indigo-400", message: "Analysis complete. Report saved: 'AI Logistics Startup Analysis — 3 Companies, 6 GTM Issues Found'. Passing intel to Pulse.", type: "success" },
      { time: "07:15", agent: "SENTINEL", agentColor: "text-sky-400", message: "Competitor monitoring: checking 4 competitor pricing pages for changes..." },
      { time: "07:18", agent: "SENTINEL", agentColor: "text-sky-400", message: "ALERT: Nexus AI updated their pricing page. New tier detected: 'Enterprise' at $399/mo. Previous max was $199/mo. Flagging for review.", type: "warning" },
      { time: "08:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing LinkedIn post based on Cortex intel: 'Why 3 AI logistics startups will fail at go-to-market'..." },
      { time: "08:12", agent: "PULSE", agentColor: "text-pink-400", message: "Post draft complete. 847 words. Hook: 'I analyzed 3 AI startups that launched this week and found the same mistake in all 3 of them.' Saved to content library.", type: "success", counters: { posts: 1 } },
      { time: "08:20", agent: "PULSE", agentColor: "text-pink-400", message: "Adapting LinkedIn post for Twitter thread format. Splitting into 9 tweets. Optimizing hooks per platform..." },
      { time: "08:31", agent: "PULSE", agentColor: "text-pink-400", message: "Twitter thread saved. 9 tweets. Engagement prediction: High. Content library updated.", type: "success" },
      { time: "09:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Building lead list: AI automation agencies in DACH region. Searching Apollo + Brave Search...", counters: { companies: 5 } },
      { time: "09:08", agent: "SPECTER", agentColor: "text-emerald-400", message: "Brave Search returned 0 results for 'AI automation agentur München'. Retrying with broader query: 'automation software agency Germany'...", type: "warning" },
      { time: "09:09", agent: "SPECTER", agentColor: "text-emerald-400", message: "Retry successful. Expanding to LinkedIn search..." },
      { time: "09:15", agent: "SPECTER", agentColor: "text-emerald-400", message: "Found 8 companies. Scoring leads against ICP... Top 3: AutomateDE (score: 85/100), KI-Fabrik (score: 72/100), DataBridge (score: 68/100).", counters: { companies: 8, leads: 3 } },
      { time: "09:22", agent: "SPECTER", agentColor: "text-emerald-400", message: "Drafting cold outreach to AutomateDE — researching founder Marcus Weber's recent LinkedIn posts..." },
      { time: "09:30", agent: "SPECTER", agentColor: "text-emerald-400", message: "Email saved. Subject: 'Your automation stack is missing one layer'. Hook references Marcus's post about client onboarding bottlenecks from last Tuesday. 8 leads total saved to Leads table.", type: "success", counters: { leads: 8, emails: 3 } },
      { time: "12:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Inbox triage initiated. Scanning last 72 hours of email... 47 emails processed." },
      { time: "12:03", agent: "STRIKER", agentColor: "text-orange-400", message: "Deal opportunity flagged: Carl Sundberg, Stonemonk Media. Previous conversation thread about marketing partnership from 11 days ago. No reply sent. Status: stale." },
      { time: "12:08", agent: "STRIKER", agentColor: "text-orange-400", message: "Researching Carl Sundberg... Founded Stonemonk Media 2015, Portland OR. LinkedIn: 1,200 followers, posts about profit acceleration models and creative agency ops. Estimated revenue: $500K-2M." },
      { time: "12:15", agent: "STRIKER", agentColor: "text-orange-400", message: "Context-aware follow-up email drafted. References his 'profit acceleration model' post from last month and connects to our trade finance ROI data. Subject: 'Circling back — the ROI piece you'd care about'.", type: "success", counters: { emails: 4 } },
      { time: "12:18", agent: "STRIKER", agentColor: "text-orange-400", message: "Lead saved: Carl Sundberg, Stonemonk Media. Score: 60/100. Status: warm. Reason for score: strong ICP fit, intent signals present, but no recent engagement." },
      { time: "12:22", agent: "STRIKER", agentColor: "text-orange-400", message: "3 additional deal-related emails flagged for review. 2 conference invitation emails deprioritized. Inbox triage complete.", type: "success" },
      { time: "15:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scheduled task: monitoring r/entrepreneur and IndieHackers for mentions of [product category]. Scanning last 24 hours...", counters: { companies: 12 } },
      { time: "15:06", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 3 relevant threads. One post on IndieHackers by founder with 800+ upvotes asking about AI team management tools. High relevance to ICP. Flagging for Specter." },
      { time: "18:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "End-of-day health check. All systems nominal. Website uptime: 100% for the past 24 hours. 0 alerts triggered." },
    ],
  },
  {
    day: "DAY 2",
    date: "Tuesday",
    entries: [
      { time: "03:22", agent: "SENTINEL", agentColor: "text-sky-400", message: "ALERT: API response time degraded — /api/search spiking at 890ms (threshold: 300ms). Investigating root cause...", type: "warning" },
      { time: "03:28", agent: "SENTINEL", agentColor: "text-sky-400", message: "Root cause identified: third-party CDN latency spike. AWS us-east-1 elevated network latency. Not our infrastructure. Monitoring." },
      { time: "03:41", agent: "SENTINEL", agentColor: "text-sky-400", message: "CDN latency resolved. /api/search back to 143ms. Incident closed. Duration: 19 minutes. No user-facing impact.", type: "success" },
      { time: "06:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Morning health check. All systems nominal. Website response time: 138ms. 0 overnight alerts.", type: "success" },
      { time: "06:02", agent: "SENTINEL", agentColor: "text-sky-400", message: "SSL renewed automatically. 365 days added. No action required.", type: "success" },
      { time: "06:30", agent: "CORTEX", agentColor: "text-indigo-400", message: "Running deep competitor analysis on Nexus AI (flagged yesterday for Enterprise tier). Visiting homepage, job board, blog, LinkedIn...", counters: { companies: 13 } },
      { time: "06:41", agent: "CORTEX", agentColor: "text-indigo-400", message: "Nexus AI posted 3 new jobs: Senior ML Engineer, Head of Growth, Customer Success Manager. Growth + CS hires signal mid-market expansion. Competitive intel saved.", type: "success", counters: { companies: 14 } },
      { time: "07:00", agent: "PULSE", agentColor: "text-pink-400", message: "Publishing Day 1 LinkedIn post ('Why 3 AI logistics startups will fail at go-to-market'). Scheduling for 08:07am for optimal engagement window..." },
      { time: "07:02", agent: "PULSE", agentColor: "text-pink-400", message: "Apollo API rate limited during lead enrichment. Queuing remaining 3 leads for next batch. ETA: 4 minutes.", type: "warning" },
      { time: "07:06", agent: "PULSE", agentColor: "text-pink-400", message: "Rate limit cleared. Resuming enrichment queue. 3 leads processed successfully.", type: "success" },
      { time: "07:08", agent: "PULSE", agentColor: "text-pink-400", message: "LinkedIn post published at 08:07am. Monitoring engagement.", type: "success", counters: { posts: 2 } },
      { time: "07:55", agent: "PULSE", agentColor: "text-pink-400", message: "Blog post draft complete. Readability score: 42. Below threshold (target: 60+). Rewriting with simpler language and shorter sentences...", type: "warning" },
      { time: "08:09", agent: "PULSE", agentColor: "text-pink-400", message: "Rewrite complete. Readability score: 67. SEO score: 87/100. Blog post saved to content library. Suggested publish: Thursday.", type: "success", counters: { posts: 3 } },
      { time: "08:12", agent: "SPECTER", agentColor: "text-emerald-400", message: "LinkedIn profile for 'jordanbuilds' is private. Falling back to company page data and X handle cross-reference.", type: "warning" },
      { time: "08:14", agent: "SPECTER", agentColor: "text-emerald-400", message: "Match found via X: Jordan Fisk, founder of Buildloop (SaaS tools for indie hackers). Email confidence: 78%. Austin, TX.", type: "success", counters: { leads: 9 } },
      { time: "08:20", agent: "SPECTER", agentColor: "text-emerald-400", message: "Lead enrichment: Buildloop — 3 employees, bootstrapped, $8K MRR (est.). Score: 78/100. Outreach hook: references his IndieHackers post directly." },
      { time: "09:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Morning inbox triage. 31 new emails since yesterday. Scanning for deal signals..." },
      { time: "09:04", agent: "STRIKER", agentColor: "text-orange-400", message: "PRIORITY FLAG: Reply received from prospect reached 8 days ago. Priya Sharma, VP Ops at Datalink Systems. She's interested — needs a Q2 proposal. Deal stage: Active.", type: "success" },
      { time: "09:10", agent: "STRIKER", agentColor: "text-orange-400", message: "Researching Datalink Systems... Series B ($12M, 2023), 85 employees, Chicago and Toronto. Priya Sharma joined 7 months ago." },
      { time: "09:18", agent: "STRIKER", agentColor: "text-orange-400", message: "Proposal draft created. Tailored to Datalink's scale. Q2 framing + relevant case study included. Flagged for your review.", type: "success", counters: { emails: 5 } },
      { time: "09:35", agent: "STRIKER", agentColor: "text-orange-400", message: "Email from Sarah Chen re: partnership inquiry. Tone analysis: positive but non-committal. Intent score: 4/10. Recommending follow-up in 5 days, not immediately." },
      { time: "11:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Market intelligence scan: SaaS funding news this week. Pulling from TechCrunch, Crunchbase, newsletters...", counters: { companies: 16 } },
      { time: "11:18", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found 6 funding announcements. 2 in your target vertical. Passing to Specter for lead list enrichment.", type: "success", counters: { companies: 20 } },
      { time: "13:22", agent: "SPECTER", agentColor: "text-emerald-400", message: "2 new leads added: Amir Patel, Flowstate (Series A, $3.2M) and Clara Mendez, OpsCore (Seed, $800K). Both score 70+. Outreach drafts generated.", type: "success", counters: { leads: 11, emails: 7 } },
      { time: "14:47", agent: "SPECTER", agentColor: "text-emerald-400", message: "Waiting for Apollo rate limit reset... (2 min cooldown)", type: "warning" },
      { time: "14:49", agent: "SPECTER", agentColor: "text-emerald-400", message: "Rate limit cleared. Resuming Flowstate enrichment.", type: "success" },
      { time: "16:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Weekly security audit. Checking exposed endpoints, headers, CORS configuration, dependency vulnerabilities..." },
      { time: "16:14", agent: "SENTINEL", agentColor: "text-sky-400", message: "Security audit complete. 1 low-severity finding: missing X-Content-Type-Options header on /api routes. Fix documented. No critical vulnerabilities.", type: "warning" },
      { time: "18:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "End-of-day check. Competitor alerts: none. Website uptime: 100% (excluding resolved CDN incident). All systems operational." },
    ],
  },
  {
    day: "DAY 3",
    date: "Wednesday",
    entries: [
      { time: "06:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "Morning check. All systems operational. Website response time: 128ms (improved vs Day 1). SSL: 363 days remaining." },
      { time: "06:15", agent: "CORTEX", agentColor: "text-indigo-400", message: "Running deep competitor audit on Nexus AI. Visiting homepage, pricing, blog, LinkedIn...", counters: { companies: 21 } },
      { time: "06:28", agent: "CORTEX", agentColor: "text-indigo-400", message: "Nexus AI pricing page blocked by bot detection. Switching to cached snapshot from 4 days ago.", type: "warning" },
      { time: "06:45", agent: "CORTEX", agentColor: "text-indigo-400", message: "'Nexus AI — Q1 2026 GTM Analysis' saved. 4 key weaknesses: weak case studies, opaque pricing, no integration marketplace, Enterprise lacks SSO. Positioning recommendations included.", type: "success", counters: { companies: 22 } },
      { time: "07:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing post #3: 'A founder lesson on delegation'. Personal voice, story-driven. Pulling voice samples from profile..." },
      { time: "07:18", agent: "PULSE", agentColor: "text-pink-400", message: "Post saved. 512 words. Hook: 'I hired 4 freelancers in Q3. Fired 3 of them by Q4. Here's what I learned.' Engagement prediction: High.", type: "success", counters: { posts: 4 } },
      { time: "07:45", agent: "PULSE", agentColor: "text-pink-400", message: "Repurposing Day 1 LinkedIn post into email newsletter format. Shorter, punchier. Adding 2 new Cortex data points..." },
      { time: "07:58", agent: "PULSE", agentColor: "text-pink-400", message: "Email newsletter draft complete. 380 words. Subject: 'The GTM mistake costing startups their first 100 customers'. Ready for Thursday send.", type: "success", counters: { posts: 5 } },
      { time: "08:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Checking open rates from Day 1 outreach batch (8 emails sent Monday)." },
      { time: "08:04", agent: "SPECTER", agentColor: "text-emerald-400", message: "Open rate: 5/8 opened (62.5%). Marcus Weber (AutomateDE) opened 3x — high intent. KI-Fabrik: 0 opens — likely spam or wrong address. Retrying with alternate format.", type: "success" },
      { time: "08:10", agent: "SPECTER", agentColor: "text-emerald-400", message: "Marcus Weber flagged for priority follow-up. KI-Fabrik alternate format queued. Lead list updated.", counters: { leads: 12 } },
      { time: "09:00", agent: "STRIKER", agentColor: "text-orange-400", message: "Inbox triage. 28 emails processed. Scanning for deal activity..." },
      { time: "09:05", agent: "STRIKER", agentColor: "text-orange-400", message: "Carl Sundberg (Stonemonk Media) opened the follow-up email twice in the last 4 hours. High intent signal. Drafting soft check-in for tomorrow — not today, too soon.", type: "success" },
      { time: "09:08", agent: "STRIKER", agentColor: "text-orange-400", message: "NEW: Email from Ben Howarth, Cascade Digital. Inbound inquiry after seeing Monday's LinkedIn post. Message: 'Interested in a demo this week.' Flagged as HOT.", type: "success" },
      { time: "09:22", agent: "STRIKER", agentColor: "text-orange-400", message: "Pre-call brief drafted for Ben Howarth: agency background, est. revenue, likely objections, relevant case studies. Demo slots suggested: Thu/Fri afternoon.", type: "success", counters: { emails: 8 } },
      { time: "11:00", agent: "CORTEX", agentColor: "text-indigo-400", message: "Scanning Reddit for high-intent conversations. Monitoring r/entrepreneur, r/SaaS, r/startups..." },
      { time: "11:14", agent: "CORTEX", agentColor: "text-indigo-400", message: "Found thread on r/startups: 'What AI tools are you using to replace fractional hires?' — 847 upvotes, 203 comments. Multiple comments asking for exactly the product being sold. Flagging for Specter.", type: "success", counters: { companies: 23 } },
      { time: "13:00", agent: "PULSE", agentColor: "text-pink-400", message: "Writing post #4: 'My full tool stack as a solo founder in 2026'. List-based format, fast to read." },
      { time: "13:19", agent: "PULSE", agentColor: "text-pink-400", message: "Post complete. 340 words. Numbered list format. Engagement prediction: High (list posts consistently outperform for this ICP).", type: "success" },
      { time: "15:00", agent: "SPECTER", agentColor: "text-emerald-400", message: "Running conference target sweep. Searching for SaaStr Annual 2026 speaker list and attendee signals..." },
      { time: "15:18", agent: "SPECTER", agentColor: "text-emerald-400", message: "15 SaaStr speakers identified in target ICP. 8 have public contact. 4 posted about AI automation in the last 30 days. Lead list saved: 'SaaStr 2026 — 8 speaker targets'.", type: "success" },
      { time: "16:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "72-hour monitoring summary: 0 downtime events, 1 CDN incident (auto-resolved), 1 security finding (documented), 6 health checks completed. All systems operational." },
      { time: "17:00", agent: "STRIKER", agentColor: "text-orange-400", message: "EOD pipeline summary: 2 active deals (Datalink Systems, Cascade Digital). 1 warm lead (Carl Sundberg). Pipeline est: $47,000." },
      { time: "18:00", agent: "SENTINEL", agentColor: "text-sky-400", message: "WEEKLY SUMMARY: 23 companies researched, 12 leads qualified, 8 emails sent, 5 posts published, 3 competitor analyses, 2 deals flagged, 1 security audit completed. System efficiency: nominal. Human hours required: 0.", type: "success" },
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
  const [counters, setCounters] = useState({ leads: 0, emails: 0, posts: 0, companies: 0 });
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const seenRef = useRef<Set<number>>(new Set());

  const agents = ["ALL", "SENTINEL", "CORTEX", "SPECTER", "STRIKER", "PULSE"];

  const filteredEntries =
    filter === "ALL"
      ? logData[activeDay].entries
      : logData[activeDay].entries.filter((e) => e.agent === filter);

  useEffect(() => {
    setCounters({ leads: 0, emails: 0, posts: 0, companies: 0 });
    seenRef.current = new Set();
    entryRefs.current = new Array(filteredEntries.length).fill(null);
  }, [activeDay, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    filteredEntries.forEach((entry, i) => {
      if (!entry.counters) return;
      const el = entryRefs.current[i];
      if (!el) return;

      const obs = new IntersectionObserver(
        ([ioEntry]) => {
          if (ioEntry.isIntersecting && !seenRef.current.has(i)) {
            seenRef.current.add(i);
            setCounters((prev) => ({
              leads: entry.counters?.leads ?? prev.leads,
              emails: entry.counters?.emails ?? prev.emails,
              posts: entry.counters?.posts ?? prev.posts,
              companies: entry.counters?.companies ?? prev.companies,
            }));
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [filteredEntries]);

  return (
    <div>
      {/* Running counter sticky bar */}
      <div className="sticky top-14 z-40 bg-[#060606]/95 backdrop-blur-sm border-b border-[#191919] mb-4">
        <div className="py-2 px-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto gap-2">
            <span className="text-xs text-neutral-600 font-mono hidden sm:block flex-shrink-0">LIVE</span>
            <div className="flex gap-3 sm:gap-6 flex-wrap">
              {[
                { label: "Companies", value: counters.companies, color: "text-indigo-400" },
                { label: "Leads", value: counters.leads, color: "text-emerald-400" },
                { label: "Emails", value: counters.emails, color: "text-orange-400" },
                { label: "Posts", value: counters.posts, color: "text-pink-400" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <span className={`text-base font-bold font-mono tabular-nums ${c.color}`}>{c.value}</span>
                  <span className="text-xs text-neutral-600">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-soft flex-shrink-0" />
          </div>
        </div>
      </div>

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
            <div
              key={i}
              ref={(el) => { entryRefs.current[i] = el; }}
              className="flex gap-3 py-1.5 border-b border-[#0f0f0f] hover:bg-[#111111] transition-colors px-1 rounded"
            >
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
          <div className="flex gap-3 py-1.5 px-1">
            <span className="text-neutral-600 w-10" />
            <span className="text-emerald-400"><span className="cursor-blink">▋</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
