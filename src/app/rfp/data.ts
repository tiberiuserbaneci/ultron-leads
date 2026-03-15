/* ── Types ─────────────────────────────────────────── */

export interface RfpForm {
  // Section 1 - Routing & contact
  recipientEmail: string;
  clientName: string;
  clientEmail: string;
  company: string;
  role: string;
  website: string;
  location: string;

  // Section 2 - Business context
  industry: string;
  companyStage: string;
  teamSize: string;
  businessSummary: string;
  revenueBand: string;
  mainMarket: string;
  growthStage: string;

  // Section 3 - What needs to be built
  automationRequest: string;
  desiredOutcome: string;
  bottleneck: string;
  expectedOutputs: string;
  workflowTitle: string;
  endUsers: string;
  currentManualProcess: string;

  // Section 4 - Current stack
  toolsInvolved: string[];
  automationTools: string;
  dataSources: string;
  modelsInUse: string[];
  stackDetails: string;

  // Section 5 - Workflow design
  triggers: string;
  workflowSteps: string;
  approvalRules: string[];
  sensitivityLevel: string;
  edgeCases: string;
  failureRisks: string;
  securityNotes: string;
  accessConstraints: string;

  // Section 6 - Delivery & success
  successMetric: string;
  urgency: string;
  successDefinition: string;
  budgetRange: string;
  communicationStyle: string;
  referenceLinks: string;
  extraContext: string;
}

export const EMPTY_FORM: RfpForm = {
  recipientEmail: "",
  clientName: "",
  clientEmail: "",
  company: "",
  role: "",
  website: "",
  location: "",
  industry: "",
  companyStage: "",
  teamSize: "",
  businessSummary: "",
  revenueBand: "",
  mainMarket: "",
  growthStage: "",
  automationRequest: "",
  desiredOutcome: "",
  bottleneck: "",
  expectedOutputs: "",
  workflowTitle: "",
  endUsers: "",
  currentManualProcess: "",
  toolsInvolved: [],
  automationTools: "",
  dataSources: "",
  modelsInUse: [],
  stackDetails: "",
  triggers: "",
  workflowSteps: "",
  approvalRules: [],
  sensitivityLevel: "",
  edgeCases: "",
  failureRisks: "",
  securityNotes: "",
  accessConstraints: "",
  successMetric: "",
  urgency: "",
  successDefinition: "",
  budgetRange: "",
  communicationStyle: "",
  referenceLinks: "",
  extraContext: "",
};

export const REQUIRED_FIELDS: (keyof RfpForm)[] = [
  "recipientEmail",
  "clientName",
  "clientEmail",
  "company",
  "industry",
  "companyStage",
  "teamSize",
  "businessSummary",
  "automationRequest",
  "desiredOutcome",
  "bottleneck",
  "expectedOutputs",
  "toolsInvolved",
  "triggers",
  "workflowSteps",
  "approvalRules",
  "sensitivityLevel",
  "successMetric",
  "urgency",
  "successDefinition",
];

/* ── Section definitions ──────────────────────────── */

export interface SectionDef {
  id: string;
  title: string;
  description: string;
  fields: (keyof RfpForm)[];
  requiredFields: (keyof RfpForm)[];
}

export const SECTIONS: SectionDef[] = [
  {
    id: "routing",
    title: "Routing and contact",
    description: "Where to send this brief and who to contact",
    fields: ["recipientEmail", "clientName", "clientEmail", "company", "role", "website", "location"],
    requiredFields: ["recipientEmail", "clientName", "clientEmail", "company"],
  },
  {
    id: "business",
    title: "Business context",
    description: "Help us understand your company",
    fields: ["industry", "companyStage", "teamSize", "businessSummary", "revenueBand", "mainMarket", "growthStage"],
    requiredFields: ["industry", "companyStage", "teamSize", "businessSummary"],
  },
  {
    id: "build",
    title: "What needs to be built",
    description: "Define the system you want automated",
    fields: ["automationRequest", "desiredOutcome", "bottleneck", "expectedOutputs", "workflowTitle", "endUsers", "currentManualProcess"],
    requiredFields: ["automationRequest", "desiredOutcome", "bottleneck", "expectedOutputs"],
  },
  {
    id: "stack",
    title: "Current stack and tools",
    description: "What tools and accounts are involved",
    fields: ["toolsInvolved", "automationTools", "dataSources", "modelsInUse", "stackDetails"],
    requiredFields: ["toolsInvolved"],
  },
  {
    id: "workflow",
    title: "Workflow design details",
    description: "How the system should behave",
    fields: ["triggers", "workflowSteps", "approvalRules", "sensitivityLevel", "edgeCases", "failureRisks", "securityNotes", "accessConstraints"],
    requiredFields: ["triggers", "workflowSteps", "approvalRules", "sensitivityLevel"],
  },
  {
    id: "delivery",
    title: "Delivery and success",
    description: "How you measure success and timeline",
    fields: ["successMetric", "urgency", "successDefinition", "budgetRange", "communicationStyle", "referenceLinks", "extraContext"],
    requiredFields: ["successMetric", "urgency", "successDefinition"],
  },
  {
    id: "review",
    title: "Review and submit",
    description: "Review your brief before sending",
    fields: [],
    requiredFields: [],
  },
];

