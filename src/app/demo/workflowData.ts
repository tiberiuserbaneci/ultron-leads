// Workflow data for all 10 demo prompts

export type NodeIcon = "search" | "person" | "mail" | "calendar" | "code" | "database" | "shield" | "chart" | "content" | "linkedin";

export interface WorkflowNode {
  id: string;
  icon: NodeIcon;
  tool: string;
  text: string;
  delay: number; // ms after branch starts
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
          { id: "1-s3", icon: "chart", tool: "Lead Scoring", text: 'Scoring leads 0-100... Top lead: Marcus Weber, AutomateDE (85/100)', delay: 2500 },
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
          { id: "1-k3", icon: "mail", tool: "Gmail Drafts", text: "8 email drafts saved to Gmail", delay: 2500 },
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
          { id: "1-p3", icon: "content", tool: "Content Generator", text: "3 LinkedIn posts drafted in your voice", delay: 2700 },
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
