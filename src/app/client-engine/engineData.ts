export type AgentId = "CORTEX" | "SPECTER" | "STRIKER" | "PULSE" | "SENTINEL";
export type Horizon = "week1" | "month1" | "quarter1";
export type Mode = "founder" | "agency";

export interface Signal {
  id: string;
  label: string;
  removable: boolean;
}

export interface OpportunityCard {
  company: string;
  signal: string;
  observation: string;
  urgency: number; // 1-10
  source: string;
  timestamp: string;
}

export interface ArchitectureStage {
  label: string;
  agent: AgentId;
  outputs: string[];
}

export interface ReplacedRole {
  role: string;
  monthlyCost: number;
  handles: string;
  coverage: "full" | "partial";
}

export interface CadenceItem {
  frequency: "overnight" | "daily" | "event-triggered" | "weekly";
  action: string;
}

export interface Metrics {
  pipelineValue: number;
  hoursReplaced: number;
  costReplaced: number;
  leadsIdentified: number;
  contentAssets: number;
  followUpsSaved: number;
}

export interface BeforeAfter {
  before: string;
  after: string;
}

export interface Engine {
  id: string;
  title: string;
  subtitle: string;
  bestFor: string;
  signalTags: string[];
  teaserStat: string;
  signals: Signal[];
  agencySignals: Signal[];
  opportunityCards: OpportunityCard[];
  agencyOpportunityCards: OpportunityCard[];
  architecture: ArchitectureStage[];
  agentsActivated: AgentId[];
  replacedRoles: ReplacedRole[];
  cadence: Record<Horizon, CadenceItem[]>;
  metrics: Record<Mode, Record<Horizon, Metrics>>;
  beforeAfter: BeforeAfter[];
  relatedEngines: string[];
  ctaLine: string;
}