/* ── Select options ───────────────────────────────── */

export const INDUSTRY_OPTIONS = [
  "SaaS", "Agency", "Ecommerce", "Local services", "Healthcare",
  "Real estate", "Education", "Media", "Finance", "Recruiting",
  "Consulting", "Other",
];

export const COMPANY_STAGE_OPTIONS = [
  "Pre-revenue", "Early traction", "Growing", "Established", "Enterprise",
];

export const TEAM_SIZE_OPTIONS = [
  "Solo", "2 to 5", "6 to 20", "21 to 50", "51+",
];

export const REVENUE_BAND_OPTIONS = [
  "Pre-revenue", "Under $100K", "$100K-$500K", "$500K-$1M", "$1M-$5M", "$5M+",
];

export const TOOL_OPTIONS = [
  "Gmail", "Google Calendar", "Slack", "Notion", "Airtable",
  "HubSpot", "Salesforce", "Stripe", "Framer", "Webflow",
  "Telegram", "WhatsApp", "Google Sheets", "Docs", "Zapier",
  "n8n", "Make", "Supabase", "Postgres", "Custom API",
  "CRM", "Helpdesk", "Internal database", "Other",
];

export const MODEL_OPTIONS = [
  "Claude", "Claude Code", "OpenClaw", "GPT", "Gemini",
  "Llama", "Mistral", "Custom model", "No model selected yet",
];

export const APPROVAL_OPTIONS = [
  "Fully autonomous where safe",
  "Human approval before send",
  "Human approval before publish",
  "Human approval before external action",
  "Internal only",
  "Mixed approval flow",
];

export const SENSITIVITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export const URGENCY_OPTIONS = [
  "No deadline", "This week", "2 weeks", "This month", "Urgent",
];

export const BUDGET_OPTIONS = [
  "Not defined yet", "Under $1K", "$1K to $5K", "$5K to $15K", "$15K+",
];

export const AUTOMATION_CHIPS = [
  "Lead generation", "Inbox triage", "Meeting scheduling",
  "CRM cleanup", "Founder content engine", "Competitor tracking",
  "Client reporting", "Support automation", "Internal ops",
  "Research system", "Multi-agent execution", "Custom workflow",
];

/* ── Guide content ────────────────────────────────── */

export interface GuideContent {
  title: string;
  purpose: string;
  strongAnswer: string;
  weakAnswer: string;
  tips: string[];
}

