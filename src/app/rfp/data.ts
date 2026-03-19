/* ── Types ─────────────────────────────────────────── */

export interface RfpForm {
  recipientEmail: string;
  clientName: string;
  clientEmail: string;
  company: string;
  role: string;
  website: string;
  location: string;
  industry: string;
  companyStage: string;
  teamSize: string;
  businessSummary: string;
  revenueBand: string;
  mainMarket: string;
  growthStage: string;
  automationRequest: string;
  desiredOutcome: string;
  bottleneck: string;
  expectedOutputs: string;
  workflowTitle: string;
  endUsers: string;
  currentManualProcess: string;
  toolsInvolved: string[];
  automationTools: string;
  dataSources: string;
  modelsInUse: string[];
  stackDetails: string;
  triggers: string;
  workflowSteps: string;
  approvalRules: string[];
  sensitivityLevel: string;
  edgeCases: string;
  failureRisks: string;
  securityNotes: string;
  accessConstraints: string;
  successMetric: string;
  urgency: string;
  successDefinition: string;
  budgetRange: string;
  communicationStyle: string;
  referenceLinks: string;
  extraContext: string;
}

export const EMPTY_FORM: RfpForm = {
  recipientEmail: "", clientName: "", clientEmail: "", company: "", role: "", website: "", location: "",
  industry: "", companyStage: "", teamSize: "", businessSummary: "", revenueBand: "", mainMarket: "", growthStage: "",
  automationRequest: "", desiredOutcome: "", bottleneck: "", expectedOutputs: "", workflowTitle: "", endUsers: "", currentManualProcess: "",
  toolsInvolved: [], automationTools: "", dataSources: "", modelsInUse: [], stackDetails: "",
  triggers: "", workflowSteps: "", approvalRules: [], sensitivityLevel: "", edgeCases: "", failureRisks: "", securityNotes: "", accessConstraints: "",
  successMetric: "", urgency: "", successDefinition: "", budgetRange: "", communicationStyle: "", referenceLinks: "", extraContext: "",
};

export const REQUIRED_FIELDS: (keyof RfpForm)[] = [
  "recipientEmail", "clientName", "clientEmail", "company",
  "industry", "companyStage", "teamSize", "businessSummary",
  "automationRequest", "desiredOutcome", "bottleneck", "expectedOutputs",
  "toolsInvolved",
  "triggers", "workflowSteps", "approvalRules", "sensitivityLevel",
  "successMetric", "urgency", "successDefinition",
];

/* ── Section definitions ──────────────────────────── */

export interface SectionDef {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  fields: (keyof RfpForm)[];
  requiredFields: (keyof RfpForm)[];
}

export const SECTIONS: SectionDef[] = [
  { id: "routing", title: "Routing and contact", shortTitle: "Routing", description: "Where to send this brief and who to reach", fields: ["recipientEmail", "clientName", "clientEmail", "company", "role", "website", "location"], requiredFields: ["recipientEmail", "clientName", "clientEmail", "company"] },
  { id: "business", title: "Business context", shortTitle: "Business", description: "Help the recipient understand your company", fields: ["industry", "companyStage", "teamSize", "businessSummary", "revenueBand", "mainMarket", "growthStage"], requiredFields: ["industry", "companyStage", "teamSize", "businessSummary"] },
  { id: "build", title: "What needs to be built", shortTitle: "Build", description: "Define the system you want created", fields: ["automationRequest", "desiredOutcome", "bottleneck", "expectedOutputs", "workflowTitle", "endUsers", "currentManualProcess"], requiredFields: ["automationRequest", "desiredOutcome", "bottleneck", "expectedOutputs"] },
  { id: "stack", title: "Current stack and tools", shortTitle: "Stack", description: "Tools and accounts this system touches", fields: ["toolsInvolved", "automationTools", "dataSources", "modelsInUse", "stackDetails"], requiredFields: ["toolsInvolved"] },
  { id: "workflow", title: "Workflow design", shortTitle: "Workflow", description: "How the system should behave end to end", fields: ["triggers", "workflowSteps", "approvalRules", "sensitivityLevel", "edgeCases", "failureRisks", "securityNotes", "accessConstraints"], requiredFields: ["triggers", "workflowSteps", "approvalRules", "sensitivityLevel"] },
  { id: "delivery", title: "Delivery and success", shortTitle: "Delivery", description: "Timeline, budget, and success criteria", fields: ["successMetric", "urgency", "successDefinition", "budgetRange", "communicationStyle", "referenceLinks", "extraContext"], requiredFields: ["successMetric", "urgency", "successDefinition"] },
  { id: "review", title: "Review and submit", shortTitle: "Review", description: "Final check before sending", fields: [], requiredFields: [] },
];