export const engines: Engine[] = [
  {
    id: "hire-signal",
    title: "Hire-Signal Engine",
    subtitle: "Find companies already telling the market they need what you sell.",
    bestFor: "B2B SaaS founders selling to growth-stage teams",
    signalTags: ["Hiring SDRs", "RevOps roles", "Content hires"],
    teaserStat: "86 target accounts / week",
    signals: [
      { id: "s1", label: "B2B SaaS", removable: true },
      { id: "s2", label: "US market", removable: true },
      { id: "s3", label: "Hiring SDR", removable: true },
      { id: "s4", label: "Hiring content lead", removable: true },
      { id: "s5", label: "Series A+", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "SaaS clients", removable: true },
      { id: "a2", label: "US + EU", removable: true },
      { id: "a3", label: "Hiring ops roles", removable: true },
      { id: "a4", label: "Revenue $1-10M", removable: true },
    ],
    opportunityCards: [
      { company: "ScaleFlow", signal: "Hiring 2 SDRs in Austin", observation: "Growing team faster than pipeline can support", urgency: 9, source: "LinkedIn Jobs", timestamp: "2 hours ago" },
      { company: "DataBridge.io", signal: "RevOps manager posted", observation: "CRM overhaul underway — decision window open", urgency: 8, source: "LinkedIn Jobs", timestamp: "5 hours ago" },
      { company: "BuildStack", signal: "Content marketing lead role", observation: "Zero blog output in 6 months — content-starved", urgency: 7, source: "Indeed", timestamp: "1 day ago" },
      { company: "AutomateDE", signal: "Hiring support engineer #3", observation: "Onboarding friction driving churn, need help fast", urgency: 8, source: "Greenhouse", timestamp: "6 hours ago" },
      { company: "Meridian Labs", signal: "VP Sales search active", observation: "Revenue team restructuring — open to new tools", urgency: 9, source: "LinkedIn Jobs", timestamp: "12 hours ago" },
      { company: "NovaTech", signal: "Ops coordinator posted", observation: "Manual processes, no automation in stack yet", urgency: 6, source: "AngelList", timestamp: "1 day ago" },
    ],
    agencyOpportunityCards: [
      { company: "Client: FitTech SaaS", signal: "Hiring 3 SDRs", observation: "Perfect fit for done-for-you outbound package", urgency: 9, source: "LinkedIn Jobs", timestamp: "3 hours ago" },
      { company: "Client: LegalFlow", signal: "RevOps posting", observation: "Needs CRM automation — sell as monthly retainer", urgency: 8, source: "LinkedIn Jobs", timestamp: "7 hours ago" },
      { company: "Prospect: CloudBase", signal: "Content lead role", observation: "Sell content engine as $2K/mo retainer", urgency: 7, source: "Indeed", timestamp: "1 day ago" },
      { company: "Prospect: FinOps.co", signal: "Hiring ops manager", observation: "Automation consulting opportunity", urgency: 8, source: "Greenhouse", timestamp: "4 hours ago" },
      { company: "Client: DataStack", signal: "VP Sales search", observation: "Interim sales ops package — high ACV", urgency: 9, source: "LinkedIn", timestamp: "8 hours ago" },
      { company: "Prospect: ShipFast", signal: "Support hire #2", observation: "Onboarding optimization retainer", urgency: 6, source: "AngelList", timestamp: "2 days ago" },
    ],
    architecture: [
      { label: "Signal Detection", agent: "CORTEX", outputs: ["Job board monitoring", "Company intent scoring"] },
      { label: "Target Enrichment", agent: "SPECTER", outputs: ["Contact discovery", "Org chart mapping"] },
      { label: "Outreach Execution", agent: "STRIKER", outputs: ["Personalized sequences", "CRM pipeline creation"] },
      { label: "Content Capture", agent: "PULSE", outputs: ["Signal-based posts", "Engagement hooks"] },
    ],
    agentsActivated: ["CORTEX", "SPECTER", "STRIKER", "PULSE"],
    replacedRoles: [
      { role: "Researcher", monthlyCost: 4500, handles: "Job board monitoring & signal detection", coverage: "full" },
      { role: "SDR", monthlyCost: 5200, handles: "Cold outreach & follow-up sequences", coverage: "full" },
      { role: "Sales Ops", monthlyCost: 6000, handles: "CRM hygiene & pipeline management", coverage: "partial" },
      { role: "Copywriter", monthlyCost: 3800, handles: "Outreach copy & content angles", coverage: "full" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Scan 200+ job boards for matching signals" },
        { frequency: "daily", action: "Score and rank new accounts by urgency" },
        { frequency: "daily", action: "Draft personalized outreach for top 5 accounts" },
        { frequency: "event-triggered", action: "Alert when high-urgency signal detected" },
        { frequency: "weekly", action: "Pipeline summary + next week targets" },
      ],
      month1: [
        { frequency: "overnight", action: "Monitor 1,200+ companies across 4 job platforms" },
        { frequency: "daily", action: "Enrich 15-20 new accounts with contact data" },
        { frequency: "daily", action: "Execute outreach sequences for 40+ active threads" },
        { frequency: "event-triggered", action: "Re-prioritize on funding / leadership changes" },
        { frequency: "weekly", action: "Performance report: open rates, replies, meetings" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Deep scan across 3,000+ companies" },
        { frequency: "daily", action: "Maintain 200+ active outreach threads" },
        { frequency: "daily", action: "Content creation tied to strongest signals" },
        { frequency: "event-triggered", action: "Auto-reactivate stale deals on new signals" },
        { frequency: "weekly", action: "Compounding report: pipeline growth trajectory" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 42000, hoursReplaced: 28, costReplaced: 4800, leadsIdentified: 18, contentAssets: 4, followUpsSaved: 12 },
        month1: { pipelineValue: 186000, hoursReplaced: 120, costReplaced: 19500, leadsIdentified: 86, contentAssets: 16, followUpsSaved: 54 },
        quarter1: { pipelineValue: 640000, hoursReplaced: 380, costReplaced: 58500, leadsIdentified: 290, contentAssets: 52, followUpsSaved: 180 },
      },
      agency: {
        week1: { pipelineValue: 28000, hoursReplaced: 35, costReplaced: 5200, leadsIdentified: 12, contentAssets: 6, followUpsSaved: 18 },
        month1: { pipelineValue: 124000, hoursReplaced: 150, costReplaced: 22000, leadsIdentified: 58, contentAssets: 24, followUpsSaved: 72 },
        quarter1: { pipelineValue: 480000, hoursReplaced: 460, costReplaced: 66000, leadsIdentified: 210, contentAssets: 78, followUpsSaved: 240 },
      },
    },
    beforeAfter: [
      { before: "Manually checking job boards for signals", after: "200+ boards scanned overnight, ranked by urgency" },
      { before: "Cold outreach with no context", after: "Every email references the exact hiring signal" },
      { before: "No follow-up system", after: "Automated multi-touch sequences triggered by intent" },
      { before: "Content disconnected from pipeline", after: "Every post tied to a live signal and outreach angle" },
    ],
    relatedEngines: ["competitor-leak", "founder-content", "dead-crm"],
    ctaLine: "Deploy the Hire-Signal Engine",
  },
  {
    id: "competitor-leak",
    title: "Competitor Leak Engine",
    subtitle: "Turn competitor weakness into content, positioning, and pipeline.",
    bestFor: "Founders in crowded markets with strong opinions",
    signalTags: ["Bad reviews", "Pricing changes", "Feature gaps"],
    teaserStat: "12 attack angles / month",
    signals: [
      { id: "s1", label: "Clay.com", removable: true },
      { id: "s2", label: "Instantly.ai", removable: true },
      { id: "s3", label: "Bad G2 reviews", removable: true },
      { id: "s4", label: "Pricing increases", removable: true },
      { id: "s5", label: "Support complaints", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "Client competitor set", removable: true },
      { id: "a2", label: "Review monitoring", removable: true },
      { id: "a3", label: "Monthly report", removable: true },
      { id: "a4", label: "Content calendar", removable: true },
    ],
    opportunityCards: [
      { company: "Instantly.ai", signal: "3.8★ on G2 this quarter", observation: "Down from 4.2★ — deliverability complaints spiking", urgency: 9, source: "G2 Reviews", timestamp: "4 hours ago" },
      { company: "Clay.com", signal: "Enterprise tier now $499/mo", observation: "40% price hike — Twitter backlash growing", urgency: 10, source: "Pricing Page", timestamp: "1 day ago" },
      { company: "GoHighLevel", signal: "Onboarding NPS dropped to 32", observation: "New users report 2-week setup time", urgency: 7, source: "Trustpilot", timestamp: "2 days ago" },
      { company: "Nexus AI", signal: "Feature removal: custom workflows", observation: "Power users migrating — capture opportunity", urgency: 8, source: "Changelog", timestamp: "3 days ago" },
      { company: "Instantly.ai", signal: "Support response time: 72+ hours", observation: "Reddit threads complaining — audience primed to switch", urgency: 8, source: "Reddit", timestamp: "12 hours ago" },
      { company: "Clay.com", signal: "Free tier removed", observation: "Entry-level users looking for alternatives", urgency: 9, source: "Product Hunt", timestamp: "6 hours ago" },
    ],
    agencyOpportunityCards: [
      { company: "Client competitor: Rival CRM", signal: "4 negative reviews this week", observation: "Position client as better alternative", urgency: 9, source: "G2 Reviews", timestamp: "3 hours ago" },
      { company: "Market: Email Tools", signal: "Top 3 tools raised prices", observation: "Create comparison content for client", urgency: 8, source: "Pricing Pages", timestamp: "1 day ago" },
      { company: "Client competitor: OldTool", signal: "Feature sunset announced", observation: "Build migration campaign for client", urgency: 10, source: "Blog", timestamp: "5 hours ago" },
      { company: "Market: Analytics", signal: "Support complaints trending", observation: "Client positioning opportunity", urgency: 7, source: "Reddit", timestamp: "8 hours ago" },
      { company: "Client competitor: BudgetApp", signal: "Free tier downgrade", observation: "Capture switchers with client offer", urgency: 8, source: "Twitter", timestamp: "2 days ago" },
      { company: "Market: Automation", signal: "G2 category shift", observation: "Reposition client in new category", urgency: 6, source: "G2", timestamp: "3 days ago" },
    ],
    architecture: [
      { label: "Weakness Detection", agent: "CORTEX", outputs: ["Review scraping", "Pricing monitoring"] },
      { label: "Target Mapping", agent: "SPECTER", outputs: ["Affected audience list", "Switch-ready accounts"] },
      { label: "Content Generation", agent: "PULSE", outputs: ["Attack angle posts", "Comparison content"] },
      { label: "System Monitoring", agent: "SENTINEL", outputs: ["Competitor watchlist", "Alert triggers"] },
    ],
    agentsActivated: ["CORTEX", "SPECTER", "PULSE", "SENTINEL"],
    replacedRoles: [
      { role: "Market Researcher", monthlyCost: 5000, handles: "Competitor tracking & analysis", coverage: "full" },
      { role: "Strategist", monthlyCost: 7000, handles: "Positioning & attack angle planning", coverage: "full" },
      { role: "Outbound Rep", monthlyCost: 4800, handles: "Reaching switch-ready accounts", coverage: "full" },
      { role: "Content Strategist", monthlyCost: 5500, handles: "Turning insights into content", coverage: "partial" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Scan G2, Trustpilot, Reddit for competitor mentions" },
        { frequency: "daily", action: "Detect pricing or feature changes on 4 competitor sites" },
        { frequency: "daily", action: "Draft 2 attack-angle content pieces" },
        { frequency: "event-triggered", action: "Alert on major competitor weakness detected" },
        { frequency: "weekly", action: "Competitor intelligence brief" },
      ],
      month1: [
        { frequency: "overnight", action: "Monitor 8+ review platforms and social channels" },
        { frequency: "daily", action: "Build and update switch-ready account lists" },
        { frequency: "daily", action: "Publish positioning content tied to fresh weaknesses" },
        { frequency: "event-triggered", action: "Launch rapid-response campaign on major events" },
        { frequency: "weekly", action: "Trend report: sentiment shifts, opportunity windows" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Deep competitive intelligence across 12+ competitors" },
        { frequency: "daily", action: "Maintain attack content library (40+ pieces)" },
        { frequency: "daily", action: "Outreach to switch-ready accounts from fresh signals" },
        { frequency: "event-triggered", action: "Auto-launch campaigns on pricing / feature events" },
        { frequency: "weekly", action: "Market position report: share of voice, win rate" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 28000, hoursReplaced: 22, costReplaced: 5500, leadsIdentified: 14, contentAssets: 6, followUpsSaved: 8 },
        month1: { pipelineValue: 145000, hoursReplaced: 96, costReplaced: 22300, leadsIdentified: 62, contentAssets: 24, followUpsSaved: 38 },
        quarter1: { pipelineValue: 520000, hoursReplaced: 310, costReplaced: 66900, leadsIdentified: 210, contentAssets: 78, followUpsSaved: 140 },
      },
      agency: {
        week1: { pipelineValue: 18000, hoursReplaced: 30, costReplaced: 6200, leadsIdentified: 8, contentAssets: 8, followUpsSaved: 14 },
        month1: { pipelineValue: 96000, hoursReplaced: 130, costReplaced: 25000, leadsIdentified: 42, contentAssets: 32, followUpsSaved: 58 },
        quarter1: { pipelineValue: 380000, hoursReplaced: 400, costReplaced: 75000, leadsIdentified: 160, contentAssets: 96, followUpsSaved: 200 },
      },
    },
    beforeAfter: [
      { before: "Competitor changes go unnoticed for weeks", after: "Every pricing, review, and feature change caught in hours" },
      { before: "No system to capitalize on competitor mistakes", after: "Auto-generated attack angles with matching outreach" },
      { before: "Content calendar disconnected from market events", after: "Content tied directly to competitor weaknesses" },
      { before: "Switching prospects fall through the cracks", after: "Switch-ready accounts identified and contacted automatically" },
    ],
    relatedEngines: ["price-capture", "hire-signal", "founder-content"],
    ctaLine: "Deploy the Competitor Leak Engine",
  },
  {
    id: "dead-crm",
    title: "Dead CRM Resurrection Engine",
    subtitle: "Recover money already sitting in your business.",
    bestFor: "Founders with 6+ months of untouched pipeline",
    signalTags: ["Stale deals", "No follow-up", "Pipeline decay"],
    teaserStat: "$186K recoverable pipeline",
    signals: [
      { id: "s1", label: "Stale deals > 14 days", removable: true },
      { id: "s2", label: "No follow-up after demo", removable: true },
      { id: "s3", label: "Old warm leads", removable: true },
      { id: "s4", label: "Pipeline decay > 30 days", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "Client CRM audit", removable: true },
      { id: "a2", label: "Stale deal recovery", removable: true },
      { id: "a3", label: "Monthly reactivation", removable: true },
      { id: "a4", label: "Pipeline health report", removable: true },
    ],
    opportunityCards: [
      { company: "Meridian Labs", signal: "Demo attended, no follow-up in 9 days", observation: "Warm contact — needs one nudge to re-engage", urgency: 9, source: "CRM", timestamp: "Just now" },
      { company: "CloudBase", signal: "$24K deal stale for 22 days", observation: "Decision maker changed roles — new contact needed", urgency: 8, source: "CRM", timestamp: "1 hour ago" },
      { company: "ScaleFlow", signal: "3 email threads gone cold", observation: "Last reply was positive — dropped due to bandwidth", urgency: 7, source: "Email", timestamp: "3 hours ago" },
      { company: "DataBridge.io", signal: "Proposal sent 18 days ago, no response", observation: "Pricing was right, timing wasn't — seasonal window now open", urgency: 8, source: "CRM", timestamp: "5 hours ago" },
      { company: "BuildStack", signal: "Old warm lead, engaged 4 months ago", observation: "Recently raised Series A — budget unlocked", urgency: 9, source: "CRM + Signal", timestamp: "2 hours ago" },
      { company: "NovaTech", signal: "Trial expired 6 weeks ago", observation: "High usage during trial, payment never completed", urgency: 10, source: "CRM", timestamp: "30 min ago" },
    ],
    agencyOpportunityCards: [
      { company: "Client: AgencyPro", signal: "142 stale deals in CRM", observation: "Sell reactivation campaign — $3K project", urgency: 9, source: "Client CRM", timestamp: "Today" },
      { company: "Client: SaaSCo", signal: "$86K in untouched pipeline", observation: "Monthly recovery retainer opportunity", urgency: 10, source: "Client CRM", timestamp: "Yesterday" },
      { company: "Client: ConsultFirm", signal: "No follow-up system", observation: "Build automated nurture sequences", urgency: 8, source: "Audit", timestamp: "2 days ago" },
      { company: "Client: TechStart", signal: "200+ cold leads from events", observation: "Event lead reactivation package", urgency: 7, source: "Client CRM", timestamp: "3 days ago" },
      { company: "Prospect: MarketingCo", signal: "Admits pipeline is neglected", observation: "Pitch CRM health monitoring retainer", urgency: 8, source: "Discovery Call", timestamp: "1 day ago" },
      { company: "Client: FinServe", signal: "Quarterly deal review overdue", observation: "Sell pipeline audit as recurring service", urgency: 6, source: "Account Review", timestamp: "4 days ago" },
    ],
    architecture: [
      { label: "Pipeline Audit", agent: "CORTEX", outputs: ["Stale deal detection", "Decay scoring"] },
      { label: "Contact Refresh", agent: "SPECTER", outputs: ["Updated contacts", "Role change detection"] },
      { label: "Reactivation Motion", agent: "STRIKER", outputs: ["Follow-up sequences", "Meeting re-booking"] },
    ],
    agentsActivated: ["STRIKER", "SPECTER", "CORTEX"],
    replacedRoles: [
      { role: "Sales Manager", monthlyCost: 7500, handles: "Pipeline review & deal prioritization", coverage: "partial" },
      { role: "RevOps", monthlyCost: 6000, handles: "CRM hygiene & reporting", coverage: "full" },
      { role: "Admin / VA", monthlyCost: 2500, handles: "Data entry & contact updates", coverage: "full" },
      { role: "Follow-up Rep", monthlyCost: 4200, handles: "Outreach to cold & stale deals", coverage: "full" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Audit entire CRM for stale deals and decay" },
        { frequency: "daily", action: "Prioritize top 5 recoverable deals by value" },
        { frequency: "daily", action: "Send reactivation emails to warm contacts" },
        { frequency: "event-triggered", action: "Flag deals where contacts changed roles" },
        { frequency: "weekly", action: "Recovery pipeline report: $value surfaced" },
      ],
      month1: [
        { frequency: "overnight", action: "Continuous CRM health monitoring" },
        { frequency: "daily", action: "Execute reactivation for 20+ stale threads" },
        { frequency: "daily", action: "Update contact data for moved / promoted contacts" },
        { frequency: "event-triggered", action: "Re-engage on funding, hiring, or product signals" },
        { frequency: "weekly", action: "Win-back report: recovered deals, meetings booked" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Predictive decay scoring across all pipeline" },
        { frequency: "daily", action: "Automated nurture for 100+ active recovery threads" },
        { frequency: "daily", action: "Cross-reference CRM with fresh intent signals" },
        { frequency: "event-triggered", action: "Instant re-engagement on any deal movement" },
        { frequency: "weekly", action: "Quarterly recovery ROI: total pipeline revived" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 68000, hoursReplaced: 18, costReplaced: 5000, leadsIdentified: 24, contentAssets: 0, followUpsSaved: 22 },
        month1: { pipelineValue: 186000, hoursReplaced: 72, costReplaced: 20200, leadsIdentified: 86, contentAssets: 0, followUpsSaved: 94 },
        quarter1: { pipelineValue: 540000, hoursReplaced: 240, costReplaced: 60600, leadsIdentified: 260, contentAssets: 0, followUpsSaved: 310 },
      },
      agency: {
        week1: { pipelineValue: 45000, hoursReplaced: 24, costReplaced: 5800, leadsIdentified: 16, contentAssets: 2, followUpsSaved: 28 },
        month1: { pipelineValue: 128000, hoursReplaced: 96, costReplaced: 24000, leadsIdentified: 62, contentAssets: 8, followUpsSaved: 120 },
        quarter1: { pipelineValue: 420000, hoursReplaced: 300, costReplaced: 72000, leadsIdentified: 200, contentAssets: 24, followUpsSaved: 380 },
      },
    },
    beforeAfter: [
      { before: "Founder checks CRM manually once a month", after: "Every stale deal flagged and scored overnight" },
      { before: "No follow-up rhythm after demos", after: "Automated multi-touch reactivation within 48 hours" },
      { before: "$186K sitting untouched in pipeline", after: "Recoverable deals surfaced and worked daily" },
      { before: "Old leads forgotten permanently", after: "Warm leads re-engaged when new signals appear" },
    ],
    relatedEngines: ["hire-signal", "founder-content", "agency-client"],
    ctaLine: "Deploy the Dead CRM Engine",
  },
  {
    id: "founder-content",
    title: "Founder Content to Pipeline Engine",
    subtitle: "Turn one founder insight into content + demand capture + warm outbound.",
    bestFor: "Opinionated founders who post but don't convert",
    signalTags: ["Founder opinion", "Market trends", "Customer pain"],
    teaserStat: "16 content assets / month from 1 insight",
    signals: [
      { id: "s1", label: "Founder opinion", removable: true },
      { id: "s2", label: "Market trend", removable: true },
      { id: "s3", label: "Competitor move", removable: true },
      { id: "s4", label: "Customer pain point", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "Client thought leadership", removable: true },
      { id: "a2", label: "Industry trend", removable: true },
      { id: "a3", label: "Weekly content batch", removable: true },
      { id: "a4", label: "Lead capture funnel", removable: true },
    ],
    opportunityCards: [
      { company: "Your Post", signal: "Hot take on AI replacing SDRs", observation: "482 impressions in 2 hours — high engagement signal", urgency: 9, source: "LinkedIn", timestamp: "2 hours ago" },
      { company: "Market Trend", signal: "3 competitors raised prices this month", observation: "Perfect window for 'why we didn't' positioning content", urgency: 8, source: "Market Intel", timestamp: "Today" },
      { company: "Customer Insight", signal: "Client asked about onboarding bottleneck", observation: "Turn this into 'how we solved it' thread + email", urgency: 7, source: "Support Chat", timestamp: "Yesterday" },
      { company: "Engaged Lead", signal: "VP Marketing liked + shared your last post", observation: "Warm outreach window — reference shared content", urgency: 9, source: "LinkedIn", timestamp: "4 hours ago" },
      { company: "Trend Spike", signal: "'AI automation' searches up 340% this month", observation: "Create pillar content for organic capture", urgency: 7, source: "Google Trends", timestamp: "Today" },
      { company: "Competitor Move", signal: "Rival launched inferior feature you already have", observation: "Comparison content + outreach to their audience", urgency: 8, source: "Product Hunt", timestamp: "6 hours ago" },
    ],
    agencyOpportunityCards: [
      { company: "Client: TechCEO", signal: "Founder has strong opinions, zero output", observation: "Ghostwriting retainer — $2.5K/mo", urgency: 9, source: "Discovery", timestamp: "Today" },
      { company: "Client: SaaS Startup", signal: "Great product, no content presence", observation: "Content-to-pipeline package — $4K/mo", urgency: 8, source: "Audit", timestamp: "Yesterday" },
      { company: "Client: ConsultCo", signal: "LinkedIn has 8K followers, no strategy", observation: "Thought leadership management retainer", urgency: 7, source: "Profile Audit", timestamp: "2 days ago" },
      { company: "Prospect: FinTech", signal: "CEO posts weekly but no conversions", observation: "Add pipeline conversion layer to existing content", urgency: 8, source: "Content Audit", timestamp: "3 days ago" },
      { company: "Client: Agency", signal: "Needs client-facing content system", observation: "White-label content engine package", urgency: 6, source: "Referral", timestamp: "4 days ago" },
      { company: "Prospect: HealthTech", signal: "Regulated space, needs compliant content", observation: "Specialized content retainer — high margin", urgency: 7, source: "Inbound", timestamp: "1 day ago" },
    ],
    architecture: [
      { label: "Insight Capture", agent: "PULSE", outputs: ["Content angles", "Hook variations"] },
      { label: "Intelligence Layer", agent: "CORTEX", outputs: ["Audience matching", "Trend validation"] },
      { label: "Audience Targeting", agent: "SPECTER", outputs: ["People likely to care", "Warm outreach list"] },
      { label: "Pipeline Conversion", agent: "STRIKER", outputs: ["Content-aware outreach", "Meeting booking"] },
    ],
    agentsActivated: ["PULSE", "CORTEX", "SPECTER", "STRIKER"],
    replacedRoles: [
      { role: "Content Strategist", monthlyCost: 5500, handles: "Content calendar & angle planning", coverage: "full" },
      { role: "Ghostwriter", monthlyCost: 4000, handles: "Draft writing & editing", coverage: "full" },
      { role: "Social Manager", monthlyCost: 3500, handles: "Post scheduling & engagement", coverage: "partial" },
      { role: "Outbound Researcher", monthlyCost: 4200, handles: "Finding people who engaged with content", coverage: "full" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Analyze founder's recent posts for high-performing angles" },
        { frequency: "daily", action: "Generate 2-3 content variants from a single insight" },
        { frequency: "daily", action: "Identify people engaging with related content" },
        { frequency: "event-triggered", action: "Draft outreach when high-value profile engages" },
        { frequency: "weekly", action: "Content performance + pipeline attribution report" },
      ],
      month1: [
        { frequency: "overnight", action: "Trend scanning across industry and competitor content" },
        { frequency: "daily", action: "Publish cross-platform content from content bank" },
        { frequency: "daily", action: "Warm outreach to engaged audience members" },
        { frequency: "event-triggered", action: "Rapid content on breaking industry events" },
        { frequency: "weekly", action: "Full funnel report: impressions → leads → meetings" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Content library maintenance (90+ pieces)" },
        { frequency: "daily", action: "Compound content strategy across all platforms" },
        { frequency: "daily", action: "Pipeline nurture tied to content consumption" },
        { frequency: "event-triggered", action: "Pillar content on major market shifts" },
        { frequency: "weekly", action: "Quarterly content ROI and pipeline attribution" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 18000, hoursReplaced: 20, costReplaced: 4200, leadsIdentified: 8, contentAssets: 8, followUpsSaved: 6 },
        month1: { pipelineValue: 92000, hoursReplaced: 88, costReplaced: 17200, leadsIdentified: 34, contentAssets: 32, followUpsSaved: 28 },
        quarter1: { pipelineValue: 340000, hoursReplaced: 280, costReplaced: 51600, leadsIdentified: 120, contentAssets: 96, followUpsSaved: 94 },
      },
      agency: {
        week1: { pipelineValue: 12000, hoursReplaced: 28, costReplaced: 4800, leadsIdentified: 6, contentAssets: 12, followUpsSaved: 10 },
        month1: { pipelineValue: 68000, hoursReplaced: 120, costReplaced: 20000, leadsIdentified: 28, contentAssets: 48, followUpsSaved: 42 },
        quarter1: { pipelineValue: 260000, hoursReplaced: 380, costReplaced: 60000, leadsIdentified: 100, contentAssets: 144, followUpsSaved: 130 },
      },
    },
    beforeAfter: [
      { before: "Great insights stuck in founder's head", after: "Every insight becomes 4-8 content pieces automatically" },
      { before: "Content disconnected from pipeline", after: "Every post tracked to leads and meetings" },
      { before: "No system to reach people who engage", after: "Warm outreach triggered when decision-makers interact" },
      { before: "Posting inconsistently, no compounding", after: "Daily publishing rhythm that builds audience and pipeline" },
    ],
    relatedEngines: ["hire-signal", "competitor-leak", "agency-client"],
    ctaLine: "Deploy the Content-to-Pipeline Engine",
  },
  {
    id: "agency-client",
    title: "Agency Client Engine",
    subtitle: "Package Ultron-powered systems into offers you can sell to clients.",
    bestFor: "Agency owners and operators who sell growth services",
    signalTags: ["Client niche", "Delivery cadence", "Recurring revenue"],
    teaserStat: "3 productized offers / week",
    signals: [
      { id: "s1", label: "Real estate agencies", removable: true },
      { id: "s2", label: "Competitor monitoring", removable: true },
      { id: "s3", label: "Monthly retainer", removable: true },
      { id: "s4", label: "Weekly reporting", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "Multi-niche", removable: true },
      { id: "a2", label: "White-label", removable: true },
      { id: "a3", label: "Client onboarding", removable: true },
      { id: "a4", label: "Scalable delivery", removable: true },
    ],
    opportunityCards: [
      { company: "Offer: Outbound Engine", signal: "Done-for-you cold outreach for SaaS", observation: "$2,500/mo retainer — Ultron runs 90% of delivery", urgency: 9, source: "Service Design", timestamp: "Ready" },
      { company: "Offer: Content System", signal: "Founder thought leadership package", observation: "$1,800/mo — 16 posts, 4 threads, pipeline tracking", urgency: 8, source: "Service Design", timestamp: "Ready" },
      { company: "Offer: CRM Recovery", signal: "Pipeline reactivation for agencies", observation: "$3,000 one-time + $1,200/mo monitoring", urgency: 8, source: "Service Design", timestamp: "Ready" },
      { company: "Offer: Competitor Intel", signal: "Monthly competitive brief for founders", observation: "$900/mo retainer — 100% automated delivery", urgency: 7, source: "Service Design", timestamp: "Ready" },
      { company: "Client: RealEstateCo", signal: "Needs listing content + lead gen", observation: "Custom package: $1,500/mo listing-to-lead engine", urgency: 8, source: "Client Request", timestamp: "Pending" },
      { company: "Client: ConsultFirm", signal: "Wants thought leadership + booking", observation: "Bundle content + outreach: $3,200/mo", urgency: 9, source: "Client Request", timestamp: "Pending" },
    ],
    agencyOpportunityCards: [
      { company: "Meta-offer: Agency Kit", signal: "Sell the engine-building process itself", observation: "$5,000 setup + $2,000/mo management per client", urgency: 10, source: "Internal", timestamp: "Design phase" },
      { company: "White-label: SaaS Niche", signal: "Productize for vertical SaaS agencies", observation: "Repeatable package, minimal customization needed", urgency: 9, source: "Market Research", timestamp: "Ready" },
      { company: "Scale: Multi-client", signal: "Same engine, 5 clients simultaneously", observation: "80% shared templates, 20% customization", urgency: 8, source: "Operations", timestamp: "In progress" },
      { company: "Upsell: Quarterly Review", signal: "Add strategic review to automation retainer", observation: "$1,500 add-on per client per quarter", urgency: 7, source: "Account Mgmt", timestamp: "Ready" },
      { company: "New vertical: E-commerce", signal: "E-com brands need review monitoring", observation: "New niche package: $1,200/mo", urgency: 7, source: "Market Gap", timestamp: "Design phase" },
      { company: "Partner: Other Agencies", signal: "Sell Ultron engine to other agencies", observation: "Referral model: 20% recurring commission", urgency: 6, source: "Partnership", timestamp: "Exploring" },
    ],
    architecture: [
      { label: "Client Intelligence", agent: "CORTEX", outputs: ["Niche research", "Opportunity sizing"] },
      { label: "Prospect Research", agent: "SPECTER", outputs: ["Client lead lists", "Decision maker mapping"] },
      { label: "Delivery Engine", agent: "STRIKER", outputs: ["Automated fulfillment", "Client CRM management"] },
      { label: "Content Production", agent: "PULSE", outputs: ["Client content", "Reporting assets"] },
      { label: "Quality Assurance", agent: "SENTINEL", outputs: ["Delivery monitoring", "Client health scoring"] },
    ],
    agentsActivated: ["CORTEX", "SPECTER", "STRIKER", "PULSE", "SENTINEL"],
    replacedRoles: [
      { role: "Ops Setup", monthlyCost: 4000, handles: "Client onboarding & system configuration", coverage: "full" },
      { role: "Strategist", monthlyCost: 6500, handles: "Offer design & niche strategy", coverage: "partial" },
      { role: "Analyst", monthlyCost: 4500, handles: "Reporting & performance tracking", coverage: "full" },
      { role: "Account Manager", monthlyCost: 5000, handles: "Client communication & updates", coverage: "partial" },
      { role: "Coordinator", monthlyCost: 3200, handles: "Task management & delivery scheduling", coverage: "full" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Audit client niche and build initial offer structure" },
        { frequency: "daily", action: "Set up 2-3 client-facing systems with Ultron agents" },
        { frequency: "daily", action: "Generate first batch of client deliverables" },
        { frequency: "event-triggered", action: "Alert when client engagement drops" },
        { frequency: "weekly", action: "Client onboarding progress report" },
      ],
      month1: [
        { frequency: "overnight", action: "Run all client engines simultaneously" },
        { frequency: "daily", action: "Deliver automated outputs to 5-10 client accounts" },
        { frequency: "daily", action: "Update client dashboards with fresh metrics" },
        { frequency: "event-triggered", action: "Escalate underperforming campaigns" },
        { frequency: "weekly", action: "Client-by-client performance review" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Scale to 15+ automated client accounts" },
        { frequency: "daily", action: "Full delivery automation with quality checks" },
        { frequency: "daily", action: "New client onboarding in <24 hours" },
        { frequency: "event-triggered", action: "Upsell triggers based on client results" },
        { frequency: "weekly", action: "Revenue report: MRR growth, churn, expansion" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 15000, hoursReplaced: 32, costReplaced: 5800, leadsIdentified: 6, contentAssets: 4, followUpsSaved: 8 },
        month1: { pipelineValue: 72000, hoursReplaced: 140, costReplaced: 23200, leadsIdentified: 24, contentAssets: 16, followUpsSaved: 36 },
        quarter1: { pipelineValue: 280000, hoursReplaced: 440, costReplaced: 69600, leadsIdentified: 80, contentAssets: 48, followUpsSaved: 120 },
      },
      agency: {
        week1: { pipelineValue: 22000, hoursReplaced: 40, costReplaced: 7200, leadsIdentified: 8, contentAssets: 6, followUpsSaved: 14 },
        month1: { pipelineValue: 110000, hoursReplaced: 180, costReplaced: 29000, leadsIdentified: 36, contentAssets: 28, followUpsSaved: 56 },
        quarter1: { pipelineValue: 420000, hoursReplaced: 560, costReplaced: 87000, leadsIdentified: 120, contentAssets: 84, followUpsSaved: 180 },
      },
    },
    beforeAfter: [
      { before: "Custom scope for every client, every time", after: "Productized offers deployed in hours, not weeks" },
      { before: "Hiring VAs and coordinators to fulfill", after: "Ultron agents handle 90% of delivery" },
      { before: "Reporting takes 4+ hours per client", after: "Automated client dashboards updated daily" },
      { before: "Scaling means hiring more people", after: "Scaling means adding more engines, not headcount" },
    ],
    relatedEngines: ["founder-content", "hire-signal", "competitor-leak"],
    ctaLine: "Deploy the Agency Client Engine",
  },
  {
    id: "price-capture",
    title: "Price-Increase Capture Engine",
    subtitle: "When competitors raise prices, Ultron turns it into 30 days of acquisition.",
    bestFor: "Founders in markets where competitors keep raising prices",
    signalTags: ["Price hikes", "Free tier cuts", "Feature removals"],
    teaserStat: "30-day capture campaign on autopilot",
    signals: [
      { id: "s1", label: "Price increases", removable: true },
      { id: "s2", label: "Free tier downgrades", removable: true },
      { id: "s3", label: "Feature removals", removable: true },
      { id: "s4", label: "Packaging changes", removable: true },
    ],
    agencySignals: [
      { id: "a1", label: "Client competitor pricing", removable: true },
      { id: "a2", label: "Market monitoring", removable: true },
      { id: "a3", label: "Rapid campaign launch", removable: true },
      { id: "a4", label: "Switch content series", removable: true },
    ],
    opportunityCards: [
      { company: "Clay.com", signal: "Enterprise tier: $299 → $499/mo", observation: "200+ complaints on Twitter in 24 hours", urgency: 10, source: "Pricing Monitor", timestamp: "6 hours ago" },
      { company: "Instantly.ai", signal: "Free tier removed entirely", observation: "Entry-level users actively seeking alternatives", urgency: 9, source: "Product Update", timestamp: "1 day ago" },
      { company: "GoHighLevel", signal: "API access now paid add-on", observation: "Developer community frustrated — migration window", urgency: 8, source: "Changelog", timestamp: "2 days ago" },
      { company: "Nexus AI", signal: "Custom workflows removed from Pro plan", observation: "Power users downgraded — reachable on LinkedIn", urgency: 8, source: "Forum Posts", timestamp: "3 days ago" },
      { company: "Rival Tool", signal: "Support now $99/mo add-on", observation: "G2 reviews dropping fast — prime capture moment", urgency: 7, source: "Pricing Page", timestamp: "5 days ago" },
      { company: "CompetitorX", signal: "Annual-only billing enforced", observation: "Monthly users forced to commit or leave", urgency: 8, source: "Email Leak", timestamp: "1 day ago" },
    ],
    agencyOpportunityCards: [
      { company: "Client's Market", signal: "Top 2 competitors raised prices", observation: "Launch comparison campaign for client — $3K project", urgency: 10, source: "Market Monitor", timestamp: "Today" },
      { company: "Client: SaaS Tool", signal: "Rival removed free tier", observation: "Build switch landing page + outreach", urgency: 9, source: "Competitor Watch", timestamp: "Yesterday" },
      { company: "Vertical: Marketing", signal: "Category-wide price increases", observation: "Multi-client campaign opportunity", urgency: 8, source: "Industry News", timestamp: "2 days ago" },
      { company: "Client: Dev Tool", signal: "Competitor deprecated key API", observation: "Migration guide content + outreach campaign", urgency: 8, source: "Changelog", timestamp: "3 days ago" },
      { company: "Client: E-com", signal: "Platform fee increase 15%", observation: "Switch campaign for affected merchants", urgency: 7, source: "Announcement", timestamp: "4 days ago" },
      { company: "New Client Pitch", signal: "Competitor chaos in their market", observation: "Pitch price-capture service as retainer", urgency: 6, source: "Market Scan", timestamp: "5 days ago" },
    ],
    architecture: [
      { label: "Price Monitoring", agent: "CORTEX", outputs: ["Pricing change detection", "Impact assessment"] },
      { label: "Audience Mapping", agent: "SPECTER", outputs: ["Affected user lists", "Switch-ready segments"] },
      { label: "Campaign Creation", agent: "PULSE", outputs: ["Comparison content", "Switch rebuttals"] },
      { label: "System Monitoring", agent: "SENTINEL", outputs: ["30-day campaign tracking", "Conversion monitoring"] },
    ],
    agentsActivated: ["CORTEX", "SPECTER", "PULSE", "SENTINEL"],
    replacedRoles: [
      { role: "Competitive Strategist", monthlyCost: 6500, handles: "Market monitoring & response planning", coverage: "full" },
      { role: "SDR", monthlyCost: 5200, handles: "Outreach to switch-ready prospects", coverage: "full" },
      { role: "Copywriter", monthlyCost: 3800, handles: "Comparison content & campaign copy", coverage: "full" },
      { role: "Marketer", monthlyCost: 5000, handles: "Campaign execution & tracking", coverage: "partial" },
    ],
    cadence: {
      week1: [
        { frequency: "overnight", action: "Monitor competitor pricing pages, changelogs, and forums" },
        { frequency: "daily", action: "Score and prioritize detected pricing events" },
        { frequency: "daily", action: "Draft comparison content for top events" },
        { frequency: "event-triggered", action: "Launch rapid campaign within 4 hours of detection" },
        { frequency: "weekly", action: "Price-event brief: what happened, what we did" },
      ],
      month1: [
        { frequency: "overnight", action: "Deep scan across 12+ competitor pricing surfaces" },
        { frequency: "daily", action: "Execute active switch campaigns (3-5 running)" },
        { frequency: "daily", action: "Build rebuttal library from competitor complaints" },
        { frequency: "event-triggered", action: "Auto-scale campaign when event goes viral" },
        { frequency: "weekly", action: "Capture report: leads acquired, pipeline from switches" },
      ],
      quarter1: [
        { frequency: "overnight", action: "Predictive pricing trend analysis across market" },
        { frequency: "daily", action: "Maintain evergreen switch content library" },
        { frequency: "daily", action: "Nurture captured leads through conversion funnel" },
        { frequency: "event-triggered", action: "Coordinate multi-channel response on major events" },
        { frequency: "weekly", action: "Quarterly capture ROI: total revenue from competitor events" },
      ],
    },
    metrics: {
      founder: {
        week1: { pipelineValue: 35000, hoursReplaced: 24, costReplaced: 5100, leadsIdentified: 22, contentAssets: 6, followUpsSaved: 14 },
        month1: { pipelineValue: 168000, hoursReplaced: 104, costReplaced: 20500, leadsIdentified: 94, contentAssets: 22, followUpsSaved: 62 },
        quarter1: { pipelineValue: 580000, hoursReplaced: 330, costReplaced: 61500, leadsIdentified: 310, contentAssets: 68, followUpsSaved: 200 },
      },
      agency: {
        week1: { pipelineValue: 24000, hoursReplaced: 30, costReplaced: 5800, leadsIdentified: 14, contentAssets: 8, followUpsSaved: 18 },
        month1: { pipelineValue: 112000, hoursReplaced: 130, costReplaced: 24000, leadsIdentified: 64, contentAssets: 32, followUpsSaved: 78 },
        quarter1: { pipelineValue: 440000, hoursReplaced: 400, costReplaced: 72000, leadsIdentified: 220, contentAssets: 96, followUpsSaved: 250 },
      },
    },
    beforeAfter: [
      { before: "Competitor raises prices, you don't notice for weeks", after: "Price changes detected in hours, campaigns launched same day" },
      { before: "No system to capture switching users", after: "Switch-ready audiences identified and contacted automatically" },
      { before: "Comparison content is outdated", after: "Evergreen comparison library updated on every change" },
      { before: "Competitor events are just news, not pipeline", after: "Every competitor event becomes 30 days of acquisition motion" },
    ],
    relatedEngines: ["competitor-leak", "hire-signal", "dead-crm"],
    ctaLine: "Deploy the Price-Capture Engine",
  },
];

export const agentMeta: Record<AgentId, { name: string; color: string }> = {
  CORTEX: { name: "Cortex", color: "#DA4E24" },
  SPECTER: { name: "Specter", color: "#DA4E24" },
  STRIKER: { name: "Striker", color: "#DA4E24" },
  PULSE: { name: "Pulse", color: "#DA4E24" },
  SENTINEL: { name: "Sentinel", color: "#DA4E24" },
};

export function getEngine(id: string): Engine | undefined {
  return engines.find((e) => e.id === id);
}
