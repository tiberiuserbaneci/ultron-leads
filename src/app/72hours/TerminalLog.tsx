"use client";

import { useState, useEffect, useRef } from "react";

type LogEntry = {
  time: string;
  agent: string;
  message: string;
  type?: "error" | "warning" | "success";
  counters?: { leads?: number; emails?: number; posts?: number; companies?: number };
};

type LogDay = { day: string; date: string; entries: LogEntry[] };

const logData: LogDay[] = [
  {
    day: "DAY 1",
    date: "Monday",
    entries: [
      { time: "06:00", agent: "SENTINEL", message: "Health check initiated. All systems operational. Website response time: 142ms. SSL certificate valid for 89 days." },
      { time: "06:03", agent: "SENTINEL", message: "Crawling internal links. 47 pages checked. 0 broken links detected. Mobile performance score: 94/100.", type: "success" },
      { time: "06:15", agent: "CORTEX", message: "Scanning ProductHunt for new AI startups in logistics space. Filtering launches from last 72 hours...", counters: { companies: 1 } },
      { time: "06:18", agent: "CORTEX", message: "Found 3 active launches: Raft (supply chain automation), Reform (process integration), LogiAI (route optimization).", counters: { companies: 3 } },
      { time: "06:22", agent: "CORTEX", message: "Visiting raft.io. Pricing: $299/mo, ~12 employees (LinkedIn), Series A ($4.2M, Crunchbase). GTM issue: no case studies on homepage, pricing page has zero social proof.", counters: { companies: 4 } },
      { time: "06:28", agent: "CORTEX", message: "Visiting logiai.com. Pricing page blocked. Retrying with cached data from previous scan...", type: "warning" },
      { time: "06:29", agent: "CORTEX", message: "Using cached data (3 days old). LogiAI pricing: $199-$499/mo. Note: data may be stale." },
      { time: "06:35", agent: "CORTEX", message: "Analysis complete. Report saved: AI Logistics Startup Analysis. 3 Companies, 6 GTM Issues Found. Passing intel to Pulse.", type: "success" },
      { time: "07:15", agent: "SENTINEL", message: "Competitor monitoring: checking 4 competitor pricing pages for changes..." },
      { time: "07:18", agent: "SENTINEL", message: "ALERT: Nexus AI updated their pricing page. New tier detected: Enterprise at $399/mo. Previous max was $199/mo. Flagging for review.", type: "warning" },
      { time: "08:00", agent: "PULSE", message: "Writing LinkedIn post based on Cortex intel: Why 3 AI logistics startups will fail at go-to-market..." },
      { time: "08:12", agent: "PULSE", message: "Post draft complete. 847 words. Hook: I analyzed 3 AI startups that launched this week and found the same mistake in all 3 of them. Saved to content library.", type: "success", counters: { posts: 1 } },
      { time: "08:20", agent: "PULSE", message: "Adapting LinkedIn post for Twitter thread format. Splitting into 9 tweets. Optimizing hooks per platform..." },
      { time: "08:31", agent: "PULSE", message: "Twitter thread saved. 9 tweets. Engagement prediction: High. Content library updated.", type: "success" },
      { time: "09:00", agent: "SPECTER", message: "Building lead list: AI automation agencies in DACH region. Searching Apollo + Brave Search...", counters: { companies: 5 } },
      { time: "09:08", agent: "SPECTER", message: "Brave Search returned 0 results for AI automation agentur Munchen. Retrying with broader query...", type: "warning" },
      { time: "09:09", agent: "SPECTER", message: "Retry successful. Expanding to LinkedIn search..." },
      { time: "09:15", agent: "SPECTER", message: "Found 8 companies. Scoring against ICP. Top 3: AutomateDE (85/100), KI-Fabrik (72/100), DataBridge (68/100).", counters: { companies: 8, leads: 3 } },
      { time: "09:22", agent: "SPECTER", message: "Drafting cold outreach to AutomateDE. Researching founder Marcus Weber's recent LinkedIn posts..." },
      { time: "09:30", agent: "SPECTER", message: "Email saved. Subject: Your automation stack is missing one layer. Hook references Marcus's post about client onboarding bottlenecks from last Tuesday. 8 leads total saved.", type: "success", counters: { leads: 8, emails: 3 } },
      { time: "12:00", agent: "STRIKER", message: "Inbox triage initiated. Scanning last 72 hours of email. 47 emails processed." },
      { time: "12:03", agent: "STRIKER", message: "Deal opportunity flagged: Carl Sundberg, Stonemonk Media. Previous conversation about marketing partnership from 11 days ago. No reply sent. Status: stale." },
      { time: "12:08", agent: "STRIKER", message: "Researching Carl Sundberg. Founded Stonemonk Media 2015, Portland OR. LinkedIn: 1,200 followers, posts about profit acceleration models. Estimated revenue: $500K-2M." },
      { time: "12:15", agent: "STRIKER", message: "Context-aware follow-up email drafted. References his profit acceleration model post from last month. Subject: Circling back. The ROI piece you would care about.", type: "success", counters: { emails: 4 } },
      { time: "12:18", agent: "STRIKER", message: "Lead saved: Carl Sundberg, Stonemonk Media. Score: 60/100. Status: warm." },
      { time: "12:22", agent: "STRIKER", message: "3 additional deal-related emails flagged. 2 conference invitations deprioritized. Inbox triage complete.", type: "success" },
      { time: "15:00", agent: "CORTEX", message: "Monitoring r/entrepreneur and IndieHackers for mentions of product category. Scanning last 24 hours...", counters: { companies: 12 } },
      { time: "15:06", agent: "CORTEX", message: "Found 3 relevant threads. One post on IndieHackers by founder with 800+ upvotes asking about AI team management tools. Flagging for Specter." },
      { time: "18:00", agent: "SENTINEL", message: "End-of-day health check. All systems nominal. Website uptime: 100% for the past 24 hours. 0 alerts triggered.", type: "success" },
    ],
  },
  {
    day: "DAY 2",
    date: "Tuesday",
    entries: [
      { time: "03:22", agent: "SENTINEL", message: "Overnight health check. All systems nominal. Response time: 138ms. No anomalies." },
      { time: "07:00", agent: "CORTEX", message: "Deep dive on Nexus AI (flagged yesterday). Scanning LinkedIn for team changes, Crunchbase for funding, G2 for reviews...", counters: { companies: 13 } },
      { time: "07:14", agent: "CORTEX", message: "Nexus AI hired VP of Sales 3 weeks ago. Posted 4 new job listings for enterprise AEs. Signal: moving upmarket aggressively.", type: "warning" },
      { time: "07:22", agent: "CORTEX", message: "Report updated: Nexus AI Competitive Profile. Added enterprise pivot signal and pricing tier change from yesterday.", type: "success", counters: { companies: 14 } },
      { time: "08:30", agent: "PULSE", message: "Publishing LinkedIn post drafted yesterday: I analyzed 3 AI startups that launched this week..." },
      { time: "08:31", agent: "PULSE", message: "Post live. Tracking engagement. Will report metrics at 18:00.", type: "success", counters: { posts: 2 } },
      { time: "09:00", agent: "SPECTER", message: "Following up on yesterday's lead list. Sending LinkedIn connection requests to 6 of 8 leads (2 already connected).", counters: { companies: 16 } },
      { time: "09:12", agent: "SPECTER", message: "Connection request to Marcus Weber (AutomateDE) accepted. Queueing personalized follow-up message for tomorrow.", type: "success", counters: { leads: 9 } },
      { time: "09:45", agent: "SPECTER", message: "Apollo API rate limited. Queuing remaining 3 leads for next batch in 45 minutes.", type: "warning" },
      { time: "10:30", agent: "SPECTER", message: "Rate limit cleared. Resuming lead enrichment. 3 remaining leads processed.", type: "success" },
      { time: "11:00", agent: "STRIKER", message: "Inbox scan. 23 new emails since yesterday's triage. 4 flagged as deal-relevant." },
      { time: "11:08", agent: "STRIKER", message: "Email from Sarah Chen, Meridian Labs. Tone analysis: positive but non-committal. Requesting product demo. Recommending follow-up with case study attachment." },
      { time: "11:15", agent: "STRIKER", message: "Demo request logged. Follow-up email drafted with 2 relevant case studies. Subject: Here is the Meridian-specific breakdown you asked about.", type: "success", counters: { emails: 5 } },
      { time: "12:00", agent: "CORTEX", message: "IndieHackers thread from yesterday (800+ upvotes). Analyzing comments for pain points and product gaps...", counters: { companies: 20 } },
      { time: "12:18", agent: "CORTEX", message: "Pain point cluster identified: AI agents that forget context between sessions. 47 comments mention this. Flagging as content angle for Pulse." },
      { time: "14:47", agent: "PULSE", message: "Writing blog post: Why most AI agents forget everything after one conversation. Based on Cortex pain point analysis." },
      { time: "14:58", agent: "PULSE", message: "Blog draft complete. 1,200 words. Readability score: 71. Above threshold. Saved to content library.", type: "success", counters: { posts: 3 } },
      { time: "15:30", agent: "SPECTER", message: "Email open tracking: 3 of 8 yesterday's outreach emails opened. AutomateDE opened twice. DataBridge opened once. No replies yet.", counters: { leads: 11, emails: 7 } },
      { time: "18:00", agent: "PULSE", message: "LinkedIn post performance: 312 impressions, 24 reactions, 7 comments, 2 DMs. Above average. Content strategy validated.", type: "success" },
      { time: "18:15", agent: "SENTINEL", message: "End of day check. Uptime: 100%. No alerts. Competitor monitoring: no additional changes detected.", type: "success" },
      { time: "22:15", agent: "SENTINEL", message: "SSL renewal reminder: certificate for staging environment expires in 14 days. Logging maintenance task.", type: "warning" },
    ],
  },
  {
    day: "DAY 3",
    date: "Wednesday",
    entries: [
      { time: "05:45", agent: "SENTINEL", message: "Health check. Response time degraded: 890ms (normally 140ms). Investigating...", type: "warning" },
      { time: "05:48", agent: "SENTINEL", message: "Root cause: third-party CDN latency spike. Not internal infrastructure. Monitoring. Will alert if it persists past 30 minutes." },
      { time: "06:12", agent: "SENTINEL", message: "CDN latency resolved. Response time back to 145ms. Incident duration: 27 minutes. Logging for weekly report.", type: "success" },
      { time: "07:00", agent: "CORTEX", message: "Weekly competitor roundup. Scanning all 4 tracked competitors for changes since Monday...", counters: { companies: 21 } },
      { time: "07:15", agent: "CORTEX", message: "Summary: 1 pricing change (Nexus AI, flagged Monday), 1 new blog post from FlowStack on enterprise AI adoption, 0 product launches. Market: stable.", type: "success", counters: { companies: 22 } },
      { time: "08:00", agent: "PULSE", message: "Repurposing yesterday's blog post into email newsletter draft. Shortening to 400 words. Adding CTA to book a demo." },
      { time: "08:14", agent: "PULSE", message: "Newsletter draft complete. Subject line: Why your AI agents forget everything (and what to do about it). Saved.", type: "success", counters: { posts: 4 } },
      { time: "08:30", agent: "PULSE", message: "Generating Twitter thread from blog post. 7 tweets. Scheduling for 12:00 posting." },
      { time: "09:00", agent: "SPECTER", message: "AutomateDE founder Marcus Weber replied to LinkedIn message. Positive response. Wants to discuss integration possibilities. Flagging for Striker.", type: "success" },
      { time: "09:05", agent: "STRIKER", message: "Hot lead alert: Marcus Weber, AutomateDE, replied on LinkedIn. Score updated: 85 to 92. Moving to active pipeline.", type: "success" },
      { time: "09:12", agent: "STRIKER", message: "Meeting request email drafted to Marcus. Proposed 3 time slots this week. Subject: Quick call this week. 3 slots open.", type: "success", counters: { emails: 8 } },
      { time: "10:00", agent: "STRIKER", message: "Carl Sundberg (flagged Monday) opened follow-up email twice yesterday. No reply yet. Scheduling second follow-up for Friday with different angle." },
      { time: "11:30", agent: "SPECTER", message: "New lead batch: SaaS companies in Nordics with 10-50 employees. Found 11 matches. Scoring...", counters: { companies: 23 } },
      { time: "11:45", agent: "SPECTER", message: "Top leads: Layke (score: 78), Kodify (score: 74), NordTech (score: 71). Drafting outreach for top 5.", type: "success", counters: { leads: 12 } },
      { time: "12:00", agent: "PULSE", message: "Twitter thread published. 7 tweets live. Monitoring engagement.", type: "success", counters: { posts: 5 } },
      { time: "13:00", agent: "CORTEX", message: "Reddit scan: r/SaaS, r/startups, r/entrepreneur. Found thread: Looking for AI tools to replace my VA. 200+ upvotes. Exact ICP match. Flagging for Specter." },
      { time: "13:08", agent: "SPECTER", message: "Reddit lead captured. OP profile: SaaS founder, 15 employees, actively looking. Cannot DM on Reddit. Searching for LinkedIn profile..." },
      { time: "13:15", agent: "SPECTER", message: "LinkedIn profile found. Adding to lead list. Score: 80. Outreach queued for tomorrow.", type: "success" },
      { time: "15:00", agent: "PULSE", message: "LinkedIn post #2 this week performing: 478 impressions, 31 reactions, 4 shares. Highest performing post this month.", type: "success" },
      { time: "16:00", agent: "STRIKER", message: "Pipeline summary: 3 active deals, 2 warming leads, 1 meeting requested. Total pipeline value: $14,500. Next actions queued for all.", type: "success" },
      { time: "18:00", agent: "SENTINEL", message: "Weekly security audit initiated. Checking SSL, DNS, exposed ports, dependency vulnerabilities..." },
      { time: "18:20", agent: "SENTINEL", message: "Audit complete. 0 critical issues. 1 minor: dependency update available for analytics package. Logging.", type: "success" },
      { time: "20:00", agent: "SENTINEL", message: "Weekly system report compiled. Uptime: 99.97% (27 min CDN incident). 0 security issues. Performance: nominal.", type: "success" },
      { time: "23:00", agent: "CORTEX", message: "WEEKLY SUMMARY: 23 companies researched. 12 leads qualified. 8 outreach emails sent. 5 content pieces published. 3 competitor analyses completed. 2 deal opportunities flagged. 1 hot lead converted to meeting. System efficiency: nominal. All agents operational.", type: "success" },
    ],
  },
];

