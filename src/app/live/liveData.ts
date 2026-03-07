export type AgentId = "CORTEX" | "SPECTER" | "STRIKER" | "PULSE" | "SENTINEL";
export type TimeRange = "7D" | "30D" | "90D" | "ALL";

const LAUNCH = new Date("2025-12-15").getTime();

export function getBaseMetrics() {
  const days = (Date.now() - LAUNCH) / 86400000;
  return {
    agents: Math.floor(47 + days * 1.8),
    tasks: Math.floor(840 + days * 62),
    apiCalls: Math.floor(9200 + days * 480),
    revenue: Math.floor(18500 + days * 950),
  };
}

/* ── sparkline data (7 points) ── */
export function getSparkline(base: number, variance: number): number[] {
  const seed = Math.floor(Date.now() / 86400000);
  return Array.from({ length: 7 }, (_, i) => {
    const v = Math.sin(seed + i * 1.7) * variance;
    return Math.floor(base + v + i * (variance * 0.3));
  });
}

/* ── Agent info ── */
export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  tasks: string[];
  tasksToday: number;
  completionRate: number;
  lastCompleted: string;
}

export const agents: AgentInfo[] = [
  {
    id: "CORTEX",
    name: "CORTEX",
    role: "Research & Intelligence",
    tasks: [
      "Scanning ProductHunt launches...",
      "Analyzing competitor job postings...",
      "Monitoring Reddit for ICP mentions...",
      "Updating market intelligence report...",
      "Cross-referencing Crunchbase data...",
    ],
    tasksToday: 47,
    completionRate: 94,
    lastCompleted: "2 min ago",
  },
  {
    id: "SPECTER",
    name: "SPECTER",
    role: "Lead Generation & Scoring",
    tasks: [
      "Enriching 12 new leads via Apollo...",
      "Scoring lead batch #47...",
      "Drafting outreach to marcus@automatede.com...",
      "LinkedIn profile scan: 8 prospects...",
      "Building DACH region lead list...",
    ],
    tasksToday: 63,
    completionRate: 97,
    lastCompleted: "45 sec ago",
  },
  {
    id: "STRIKER",
    name: "STRIKER",
    role: "Outreach & Execution",
    tasks: [
      "Triaging inbox: 23 new emails...",
      "Drafting follow-up for stale deal...",
      "Updating pipeline: 3 deals moved...",
      "Creating Calendar reminder for Marcus call...",
      "Analyzing email open rates...",
    ],
    tasksToday: 51,
    completionRate: 91,
    lastCompleted: "1 min ago",
  },
  {
    id: "PULSE",
    name: "PULSE",
    role: "Content & Distribution",
    tasks: [
      "Writing LinkedIn post #3 of 5...",
      "Scraping viral hooks from this week...",
      "Adapting blog post for Twitter thread...",
      "Scheduling content for tomorrow 9AM...",
      "Analyzing engagement on yesterday's post...",
    ],
    tasksToday: 38,
    completionRate: 96,
    lastCompleted: "3 min ago",
  },
  {
    id: "SENTINEL",
    name: "SENTINEL",
    role: "Monitoring & Security",
    tasks: [
      "Health check: response time 142ms...",
      "SSL certificate: 74 days remaining...",
      "Scanning for broken links: 0 found...",
      "Competitor site change detected...",
      "API endpoint test: all operational...",
    ],
    tasksToday: 29,
    completionRate: 99,
    lastCompleted: "30 sec ago",
  },
];

/* ── Revenue chart data ── */
export function getRevenueData(range: TimeRange) {
  const mult = range === "7D" ? 0.6 : range === "30D" ? 1 : range === "90D" ? 1.5 : 2;
  const ultron = [2100, 4800, 7200, 10500, 14200, 17800, 22400, 27100, 31500, 36800, 41200, 47500].map(
    (v) => Math.floor(v * mult)
  );
  const manual = [3200, 3800, 4100, 4500, 5200, 5800, 6100, 6800, 7200, 7500, 7800, 8200].map(
    (v) => Math.floor(v * mult)
  );
  return { ultron, manual };
}

