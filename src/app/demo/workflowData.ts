// Workflow data for all 20 demo prompts

export type NodeIcon = "search" | "person" | "mail" | "calendar" | "code" | "database" | "shield" | "chart" | "content" | "linkedin";

export type Category = "all" | "revenue" | "automation" | "competitive" | "operations";

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "revenue", label: "Revenue" },
  { id: "automation", label: "Automation" },
  { id: "competitive", label: "Competitive" },
  { id: "operations", label: "Operations" },
];

// Cost per node type for "Money saved" counter
export const nodeCostMap: Record<string, number> = {
  "search": 150, "chart": 150, "person": 200, "linkedin": 200,
  "mail": 300, "calendar": 50, "content": 250, "code": 200,
  "shield": 200, "database": 150,
};

export interface WorkflowNode {
  id: string;
  icon: NodeIcon;
  tool: string;
  text: string;
  delay: number; // ms after branch starts
  hoverPreview?: string; // tooltip content on hover when complete
}

export interface OutputUpdate {
  icon: NodeIcon;
  text: string;
  count?: number;
  afterNodeId: string; // appears after this node completes
}

export interface AgentBranch {
  agent: string;
  subtitle: string;
  color: string; // "orange" for same-agent, "blue" for cross-agent
  startDelay: number; // ms after workflow starts
  nodes: WorkflowNode[];
  outputUpdates: OutputUpdate[];
  sendsDataTo?: string; // agent name data flows to
}

export interface TimelineEntry {
  time: string;
  agent: string;
  text: string;
  delay: number; // ms after workflow starts
}

export interface PromptData {
  id: number;
  slug: string;
  prompt: string;
  tags: string;
  category: Category;
  popular?: boolean;
  agentNames: string[];
  brainResponse: string;
  type: "branch" | "timeline";
  branches?: AgentBranch[];
  timeline?: TimelineEntry[];
  summary: {
    actions: number;
    time: number;
    humanTime: string;
    humanCost: string;
  };
  outputSummary: string;
}