/* ── Select options ───────────────────────────────── */

export const INDUSTRY_OPTIONS = ["SaaS", "Agency", "Ecommerce", "Local services", "Healthcare", "Real estate", "Education", "Media", "Finance", "Recruiting", "Consulting", "Other"];
export const COMPANY_STAGE_OPTIONS = ["Pre-revenue", "Early traction", "Growing", "Established", "Enterprise"];
export const TEAM_SIZE_OPTIONS = ["Solo", "2 to 5", "6 to 20", "21 to 50", "51+"];
export const REVENUE_BAND_OPTIONS = ["Pre-revenue", "Under $100K", "$100K-$500K", "$500K-$1M", "$1M-$5M", "$5M+"];
export const TOOL_OPTIONS = ["Gmail", "Google Calendar", "Slack", "Notion", "Airtable", "HubSpot", "Salesforce", "Stripe", "Framer", "Webflow", "Telegram", "WhatsApp", "Google Sheets", "Docs", "Zapier", "n8n", "Make", "Supabase", "Postgres", "Custom API", "CRM", "Helpdesk", "Internal database", "Other"];
export const MODEL_OPTIONS = ["Claude", "Claude Code", "OpenClaw", "GPT", "Gemini", "Llama", "Mistral", "Custom model", "No model selected yet"];
export const APPROVAL_OPTIONS = ["Fully autonomous where safe", "Human approval before send", "Human approval before publish", "Human approval before external action", "Internal only", "Mixed approval flow"];
export const SENSITIVITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
export const URGENCY_OPTIONS = ["No deadline", "This week", "2 weeks", "This month", "Urgent"];
export const BUDGET_OPTIONS = ["Not defined yet", "Under $1K", "$1K to $5K", "$5K to $15K", "$15K+"];
export const AUTOMATION_CHIPS = ["Lead generation", "Inbox triage", "Meeting scheduling", "CRM cleanup", "Founder content engine", "Competitor tracking", "Client reporting", "Support automation", "Internal ops", "Research system", "Multi-agent execution", "Custom workflow"];

/* ── Field examples (expandable help text) ────────── */

export const FIELD_EXAMPLES: Partial<Record<keyof RfpForm, string>> = {
  businessSummary: "We run a B2B SaaS platform that helps recruiting agencies manage candidate pipelines. Our customers are mid-size staffing firms with 10-50 recruiters. We are growing but our sales process is still mostly manual.",
  automationRequest: "Monitor founder job posts across 200 target companies, enrich hiring signals with firmographic data, create prioritized target accounts based on team growth velocity, and draft contextual outbound emails referencing specific hiring patterns for review before sending.",
  desiredOutcome: "Every weekday morning, 5-10 qualified, enriched leads are ready in the pipeline with personalized outreach drafted. Manual prospecting time drops from 3 hours to 15 minutes of review and approval.",
  bottleneck: "I spend 3 hours every morning manually checking LinkedIn, job boards, and company pages for signals. Then I copy data into a spreadsheet, score leads by gut feel, and write individual emails. The quality is inconsistent and I miss opportunities.",
  expectedOutputs: "Enriched lead records with company data, contact info, and hiring signals. A fit score per lead. Personalized outreach draft per lead. Daily summary of new leads found and queued. Weekly pipeline health report.",
  triggers: "Daily scheduled run at 6am UTC. Also triggered when a monitored company posts a new job listing on LinkedIn or their careers page. Manual trigger available for ad-hoc research requests.",
  workflowSteps: "1. Scan monitored company list for new job posts and team changes\n2. Enrich matches with firmographic data (industry, size, funding, tech stack)\n3. Pull contact info for decision makers\n4. Score each lead against ICP criteria (team size, industry, growth rate)\n5. Generate personalized email draft referencing specific signals\n6. Queue high-confidence leads for auto-send, hold others for review\n7. Track email opens, replies, and bounces\n8. Update CRM with engagement data",
  successMetric: "80% of qualified leads get a personalized follow-up within 1 hour of detection. Pipeline volume increases by 3x. Manual prospecting time drops below 30 minutes per day. Reply rate stays above 8%.",
  successDefinition: "First version monitors 50 target companies, enriches new leads, scores them, and drafts outreach emails held for approval. No auto-sending in v1. Daily summary delivered to Slack. Basic CRM integration for lead tracking.",
};