const typeStyles: Record<string, string> = {
  warning: "text-[#1F77F6]",
  success: "text-[#DA4E24]",
  error: "text-[#999]",
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
      <div className="sticky top-14 z-40 bg-black/95 backdrop-blur-sm border-b border-[#1a1a1a] mb-4">
        <div className="py-2 px-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto gap-2">
            <span className="text-xs text-[#555] font-terminal hidden sm:block flex-shrink-0">LIVE</span>
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              {[
                { label: "Companies", value: counters.companies },
                { label: "Leads", value: counters.leads },
                { label: "Emails", value: counters.emails },
                { label: "Posts", value: counters.posts },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  <span className="text-base font-bold font-terminal tabular-nums text-[#DA4E24]">{c.value}</span>
                  <span className="text-xs text-[#555]">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="w-2 h-2 rounded-full bg-[#DA4E24] pulse-soft flex-shrink-0" />
          </div>
        </div>
      </div>

      <div className="bg-black border border-[#1a1a1a] rounded-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border-b border-[#1a1a1a]">
          <div className="w-3 h-3 rounded-full bg-[#DA4E24]/60" />
          <div className="w-3 h-3 rounded-full bg-[#999]/40" />
          <div className="w-3 h-3 rounded-full bg-[#1F77F6]/40" />
          <span className="ml-2 text-[#555] text-xs font-terminal">ultron-activity-log. session-72h</span>
        </div>

        {/* Day selector */}
        <div className="flex border-b border-[#1a1a1a] bg-[#0a0a0a]">
          {logData.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`flex-1 py-3 text-xs font-terminal font-medium transition-colors ${
                activeDay === i
                  ? "text-[#DA4E24] border-b-2 border-[#DA4E24]"
                  : "text-[#555] hover:text-[#999]"
              }`}
            >
              {day.day}
              <span className="hidden sm:inline text-[#333] ml-1">/ {day.date}</span>
            </button>
          ))}
        </div>

        {/* Agent filter */}
        <div className="flex gap-2 px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a] overflow-x-auto">
          {agents.map((agent) => (
            <button
              key={agent}
              onClick={() => setFilter(agent)}
              className={`flex-shrink-0 px-3 py-1 rounded text-xs font-terminal font-medium border transition-colors ${
                filter === agent
                  ? "bg-[#DA4E24]/10 text-[#DA4E24] border-[#DA4E24]/30"
                  : "text-[#555] border-[#1a1a1a] hover:border-[#333] hover:text-[#999]"
              }`}
            >
              {agent}
            </button>
          ))}
        </div>

        {/* Log entries */}
        <div className="p-4 space-y-0.5 max-h-[600px] overflow-y-auto">
          {filteredEntries.map((entry, i) => (
            <div
              key={i}
              ref={(el) => { entryRefs.current[i] = el; }}
              className="flex gap-3 py-1.5 border-b border-[#0a0a0a] hover:bg-[#0a0a0a] transition-colors px-1 rounded"
            >
              <span className="text-[#444] flex-shrink-0 w-10 text-xs font-terminal">{entry.time}</span>
              <span className="flex-shrink-0 w-16 font-bold text-xs text-[#DA4E24] font-terminal">
                {entry.agent}
              </span>
              <span className={`flex-1 leading-relaxed text-xs ${
                entry.type ? typeStyles[entry.type] : "text-[#999]"
              }`}>
                {entry.type === "warning" && <span className="text-[#1F77F6] mr-1">!</span>}
                {entry.type === "success" && <span className="text-[#DA4E24] mr-1">+</span>}
                {entry.type === "error" && <span className="text-[#999] mr-1">x</span>}
                {entry.message}
              </span>
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-[#555] text-center py-8 text-xs font-terminal">
              No entries for {filter} on {logData[activeDay].day}
            </div>
          )}
          <div className="flex gap-3 py-1.5 px-1">
            <span className="text-[#444] w-10 text-xs font-terminal" />
            <span className="text-[#DA4E24] text-xs font-terminal"><span className="cursor-blink">_</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