/* ── Pipeline funnel ── */
export function getPipelineData(range: TimeRange) {
  const mult = range === "7D" ? 0.3 : range === "30D" ? 1 : range === "90D" ? 2.5 : 4;
  return [
    { label: "LEADS FOUND", value: Math.floor(1247 * mult) },
    { label: "QUALIFIED", value: Math.floor(489 * mult), rate: 39.2 },
    { label: "OUTREACH SENT", value: Math.floor(312 * mult), rate: 63.8 },
    { label: "REPLIES", value: Math.floor(94 * mult), rate: 30.1 },
    { label: "MEETINGS BOOKED", value: Math.floor(41 * mult), rate: 43.6 },
    { label: "DEALS CLOSED", value: Math.floor(18 * mult), rate: 43.9 },
  ];
}

/* ── Donut chart data ── */
export function getDonutData(range: TimeRange, activeAgents: Set<AgentId>) {
  const mult = range === "7D" ? 0.3 : range === "30D" ? 1 : range === "90D" ? 2.5 : 4;
  const all = [
    { agent: "SPECTER" as AgentId, pct: 28, tasks: Math.floor(847 * mult) },
    { agent: "CORTEX" as AgentId, pct: 22, tasks: Math.floor(692 * mult) },
    { agent: "PULSE" as AgentId, pct: 20, tasks: Math.floor(614 * mult) },
    { agent: "STRIKER" as AgentId, pct: 18, tasks: Math.floor(558 * mult) },
    { agent: "SENTINEL" as AgentId, pct: 12, tasks: Math.floor(371 * mult) },
  ];
  return all.filter((d) => activeAgents.has(d.agent));
}

/* ── Horizontal bar chart (tasks per agent) ── */
export function getTaskBars(range: TimeRange) {
  const mult = range === "7D" ? 0.3 : range === "30D" ? 1 : range === "90D" ? 2.5 : 4;
  return [
    { agent: "SPECTER" as AgentId, tasks: Math.floor(847 * mult) },
    { agent: "CORTEX" as AgentId, tasks: Math.floor(692 * mult) },
    { agent: "PULSE" as AgentId, tasks: Math.floor(614 * mult) },
    { agent: "STRIKER" as AgentId, tasks: Math.floor(558 * mult) },
    { agent: "SENTINEL" as AgentId, tasks: Math.floor(371 * mult) },
  ];
}

/* ── Content performance ── */
export const contentStats = {
  postsThisMonth: 47,
  dailyPosts: [3, 2, 4, 1, 3, 2, 3],
  platforms: [
    { name: "LinkedIn", count: 18 },
    { name: "Twitter", count: 14 },
    { name: "Blog", count: 8 },
    { name: "Email", count: 7 },
  ],
  engagementRate: 4.2,
  engagementTrend: [2.1, 2.4, 2.8, 3.0, 3.2, 3.5, 3.4, 3.8, 4.0, 3.9, 4.1, 4.2],
};

/* ── Money saved ── */
export const moneySaved = [
  { label: "SDR", amount: 4500 },
  { label: "Content", amount: 4000 },
  { label: "Sales Ops", amount: 3500 },
  { label: "Research", amount: 3000 },
  { label: "DevOps", amount: 5000 },
];
export const totalSaved = moneySaved.reduce((s, m) => s + m.amount, 0);

/* ── Activity heatmap (90 days, 7 rows x 13 cols) ── */
export function getHeatmapData(): number[] {
  const cells: number[] = [];
  const seed = Math.floor(Date.now() / 86400000);
  for (let w = 0; w < 13; w++) {
    for (let d = 0; d < 7; d++) {
      const isWeekend = d >= 5;
      const base = isWeekend ? 0.3 : 0.7;
      const noise = Math.abs(Math.sin(seed + w * 7 + d * 3.7)) * 0.6;
      const spike = (w === 4 && d === 2) || (w === 9 && d === 3) || (w === 11 && d === 1) ? 0.4 : 0;
      cells.push(Math.min(1, base + noise * (isWeekend ? 0.5 : 1) + spike));
    }
  }
  return cells;
}