/* ── Guide content ────────────────────────────────── */

export interface GuideContent {
  title: string;
  purpose: string;
  tips: string[];
  example: string;
  avoid: string;
}

export const SECTION_GUIDES: Record<string, GuideContent> = {
  routing: {
    title: "Routing and contact",
    purpose: "The recipient email receives the full structured brief. Your email gets a confirmation copy. Use the direct email of the person who will scope the work.",
    tips: [
      "Use the email of the person actually reviewing this brief",
      "Include your company name as you want it referenced",
      "Role and website help the recipient research context quickly",
    ],
    example: "Direct email of the technical lead or project manager, not a generic inbox",
    avoid: "Generic addresses like info@ or support@ that nobody monitors",
  },
  business: {
    title: "Business context",
    purpose: "This shapes how complex the solution needs to be and what constraints matter. Be specific about what the company does, not just what industry it is in.",
    tips: [
      "Describe what the business does in 2-3 concrete sentences",
      "Team size affects whether the system needs multi-user logic",
      "Revenue band helps calibrate the solution to your current scale",
    ],
    example: "B2B SaaS helping recruiting agencies manage candidate pipelines. 12-person team, $800K ARR, growing 15% MoM. Primary market is US mid-size staffing firms.",
    avoid: "Vague descriptions like 'we help businesses grow' without specifics about customers, product, or scale",
  },
  build: {
    title: "What needs to be built",
    purpose: "This is the core of the brief. Describe the manual process today, what the automated version should do, and what it should produce. The more specific, the faster scoping starts.",
    tips: [
      "Walk through the current manual workflow step by step",
      "Name the exact bottleneck, even if the bottleneck is you",
      "List every expected output: emails, reports, data updates, notifications",
      "Use the template buttons to see examples of well-written requests",
    ],
    example: "Build a system that monitors 200 target companies for hiring signals, enriches leads with firmographic data, scores against ICP, and drafts personalized outreach held for founder approval before sending.",
    avoid: "Vague requests like 'automate my outreach' or 'use AI to handle leads' without specifying what exactly happens at each step",
  },
  stack: {
    title: "Stack and tools",
    purpose: "Every automation connects to existing tools. Knowing the full stack upfront prevents rework, reveals integration complexity, and helps estimate build time accurately.",
    tips: [
      "Include every tool the workflow will touch, even indirectly",
      "Note any tools with API restrictions or limited access",
      "Mention automation tools you have tried and moved away from",
    ],
    example: "Gmail for outreach, HubSpot as CRM, Google Sheets for tracking, Slack for notifications, LinkedIn for research (manual currently), Apollo for enrichment",
    avoid: "Saying 'standard tools' without listing them. The builder needs to plan integrations specifically.",
  },
  workflow: {
    title: "Workflow design",
    purpose: "This defines exactly how the system should behave. Clear triggers, ordered steps, and explicit approval rules are what separate a good brief from a vague one.",
    tips: [
      "Name every trigger: new email, form submission, cron schedule, webhook, manual",
      "List steps in execution order from trigger to final output",
      "Be explicit about what needs human approval vs. autonomous execution",
    ],
    example: "Triggered daily at 6am. Scans job boards, enriches matches, scores leads, drafts emails, holds for review. Auto-sends only leads scoring 90+. Sends daily Slack summary.",
    avoid: "Saying 'just make it work automatically' without specifying triggers, steps, or where humans stay in the loop",
  },
  delivery: {
    title: "Delivery and success",
    purpose: "Without a shared definition of success, expectations diverge. Name measurable outcomes, realistic timelines, and what the minimum first version looks like.",
    tips: [
      "Name a measurable number: hours saved, response time, leads contacted",
      "First version can be simpler than the final vision",
      "Budget range helps the builder propose realistic scope",
    ],
    example: "Success = 80% of leads get a follow-up within 1 hour instead of 24 hours. First version needed in 2 weeks. Budget $3K-$5K for v1.",
    avoid: "Goals like 'make it better' or timelines like 'ASAP' without measurable criteria",
  },
  review: {
    title: "Review",
    purpose: "Check that required fields are complete and key sections have enough detail for the recipient to understand the project without a follow-up call.",
    tips: [
      "Would a stranger understand what to build from this brief?",
      "Is the desired outcome measurable?",
      "Is the recipient email correct?",
    ],
    example: "All sections filled with specific, actionable detail. Automation request describes exact steps. Success metric names a number.",
    avoid: "Single-word answers in required fields or vague descriptions in key sections",
  },
};