export const prompts: PromptData[] = [
  // PROMPT 1
  {
    id: 1,
    slug: "make-me-20k",
    prompt: "Make me $20,000 this month",
    tags: "ALL 5 AGENTS",
    category: "revenue",
    popular: true,
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "You sell at $4,997 per deal. You need 4 closes. Deploying full pipeline.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "1-c1", icon: "search", tool: "Brave Search API", text: "Searching for SaaS founders who raised seed rounds this month...", delay: 0 },
          { id: "1-c2", icon: "person", tool: "Apollo Enrichment", text: "Enriching 23 companies with decision-maker data...", delay: 1200 },
          { id: "1-c3", icon: "chart", tool: "Analysis Engine", text: "Scoring companies by ICP fit and timing signals...", delay: 2200 },
          { id: "1-c4", icon: "database", tool: "Save to Supabase", text: "Intel report saved. 6 high-priority targets identified.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "chart", text: "6 high-priority targets identified", afterNodeId: "1-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "1-s1", icon: "person", tool: "Apollo.io API", text: "Pulling verified emails for 23 founders...", delay: 0 },
          { id: "1-s2", icon: "linkedin", tool: "LinkedIn Search", text: "Cross-referencing LinkedIn profiles for recent activity...", delay: 1500 },
          { id: "1-s3", icon: "chart", tool: "Lead Scoring", text: 'Scoring leads 0-100... Top lead: Marcus Weber, AutomateDE (85/100)', delay: 2500, hoverPreview: "Top 3 Leads:\n1. Marcus Weber, AutomateDE — 85/100\n2. Sarah Chen, Meridian Labs — 78/100\n3. Jonas Kraft, KI-Fabrik — 72/100" },
          { id: "1-s4", icon: "database", tool: "Save to CRM", text: "23 leads saved. 8 qualified. 3 hot.", delay: 3300 },
        ],
        outputUpdates: [
          { icon: "person", text: "leads added to pipeline", count: 23, afterNodeId: "1-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "1-k1", icon: "mail", tool: "Gmail API", text: "Drafting personalized outreach for 8 qualified leads...", delay: 0 },
          { id: "1-k2", icon: "search", tool: "Context Engine", text: "Referencing each lead's recent LinkedIn post as hook...", delay: 1500 },
          { id: "1-k3", icon: "mail", tool: "Gmail Drafts", text: "8 email drafts saved to Gmail", delay: 2500, hoverPreview: "Subject: \"Your automation stack is missing one layer\"\nTo: marcus@automatede.com\nPreview: \"Hey Marcus, saw your post about client onboarding bottlenecks...\"" },
          { id: "1-k4", icon: "calendar", tool: "Google Calendar", text: "Creating follow-up reminders for Day 3, 7, and 14", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Gmail drafts ready to send", count: 8, afterNodeId: "1-k3" },
          { icon: "calendar", text: "Calendar events created", count: 24, afterNodeId: "1-k4" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "1-p1", icon: "code", tool: "Apify Scraper", text: "Scraping top LinkedIn posts about AI automation this week...", delay: 0 },
          { id: "1-p2", icon: "chart", tool: "Hook Analysis", text: "Extracted 12 viral patterns. Generating content...", delay: 1200 },
          { id: "1-p3", icon: "content", tool: "Content Generator", text: "3 LinkedIn posts drafted in your voice", delay: 2700, hoverPreview: "Post 1: \"I replaced a $15K/month growth team with 5 AI agents...\"\nPost 2: \"Your competitor just automated their entire pipeline...\"\nPost 3: \"Stop writing content. Start deploying content systems.\"" },
          { id: "1-p4", icon: "calendar", tool: "Calendar Schedule", text: "Posting slots blocked: Mon 9AM, Wed 12PM, Fri 5PM", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "posts ready to publish", count: 3, afterNodeId: "1-p3" },
          { icon: "calendar", text: "posting slots scheduled", count: 3, afterNodeId: "1-p4" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "1-n1", icon: "code", tool: "Site Crawler", text: "Visiting dealmaker.world... checking every page...", delay: 0 },
          { id: "1-n2", icon: "shield", tool: "Checkout Test", text: "Testing Stripe checkout flow end to end...", delay: 1000 },
          { id: "1-n3", icon: "shield", tool: "Health Report", text: "Site speed: 142ms. SSL: valid. All CTAs working.", delay: 1800 },
          { id: "1-n4", icon: "shield", tool: "Alert Check", text: "1 issue found: pricing page mobile CTA overlaps on iPhone SE", delay: 2300 },
        ],
        outputUpdates: [
          { icon: "shield", text: "issue flagged for fix", count: 1, afterNodeId: "1-n4" },
        ],
      },
    ],
    summary: { actions: 47, time: 94, humanTime: "3 days", humanCost: "$4,200" },
    outputSummary: "47 actions executed across 5 departments in 94 seconds.\nA human team would take 3 days and cost $4,200.",
  },

  // PROMPT 2
  {
    id: 2,
    slug: "overnight",
    prompt: "I just woke up. What did you do overnight?",
    tags: "ALL 5 AGENTS",
    category: "operations",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Good morning. Here's what happened between midnight and 7 AM.",
    type: "timeline",
    timeline: [
      { time: "03:22 AM", agent: "SENTINEL", text: "Health check complete. All systems nominal. Response time: 138ms.", delay: 0 },
      { time: "03:45 AM", agent: "CORTEX", text: "Competitor scan: Nexus AI updated pricing page. New enterprise tier at $399/mo.", delay: 800 },
      { time: "04:00 AM", agent: "SPECTER", text: "Overnight lead sweep: 12 new companies matching ICP found. 4 scored above 80.", delay: 1600 },
      { time: "04:15 AM", agent: "SPECTER", text: "Email drafts created for top 4 leads. Saved to Gmail.", delay: 2400 },
      { time: "05:00 AM", agent: "PULSE", text: 'LinkedIn post for today generated. Topic: "Why 3 AI startups launched this week will fail at GTM."', delay: 3200 },
      { time: "05:30 AM", agent: "PULSE", text: "Twitter thread adapted. 7 tweets scheduled for 12PM.", delay: 4000 },
      { time: "06:00 AM", agent: "STRIKER", text: "Inbox scan: 3 deal-relevant emails from yesterday. Follow-ups drafted.", delay: 4800 },
      { time: "06:15 AM", agent: "STRIKER", text: "Carl Sundberg opened your email twice. Moving to hot pipeline.", delay: 5600 },
      { time: "06:30 AM", agent: "SENTINEL", text: "SSL certificate expires in 14 days. Maintenance task created.", delay: 6400 },
      { time: "06:45 AM", agent: "CORTEX", text: "Morning brief compiled and sent to Telegram.", delay: 7200 },
    ],
    summary: { actions: 31, time: 0, humanTime: "impossible overnight", humanCost: "$2,100" },
    outputSummary: "12 leads found | 4 emails drafted | 1 post ready | 3 follow-ups queued | 1 issue flagged",
  },

  // PROMPT 3
  {
    id: 3,
    slug: "competitor-response",
    prompt: "A competitor just dropped their prices. Respond.",
    tags: "CORTEX + PULSE + SPECTER + STRIKER",
    category: "competitive",
    agentNames: ["CORTEX", "PULSE", "SPECTER", "STRIKER"],
    brainResponse: "Competitive threat detected. Deploying counter-strategy across 4 departments.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "3-c1", icon: "code", tool: "Site Crawler", text: "Visiting competitor site... screenshotting pricing page...", delay: 0 },
          { id: "3-c2", icon: "chart", tool: "Price Extraction", text: "Extracting new tiers... comparing to our pricing...", delay: 1200 },
          { id: "3-c3", icon: "chart", tool: "Weakness Analysis", text: "Found 3 weaknesses in their new pricing model", delay: 2200 },
          { id: "3-c4", icon: "database", tool: "Save Analysis", text: "Competitive analysis saved to intelligence reports", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "chart", text: "competitive analysis complete", count: 1, afterNodeId: "3-c4" },
        ],
        sendsDataTo: "PULSE",
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 3500,
        nodes: [
          { id: "3-p1", icon: "chart", tool: "Intel Intake", text: "Taking Cortex competitive intel... crafting counter-narrative...", delay: 0 },
          { id: "3-p2", icon: "content", tool: "Content Generator", text: "3 counter-positioning LinkedIn posts drafted", delay: 1500 },
          { id: "3-p3", icon: "content", tool: "Thread Builder", text: "Comparison thread created with data-backed positioning", delay: 2500 },
          { id: "3-p4", icon: "calendar", tool: "Schedule Posts", text: "All content scheduled for this week", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "counter-posts ready", count: 3, afterNodeId: "3-p2" },
        ],
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "3-s1", icon: "search", tool: "Social Scanner", text: "Searching Twitter/Reddit/G2 for competitor complaints...", delay: 0 },
          { id: "3-s2", icon: "person", tool: "Profile Matcher", text: "Matching frustrated users to real profiles...", delay: 1500 },
          { id: "3-s3", icon: "chart", tool: "Lead Scoring", text: "15 frustrated users identified and scored", delay: 2500 },
          { id: "3-s4", icon: "database", tool: "Save Leads", text: '15 leads saved tagged "competitor-churn"', delay: 3200 },
        ],
        outputUpdates: [
          { icon: "person", text: "churn leads found", count: 15, afterNodeId: "3-s4" },
        ],
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "3-k1", icon: "database", tool: "Pipeline Scan", text: "Pulling every current prospect from pipeline...", delay: 0 },
          { id: "3-k2", icon: "chart", tool: "Positioning Engine", text: "Crafting advantage-based messaging for each prospect...", delay: 1200 },
          { id: "3-k3", icon: "mail", tool: "Gmail Drafts", text: "12 re-engagement emails drafted referencing competitor move", delay: 2400 },
          { id: "3-k4", icon: "mail", tool: "Save Drafts", text: "All 12 drafts saved to Gmail", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "mail", text: "re-engagement emails drafted", count: 12, afterNodeId: "3-k3" },
        ],
      },
    ],
    summary: { actions: 31, time: 78, humanTime: "2 days", humanCost: "$3,100" },
    outputSummary: "1 competitive analysis | 3 counter-posts ready | 15 churn leads found | 12 re-engagement emails drafted",
  },

  // PROMPT 4
  {
    id: 4,
    slug: "sales-call-prep",
    prompt: "I have a sales call in 30 minutes. Prep me.",
    tags: "CORTEX + STRIKER",
    category: "operations",
    agentNames: ["CORTEX", "STRIKER"],
    brainResponse: "Researching prospect now. Briefing in 2 minutes.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "4-c1", icon: "search", tool: "Brave Search API", text: "Searching prospect's company... recent funding, team changes...", delay: 0 },
          { id: "4-c2", icon: "linkedin", tool: "LinkedIn Scanner", text: "Scanning prospect's LinkedIn for recent posts and activity...", delay: 1200 },
          { id: "4-c3", icon: "chart", tool: "Pain Point Analysis", text: "3 pain points identified from public signals", delay: 2200 },
          { id: "4-c4", icon: "search", tool: "Competitor Intel", text: "Found 2 competitor tools they currently use", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "chart", text: "Company profile complete", count: 1, afterNodeId: "4-c2" },
          { icon: "chart", text: "pain points identified", count: 3, afterNodeId: "4-c3" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "4-k1", icon: "mail", tool: "Email Thread Pull", text: "Pulling previous email thread with prospect...", delay: 0 },
          { id: "4-k2", icon: "chart", tool: "Conversation Summary", text: "Summarizing conversation history... identifying objections...", delay: 1200 },
          { id: "4-k3", icon: "content", tool: "Talking Points", text: "3 talking points drafted with objection handlers", delay: 2200 },
          { id: "4-k4", icon: "mail", tool: "Brief to Gmail", text: "One-page call brief sent to your email", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Call brief sent to email", count: 1, afterNodeId: "4-k4" },
        ],
      },
    ],
    summary: { actions: 12, time: 45, humanTime: "2 hours", humanCost: "$350" },
    outputSummary: "Company profile complete | 3 pain points identified | Call brief sent to email",
  },

  // PROMPT 5
  {
    id: 5,
    slug: "content-recovery",
    prompt: "I haven't posted content in 2 weeks. Fix that.",
    tags: "PULSE + CORTEX",
    category: "operations",
    agentNames: ["CORTEX", "PULSE"],
    brainResponse: "Content gap detected. Building a 2-week recovery plan.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "5-c1", icon: "code", tool: "Apify Scraper", text: "Scraping trending posts in your niche this week...", delay: 0 },
          { id: "5-c2", icon: "chart", tool: "Hook Extractor", text: "Extracting top performing hooks and formats...", delay: 1200 },
          { id: "5-c3", icon: "chart", tool: "Gap Analysis", text: "Identifying content gaps competitors haven't covered...", delay: 2200 },
          { id: "5-c4", icon: "chart", tool: "Angle Finder", text: "5 unique angles identified for your voice", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "chart", text: "unique angles found", count: 5, afterNodeId: "5-c4" },
        ],
        sendsDataTo: "PULSE",
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 3500,
        nodes: [
          { id: "5-p1", icon: "chart", tool: "Intel Intake", text: "Using Cortex research to generate content plan...", delay: 0 },
          { id: "5-p2", icon: "content", tool: "Content Generator", text: "Writing 10 posts across LinkedIn, Twitter, and blog...", delay: 1500 },
          { id: "5-p3", icon: "content", tool: "Platform Adapter", text: "Adapting each post for platform-specific formats", delay: 3000 },
          { id: "5-p4", icon: "calendar", tool: "Schedule Builder", text: "2 posts/day for next 5 business days. Calendar slots blocked.", delay: 4000 },
        ],
        outputUpdates: [
          { icon: "content", text: "posts drafted", count: 10, afterNodeId: "5-p2" },
          { icon: "calendar", text: "days scheduled", count: 5, afterNodeId: "5-p4" },
          { icon: "calendar", text: "Calendar slots blocked", count: 10, afterNodeId: "5-p4" },
        ],
      },
    ],
    summary: { actions: 18, time: 62, humanTime: "6 hours", humanCost: "$900" },
    outputSummary: "10 posts drafted | 5 days scheduled | 10 Calendar slots blocked",
  },

  // PROMPT 6
  {
    id: 6,
    slug: "steal-ghl-clients",
    prompt: "Find me 10 clients who are about to leave GoHighLevel",
    tags: "SPECTER + CORTEX + STRIKER",
    category: "competitive",
    agentNames: ["CORTEX", "SPECTER", "STRIKER"],
    brainResponse: "Scanning public complaints. Targeting churn signals.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "6-c1", icon: "search", tool: "Review Scanner", text: "Searching G2 reviews (1-3 stars), Reddit complaints, Twitter frustrations...", delay: 0 },
          { id: "6-c2", icon: "chart", tool: "Pain Extractor", text: "Extracting specific pain points per reviewer...", delay: 1500 },
          { id: "6-c3", icon: "chart", tool: "Signal Analysis", text: "Mapping complaints to churn probability scores...", delay: 2500 },
          { id: "6-c4", icon: "database", tool: "Save Intel", text: "Churn intelligence report compiled", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "chart", text: "churn signals mapped", count: 1, afterNodeId: "6-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "6-s1", icon: "person", tool: "Profile Matcher", text: "Matching complaints to real LinkedIn profiles...", delay: 0 },
          { id: "6-s2", icon: "person", tool: "Apollo.io API", text: "Finding verified emails for each match...", delay: 1200 },
          { id: "6-s3", icon: "chart", tool: "Lead Scoring", text: "Scoring each lead by churn urgency and ICP fit...", delay: 2200 },
          { id: "6-s4", icon: "database", tool: "Save to CRM", text: '10 qualified leads saved tagged "GHL-churn"', delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "churning leads found", count: 10, afterNodeId: "6-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "6-k1", icon: "chart", tool: "Context Engine", text: "Matching each lead to their exact complaint...", delay: 0 },
          { id: "6-k2", icon: "mail", tool: "DM Generator", text: "Drafting 10 personalized DMs referencing specific pain points...", delay: 1500 },
          { id: "6-k3", icon: "mail", tool: "Gmail Drafts", text: "10 DMs saved to Gmail drafts", delay: 2500 },
          { id: "6-k4", icon: "database", tool: "Pipeline Update", text: "All 10 leads added to pipeline with context tags", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "personalized DMs drafted", count: 10, afterNodeId: "6-k3" },
          { icon: "database", text: "All saved to pipeline", count: 10, afterNodeId: "6-k4" },
        ],
      },
    ],
    summary: { actions: 22, time: 71, humanTime: "4 hours", humanCost: "$650" },
    outputSummary: "10 churning leads found | 10 personalized DMs drafted | All saved to pipeline",
  },

  // PROMPT 7
  {
    id: 7,
    slug: "business-audit",
    prompt: "Audit my entire business and tell me where I'm bleeding money",
    tags: "SENTINEL + CORTEX + STRIKER",
    category: "operations",
    agentNames: ["SENTINEL", "CORTEX", "STRIKER"],
    brainResponse: "Running full business diagnostic.",
    type: "branch",
    branches: [
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "7-n1", icon: "code", tool: "Site Crawler", text: "Checking website speed, uptime, SSL, broken links...", delay: 0 },
          { id: "7-n2", icon: "shield", tool: "API Tester", text: "Testing every API endpoint... measuring response times...", delay: 1200 },
          { id: "7-n3", icon: "shield", tool: "Payment Flow", text: "Testing payment flow end to end...", delay: 2200 },
          { id: "7-n4", icon: "shield", tool: "Health Report", text: "2 site issues found. Full report saved.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "shield", text: "site issues found", count: 2, afterNodeId: "7-n4" },
        ],
      },
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "7-c1", icon: "database", tool: "Lead Analytics", text: "Analyzing last 30 days of leads...", delay: 0 },
          { id: "7-c2", icon: "chart", tool: "Conversion Analysis", text: "Identifying conversion drop-offs by stage...", delay: 1500 },
          { id: "7-c3", icon: "chart", tool: "Channel Analysis", text: "Finding which channels produce dead leads...", delay: 2500 },
          { id: "7-c4", icon: "chart", tool: "CPA Calculator", text: "3 conversion leaks identified. CPA calculated per channel.", delay: 3500 },
        ],
        outputUpdates: [
          { icon: "chart", text: "conversion leaks identified", count: 3, afterNodeId: "7-c4" },
        ],
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "7-k1", icon: "mail", tool: "Inbox Scanner", text: "Scanning inbox for missed opportunities...", delay: 0 },
          { id: "7-k2", icon: "chart", tool: "Reply Analysis", text: "Finding emails that never got replies...", delay: 1500 },
          { id: "7-k3", icon: "chart", tool: "Revenue Calculator", text: "Calculating estimated revenue lost from stale deals...", delay: 2500 },
          { id: "7-k4", icon: "content", tool: "Report Builder", text: '"Money Left on the Table" report: $14,500 in missed deals', delay: 3500 },
        ],
        outputUpdates: [
          { icon: "chart", text: "in missed deals flagged", count: 14500, afterNodeId: "7-k4" },
        ],
      },
    ],
    summary: { actions: 19, time: 58, humanTime: "1.5 days", humanCost: "$2,800" },
    outputSummary: "2 site issues found | 3 conversion leaks identified | $14,500 in missed deals flagged",
  },

  // PROMPT 8
  {
    id: 8,
    slug: "cold-outreach-saas",
    prompt: "Write a cold outreach campaign for SaaS founders who just raised seed rounds",
    tags: "CORTEX + SPECTER + STRIKER + PULSE",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE"],
    brainResponse: "Building targeted campaign from scratch.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "8-c1", icon: "search", tool: "Brave Search API", text: "Searching Crunchbase and tech news for seed rounds this month...", delay: 0 },
          { id: "8-c2", icon: "chart", tool: "Company Extractor", text: "Found 30 companies. Extracting founder names, details...", delay: 1500 },
          { id: "8-c3", icon: "chart", tool: "Build Analysis", text: "Analyzing what each company is building and their stack...", delay: 2500 },
          { id: "8-c4", icon: "database", tool: "Save Intel", text: "30 company profiles saved with enrichment data", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "search", text: "companies researched", count: 30, afterNodeId: "8-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 3000,
        nodes: [
          { id: "8-s1", icon: "person", tool: "Apollo.io API", text: "Enriching all 30 founders... finding verified emails...", delay: 0 },
          { id: "8-s2", icon: "chart", tool: "ICP Scorer", text: "Scoring by ICP fit... qualifying top prospects...", delay: 1200 },
          { id: "8-s3", icon: "chart", tool: "Lead Qualifier", text: "Top 15 qualified. Remaining 15 tagged for nurture.", delay: 2200 },
          { id: "8-s4", icon: "database", tool: "Save to CRM", text: "15 hot leads + 15 nurture leads saved", delay: 2800 },
        ],
        outputUpdates: [
          { icon: "person", text: "leads qualified", count: 15, afterNodeId: "8-s3" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5500,
        nodes: [
          { id: "8-k1", icon: "mail", tool: "Sequence Builder", text: "Building 3-email sequence: first touch, case study, urgency...", delay: 0 },
          { id: "8-k2", icon: "mail", tool: "Personalization", text: "Personalizing each sequence with raise amount and product...", delay: 1500 },
          { id: "8-k3", icon: "mail", tool: "Gmail Drafts", text: "45 email drafts saved to Gmail (3 per lead x 15)", delay: 2500 },
          { id: "8-k4", icon: "calendar", tool: "Send Schedule", text: "Send dates staggered: Day 1, Day 4, Day 9", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "email drafts created", count: 45, afterNodeId: "8-k3" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "8-p1", icon: "chart", tool: "ICP Content Strategy", text: "Designing inbound content for seed-stage founder ICP...", delay: 0 },
          { id: "8-p2", icon: "content", tool: "Content Generator", text: "3 LinkedIn posts: 'Why seed-stage founders burn 60% of runway on ops'", delay: 1500 },
          { id: "8-p3", icon: "content", tool: "Hook Optimizer", text: "Optimizing hooks for maximum reach in founder networks", delay: 2500 },
          { id: "8-p4", icon: "calendar", tool: "Schedule Posts", text: "Posts scheduled across next 5 days", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "inbound posts ready", count: 3, afterNodeId: "8-p2" },
        ],
      },
    ],
    summary: { actions: 38, time: 82, humanTime: "2.5 days", humanCost: "$3,800" },
    outputSummary: "30 companies researched | 15 qualified | 45 email drafts | 3 inbound posts",
  },

  // PROMPT 9
  {
    id: 9,
    slug: "agency-pipeline",
    prompt: "I want to sell AI agents to agencies. Build me the pipeline.",
    tags: "ALL 5 AGENTS",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Agency pipeline deployment initiated.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "9-c1", icon: "search", tool: "Brave Search API", text: "Mapping the agency landscape... finding top 50 AI/automation agencies...", delay: 0 },
          { id: "9-c2", icon: "chart", tool: "Market Analysis", text: "Identifying pricing models, service gaps, and churn signals...", delay: 1500 },
          { id: "9-c3", icon: "chart", tool: "Opportunity Mapper", text: "50 agencies mapped. Key gaps identified in their offerings.", delay: 2500 },
          { id: "9-c4", icon: "database", tool: "Save Intel", text: "Full agency landscape report saved", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "search", text: "agencies mapped", count: 50, afterNodeId: "9-c3" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "9-s1", icon: "chart", tool: "Size Filter", text: "Filtering to agencies with 5-20 employees (sweet spot)...", delay: 0 },
          { id: "9-s2", icon: "linkedin", tool: "LinkedIn Search", text: "Finding agency owners on LinkedIn...", delay: 1200 },
          { id: "9-s3", icon: "chart", tool: "Lead Scoring", text: "Scoring 20 leads by fit, size, and growth signals...", delay: 2200 },
          { id: "9-s4", icon: "database", tool: "Save to CRM", text: "20 qualified agency leads saved to pipeline", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "leads qualified", count: 20, afterNodeId: "9-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "9-k1", icon: "mail", tool: "Outreach Builder", text: 'Drafting partnership-style outreach: "I built the infrastructure you sell manually"', delay: 0 },
          { id: "9-k2", icon: "mail", tool: "Sequence Creator", text: "Building 3-email sequence for each of 20 leads...", delay: 1500 },
          { id: "9-k3", icon: "mail", tool: "Gmail Drafts", text: "20 outreach sequences saved to Gmail drafts", delay: 2500 },
          { id: "9-k4", icon: "calendar", tool: "Google Calendar", text: "Follow-up reminders created for Day 3, 7, 14", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "outreach sequences created", count: 20, afterNodeId: "9-k3" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "9-p1", icon: "chart", tool: "Content Strategy", text: 'Positioning you as the "agency weapon"... case study format...', delay: 0 },
          { id: "9-p2", icon: "content", tool: "Content Generator", text: "5 LinkedIn posts drafted targeting agency owners", delay: 1500 },
          { id: "9-p3", icon: "content", tool: "Format Optimizer", text: "Adapting each post for maximum agency audience reach", delay: 2500 },
          { id: "9-p4", icon: "calendar", tool: "Schedule Posts", text: "All 5 posts scheduled across next week", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "content pieces scheduled", count: 5, afterNodeId: "9-p4" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "9-n1", icon: "code", tool: "Site Crawler", text: "Auditing your site for agency traffic readiness...", delay: 0 },
          { id: "9-n2", icon: "shield", tool: "Demo Flow Test", text: "Testing demo booking flow end to end...", delay: 1200 },
          { id: "9-n3", icon: "shield", tool: "Performance Check", text: "Page speed: 156ms. All forms working. SSL valid.", delay: 2200 },
          { id: "9-n4", icon: "shield", tool: "Audit Report", text: "Site audit complete. Ready for agency traffic.", delay: 2800 },
        ],
        outputUpdates: [
          { icon: "shield", text: "Site audit complete", count: 1, afterNodeId: "9-n4" },
        ],
      },
    ],
    summary: { actions: 41, time: 88, humanTime: "3 days", humanCost: "$4,500" },
    outputSummary: "50 agencies mapped | 20 leads qualified | 20 outreach sequences | 5 content pieces | Site audit complete",
  },

  // PROMPT 10
  {
    id: 10,
    slug: "steal-conference",
    prompt: "Steal a conference without attending",
    tags: "SPECTER + CORTEX + STRIKER",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER"],
    brainResponse: "Scanning conference attendees and speakers. Building hit list.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "10-c1", icon: "search", tool: "Conference Scanner", text: "Finding speaker list and session topics...", delay: 0 },
          { id: "10-c2", icon: "chart", tool: "ICP Session Mapper", text: "Identifying which sessions attract your ICP...", delay: 1200 },
          { id: "10-c3", icon: "search", tool: "Attendee Extractor", text: "Extracting attendee posts mentioning the conference...", delay: 2200 },
          { id: "10-c4", icon: "database", tool: "Save Intel", text: "Conference intelligence report compiled", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "chart", text: "conference intel compiled", count: 1, afterNodeId: "10-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "10-s1", icon: "linkedin", tool: "LinkedIn Search", text: "Finding 25 attendees matching ICP from LinkedIn posts...", delay: 0 },
          { id: "10-s2", icon: "chart", tool: "Session Matcher", text: "Matching each attendee to the session they're excited about...", delay: 1200 },
          { id: "10-s3", icon: "person", tool: "Apollo.io API", text: "Finding contact info for all 25 matches...", delay: 2200 },
          { id: "10-s4", icon: "database", tool: "Save to CRM", text: "25 conference leads saved with session tags", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "conference leads found", count: 25, afterNodeId: "10-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "10-k1", icon: "chart", tool: "Context Engine", text: "Matching each lead to their specific session interest...", delay: 0 },
          { id: "10-k2", icon: "mail", tool: "DM Generator", text: '"Saw you\'re going to [session]. We built the thing they\'re going to talk about."', delay: 1500 },
          { id: "10-k3", icon: "mail", tool: "Gmail Drafts", text: "25 personalized DMs saved to Gmail", delay: 2500 },
          { id: "10-k4", icon: "chart", tool: "ROI Summary", text: "$0 spent on tickets. 25 warm leads generated.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "personalized DMs drafted", count: 25, afterNodeId: "10-k3" },
          { icon: "chart", text: "spent on tickets", count: 0, afterNodeId: "10-k4" },
        ],
      },
    ],
    summary: { actions: 28, time: 67, humanTime: "5 hours", humanCost: "$1,200" },
    outputSummary: "25 conference leads found | Each matched to a session | 25 personalized DMs drafted | $0 spent on tickets",
  },

  // PROMPT 11
  {
    id: 11,
    slug: "sell-agent-to-agencies",
    prompt: "Build me an AI agent I can sell to agencies for $2,000/month",
    tags: "ALL 5 AGENTS",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Packaging a sellable agent product. Market research, build spec, pricing, outreach, delivery.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "11-c1", icon: "search", tool: "Brave Search", text: "Researching what agencies currently pay for... content, lead gen, reporting...", delay: 0 },
          { id: "11-c2", icon: "chart", tool: "Market Analysis", text: "Identifying highest-demand agent type... gap analysis running...", delay: 1200 },
          { id: "11-c3", icon: "search", tool: "Competitor Scan", text: "Analyzing 12 competing agent products and their pricing...", delay: 2400 },
          { id: "11-c4", icon: "database", tool: "Save Report", text: "Market gap identified. Agent spec document saved.", delay: 3200, hoverPreview: "Gap: 73% of agencies lack automated lead qualification.\nTop opportunity: Lead gen agent with scoring.\nPrice range: $1,500-$3,000/mo in market." },
        ],
        outputUpdates: [
          { icon: "chart", text: "Market gap identified", count: 1, afterNodeId: "11-c4" },
          { icon: "content", text: "Agent spec document created", count: 1, afterNodeId: "11-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "11-s1", icon: "linkedin", tool: "LinkedIn Search", text: "Finding agency owners who publicly need help with identified gap...", delay: 0 },
          { id: "11-s2", icon: "person", tool: "Apollo Enrichment", text: "Enriching 30 agency contacts... emails, company size, revenue...", delay: 1200 },
          { id: "11-s3", icon: "chart", tool: "Lead Scoring", text: "Scoring by revenue size and urgency... Top: DigitalFirst Agency (91/100)", delay: 2400, hoverPreview: "Top 3 Agency Leads:\n1. DigitalFirst Agency — 91/100 (12 employees, $1.2M rev)\n2. ScaleStack — 87/100 (8 employees, $800K rev)\n3. GrowthLab Co — 83/100 (15 employees, $1.8M rev)" },
          { id: "11-s4", icon: "database", tool: "Save to CRM", text: "30 leads saved. Tagged: agent-buyers.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "person", text: "agency leads found", count: 30, afterNodeId: "11-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "11-k1", icon: "content", tool: "Sales Page Builder", text: "Drafting sales page outline with 3 pricing tiers...", delay: 0 },
          { id: "11-k2", icon: "chart", tool: "Proposal Engine", text: "Creating agency proposal template with ROI projections...", delay: 1500 },
          { id: "11-k3", icon: "mail", tool: "Gmail API", text: "Drafting 15 personalized outreach emails to agency leads...", delay: 2500, hoverPreview: "Subject: \"Your agency is doing lead gen manually. I automated it.\"\nTo: james@digitalfirst.io\nPreview: \"Hey James, I saw your team is scaling past 10 clients...\"" },
          { id: "11-k4", icon: "mail", tool: "Save Drafts", text: "15 Gmail drafts ready. Proposal template saved.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "outreach emails drafted", count: 15, afterNodeId: "11-k4" },
          { icon: "content", text: "Sales page outlined", count: 1, afterNodeId: "11-k1" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "11-p1", icon: "content", tool: "Content Generator", text: "Writing case study: 'I built an AI agent agencies pay $2K/month for'...", delay: 0 },
          { id: "11-p2", icon: "content", tool: "Platform Adapter", text: "Creating 3 Twitter posts teasing the offer...", delay: 1500 },
          { id: "11-p3", icon: "calendar", tool: "Calendar Schedule", text: "Scheduling launch content across 5 days...", delay: 2500 },
        ],
        outputUpdates: [],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "11-n1", icon: "shield", tool: "Stripe Checker", text: "Verifying Stripe can handle recurring $2K subscriptions...", delay: 0 },
          { id: "11-n2", icon: "code", tool: "Onboarding Audit", text: "Testing agency client onboarding flow end to end...", delay: 1200 },
          { id: "11-n3", icon: "shield", tool: "Health Report", text: "Payment flow verified. 1 onboarding gap flagged.", delay: 2200 },
        ],
        outputUpdates: [
          { icon: "shield", text: "Payment flow verified", count: 1, afterNodeId: "11-n3" },
        ],
      },
    ],
    summary: { actions: 34, time: 97, humanTime: "4 days", humanCost: "$5,200" },
    outputSummary: "Market gap identified | Agent spec created | 30 agency leads found | 15 outreach emails drafted | Sales page outlined | Payment flow verified",
  },

  // PROMPT 12
  {
    id: 12,
    slug: "clone-sales-process",
    prompt: "Clone my best sales process and run it 24/7 without me",
    tags: "CORTEX + SPECTER + STRIKER",
    category: "automation",
    agentNames: ["CORTEX", "SPECTER", "STRIKER"],
    brainResponse: "Extracting your sales DNA. Building autonomous pipeline.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "12-c1", icon: "mail", tool: "Gmail Scanner", text: "Scanning your last 50 email threads...", delay: 0 },
          { id: "12-c2", icon: "chart", tool: "Pattern Extraction", text: "Identifying which messages got replies... extracting tone and objection handling...", delay: 1500 },
          { id: "12-c3", icon: "chart", tool: "DNA Builder", text: "Building Sales DNA Profile... documenting exactly how you close deals...", delay: 2500, hoverPreview: "7 Winning Patterns Found:\n1. Personal hook referencing recent post\n2. Problem-first, not product-first\n3. Under 90 words on first touch\n4. Follow-up within 72 hours\n5. Case study in email 2\n6. Urgency trigger in email 3\n7. Always close with a question" },
          { id: "12-c4", icon: "database", tool: "Save Profile", text: "Sales DNA Profile complete. 7 winning patterns extracted.", delay: 3500 },
        ],
        outputUpdates: [
          { icon: "chart", text: "Sales DNA extracted from 50 threads", count: 1, afterNodeId: "12-c2" },
          { icon: "chart", text: "winning patterns identified", count: 7, afterNodeId: "12-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2500,
        nodes: [
          { id: "12-s1", icon: "chart", tool: "ICP Matcher", text: "Configuring lead scoring to match clients you've actually closed...", delay: 0 },
          { id: "12-s2", icon: "calendar", tool: "Auto-Sweep Config", text: "Setting up daily prospecting sweep... schedule: 6 AM every morning...", delay: 1200 },
          { id: "12-s3", icon: "search", tool: "First Sweep", text: "Running initial sweep... 15 leads found matching your winning pattern...", delay: 2400 },
          { id: "12-s4", icon: "database", tool: "Save Leads", text: "15 leads saved. Autonomous daily prospecting: ACTIVE.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "calendar", text: "Daily prospecting configured (6 AM)", count: 1, afterNodeId: "12-s2" },
          { icon: "person", text: "initial leads found", count: 15, afterNodeId: "12-s3" },
        ],
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 4500,
        nodes: [
          { id: "12-k1", icon: "mail", tool: "Email Generator", text: "Generating personalized sequences using your email patterns...", delay: 0 },
          { id: "12-k2", icon: "mail", tool: "Auto-Follow-Up", text: "Building 3-touch follow-up system... triggers on 3-day cold threshold...", delay: 1500 },
          { id: "12-k3", icon: "chart", tool: "Morning Brief Config", text: "Setting up daily pipeline review... Telegram summary at 7 AM...", delay: 2500 },
          { id: "12-k4", icon: "shield", tool: "Activation", text: "Autonomous sales system LIVE. First briefing tomorrow 7 AM.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Auto-follow-up system active", count: 1, afterNodeId: "12-k2" },
          { icon: "calendar", text: "Morning briefing scheduled", count: 1, afterNodeId: "12-k3" },
        ],
      },
    ],
    summary: { actions: 24, time: 76, humanTime: "impossible to replicate", humanCost: "$3,600" },
    outputSummary: "Sales DNA extracted | 7 winning patterns | Daily prospecting at 6 AM | 15 initial leads | Auto-follow-up active | Morning briefing scheduled",
  },

  // PROMPT 13
  {
    id: 13,
    slug: "run-client-business",
    prompt: "Set up Ultron to run my client's business while I sleep",
    tags: "ALL 5 AGENTS",
    category: "automation",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Deploying white-label operations for client workspace.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "13-c1", icon: "search", tool: "Company Research", text: "Pulling client's company profile... industry, size, positioning...", delay: 0 },
          { id: "13-c2", icon: "search", tool: "Competitor Mapping", text: "Researching client's top 5 competitors...", delay: 1200 },
          { id: "13-c3", icon: "chart", tool: "ICP Builder", text: "Building client's ideal customer profile from their existing customers...", delay: 2400 },
          { id: "13-c4", icon: "database", tool: "Baseline Report", text: "Market intelligence baseline complete. Weekly auto-update: CONFIGURED.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "chart", text: "Client workspace deployed", count: 1, afterNodeId: "13-c1" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "13-s1", icon: "chart", tool: "ICP Configuration", text: "Configuring lead gen for client's ICP...", delay: 0 },
          { id: "13-s2", icon: "calendar", tool: "Daily Sweep Setup", text: "Setting daily sweeps... 5-10 new prospects every morning...", delay: 1200 },
          { id: "13-s3", icon: "person", tool: "Auto-Enrich", text: "Enabling auto-enrichment and scoring pipeline...", delay: 2200 },
          { id: "13-s4", icon: "database", tool: "Queue System", text: "Outreach drafts queued for client approval. System LIVE.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "Lead gen running daily", count: 1, afterNodeId: "13-s2" },
        ],
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 3500,
        nodes: [
          { id: "13-k1", icon: "mail", tool: "Inbox Connect", text: "Connecting to client's inbox... setting up automated triage...", delay: 0 },
          { id: "13-k2", icon: "mail", tool: "Follow-Up Config", text: "Configuring sequences for stale deals...", delay: 1200 },
          { id: "13-k3", icon: "calendar", tool: "Weekly Report", text: "Building Monday 8 AM pipeline report... template configured...", delay: 2200 },
          { id: "13-k4", icon: "shield", tool: "Activation", text: "Client deal tracking: AUTONOMOUS.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "calendar", text: "Weekly reports automated", count: 1, afterNodeId: "13-k3" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "13-p1", icon: "chart", tool: "Voice Analysis", text: "Analyzing client's existing content for brand voice...", delay: 0 },
          { id: "13-p2", icon: "content", tool: "Content Engine", text: "Configuring 3 posts per week in client's voice...", delay: 1500 },
          { id: "13-p3", icon: "calendar", tool: "Calendar Setup", text: "Content calendar deployed. Performance tracking active.", delay: 2500 },
        ],
        outputUpdates: [
          { icon: "content", text: "Content engine: 3 posts/week", count: 1, afterNodeId: "13-p2" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "13-n1", icon: "code", tool: "Uptime Monitor", text: "Setting up client website monitoring...", delay: 0 },
          { id: "13-n2", icon: "shield", tool: "Competitor Watch", text: "Weekly competitor change detection configured...", delay: 1200 },
          { id: "13-n3", icon: "calendar", tool: "Monthly Report", text: "Monthly health report template created. First report: 30 days.", delay: 2200 },
        ],
        outputUpdates: [
          { icon: "calendar", text: "autonomous schedules configured", count: 5, afterNodeId: "13-n3" },
          { icon: "shield", text: "Monthly health audit scheduled", count: 1, afterNodeId: "13-n3" },
        ],
      },
    ],
    summary: { actions: 36, time: 84, humanTime: "1 week", humanCost: "$6,500" },
    outputSummary: "Client workspace deployed | 5 autonomous schedules | Lead gen daily | Content 3 posts/week | Weekly reports | Monthly health audit",
  },

  // PROMPT 14
  {
    id: 14,
    slug: "reddit-to-clients",
    prompt: "Someone just posted about us on Reddit. Turn it into 10 clients.",
    tags: "CORTEX + SPECTER + STRIKER + PULSE",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE"],
    brainResponse: "Social signal detected. Converting attention into pipeline.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "14-c1", icon: "search", tool: "Reddit Scanner", text: "Finding the thread... analyzing 200+ comments...", delay: 0 },
          { id: "14-c2", icon: "person", tool: "Profile Extraction", text: "Identifying commenter profiles matching ICP...", delay: 1200 },
          { id: "14-c3", icon: "chart", tool: "Sentiment Analysis", text: "Mapping sentiment and objections mentioned in thread...", delay: 2200, hoverPreview: "Sentiment Map:\n+ 67% positive (\"finally someone built this\")\n- 18% skeptical (\"sounds too good\")\n? 15% curious (\"how does this compare to X\")\n\n8 objections mapped for outreach angles" },
          { id: "14-c4", icon: "database", tool: "Intel Report", text: "22 ICP matches found. 8 objections mapped. Report saved.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "chart", text: "comments analyzed", count: 200, afterNodeId: "14-c1" },
          { icon: "person", text: "ICP profiles identified", count: 22, afterNodeId: "14-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "14-s1", icon: "linkedin", tool: "LinkedIn Cross-Ref", text: "Cross-referencing Reddit usernames with LinkedIn profiles...", delay: 0 },
          { id: "14-s2", icon: "person", tool: "Email Finder", text: "Pulling contact info for 22 matches via Apollo...", delay: 1200 },
          { id: "14-s3", icon: "chart", tool: "Lead Scoring", text: "Scoring by ICP fit and comment sentiment... Top 15 qualified.", delay: 2400 },
          { id: "14-s4", icon: "database", tool: "Save Leads", text: "15 leads saved. Tagged: reddit-inbound.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "person", text: "qualified leads saved", count: 15, afterNodeId: "14-s4" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 4500,
        nodes: [
          { id: "14-k1", icon: "chart", tool: "Context Engine", text: "Loading each lead's exact Reddit comment as conversation opener...", delay: 0 },
          { id: "14-k2", icon: "mail", tool: "Gmail API", text: "Drafting 15 personalized DMs referencing their specific comment...", delay: 1500, hoverPreview: "Subject: \"Saw your Reddit comment about AI agents\"\nTo: sarah@meridianops.com\nPreview: \"Hey Sarah, you wrote 'I wish someone built this for agencies'. We did. Here's how...\"" },
          { id: "14-k3", icon: "mail", tool: "Follow-Up Queue", text: "Creating 3-day follow-up sequence for non-responders...", delay: 2500 },
          { id: "14-k4", icon: "mail", tool: "Save Drafts", text: "15 DMs + 15 follow-ups saved to Gmail.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "personalized DMs drafted", count: 15, afterNodeId: "14-k2" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 1500,
        nodes: [
          { id: "14-p1", icon: "chart", tool: "Thread Analysis", text: "Extracting top questions from the Reddit thread...", delay: 0 },
          { id: "14-p2", icon: "content", tool: "Content Generator", text: "Writing LinkedIn post: 'Someone posted about us on Reddit. 200 comments in 6 hours.'", delay: 1200 },
          { id: "14-p3", icon: "content", tool: "Content Multiplier", text: "Turning top 3 Reddit questions into separate content pieces...", delay: 2400 },
          { id: "14-p4", icon: "calendar", tool: "Schedule", text: "4 posts scheduled this week.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "content pieces created", count: 4, afterNodeId: "14-p3" },
        ],
      },
    ],
    summary: { actions: 32, time: 86, humanTime: "8 hours", humanCost: "$1,800" },
    outputSummary: "200+ comments analyzed | 22 ICP profiles | 15 qualified leads | 15 DMs drafted | 4 content pieces",
  },

  // PROMPT 15
  {
    id: 15,
    slug: "vacation-mode",
    prompt: "I'm going on vacation for 2 weeks. Keep my business running.",
    tags: "ALL 5 AGENTS",
    category: "automation",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Vacation mode activated. Deploying 14-day autonomous schedule.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "15-c1", icon: "calendar", tool: "Daily Scan Config", text: "Setting up daily competitive scan... 6 AM trigger...", delay: 0 },
          { id: "15-c2", icon: "chart", tool: "Weekly Trends", text: "Configuring weekly industry trend reports...", delay: 1200 },
          { id: "15-c3", icon: "search", tool: "Brand Monitor", text: "Activating real-time brand mention alerts...", delay: 2200 },
          { id: "15-c4", icon: "content", tool: "Summary Config", text: "Day 14 'While You Were Gone' summary: SCHEDULED.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "calendar", text: "14-day schedule deployed", count: 1, afterNodeId: "15-c1" },
        ],
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 1500,
        nodes: [
          { id: "15-s1", icon: "calendar", tool: "Daily Sweeps", text: "Activating daily lead sweeps... 7 AM trigger...", delay: 0 },
          { id: "15-s2", icon: "person", tool: "Auto-Enrich Pipeline", text: "Enabling auto-enrichment for all new leads...", delay: 1200 },
          { id: "15-s3", icon: "chart", tool: "Threshold Config", text: "Leads above 80 get auto-queued for outreach. Cap: 10/day.", delay: 2200 },
          { id: "15-s4", icon: "shield", tool: "Activation", text: "14-day lead generation: LIVE.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "Daily lead gen active (cap: 10/day)", count: 1, afterNodeId: "15-s4" },
        ],
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 3000,
        nodes: [
          { id: "15-k1", icon: "mail", tool: "Auto-Follow-Up", text: "Activating follow-up on all open deals...", delay: 0 },
          { id: "15-k2", icon: "chart", tool: "Deal Rescue", text: "Configuring 3-day cold deal rescue triggers...", delay: 1200 },
          { id: "15-k3", icon: "mail", tool: "Daily Brief", text: "Pipeline email to phone at 8 AM daily. Only $5K+ deals ping you.", delay: 2200 },
          { id: "15-k4", icon: "shield", tool: "Activation", text: "Autonomous deal tracking: LIVE.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Auto follow-up on all deals", count: 1, afterNodeId: "15-k1" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "15-p1", icon: "content", tool: "Content Batch", text: "Generating 14 days of content... 28 posts total...", delay: 0, hoverPreview: "Week 1:\nMon: \"3 things I automated this quarter\"\nTue: Twitter thread on AI ops\nWed: Case study breakdown\nThu: \"Why founders burn out\"\nFri: Behind-the-scenes post\n\n...and 9 more for Week 2" },
          { id: "15-p2", icon: "content", tool: "Platform Variants", text: "Adapting for LinkedIn (14), Twitter (14)...", delay: 1500 },
          { id: "15-p3", icon: "calendar", tool: "Full Schedule", text: "All 28 posts scheduled on Calendar...", delay: 2500 },
          { id: "15-p4", icon: "mail", tool: "Engagement Monitor", text: "Auto-response templates for DMs activated.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "content pieces pre-generated", count: 28, afterNodeId: "15-p1" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 500,
        nodes: [
          { id: "15-n1", icon: "shield", tool: "24/7 Mode", text: "Activating continuous monitoring... health checks every 6 hours...", delay: 0 },
          { id: "15-n2", icon: "shield", tool: "Alert Config", text: "P0 issues: immediate Telegram alert. Everything else: report.", delay: 1200 },
          { id: "15-n3", icon: "shield", tool: "Diagnostics", text: "Initial baseline captured. Monitoring: ACTIVE.", delay: 2200 },
        ],
        outputUpdates: [
          { icon: "shield", text: "Health monitoring every 6 hours", count: 1, afterNodeId: "15-n1" },
          { icon: "shield", text: "Emergency alerts only to phone", count: 1, afterNodeId: "15-n2" },
        ],
      },
    ],
    summary: { actions: 38, time: 91, humanTime: "impossible", humanCost: "$8,400" },
    outputSummary: "14-day schedule deployed | 28 content pieces | Daily lead gen | Auto follow-up | Health monitoring | Emergency alerts only",
  },

  // PROMPT 16
  {
    id: 16,
    slug: "reverse-engineer",
    prompt: "Reverse engineer how this company makes money and build me the same thing",
    tags: "CORTEX + SPECTER + PULSE",
    category: "competitive",
    agentNames: ["CORTEX", "SPECTER", "PULSE"],
    brainResponse: "Target acquired. Deconstructing their entire business model.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "16-c1", icon: "code", tool: "Site Crawler", text: "Visiting every page... screenshots of pricing, features, about, careers...", delay: 0 },
          { id: "16-c2", icon: "linkedin", tool: "LinkedIn Analysis", text: "Analyzing team size, hiring patterns, growth signals...", delay: 1200 },
          { id: "16-c3", icon: "search", tool: "Funding Check", text: "Checking Crunchbase for funding rounds and investor activity...", delay: 2200 },
          { id: "16-c4", icon: "search", tool: "Review Scan", text: "Scanning G2, Trustpilot, Glassdoor for customer and employee complaints...", delay: 3200 },
          { id: "16-c5", icon: "chart", tool: "Funnel Reverse", text: "Mapping their entire funnel: ads, landing pages, free trial flow, onboarding...", delay: 4200 },
          { id: "16-c6", icon: "database", tool: "Blueprint", text: "Business Clone Blueprint complete. 12 pages. 4 exploitable weaknesses found.", delay: 5200, hoverPreview: "4 Weaknesses Found:\n1. No personalized onboarding (drop-off: ~40%)\n2. Pricing too complex (5 tiers, confusing)\n3. No content marketing (zero social presence)\n4. Support response time: 48+ hours" },
        ],
        outputUpdates: [
          { icon: "chart", text: "Full business model deconstructed", count: 1, afterNodeId: "16-c5" },
          { icon: "chart", text: "exploitable weaknesses found", count: 4, afterNodeId: "16-c6" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 3000,
        nodes: [
          { id: "16-s1", icon: "search", tool: "Customer Mining", text: "Identifying their customers from case studies and testimonials...", delay: 0 },
          { id: "16-s2", icon: "linkedin", tool: "LinkedIn Finder", text: "Finding 20 of their customers on LinkedIn...", delay: 1500 },
          { id: "16-s3", icon: "database", tool: "Save Leads", text: "20 leads saved. Tagged: competitor-customers. Already paying for what you're building.", delay: 2500 },
        ],
        outputUpdates: [
          { icon: "person", text: "of their customers identified as leads", count: 20, afterNodeId: "16-s3" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 4000,
        nodes: [
          { id: "16-p1", icon: "content", tool: "Content Series", text: "Writing 5-post 'building in public' series documenting your better version...", delay: 0, hoverPreview: "Post 1: \"I reverse-engineered a $5M company in 90 seconds\"\nPost 2: \"4 weaknesses their customers already know about\"\nPost 3: \"How I'm building the version they wish existed\"\nPost 4: \"Week 1 results vs their year 1\"\nPost 5: \"The unfair advantage of AI-first GTM\"" },
          { id: "16-p2", icon: "content", tool: "Comparison Draft", text: "Creating us-vs-them comparison page outline...", delay: 1500 },
          { id: "16-p3", icon: "calendar", tool: "Launch Schedule", text: "Launch week content scheduled.", delay: 2500 },
        ],
        outputUpdates: [
          { icon: "content", text: "launch series created", count: 5, afterNodeId: "16-p1" },
        ],
      },
    ],
    summary: { actions: 26, time: 102, humanTime: "1 week", humanCost: "$5,500" },
    outputSummary: "Full business model deconstructed | Funnel mapped | 4 weaknesses found | 20 customers identified as leads | 5-post launch series",
  },

  // PROMPT 17
  {
    id: 17,
    slug: "50k-pipeline-friday",
    prompt: "Generate $50K in pipeline by Friday",
    tags: "SPECTER + CORTEX + STRIKER",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER"],
    brainResponse: "4 days. $50K target. Deploying aggressive outbound.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "17-c1", icon: "chart", tool: "Segment Analysis", text: "Identifying your 3 fastest-converting lead segments from last 90 days...", delay: 0 },
          { id: "17-c2", icon: "search", tool: "Trigger Events", text: "Scanning for buying signals happening RIGHT NOW... funding, hiring, launches...", delay: 1200 },
          { id: "17-c3", icon: "search", tool: "Company Mapping", text: "50 companies showing active buying signals this week...", delay: 2400 },
          { id: "17-c4", icon: "database", tool: "Priority Report", text: "Urgency-ranked list complete. 20 most likely to close this week flagged.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "search", text: "companies with buying signals", count: 50, afterNodeId: "17-c3" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2500,
        nodes: [
          { id: "17-s1", icon: "person", tool: "Apollo Enrichment", text: "Enriching all 50 companies... decision-maker contacts...", delay: 0 },
          { id: "17-s2", icon: "chart", tool: "Urgency Scoring", text: "Scoring by urgency, not just fit... trigger events weighted 3x...", delay: 1200 },
          { id: "17-s3", icon: "chart", tool: "Top 20 Selection", text: "20 hottest leads selected. Average score: 84/100.", delay: 2200, hoverPreview: "Top 5 Hot Leads:\n1. TechForge (just raised $8M) — 94/100\n2. Nimbus Labs (hiring 3 sales reps) — 91/100\n3. PipelineHQ (competitor just shut down) — 89/100\n4. DataMesh (new CEO, cleaning house) — 86/100\n5. CloudStack (expanding to EU) — 84/100" },
          { id: "17-s4", icon: "database", tool: "Save Pipeline", text: "Pipeline loaded. $50K+ estimated value.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "hot leads prioritized", count: 20, afterNodeId: "17-s3" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 5000,
        nodes: [
          { id: "17-k1", icon: "mail", tool: "Hyper-Personalization", text: "Drafting emails referencing trigger events from THIS WEEK...", delay: 0 },
          { id: "17-k2", icon: "mail", tool: "Follow-Up Builder", text: "Creating 48-hour follow-ups for non-openers...", delay: 1500 },
          { id: "17-k3", icon: "mail", tool: "Gmail Drafts", text: "40 emails saved (20 first-touch + 20 follow-ups)...", delay: 2500 },
          { id: "17-k4", icon: "calendar", tool: "Send Schedule", text: "Calendar: Tue 10 sends, Wed 10 sends, Thu 20 follow-ups.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Gmail drafts ready", count: 40, afterNodeId: "17-k3" },
          { icon: "calendar", text: "Send schedule configured", count: 1, afterNodeId: "17-k4" },
        ],
      },
    ],
    summary: { actions: 26, time: 79, humanTime: "3 days", humanCost: "$3,200" },
    outputSummary: "50 companies with buying signals | 20 hot leads | 40 Gmail drafts | Send schedule set | Projected: $50K+",
  },

  // PROMPT 18
  {
    id: 18,
    slug: "substack-to-revenue",
    prompt: "Turn my Substack subscribers into paying customers",
    tags: "CORTEX + SPECTER + STRIKER + PULSE",
    category: "revenue",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE"],
    brainResponse: "1,200 subscribers. Converting warm audience to revenue.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "18-c1", icon: "chart", tool: "Content Analysis", text: "Analyzing your top 10 performing Substack posts...", delay: 0 },
          { id: "18-c2", icon: "chart", tool: "Engagement Mapping", text: "Identifying which topics drive highest engagement...", delay: 1200 },
          { id: "18-c3", icon: "chart", tool: "Conversion Angle", text: "Mapping overlap between subscriber interests and product value props...", delay: 2200 },
          { id: "18-c4", icon: "database", tool: "Strategy Report", text: "Conversion bridge identified: 3 angles that connect free content to paid product.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "chart", text: "Subscriber analysis complete", count: 1, afterNodeId: "18-c2" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "18-s1", icon: "linkedin", tool: "Subscriber Analysis", text: "Cross-referencing subscriber data with LinkedIn profiles...", delay: 0 },
          { id: "18-s2", icon: "chart", tool: "ICP Match", text: "Identifying founders, agency owners, decision-makers in subscriber base...", delay: 1200 },
          { id: "18-s3", icon: "chart", tool: "Lead Scoring", text: "50 high-value subscribers matched to buyer persona...", delay: 2200 },
          { id: "18-s4", icon: "database", tool: "Save Leads", text: "50 leads saved. Tagged: warm-substack.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "person", text: "high-value subscribers identified", count: 50, afterNodeId: "18-s3" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 4500,
        nodes: [
          { id: "18-k1", icon: "mail", tool: "Personal Touch", text: "Drafting message 1: 'I noticed you've been reading Founder Terminal...'", delay: 0 },
          { id: "18-k2", icon: "mail", tool: "Case Study Match", text: "Message 2: industry-specific case study for each lead...", delay: 1500 },
          { id: "18-k3", icon: "mail", tool: "Conversion Email", text: "Message 3: 'Try it free, here's your link'...", delay: 2500 },
          { id: "18-k4", icon: "mail", tool: "Gmail Drafts", text: "150 emails saved (3 per lead). Sequence ready.", delay: 3200, hoverPreview: "Email 1: \"I noticed you've been reading Founder Terminal...\"\nEmail 2: \"[Name], here's how a founder in [industry] used Ultron...\"\nEmail 3: \"Try it free. 14-day trial. No card needed.\"" },
        ],
        outputUpdates: [
          { icon: "mail", text: "personalized emails drafted", count: 150, afterNodeId: "18-k4" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "18-p1", icon: "content", tool: "Conversion Post", text: "Writing Substack post: 'I've been giving you playbooks. Here's the system that runs them.'", delay: 0 },
          { id: "18-p2", icon: "content", tool: "LinkedIn Announce", text: "Creating LinkedIn post announcing something new for subscribers...", delay: 1500 },
          { id: "18-p3", icon: "calendar", tool: "Schedule", text: "Launch sequence scheduled for this week.", delay: 2500 },
        ],
        outputUpdates: [
          { icon: "content", text: "Conversion post written", count: 1, afterNodeId: "18-p1" },
          { icon: "calendar", text: "Launch sequence scheduled", count: 1, afterNodeId: "18-p3" },
        ],
      },
    ],
    summary: { actions: 30, time: 83, humanTime: "2 days", humanCost: "$2,900" },
    outputSummary: "1,200 subscribers analyzed | 50 buyers identified | 150 emails ready | Conversion content scheduled",
  },

  // PROMPT 19
  {
    id: 19,
    slug: "perpetual-lead-engine",
    prompt: "Build me a lead generation system that runs forever without touching it",
    tags: "ALL 5 AGENTS",
    category: "automation",
    agentNames: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    brainResponse: "Deploying perpetual lead engine. Set once. Runs forever.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "19-c1", icon: "calendar", tool: "Weekly Scan Config", text: "Setting up recurring competitive scan... every Monday 6 AM...", delay: 0 },
          { id: "19-c2", icon: "chart", tool: "Daily Trends", text: "Configuring daily industry trend monitoring...", delay: 1200 },
          { id: "19-c3", icon: "search", tool: "Trigger Detection", text: "Activating event detection: funding rounds, hires, product launches...", delay: 2200 },
          { id: "19-c4", icon: "database", tool: "Intel Pipeline", text: "All intel auto-feeds to Specter. Pipeline: CONNECTED.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "chart", text: "Perpetual system deployed", count: 1, afterNodeId: "19-c4" },
        ],
        sendsDataTo: "SPECTER",
      },
      {
        agent: "SPECTER",
        subtitle: "Outreach & Lead Gen",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "19-s1", icon: "calendar", tool: "Daily Sweep", text: "Configuring daily autonomous sweep... 7 AM trigger... 10 leads/day...", delay: 0 },
          { id: "19-s2", icon: "person", tool: "Auto-Enrich", text: "Enabling Apollo auto-enrichment for every new lead...", delay: 1200 },
          { id: "19-s3", icon: "chart", tool: "Auto-Score", text: "Lead scoring active. Above 75: queue for outreach. Above 90: Telegram alert.", delay: 2200 },
          { id: "19-s4", icon: "database", tool: "Pipeline Active", text: "Perpetual lead generation: LIVE. Expected: 200+ leads/month.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "person", text: "Daily: 10 leads found, scored, enriched", count: 10, afterNodeId: "19-s1" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 4500,
        nodes: [
          { id: "19-k1", icon: "mail", tool: "Sequence Builder", text: "Building automated email sequences... day 0, 3, 7, 14...", delay: 0 },
          { id: "19-k2", icon: "mail", tool: "Auto-Trigger", text: "New lead enters pipeline -> sequence starts automatically...", delay: 1500 },
          { id: "19-k3", icon: "chart", tool: "Daily Summary", text: "Telegram pipeline summary configured... 8 AM daily...", delay: 2500 },
          { id: "19-k4", icon: "shield", tool: "System Active", text: "Autonomous outreach: LIVE. No human intervention needed.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "mail", text: "Auto-outreach on qualified leads", count: 1, afterNodeId: "19-k2" },
        ],
      },
      {
        agent: "PULSE",
        subtitle: "Content & Social Media",
        color: "orange",
        startDelay: 1500,
        nodes: [
          { id: "19-p1", icon: "chart", tool: "Weekly Content", text: "Configuring weekly content generation... pulls trending topics from Cortex...", delay: 0 },
          { id: "19-p2", icon: "content", tool: "Auto-Write", text: "Every Monday: 5 posts written and scheduled...", delay: 1500 },
          { id: "19-p3", icon: "chart", tool: "Inbound Loop", text: "Content attracts inbound leads -> leads enter same pipeline -> LOOP CLOSED.", delay: 2500 },
        ],
        outputUpdates: [
          { icon: "content", text: "Weekly: 5 content pieces published", count: 5, afterNodeId: "19-p2" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "19-n1", icon: "shield", tool: "System Monitor", text: "Monitoring all automations for health...", delay: 0 },
          { id: "19-n2", icon: "shield", tool: "Threshold Alerts", text: "Alert if daily lead gen drops below 5...", delay: 1200 },
          { id: "19-n3", icon: "calendar", tool: "Weekly Report", text: "Friday system health report: CONFIGURED.", delay: 2200 },
        ],
        outputUpdates: [
          { icon: "shield", text: "24/7 health monitoring active", count: 1, afterNodeId: "19-n1" },
        ],
      },
    ],
    summary: { actions: 40, time: 92, humanTime: "impossible", humanCost: "$7,200" },
    outputSummary: "Perpetual system deployed | 10 leads/day | Auto-outreach | 5 weekly content pieces | 24/7 monitoring | 200+ leads/month expected",
  },

  // PROMPT 20
  {
    id: 20,
    slug: "client-onboarding",
    prompt: "I just signed a new client. Onboard them in the next hour.",
    tags: "CORTEX + STRIKER + SENTINEL",
    category: "operations",
    agentNames: ["CORTEX", "STRIKER", "SENTINEL"],
    brainResponse: "New client onboarding initiated. Building their world in 60 minutes.",
    type: "branch",
    branches: [
      {
        agent: "CORTEX",
        subtitle: "Research & Intelligence",
        color: "orange",
        startDelay: 0,
        nodes: [
          { id: "20-c1", icon: "search", tool: "Deep Research", text: "Researching client's company... website, team, competitors, market position...", delay: 0 },
          { id: "20-c2", icon: "search", tool: "News Scan", text: "Checking recent news, funding, product launches...", delay: 1200 },
          { id: "20-c3", icon: "chart", tool: "Quick Wins", text: "Identifying 3 deliverables you can ship in week 1...", delay: 2200, hoverPreview: "Quick Win 1: Fix their mobile checkout CTA (broken on iPhone)\nQuick Win 2: 5 leads matching their ICP, ready to send\nQuick Win 3: Competitive analysis of top 3 competitors" },
          { id: "20-c4", icon: "database", tool: "Client Profile", text: "Complete Client Profile document saved. 6 pages.", delay: 3200 },
        ],
        outputUpdates: [
          { icon: "content", text: "Client profile built (6 pages)", count: 1, afterNodeId: "20-c4" },
          { icon: "chart", text: "quick wins identified", count: 3, afterNodeId: "20-c3" },
        ],
        sendsDataTo: "STRIKER",
      },
      {
        agent: "STRIKER",
        subtitle: "Sales & Deal Tracking",
        color: "orange",
        startDelay: 2000,
        nodes: [
          { id: "20-k1", icon: "mail", tool: "Welcome Email", text: "Drafting email 1: 'Welcome. Here's what happens next.' with timeline...", delay: 0 },
          { id: "20-k2", icon: "mail", tool: "Setup Email", text: "Drafting email 2 (day 1): access credentials and setup checklist...", delay: 1200 },
          { id: "20-k3", icon: "mail", tool: "Results Email", text: "Drafting email 3 (day 3): 'Your first results' with quick win delivery...", delay: 2200 },
          { id: "20-k4", icon: "calendar", tool: "Calendar Events", text: "Creating: kickoff call, week 1 review, month 1 check-in...", delay: 3000 },
          { id: "20-k5", icon: "mail", tool: "Gmail Drafts", text: "3 onboarding emails saved. Calendar events created.", delay: 3800 },
        ],
        outputUpdates: [
          { icon: "mail", text: "onboarding emails drafted", count: 3, afterNodeId: "20-k5" },
          { icon: "calendar", text: "Kickoff call scheduled", count: 1, afterNodeId: "20-k4" },
        ],
      },
      {
        agent: "SENTINEL",
        subtitle: "Infrastructure & Monitoring",
        color: "orange",
        startDelay: 1000,
        nodes: [
          { id: "20-n1", icon: "code", tool: "Client Monitoring", text: "Setting up monitoring for client's website... uptime, performance...", delay: 0 },
          { id: "20-n2", icon: "shield", tool: "Competitor Config", text: "Configuring competitor tracking specific to client's market...", delay: 1200 },
          { id: "20-n3", icon: "shield", tool: "Initial Diagnostic", text: "Running baseline diagnostics... data ready for kickoff call.", delay: 2200 },
          { id: "20-n4", icon: "shield", tool: "Dashboard", text: "Client dashboard configured. Monitoring: ACTIVE.", delay: 3000 },
        ],
        outputUpdates: [
          { icon: "shield", text: "Client monitoring active", count: 1, afterNodeId: "20-n4" },
          { icon: "shield", text: "Dashboard configured", count: 1, afterNodeId: "20-n4" },
        ],
      },
    ],
    summary: { actions: 22, time: 73, humanTime: "half a day", humanCost: "$1,500" },
    outputSummary: "Client profile built | 3 quick wins identified | 3 onboarding emails | Kickoff scheduled | Monitoring active | Dashboard configured",
  },
];

export function getPromptBySlug(slug: string): PromptData | undefined {
  return prompts.find((p) => p.slug === slug);
}

export function getAgentColor(agent: string): string {
  const colors: Record<string, string> = {
    CORTEX: "#DA4E24",
    SPECTER: "#DA4E24",
    STRIKER: "#DA4E24",
    PULSE: "#DA4E24",
    SENTINEL: "#DA4E24",
  };
  return colors[agent] || "#DA4E24";
}