/* ── System health ── */
export const systemHealth = [
  { label: "Website Uptime", value: "99.97%", bar: 99.97, status: "green" as const },
  { label: "Avg Response Time", value: "142ms", bar: 40, status: "green" as const },
  { label: "SSL Certificate", value: "Valid", detail: "74 days remaining", status: "green" as const },
  { label: "API Health", value: "Operational", detail: "All 12 endpoints", status: "green" as const },
  { label: "Security Audit", value: "Clear", detail: "Last run: 2h ago", status: "green" as const },
  { label: "Competitor Monitor", value: "Active", detail: "4 competitors tracked", status: "green" as const },
  { label: "Database", value: "Healthy", detail: "847 MB / 5 GB", status: "green" as const },
  { label: "Cron Jobs", value: "Running", detail: "5/5 agents scheduled", status: "green" as const },
];

/* ── Activity feed entries ── */
export const feedEntries = [
  { agent: "CORTEX" as AgentId, text: "Competitor pricing change detected: Nexus AI +$200/mo" },
  { agent: "SPECTER" as AgentId, text: "Lead scored: Sarah Chen, Meridian Labs \u2014 78/100" },
  { agent: "STRIKER" as AgentId, text: "Follow-up email drafted for stale deal: BuildStack" },
  { agent: "PULSE" as AgentId, text: 'LinkedIn post published: "Why 3 AI startups will fail..."' },
  { agent: "SENTINEL" as AgentId, text: "Health check complete. All systems nominal." },
  { agent: "SPECTER" as AgentId, text: "New lead: Jonas Kraft, KI-Fabrik \u2014 enriched via Apollo" },
  { agent: "CORTEX" as AgentId, text: "Reddit thread detected: r/SaaS \u2014 ICP match found" },
  { agent: "STRIKER" as AgentId, text: "Pipeline update: Marcus Weber moved to Proposal stage" },
  { agent: "PULSE" as AgentId, text: "Blog post draft saved: 1,200 words, readability 71" },
  { agent: "SENTINEL" as AgentId, text: "API endpoint test: /api/leads \u2014 89ms response" },
  { agent: "CORTEX" as AgentId, text: "Market report generated: 14 new funding rounds this week" },
  { agent: "SPECTER" as AgentId, text: "Enriching batch #48: 15 leads from DACH region" },
  { agent: "STRIKER" as AgentId, text: "Email opened: sarah.chen@scaleflow.io (3rd touch)" },
  { agent: "PULSE" as AgentId, text: "Twitter thread scheduled: 7 tweets, 9AM tomorrow" },
  { agent: "SENTINEL" as AgentId, text: "Broken link fixed: /blog/old-post redirected" },
  { agent: "CORTEX" as AgentId, text: "Competitor job posting spike: GoHighLevel hiring 8 engineers" },
  { agent: "SPECTER" as AgentId, text: "Lead list exported: 23 qualified prospects for review" },
  { agent: "STRIKER" as AgentId, text: "Meeting booked: Sarah Chen, Thursday 2:00 PM" },
  { agent: "PULSE" as AgentId, text: "Engagement report: LinkedIn post hit 12.4K impressions" },
  { agent: "SENTINEL" as AgentId, text: "SSL renewal reminder set: 60 days out" },
  { agent: "CORTEX" as AgentId, text: "ProductHunt scan: 3 relevant launches detected" },
  { agent: "SPECTER" as AgentId, text: "Lead scored: Tom Liu, DataBridge \u2014 91/100" },
  { agent: "STRIKER" as AgentId, text: "Deal alert: AutomateDE contract sent for signature" },
  { agent: "PULSE" as AgentId, text: 'Instagram carousel created: "5 signs you need AI agents"' },
  { agent: "SENTINEL" as AgentId, text: "Performance audit: /pricing loads in 1.8s (target <2s)" },
  { agent: "CORTEX" as AgentId, text: "Crunchbase data synced: 47 new companies in ICP" },
  { agent: "SPECTER" as AgentId, text: "Apollo enrichment complete: 12/12 emails verified" },
  { agent: "STRIKER" as AgentId, text: "Follow-up #3 sent to jonas@ki-fabrik.de" },
  { agent: "PULSE" as AgentId, text: "Content calendar updated: 5 posts queued for next week" },
  { agent: "SENTINEL" as AgentId, text: "Security scan clear: no exposed endpoints found" },
  { agent: "CORTEX" as AgentId, text: "Trend detected: 'agentic AI' mentions up 280% this week" },
  { agent: "SPECTER" as AgentId, text: "New ICP match: CloudBase (Series A, 45 employees)" },
  { agent: "STRIKER" as AgentId, text: "Proposal template customized for enterprise tier" },
  { agent: "PULSE" as AgentId, text: "Hook analysis: contrarian takes getting 4.2x engagement" },
  { agent: "SENTINEL" as AgentId, text: "Database backup verified: 847 MB, integrity check passed" },
  { agent: "CORTEX" as AgentId, text: "Weekly competitor report compiled: 4 changes detected" },
  { agent: "SPECTER" as AgentId, text: "Lead nurture sequence started: 8 prospects in pipeline" },
  { agent: "STRIKER" as AgentId, text: "Calendar blocked: 3 discovery calls this week" },
  { agent: "PULSE" as AgentId, text: "Video script drafted: 90-second product walkthrough" },
  { agent: "SENTINEL" as AgentId, text: "Uptime check: 99.97% over last 30 days" },
  { agent: "CORTEX" as AgentId, text: "G2 review scan: 3 new competitor complaints found" },
  { agent: "SPECTER" as AgentId, text: "Contact found: sarah.chen@scaleflow.io (98% confidence)" },
  { agent: "STRIKER" as AgentId, text: "Invoice reminder drafted: DataBridge ($4,500, 5 days overdue)" },
  { agent: "PULSE" as AgentId, text: "Engagement spike: case study post trending on LinkedIn" },
  { agent: "SENTINEL" as AgentId, text: "Cron status: all 5 agents running on schedule" },
  { agent: "CORTEX" as AgentId, text: "Partnership opportunity: IntegrateHQ (CRM, 5K users)" },
  { agent: "SPECTER" as AgentId, text: "Lead re-scored: Marcus Weber moved to 92/100" },
  { agent: "STRIKER" as AgentId, text: "Outreach campaign #12 completed: 47 emails, 14% reply rate" },
  { agent: "PULSE" as AgentId, text: "A/B test result: Hook B outperformed by 2.8x" },
  { agent: "SENTINEL" as AgentId, text: "Competitor alert: Instantly.ai launched new feature" },
];

/* ── Outreach performance ── */
export const outreachStats = {
  emailsSent: 312,
  openRate: { value: 47.2, change: 3.1, up: true },
  replyRate: { value: 12.8, change: 1.4, up: true },
  meetingsBooked: 41,
  avgResponseTime: "4.2 hours",
  bestSubject: "Your automation stack is missing one layer",
};

/* ── Competitor tracking ── */
export const competitors = [
  { name: "Clay.com", change: "Pricing update 3d ago", status: "monitoring" as const },
  { name: "Instantly.ai", change: "New feature 1w ago", status: "monitoring" as const },
  { name: "GoHighLevel.com", change: "Job posting spike", status: "alert" as const },
  { name: "Nexus AI", change: "Enterprise tier added", status: "alert" as const },
];
