export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;            // ISO date string
  readTime: string;        // e.g. "6 min read"
  featured?: boolean;
  body: string;            // markdown content
}

/*
 * ─── HOW TO ADD NEW POSTS ───────────────────────────────────
 *
 * Export your posts from ChatGPT as .md files with this frontmatter:
 *
 *   ---
 *   slug: my-post-slug
 *   title: My Post Title
 *   excerpt: A one-liner summary.
 *   category: AI Automation
 *   date: 2026-03-20
 *   readTime: 6 min read
 *   featured: false
 *   ---
 *
 *   ## Markdown body here…
 *
 * Then paste the content into a new object in the `posts` array below,
 * using the same structure. The `body` field is standard markdown.
 *
 * Or: place .md files in /content/news/ and we can build a loader
 * that reads them at build time (ask Claude to set that up).
 * ─────────────────────────────────────────────────────────────
 */

export const posts: BlogPost[] = [
  {
    slug: "ai-sales-agents-replacing-sdrs-2026",
    title: "Why AI Sales Agents Are Replacing SDRs in 2026",
    excerpt:
      "The economics of outbound sales have fundamentally shifted. Here's how autonomous AI agents are outperforming human SDR teams at a fraction of the cost.",
    category: "AI Automation",
    date: "2026-03-18",
    readTime: "8 min read",
    featured: true,
    body: `The traditional Sales Development Representative model is breaking. Companies spend $75,000–$120,000 per SDR annually — salary, tools, training, management overhead — and get diminishing returns. Ramp time averages 3–4 months. Turnover sits at 35%. The math no longer works.

Meanwhile, AI sales agents have crossed a critical threshold. They don't just send templated emails anymore. They research prospects in real-time, craft personalized outreach based on company signals, handle objections in multi-turn conversations, and book qualified meetings directly on your calendar.

## The Unit Economics Tell the Story

Consider a mid-market B2B company running a 5-person SDR team:

- **Annual cost:** $500K+ (salary, benefits, tools, management)
- **Output:** ~150 qualified meetings per month at peak performance
- **Ramp time:** 3–4 months before a new hire is productive
- **Consistency:** Performance varies wildly by rep, day, and mood

Now compare that to an AI-powered pipeline with Ultron:

- **Annual cost:** Under $36K
- **Output:** 200+ qualified engagements per month from day one
- **Ramp time:** Zero — deploys in hours, not months
- **Consistency:** Same quality at 2 AM as 2 PM, every single day

That's not a marginal improvement. That's a structural shift in how pipeline gets built.

## What Changed in the Last 12 Months

Three converging trends made this possible:

**1. Language models got reliable enough for business communication.** Early AI outreach was obviously robotic. Current models produce emails and LinkedIn messages that are indistinguishable from a skilled human rep — because they understand context, tone, and timing.

**2. Real-time data enrichment became accessible.** AI agents can now pull live signals — job changes, funding rounds, tech stack updates, hiring patterns — and use them to craft relevant outreach within seconds of a trigger event.

**3. Multi-channel orchestration matured.** Modern AI agents don't just email. They coordinate across email, LinkedIn, and phone in sequenced campaigns that adapt based on prospect behavior.

## The Human Role Is Evolving, Not Disappearing

This isn't about eliminating people from sales. It's about redeploying them where they create the most value. The best-performing teams in 2026 use AI agents to handle the top of funnel — prospecting, initial outreach, qualification, and meeting booking — while human AEs focus on what they do best: building relationships, running demos, and closing deals.

The companies that figured this out early are seeing 3–5x more pipeline per sales dollar spent. The ones still hiring SDR armies are burning cash on a model that peaked in 2021.

## What This Means for Founders

If you're a B2B founder or revenue leader, the question isn't whether to adopt AI sales agents. It's how fast you can integrate them before your competitors do.

The playbook is straightforward:

- **Start with a focused ICP.** Give your AI agent a well-defined Ideal Customer Profile and let it learn what converts.
- **Feed it real data.** Connect your CRM, past conversations, and win/loss patterns so the agent gets smarter over time.
- **Keep humans in the loop for high-value moments.** AI books the meeting, your best closer runs it.
- **Measure cost per qualified meeting, not activity volume.** Vanity metrics like emails sent are meaningless. Pipeline created per dollar spent is all that matters.

The SDR model served its purpose for a decade. But the economics have shifted permanently. AI agents aren't the future of outbound sales — they're the present. The only question is whether you're building with them or competing against them.`,
  },
  {
    slug: "building-autonomous-sales-pipeline",
    title: "How to Build a Fully Autonomous Sales Pipeline",
    excerpt:
      "A step-by-step breakdown of deploying AI agents that prospect, qualify, and book meetings without human intervention.",
    category: "Playbooks",
    date: "2026-03-12",
    readTime: "6 min read",
    body: `Placeholder — full article coming soon.`,
  },
  {
    slug: "ultron-product-update-march-2026",
    title: "Product Update: Multi-Agent Orchestration, CRM Sync, and More",
    excerpt:
      "What shipped in March 2026 — including parallel agent execution, native HubSpot/Salesforce sync, and the new ROI dashboard.",
    category: "Product",
    date: "2026-03-05",
    readTime: "4 min read",
    body: `Placeholder — full article coming soon.`,
  },
  {
    slug: "roi-calculator-ai-outbound",
    title: "The Real ROI of AI Outbound: What the Data Shows",
    excerpt:
      "We analyzed 12 months of customer data. Here are the actual numbers on cost savings, conversion rates, and pipeline growth.",
    category: "Data",
    date: "2026-02-22",
    readTime: "5 min read",
    body: `Placeholder — full article coming soon.`,
  },
  {
    slug: "from-cold-email-to-closed-deal",
    title: "From Cold Email to Closed Deal: Anatomy of an AI-Run Campaign",
    excerpt:
      "A real campaign teardown showing how Ultron agents took a prospect from first touch to signed contract in 11 days.",
    category: "Case Study",
    date: "2026-02-14",
    readTime: "7 min read",
    body: `Placeholder — full article coming soon.`,
  },
  {
    slug: "nxt-enterprises-seed-round",
    title: "NXT Enterprises Closes Pre-Seed to Build the Future of Autonomous Sales",
    excerpt:
      "We raised our initial round to accelerate Ultron development and expand across Europe and the US.",
    category: "Company",
    date: "2026-01-28",
    readTime: "3 min read",
    body: `Placeholder — full article coming soon.`,
  },
];