export const SECTION_GUIDES: Record<string, GuideContent> = {
  routing: {
    title: "Routing and contact",
    purpose: "This determines where the completed brief lands. The recipient email receives the full structured document. Your email gets a confirmation copy.",
    strongAnswer: "Clear professional email addresses. The recipient should be the person or team who will actually scope and build the work.",
    weakAnswer: "Generic inboxes like info@ or support@ that nobody monitors. Missing company name or contact info.",
    tips: [
      "Use the direct email of the person reviewing this brief",
      "Include your company name exactly as you want it referenced",
      "Your role helps the recipient understand your decision-making authority",
      "Website helps with quick context research",
    ],
  },
  business: {
    title: "Business context",
    purpose: "This section gives the builder immediate context about your company. It shapes how complex the solution needs to be and what constraints matter.",
    strongAnswer: "Specific industry, clear stage, honest team size, and a business summary that explains what the company actually does in 2 to 3 sentences.",
    weakAnswer: "Vague descriptions like 'we help businesses grow' or skipping the team size. These make it hard to scope anything accurately.",
    tips: [
      "Be specific about what the business does, not just what industry it is in",
      "Team size affects whether the system needs multi-user logic",
      "Revenue band helps calibrate the solution to your scale",
      "Growth stage tells the builder how much the system needs to flex",
    ],
  },
  build: {
    title: "What needs to be built",
    purpose: "This is the core of the brief. It defines what you want automated, what outcome you expect, and what is currently broken or slow.",
    strongAnswer: "Concrete description of the manual process, clear desired outcome, specific bottleneck, and defined expected outputs. Example: 'Every morning I manually check 3 platforms for new leads, score them in a spreadsheet, and write follow-up emails. This takes 2 hours daily.'",
    weakAnswer: "'I want AI to handle everything' or 'Automate my business.' These give the builder nothing to work with.",
    tips: [
      "Describe the current manual workflow step by step",
      "Be specific about what 'done' looks like",
      "Name the bottleneck honestly, even if it is you",
      "List every expected output: emails sent, reports generated, data updated",
    ],
  },
  stack: {
    title: "Current stack and tools",
    purpose: "Every automation connects to existing tools. Knowing your stack upfront prevents rework and scoping errors. This also reveals integration complexity.",
    strongAnswer: "Complete list of tools the system needs to touch. Include login providers, data stores, communication channels, and any existing automation tools.",
    weakAnswer: "Listing just one tool or saying 'standard stuff.' The builder needs to know exactly what connects to what.",
    tips: [
      "Include every tool the workflow touches, even indirectly",
      "Mention any tools you have tried and stopped using",
      "If you already use an automation platform, name it",
      "Note any tools with API limitations or restricted access",
    ],
  },
  workflow: {
    title: "Workflow design details",
    purpose: "This defines exactly how the system should behave. Triggers, steps, approval logic, and sensitivity. This is where build quality is determined.",
    strongAnswer: "Clear trigger events, step-by-step process, defined approval points, and honest sensitivity assessment. Example: 'Triggered by new row in Airtable. System enriches the lead, scores it, drafts a personalized email, and holds for approval before sending.'",
    weakAnswer: "'Just make it work automatically' without defining what triggers the system, what it does, or where humans need to stay in the loop.",
    tips: [
      "Name every trigger event: new email, form submission, schedule, API webhook",
      "List steps in the order they should execute",
      "Be explicit about what needs human approval",
      "Higher sensitivity means more guardrails, which is fine",
    ],
  },
  delivery: {
    title: "Delivery and success",
    purpose: "This tells the builder how to measure whether the system works and when it needs to be ready. Without this, there is no shared definition of done.",
    strongAnswer: "A measurable success metric, realistic timeline, and clear first-version definition. Example: 'Success means 80% of leads get a follow-up within 1 hour instead of 24 hours. First version needed in 2 weeks.'",
    weakAnswer: "'Make it better' or 'ASAP' without any measurable criteria. This leads to misaligned expectations.",
    tips: [
      "Name a number: hours saved, response time reduced, leads contacted",
      "First version can be simpler than the final vision",
      "Budget range helps the builder propose realistic scope",
      "Reference links to similar tools or workflows speed up understanding",
    ],
  },
  review: {
    title: "Review",
    purpose: "Check your brief before submitting. Make sure required fields are complete and key sections are detailed enough to start a real conversation.",
    strongAnswer: "All required fields filled. Key sections have enough detail for the recipient to understand the project without a follow-up call.",
    weakAnswer: "Rushed through required fields with single-word answers. Key sections left vague.",
    tips: [
      "Read back the automation request section. Would a stranger understand what to build?",
      "Check that your desired outcome is measurable",
      "Verify the recipient email is correct",
      "The stronger the brief, the faster the build starts",
    ],
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
    label: "Lead gen workflow",
    description: "Automated lead generation and outreach pipeline",
    data: {
      workflowTitle: "Automated lead generation pipeline",
      automationRequest: "Build a system that finds qualified leads from defined ICP criteria, enriches them with company and contact data, scores them based on fit signals, and queues personalized outreach sequences.",
      desiredOutcome: "Qualified leads entering the pipeline daily without manual prospecting. Each lead scored, enriched, and ready for outreach.",
      bottleneck: "Manual prospecting takes 3+ hours daily. Lead quality is inconsistent. No systematic scoring.",
      expectedOutputs: "Enriched lead records, fit scores, personalized outreach drafts, daily pipeline report",
      triggers: "Daily scheduled run + new ICP match from monitoring sources",
      workflowSteps: "1. Source leads from defined channels\n2. Enrich with firmographic and contact data\n3. Score against ICP criteria\n4. Generate personalized outreach draft\n5. Queue for review or auto-send based on confidence\n6. Track engagement signals",
      approvalRules: ["Human approval before send", "Fully autonomous where safe"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["CRM", "Gmail", "Google Sheets"],
    },
  },
  {
    label: "Inbox automation",
    description: "Email triage, categorization, and response drafting",
    data: {
      workflowTitle: "Inbox triage and response system",
      automationRequest: "Build a system that triages incoming emails, categorizes by priority and type, drafts responses for common inquiries, and escalates important messages.",
      desiredOutcome: "Inbox processing time reduced by 70%. Common inquiries handled automatically. Important messages surfaced immediately.",
      bottleneck: "Manually reading and responding to 50+ emails daily. Missing important messages buried in noise.",
      expectedOutputs: "Categorized inbox, draft responses, priority alerts, daily email summary",
      triggers: "New email received in monitored inbox",
      workflowSteps: "1. Receive and parse new email\n2. Categorize by type and priority\n3. Draft response for standard inquiries\n4. Escalate urgent or complex messages\n5. Send approved responses\n6. Update tracking log",
      approvalRules: ["Human approval before send", "Fully autonomous where safe"],
      sensitivityLevel: "High",
      toolsInvolved: ["Gmail", "Slack", "Google Sheets"],
    },
  },
  {
    label: "Content engine",
    description: "Founder content creation and distribution pipeline",
    data: {
      workflowTitle: "Founder content engine",
      automationRequest: "Build a system that generates content from founder insights, adapts it across platforms, schedules publishing, and tracks performance.",
      desiredOutcome: "Consistent content output across LinkedIn, Twitter, and email without daily founder involvement. Performance tracking automated.",
      bottleneck: "Founder has ideas but no time to write, format, and publish consistently. Content is sporadic.",
      expectedOutputs: "Platform-ready posts, scheduled publishing queue, performance reports, content variants",
      triggers: "Voice memo, rough notes, or scheduled content calendar trigger",
      workflowSteps: "1. Capture founder input (voice, notes, bullets)\n2. Generate full content drafts\n3. Adapt for each platform format\n4. Queue for founder approval\n5. Publish on schedule\n6. Track engagement and surface top performers",
      approvalRules: ["Human approval before publish"],
      sensitivityLevel: "Medium",
      toolsInvolved: ["Notion", "Google Sheets", "Slack"],
    },
  },
  {
    label: "Client reporting",
    description: "Automated client-facing reports and dashboards",
    data: {
      workflowTitle: "Automated client reporting system",
      automationRequest: "Build a system that pulls data from multiple sources, generates structured client reports, and delivers them on schedule.",
      desiredOutcome: "Client reports generated and delivered weekly without manual data gathering or formatting.",
      bottleneck: "Pulling data from 4+ tools, formatting in slides, and sending to 10+ clients takes a full day each week.",
      expectedOutputs: "Formatted client reports, delivery confirmations, data anomaly alerts",
      triggers: "Weekly schedule + client data update events",
      workflowSteps: "1. Pull metrics from connected data sources\n2. Aggregate and normalize data\n3. Generate formatted report per client\n4. Flag anomalies or notable changes\n5. Deliver to client via email\n6. Log delivery and track opens",
      approvalRules: ["Human approval before external action", "Fully autonomous where safe"],
      sensitivityLevel: "High",
      toolsInvolved: ["Google Sheets", "Gmail", "CRM", "Custom API"],
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

export function getStrengthLabel(percent: number): string {
  if (percent === 100) return "Ready to submit";
  if (percent >= 80) return "Brief is strong";
  if (percent >= 50) return "Brief is taking shape";
  if (percent >= 20) return "Getting started";
  return "Start filling sections";
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const FIELD_LABELS: Record<string, string> = {
  recipientEmail: "Send this brief to",
  clientName: "Your name",
  clientEmail: "Your work email",
  company: "Company",
  role: "Your role",
  website: "Website",
  location: "Company location",
  industry: "Industry",
  companyStage: "Company stage",
  teamSize: "Team size",
  businessSummary: "What does the business do?",
  revenueBand: "Revenue band",
  mainMarket: "Main market",
  growthStage: "Current growth stage",
  automationRequest: "What do you want automated?",
  desiredOutcome: "Desired outcome",
  bottleneck: "Main bottleneck today",
  expectedOutputs: "Expected outputs",
  workflowTitle: "Workflow title",
  endUsers: "Who will use it?",
  currentManualProcess: "What happens manually today?",
  toolsInvolved: "Tools and accounts involved",
  automationTools: "Current automation tools",
  dataSources: "Data sources",
  modelsInUse: "Models in use",
  stackDetails: "Hosting and deployment stack",
  triggers: "Trigger events",
  workflowSteps: "Core steps the system should perform",
  approvalRules: "What should require approval?",
  sensitivityLevel: "Sensitivity level",
  edgeCases: "Edge cases to consider",
  failureRisks: "Failure risks",
  securityNotes: "Security or privacy notes",
  accessConstraints: "Access constraints",
  successMetric: "Success metric",
  urgency: "Deadline or urgency",
  successDefinition: "What does a successful first version look like?",
  budgetRange: "Budget range",
  communicationStyle: "Preferred communication style",
  referenceLinks: "Reference links",
  extraContext: "Extra context",
};