/* ── Templates ────────────────────────────────────── */

export interface Template {
  label: string;
  description: string;
  data: Partial<RfpForm>;
}

export const TEMPLATES: Template[] = [
  {
    label: "Lead generation",
    description: "Automated prospecting, enrichment, scoring, and outreach pipeline",
    data: {
      workflowTitle: "Automated lead generation pipeline",
      automationRequest: "Monitor founder job posts across 200 target companies, enrich hiring signals with firmographic data, create prioritized target accounts based on team growth velocity, and draft contextual outbound emails referencing specific hiring patterns for review before sending.",
      desiredOutcome: "5-10 qualified, enriched leads ready every weekday morning with personalized outreach drafted. Manual prospecting time drops from 3 hours to 15 minutes of review.",
      bottleneck: "Manual prospecting takes 3+ hours daily. Lead quality is inconsistent because scoring is based on gut feel. No systematic enrichment or signal tracking.",
      expectedOutputs: "Enriched lead records with company data and contact info, fit scores per lead, personalized outreach drafts, daily lead summary, weekly pipeline report",
      triggers: "Daily scheduled run at 6am UTC + triggered when monitored company posts new job listing",
      workflowSteps: "1. Scan monitored company list for new job posts and team changes\n2. Enrich matches with firmographic data (industry, size, funding, tech stack)\n3. Pull contact info for decision makers\n4. Score each lead against ICP criteria\n5. Generate personalized email referencing specific signals\n6. Queue high-confidence for auto-send, hold others for review\n7. Track opens, replies, bounces\n8. Update CRM with engagement data",
      approvalRules: ["Human approval before send", "Fully autonomous where safe"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["CRM", "Gmail", "Google Sheets", "Slack"],
      successMetric: "Pipeline volume increases 3x. Manual prospecting drops below 30 min/day. Reply rate stays above 8%.",
      successDefinition: "V1 monitors 50 companies, enriches leads, scores them, drafts outreach held for approval. No auto-sending in v1. Daily Slack summary. Basic CRM integration.",
    },
  },
  {
    label: "Inbox automation",
    description: "Triage, classify, draft responses, escalate high-intent",
    data: {
      workflowTitle: "Inbox triage and response system",
      automationRequest: "Watch a shared inbox for new inbound leads and support requests. Classify each email by urgency and type. Draft replies for common inquiries. Route high-intent leads to a Slack channel with context. Prepare calendar booking options for meeting requests.",
      desiredOutcome: "Inbox processing time reduced by 70%. Common inquiries answered within 10 minutes. High-intent leads surfaced in Slack within 2 minutes of arrival.",
      bottleneck: "Manually reading and responding to 60+ emails daily. Missing high-intent leads buried under support noise. Average first-response time is 6 hours.",
      expectedOutputs: "Categorized inbox feed, auto-drafted responses, Slack alerts for high-intent leads, calendar booking links, daily email summary with stats",
      triggers: "New email received in monitored inbox",
      workflowSteps: "1. Parse incoming email for sender, subject, body, attachments\n2. Classify by type: lead inquiry, support, billing, spam, internal\n3. Score urgency based on keywords, sender history, and context\n4. Draft response using category-specific templates\n5. Route high-intent leads to Slack with enriched sender data\n6. Prepare calendar booking options for meeting requests\n7. Hold drafts for review or auto-send based on confidence\n8. Log all actions and update daily metrics",
      approvalRules: ["Human approval before send", "Fully autonomous where safe"],
      sensitivityLevel: "High",
      toolsInvolved: ["Gmail", "Slack", "Google Calendar", "Google Sheets"],
      successMetric: "Average first-response time drops from 6 hours to under 30 minutes. Zero high-intent leads missed per week.",
      successDefinition: "V1 handles the shared inbox only. Classifies emails, drafts responses held for approval, and sends Slack alerts for leads. No auto-sending in v1.",
    },
  },
  {
    label: "Content engine",
    description: "Turn founder insights into multi-platform content",
    data: {
      workflowTitle: "Founder content engine",
      automationRequest: "Turn one weekly founder insight (voice memo, rough notes, or bullet points) into a LinkedIn post, Twitter thread, email newsletter draft, and 3 outbound conversation angles tied to active market signals. Track performance across platforms.",
      desiredOutcome: "Consistent daily content output across 3 platforms without daily founder involvement. Content performance tracked automatically. Best-performing angles identified weekly.",
      bottleneck: "Founder has insights but no time to write, format, and publish consistently. Content goes out 1-2x per week instead of daily. No performance tracking.",
      expectedOutputs: "Platform-ready posts for LinkedIn and Twitter, email newsletter draft, outbound conversation angles, performance dashboard, weekly top-performer report",
      triggers: "Founder submits voice memo or notes via Slack command or shared Notion page",
      workflowSteps: "1. Capture founder input (voice memo transcribed, or notes parsed)\n2. Extract core insight, supporting points, and market angle\n3. Generate LinkedIn post (hook + body + CTA)\n4. Generate Twitter thread (5-7 tweets)\n5. Generate email newsletter section\n6. Generate 3 outbound conversation openers tied to current signals\n7. Queue all content for founder approval\n8. Publish approved content on schedule\n9. Track engagement metrics per piece\n10. Surface top performers in weekly report",
      approvalRules: ["Human approval before publish"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["Notion", "Slack", "Google Sheets"],
      successMetric: "Content output increases from 2x/week to daily. Engagement rate stays at or above current baseline. Founder time drops from 5 hours/week to 30 minutes.",
      successDefinition: "V1 takes text input (no voice), generates LinkedIn and Twitter drafts, holds for approval, publishes on schedule. Basic engagement tracking.",
    },
  },
  {
    label: "Competitor monitoring",
    description: "Track competitor changes, pricing shifts, and market signals",
    data: {
      workflowTitle: "Competitive intelligence system",
      automationRequest: "Monitor 10 competitor websites daily for pricing changes, feature launches, messaging shifts, team changes, and content strategy moves. Classify signals by importance. Generate a weekly competitive brief with recommended responses.",
      desiredOutcome: "No competitor move goes unnoticed for more than 24 hours. Weekly competitive brief delivered with actionable recommendations. Positioning stays current.",
      bottleneck: "Founder manually checks competitor sites weekly, spending 2+ hours per session. Often misses changes that happened mid-week. No systematic tracking of pricing or messaging shifts.",
      expectedOutputs: "Real-time Slack alerts for major changes, daily change log, weekly competitive brief with recommendations, pricing comparison matrix, messaging drift tracker",
      triggers: "Daily scheduled scan at 7am UTC + real-time webhook for major changes detected",
      workflowSteps: "1. Crawl competitor websites for pricing, features, team, and content changes\n2. Diff against previous snapshot to detect changes\n3. Classify each change by type and importance\n4. Send immediate Slack alert for high-importance changes\n5. Log all changes with timestamps and screenshots\n6. Generate weekly competitive brief with change summary\n7. Include recommended responses for significant moves\n8. Update pricing comparison matrix",
      approvalRules: ["Fully autonomous where safe"],
      sensitivityLevel: "Low",
      toolsInvolved: ["Slack", "Google Sheets", "Notion"],
      successMetric: "Zero competitor pricing or feature changes missed. Weekly brief delivered every Monday by 9am. Founder time on competitive research drops from 2 hours to 10 minutes.",
      successDefinition: "V1 monitors 5 competitors for pricing and feature page changes. Sends Slack alerts for changes. Weekly summary in Google Doc.",
    },
  },
  {
    label: "Client reporting",
    description: "Automated multi-source reports delivered to clients",
    data: {
      workflowTitle: "Automated client reporting system",
      automationRequest: "Pull performance data from Google Analytics, ad platforms, and CRM for each client. Generate a branded weekly report with key metrics, trends, and anomaly flags. Deliver via email on a per-client schedule.",
      desiredOutcome: "Client reports delivered weekly without any manual data gathering or formatting. Reports highlight anomalies and suggest actions. Delivery confirmation tracked.",
      bottleneck: "Pulling data from 4+ tools per client, formatting in slides, and sending to 12 clients takes a full day each week. Reports are often late. No anomaly detection.",
      expectedOutputs: "Branded PDF reports per client, email delivery with tracking, anomaly alerts, internal dashboard of delivery status, quarterly trend summaries",
      triggers: "Weekly schedule per client (configurable day/time) + manual trigger for ad-hoc reports",
      workflowSteps: "1. Pull metrics from each client's connected data sources\n2. Normalize and aggregate data into standard format\n3. Calculate week-over-week and month-over-month trends\n4. Flag statistical anomalies and notable changes\n5. Generate branded report with charts and commentary\n6. Queue for internal review (optional)\n7. Deliver to client via email with tracking pixel\n8. Log delivery status and client open events",
      approvalRules: ["Human approval before external action", "Fully autonomous where safe"],
      sensitivityLevel: "High",
      toolsInvolved: ["Google Sheets", "Gmail", "CRM", "Custom API", "Google Calendar"],
      successMetric: "Report delivery time drops from 8 hours to under 1 hour. Zero missed deadlines per month. Client satisfaction with report quality stays at or above current level.",
      successDefinition: "V1 handles 3 clients with Google Sheets data sources. Generates simple metric summary, sends via email. No branded PDF in v1, just clean HTML email.",
    },
  },
  {
    label: "CRM recovery",
    description: "Re-engage stale pipeline and churned accounts",
    data: {
      workflowTitle: "CRM pipeline recovery workflow",
      automationRequest: "Identify stale deals and churned accounts in the CRM. Enrich with recent activity signals (website visits, email opens, social engagement). Score reactivation potential. Draft personalized re-engagement outreach referencing specific signals or changes since last contact.",
      desiredOutcome: "Stale pipeline is systematically worked every week. High-potential re-engagement leads are surfaced with context. Recovered pipeline value tracked monthly.",
      bottleneck: "400+ stale deals sitting in CRM untouched. No systematic way to identify which ones are worth re-engaging. Re-engagement emails are generic and low-converting.",
      expectedOutputs: "Weekly stale pipeline report, reactivation scores, personalized re-engagement drafts, Slack alerts for high-signal reactivations, monthly recovery dashboard",
      triggers: "Weekly scheduled run + triggered when a stale contact shows new engagement signal",
      workflowSteps: "1. Scan CRM for deals inactive for 30+ days\n2. Enrich each with recent signals (website visits, email opens, social activity)\n3. Score reactivation potential based on signal freshness and deal value\n4. Filter to top 10-15 highest-potential leads per week\n5. Draft personalized re-engagement email referencing specific signals\n6. Queue for founder review and approval\n7. Track re-engagement response rates\n8. Update CRM with reactivation status",
      approvalRules: ["Human approval before send"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["CRM", "Gmail", "Slack", "Google Sheets"],
      successMetric: "At least 5 stale deals re-engaged per week. Re-engagement reply rate above 12%. $10K+ in recovered pipeline value within first month.",
      successDefinition: "V1 scans CRM weekly, identifies top 10 stale deals by value, generates re-engagement drafts held for approval. Basic signal enrichment (email opens only).",
    },
  },
  {
    label: "Meeting scheduling",
    description: "Qualify, schedule, and prep meetings automatically",
    data: {
      workflowTitle: "Intelligent meeting scheduling assistant",
      automationRequest: "When a lead requests a meeting (via email, form, or chat), qualify them against ICP criteria, check calendar availability, send booking options, confirm the meeting, enrich the lead profile, and prepare a pre-meeting brief with company research and talking points.",
      desiredOutcome: "Meeting requests are handled within 5 minutes instead of hours. Every meeting has a prep brief ready. No-show rate decreases through automated reminders.",
      bottleneck: "Scheduling takes 3-4 email exchanges per meeting. No qualification before booking. Founder goes into meetings without prep. 25% no-show rate with no reminders.",
      expectedOutputs: "Automated booking confirmations, pre-meeting briefs with company research, calendar events with context, reminder sequences, weekly meeting analytics",
      triggers: "New meeting request via email, contact form, or Calendly webhook",
      workflowSteps: "1. Detect meeting request from email or form submission\n2. Qualify lead against ICP criteria (company size, industry, role)\n3. Check founder calendar for available slots\n4. Send booking options with preferred times\n5. Confirm booking and add to calendar with context\n6. Enrich lead profile with company research\n7. Generate pre-meeting brief (company overview, recent news, talking points)\n8. Send reminder sequence (24h and 1h before)\n9. Log meeting outcome post-call",
      approvalRules: ["Fully autonomous where safe", "Human approval before send"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["Gmail", "Google Calendar", "Slack", "CRM"],
      successMetric: "Time from meeting request to confirmed booking drops from 24 hours to under 30 minutes. No-show rate drops below 10%. Every meeting has a prep brief.",
      successDefinition: "V1 handles email-based meeting requests only. Sends 3 time slots, confirms booking, adds to calendar. Basic company enrichment for prep brief.",
    },
  },
  {
    label: "Internal ops",
    description: "Automate recurring operational tasks and reporting",
    data: {
      workflowTitle: "Internal operations assistant",
      automationRequest: "Automate weekly team standup summaries, expense categorization, contractor invoice tracking, and monthly operational metrics. Pull data from Slack, email, and spreadsheets. Deliver formatted summaries to the right people at the right time.",
      desiredOutcome: "Operational reporting runs without manual work. Team has visibility into key metrics. No invoices or expenses are missed. Weekly rhythm is automated.",
      bottleneck: "Ops manager spends 6 hours/week on reporting, expense tracking, and standup coordination. Data lives in 5 different tools. Monthly close takes 2 days of manual aggregation.",
      expectedOutputs: "Weekly standup summary, categorized expense log, invoice tracker with payment status, monthly ops dashboard, automated reminders for overdue items",
      triggers: "Weekly schedule (Monday 8am) for standups, daily for expense scanning, monthly for ops report, event-based for new invoices",
      workflowSteps: "1. Pull Slack standup messages from team channels\n2. Summarize key updates, blockers, and action items\n3. Scan email for new invoices and receipts\n4. Categorize expenses and update tracking spreadsheet\n5. Flag overdue invoices and send reminders\n6. Aggregate monthly metrics from all sources\n7. Generate formatted ops report\n8. Deliver to stakeholders via email and Slack",
      approvalRules: ["Fully autonomous where safe", "Human approval before external action"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["Slack", "Gmail", "Google Sheets", "Notion"],
      successMetric: "Ops reporting time drops from 6 hours/week to under 1 hour. Zero missed invoices. Monthly close time drops from 2 days to 4 hours.",
      successDefinition: "V1 automates standup summaries and invoice detection. Expense categorization manual in v1. Basic weekly summary delivered to Slack.",
    },
  },
  {
    label: "Research and enrichment",
    description: "Systematic research pipeline for target accounts",
    data: {
      workflowTitle: "Account research and enrichment workflow",
      automationRequest: "Given a list of target accounts, systematically research each company's tech stack, recent funding, team size, hiring patterns, and market positioning. Enrich contact records with verified emails and LinkedIn profiles. Score each account for sales readiness.",
      desiredOutcome: "Every target account has a complete research profile within 24 hours of being added. Sales team never goes into a call without context. Research is consistent and repeatable.",
      bottleneck: "SDR spends 45 minutes researching each account manually. Quality varies by person. Some accounts get thorough research, others get a quick Google search. No standardized format.",
      expectedOutputs: "Enriched account profiles, contact records with verified emails, sales readiness scores, research summary cards, weekly new-account batch report",
      triggers: "New account added to target list in CRM or spreadsheet + weekly batch processing of newly added accounts",
      workflowSteps: "1. Detect new accounts added to target list\n2. Research company website, LinkedIn page, and Crunchbase\n3. Extract tech stack, team size, funding status, and recent news\n4. Identify decision makers and pull contact info\n5. Verify email addresses\n6. Score account for sales readiness based on ICP fit\n7. Generate research summary card\n8. Push enriched data back to CRM\n9. Notify sales team of new high-score accounts",
      approvalRules: ["Fully autonomous where safe"],
      sensitivityLevel: "Low",
      toolsInvolved: ["CRM", "Google Sheets", "Slack"],
      successMetric: "Research time per account drops from 45 minutes to 5 minutes of review. 90% of accounts enriched within 24 hours. Data completeness rate above 85%.",
      successDefinition: "V1 processes accounts from a Google Sheet. Pulls basic company info and LinkedIn profiles. Generates summary card. No CRM integration in v1.",
    },
  },
  {
    label: "Approval-based outbound",
    description: "Human-in-the-loop outbound with quality controls",
    data: {
      workflowTitle: "Approval-gated outbound system",
      automationRequest: "Build an outbound system where every email is drafted by AI, reviewed by a human before sending, and tracked for engagement. Include A/B testing of subject lines and angles. Aggregate results into a weekly performance report with recommendations for angle adjustments.",
      desiredOutcome: "High-quality outbound at scale with human quality control on every message. Clear data on which angles and subject lines perform best. Volume increases without sacrificing personalization.",
      bottleneck: "Currently sending 10-15 personalized emails per day manually. Want to scale to 50+ per day but can not sacrifice quality. No A/B testing infrastructure. No systematic performance tracking.",
      expectedOutputs: "Draft emails held for approval, A/B test variants, engagement tracking (opens, replies, bounces), weekly performance report, angle effectiveness rankings",
      triggers: "Daily batch of qualified leads from pipeline + manual ad-hoc requests",
      workflowSteps: "1. Pull qualified leads from daily pipeline batch\n2. Research each lead for personalization signals\n3. Generate email draft with A/B subject line variants\n4. Queue all drafts for human review in approval interface\n5. Apply edits and approve or reject each draft\n6. Send approved emails with tracking\n7. Monitor engagement (opens, clicks, replies, bounces)\n8. Aggregate performance data by angle and subject line\n9. Generate weekly report with top-performing patterns\n10. Recommend angle adjustments based on data",
      approvalRules: ["Human approval before send"],
      sensitivityLevel: "High",
      toolsInvolved: ["Gmail", "CRM", "Google Sheets", "Slack"],
      successMetric: "Outbound volume scales from 15 to 50+ emails/day. Reply rate stays above 6%. Clear data on best-performing angles within 4 weeks.",
      successDefinition: "V1 drafts emails from a lead list, holds all for approval, sends after review. Basic open tracking. No A/B testing in v1, just draft quality.",
    },
  },
];

/* ── Helpers ───────────────────────────────────────── */

export function isFieldFilled(form: RfpForm, key: keyof RfpForm): boolean {
  const val = form[key];
  if (Array.isArray(val)) return val.length > 0;
  return typeof val === "string" && val.trim().length > 0;
}

export function getSectionCompletion(form: RfpForm, section: SectionDef): { filled: number; total: number; complete: boolean } {
  const total = section.requiredFields.length;
  if (total === 0) return { filled: 0, total: 0, complete: true };
  const filled = section.requiredFields.filter((f) => isFieldFilled(form, f)).length;
  return { filled, total, complete: filled === total };
}

export function getTotalCompletion(form: RfpForm): { filled: number; total: number; percent: number } {
  const total = REQUIRED_FIELDS.length;
  const filled = REQUIRED_FIELDS.filter((f) => isFieldFilled(form, f)).length;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const FIELD_LABELS: Record<string, string> = {
  recipientEmail: "Send this brief to", clientName: "Your name", clientEmail: "Your work email", company: "Company", role: "Your role", website: "Website", location: "Company location",
  industry: "Industry", companyStage: "Company stage", teamSize: "Team size", businessSummary: "What does the business do?", revenueBand: "Revenue band", mainMarket: "Main market", growthStage: "Current growth stage",
  automationRequest: "What do you want automated?", desiredOutcome: "Desired outcome", bottleneck: "Main bottleneck today", expectedOutputs: "Expected outputs", workflowTitle: "Workflow title", endUsers: "Who will use it?", currentManualProcess: "What happens manually today?",
  toolsInvolved: "Tools and accounts involved", automationTools: "Current automation tools", dataSources: "Data sources", modelsInUse: "Models in use", stackDetails: "Hosting and deployment stack",
  triggers: "Trigger events", workflowSteps: "Core steps the system should perform", approvalRules: "What should require approval?", sensitivityLevel: "Sensitivity level", edgeCases: "Edge cases to consider", failureRisks: "Failure risks", securityNotes: "Security or privacy notes", accessConstraints: "Access constraints",
  successMetric: "Success metric", urgency: "Deadline or urgency", successDefinition: "What does a successful first version look like?", budgetRange: "Budget range", communicationStyle: "Preferred communication style", referenceLinks: "Reference links", extraContext: "Extra context",
};
