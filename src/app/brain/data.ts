export type AgentId = "cortex" | "specter" | "striker" | "pulse" | "sentinel";

export interface AgentActivation {
  id: AgentId;
  label: string;
  role: string;
  active: boolean;
}

export interface AttentionCard {
  signal: string;
  observation: string;
  source: string;
  urgency: number; // 1-10
  state: "auto-handle" | "monitor" | "escalate";
}

export interface DecisionCard {
  title: string;
  why: string;
  recommendation: string;
  ifApproved: string;
}

export interface CommandMetrics {
  hoursNotSpent: number;
  tasksAbsorbed: number;
  signalsUnderWatch: number;
  pipelineRiskRecovered: number;
  decisionsSimplified: number;
  followUpsQueued: number;
}

export interface CommandData {
  id: string;
  input: string;
  interpretation: string[];
  attentionCards: AttentionCard[];
  handledAutomatically: string[];
  watchItems: string[];
  founderDecisions: DecisionCard[];
  agents: AgentActivation[];
  metrics: CommandMetrics;
}

const AGENTS_BASE: AgentActivation[] = [
  { id: "cortex", label: "Cortex", role: "", active: false },
  { id: "specter", label: "Specter", role: "", active: false },
  { id: "striker", label: "Striker", role: "", active: false },
  { id: "pulse", label: "Pulse", role: "", active: false },
  { id: "sentinel", label: "Sentinel", role: "", active: false },
];

function makeAgents(
  activations: Partial<Record<AgentId, string>>
): AgentActivation[] {
  return AGENTS_BASE.map((a) => ({
    ...a,
    active: a.id in activations,
    role: activations[a.id] || "",
  }));
}

export const COMMANDS: CommandData[] = [
  {
    id: "attention",
    input: "What deserves my attention right now?",
    interpretation: [
      "2 high-leverage sales risks identified",
      "1 competitor move worth counter-positioning",
      "1 task handled automatically",
      "1 founder decision required",
    ],
    attentionCards: [
      {
        signal: "Pipeline Risk",
        observation:
          "Warm lead reopened your pricing page twice in 24 hours without converting",
        source: "Striker pipeline tracking",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Competitor Move",
        observation:
          "Competitor removed free tier from website — pricing shift detected",
        source: "Sentinel competitive watch",
        urgency: 7,
        state: "escalate",
      },
      {
        signal: "Stale Pipeline",
        observation: "7 stale opportunities crossed risk threshold this week",
        source: "Striker deal scoring",
        urgency: 6,
        state: "auto-handle",
      },
      {
        signal: "Content Signal",
        observation:
          "LinkedIn post angle outperformed baseline engagement by 38%",
        source: "Pulse content analytics",
        urgency: 5,
        state: "monitor",
      },
      {
        signal: "Messaging Drift",
        observation:
          "Product messaging mismatch detected across homepage and outbound copy",
        source: "Pulse positioning audit",
        urgency: 4,
        state: "auto-handle",
      },
    ],
    handledAutomatically: [
      "Rescore 24 leads based on latest engagement signals",
      "Queue follow-up sequence for stale pipeline entries",
      "Flag CTA mismatch between homepage and outbound emails",
      "Adapt winning hook into 3 content variants",
    ],
    watchItems: [
      "Competitor pricing changes — monitoring for further shifts",
      "Repeat support complaint category forming around onboarding",
      "Rising churn signal cluster in Q1 cohort",
    ],
    founderDecisions: [
      {
        title: "Approve counter-positioning against competitor price increase",
        why: "Competitor removed free tier. Your free-to-paid funnel is now a differentiator worth amplifying.",
        recommendation:
          'Push "still free to start" angle across outbound and landing pages',
        ifApproved:
          "Pulse updates all positioning. Striker adjusts outbound pitch within 2 hours.",
      },
      {
        title: "Choose outbound focus: founders or operators",
        why: "Founder-targeted outreach converts 2.3x better but operator leads close faster.",
        recommendation:
          "Split 70/30 toward founders with operator-specific follow-up track",
        ifApproved:
          "Specter rebuilds targeting lists. Striker sequences update overnight.",
      },
    ],
    agents: makeAgents({
      cortex: "Mapping the source of each signal",
      specter: "Identifying accounts affected by competitor shift",
      striker: "Queuing pipeline recovery actions",
      pulse: "Adapting positioning based on content performance",
      sentinel: "Monitoring follow-on risk from pricing changes",
    }),
    metrics: {
      hoursNotSpent: 6.5,
      tasksAbsorbed: 11,
      signalsUnderWatch: 3,
      pipelineRiskRecovered: 7,
      decisionsSimplified: 2,
      followUpsQueued: 9,
    },
  },
  {
    id: "money-leaking",
    input: "Where is money leaking in this business?",
    interpretation: [
      "3 revenue leak sources identified",
      "2 cost inefficiencies flagged",
      "1 pricing opportunity surfaced",
      "2 tasks handled automatically",
    ],
    attentionCards: [
      {
        signal: "Churn Pattern",
        observation:
          "14% of month-2 users downgrade before hitting activation milestone",
        source: "Cortex retention analysis",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Wasted Spend",
        observation:
          "Paid campaigns driving 40% of leads that never open first email",
        source: "Specter acquisition audit",
        urgency: 8,
        state: "escalate",
      },
      {
        signal: "Pricing Gap",
        observation:
          "Enterprise-adjacent accounts using basic tier — 3x revenue left on table",
        source: "Striker account scoring",
        urgency: 7,
        state: "monitor",
      },
      {
        signal: "Support Drain",
        observation:
          "Same 4 onboarding questions drive 62% of support tickets",
        source: "Sentinel support clustering",
        urgency: 5,
        state: "auto-handle",
      },
    ],
    handledAutomatically: [
      "Generate onboarding FAQ responses to reduce ticket volume",
      "Pause low-performing ad variants below engagement threshold",
      "Flag enterprise-adjacent accounts for tier upgrade outreach",
    ],
    watchItems: [
      "Month-2 churn pattern — tracking if activation milestone change reduces drop-off",
      "Ad spend efficiency — monitoring post-pause campaign recovery",
    ],
    founderDecisions: [
      {
        title: "Approve activation milestone change for month-2 retention",
        why: "Users who hit value within 5 days retain 3.1x better. Current onboarding delays this.",
        recommendation:
          "Shorten onboarding to 3 steps, push first-value moment to day 2",
        ifApproved:
          "Pulse rebuilds onboarding sequence. Cortex tracks retention delta within 14 days.",
      },
      {
        title: "Confirm enterprise tier pricing test",
        why: "8 accounts are clearly enterprise-scale on basic pricing. Revenue gap is $14K/mo.",
        recommendation:
          "Introduce usage-based pricing trigger for accounts above threshold",
        ifApproved:
          "Striker segments affected accounts. Outreach begins within 48 hours.",
      },
    ],
    agents: makeAgents({
      cortex: "Analyzing retention and churn patterns",
      specter: "Auditing acquisition channel efficiency",
      striker: "Scoring accounts for upgrade eligibility",
      sentinel: "Clustering support tickets by root cause",
    }),
    metrics: {
      hoursNotSpent: 8,
      tasksAbsorbed: 9,
      signalsUnderWatch: 2,
      pipelineRiskRecovered: 3,
      decisionsSimplified: 2,
      followUpsQueued: 6,
    },
  },
  {
    id: "stop-manual",
    input: "What should I stop doing manually?",
    interpretation: [
      "4 manual tasks identified for automation",
      "2 recurring decisions worth delegating",
      "1 workflow already partially automated",
      "Estimated 12 hours/week recoverable",
    ],
    attentionCards: [
      {
        signal: "Manual Outreach",
        observation:
          "Founder personally writing follow-ups for 60% of warm leads",
        source: "Striker activity log",
        urgency: 9,
        state: "auto-handle",
      },
      {
        signal: "Content Review",
        observation:
          "Every LinkedIn post goes through manual approval — 45 min/day average",
        source: "Pulse workflow audit",
        urgency: 8,
        state: "auto-handle",
      },
      {
        signal: "Lead Scoring",
        observation:
          "Manual lead qualification taking 3 hours/week with no scoring model",
        source: "Cortex process analysis",
        urgency: 7,
        state: "auto-handle",
      },
      {
        signal: "Competitor Checks",
        observation:
          "Founder manually checking competitor sites weekly — 2 hours per session",
        source: "Sentinel usage pattern",
        urgency: 6,
        state: "auto-handle",
      },
      {
        signal: "Reporting",
        observation:
          "Weekly pipeline report built manually in spreadsheet — could be automated",
        source: "Cortex workflow mapping",
        urgency: 5,
        state: "monitor",
      },
    ],
    handledAutomatically: [
      "Deploy follow-up sequences for warm leads with personalization",
      "Set up content approval rules — auto-publish within brand guidelines",
      "Activate lead scoring model based on engagement + firmographic data",
      "Switch competitor monitoring to automated Sentinel alerts",
    ],
    watchItems: [
      "Content quality after auto-publish — monitoring engagement deltas",
      "Lead scoring accuracy — comparing against manual qualification outcomes",
      "Weekly report automation — testing template accuracy",
    ],
    founderDecisions: [
      {
        title: "Approve auto-publish rules for LinkedIn content",
        why: "45 min/day spent approving posts that match brand guidelines 94% of the time.",
        recommendation:
          "Auto-publish posts scoring above brand threshold. Flag only outliers.",
        ifApproved:
          "Pulse begins auto-publishing within guidelines. Founder reviews only flagged posts.",
      },
      {
        title: "Confirm lead scoring thresholds for auto-qualification",
        why: "Manual qualification matches scoring model predictions 87% of the time.",
        recommendation:
          "Auto-qualify leads scoring 70+. Route edge cases (50-69) for quick review.",
        ifApproved:
          "Striker auto-routes qualified leads. Founder reviews only edge cases.",
      },
    ],
    agents: makeAgents({
      cortex: "Mapping all manual processes and time costs",
      striker: "Deploying follow-up automation for warm leads",
      pulse: "Setting up content auto-publish rules",
      sentinel: "Activating automated competitor monitoring",
    }),
    metrics: {
      hoursNotSpent: 12,
      tasksAbsorbed: 14,
      signalsUnderWatch: 3,
      pipelineRiskRecovered: 0,
      decisionsSimplified: 4,
      followUpsQueued: 8,
    },
  },
  {
    id: "attack-week",
    input: "What should I attack this week?",
    interpretation: [
      "2 high-leverage opportunities identified",
      "1 competitive window open now",
      "3 tasks queued for execution",
      "1 strategic decision pending",
    ],
    attentionCards: [
      {
        signal: "Competitive Window",
        observation:
          "Competitor paused ad spend — their branded search impressions dropped 60%",
        source: "Sentinel competitive intel",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Hot Pipeline",
        observation:
          "3 demo-qualified leads haven't received proposals — window closing Friday",
        source: "Striker deal tracking",
        urgency: 9,
        state: "auto-handle",
      },
      {
        signal: "Content Momentum",
        observation:
          "Last 3 posts hit 2x avg engagement — audience receptive to current angle",
        source: "Pulse performance tracking",
        urgency: 7,
        state: "auto-handle",
      },
      {
        signal: "Segment Signal",
        observation:
          "Agency segment showing 40% higher trial-to-paid than SaaS segment",
        source: "Cortex segment analysis",
        urgency: 6,
        state: "monitor",
      },
    ],
    handledAutomatically: [
      "Generate and send proposals to 3 demo-qualified leads",
      "Double content output this week to ride engagement momentum",
      "Increase branded search spend to capture competitor gap",
    ],
    watchItems: [
      "Competitor ad spend recovery — will adjust strategy if they return",
      "Agency segment trial-to-paid — confirming trend before shifting focus",
    ],
    founderDecisions: [
      {
        title: "Approve aggressive push into competitor branded search gap",
        why: "Competitor paused ads. Their branded keywords are 60% cheaper this week.",
        recommendation:
          "Allocate 2x budget to competitor branded terms for 7 days",
        ifApproved:
          "Specter adjusts targeting. Striker tracks inbound from competitor keywords.",
      },
      {
        title: "Confirm content doubling strategy for this week",
        why: "Engagement is 2x above baseline. Audience is warm. Momentum is perishable.",
        recommendation:
          "Publish daily instead of 3x/week. Use top-performing angles as templates.",
        ifApproved:
          "Pulse generates 4 additional posts. Auto-publishes within brand rules.",
      },
    ],
    agents: makeAgents({
      cortex: "Analyzing segment performance and trends",
      specter: "Adjusting targeting for competitive gap",
      striker: "Generating proposals and tracking deal windows",
      pulse: "Doubling content output on momentum",
      sentinel: "Monitoring competitor ad spend recovery",
    }),
    metrics: {
      hoursNotSpent: 5,
      tasksAbsorbed: 8,
      signalsUnderWatch: 2,
      pipelineRiskRecovered: 3,
      decisionsSimplified: 2,
      followUpsQueued: 7,
    },
  },
  {
    id: "competitor-movement",
    input: "Which competitor movement matters most?",
    interpretation: [
      "3 competitor movements tracked",
      "1 requires immediate response",
      "1 positioning opportunity surfaced",
      "2 being monitored passively",
    ],
    attentionCards: [
      {
        signal: "Pricing Shift",
        observation:
          "Main competitor raised prices 30% and removed monthly billing option",
        source: "Sentinel pricing tracker",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Feature Launch",
        observation:
          "Competitor 2 launched AI-powered feature similar to your roadmap item",
        source: "Sentinel product watch",
        urgency: 7,
        state: "monitor",
      },
      {
        signal: "Team Change",
        observation:
          "Competitor VP of Sales left — their enterprise pipeline likely disrupted",
        source: "Specter org tracking",
        urgency: 6,
        state: "auto-handle",
      },
      {
        signal: "Content Strategy",
        observation:
          "Competitor shifted messaging from 'automation' to 'AI agents' — matching your positioning",
        source: "Pulse competitive content",
        urgency: 5,
        state: "monitor",
      },
    ],
    handledAutomatically: [
      "Target competitor enterprise accounts affected by VP departure",
      "Update competitive battle cards with new pricing data",
      "Adjust SEO content to differentiate from competitor messaging shift",
    ],
    watchItems: [
      "Competitor 2 AI feature adoption — tracking user reviews for gaps",
      "Competitor messaging convergence — monitoring for positioning overlap",
    ],
    founderDecisions: [
      {
        title: "Approve counter-campaign against competitor price increase",
        why: "Their 30% price hike makes your pricing a clear advantage. Window is 2-3 weeks.",
        recommendation:
          'Launch "switch and save" campaign targeting their customer base',
        ifApproved:
          "Specter builds targeting list. Striker deploys outreach. Pulse creates landing page.",
      },
      {
        title: "Decide response to competitor AI feature launch",
        why: "They launched first but reviews show gaps in accuracy. Your version could leapfrog.",
        recommendation:
          "Accelerate your feature launch by 2 weeks. Position on accuracy, not speed.",
        ifApproved:
          "Cortex compiles competitive gap analysis. Pulse prepares launch positioning.",
      },
    ],
    agents: makeAgents({
      cortex: "Compiling competitive gap analysis",
      specter: "Building targeting lists for competitor customers",
      striker: "Deploying outreach to disrupted competitor accounts",
      pulse: "Adjusting positioning against competitor messaging",
      sentinel: "Tracking all competitor movements in real-time",
    }),
    metrics: {
      hoursNotSpent: 4,
      tasksAbsorbed: 7,
      signalsUnderWatch: 4,
      pipelineRiskRecovered: 0,
      decisionsSimplified: 2,
      followUpsQueued: 5,
    },
  },
  {
    id: "next-deals",
    input: "Show me where the next 3 deals come from.",
    interpretation: [
      "3 highest-probability deals identified",
      "2 need founder action to close",
      "1 closing autonomously",
      "Pipeline confidence: high",
    ],
    attentionCards: [
      {
        signal: "Hot Lead",
        observation:
          "Agency founder viewed pricing 4x, opened last 3 emails, visited case studies",
        source: "Striker engagement scoring",
        urgency: 10,
        state: "escalate",
      },
      {
        signal: "Warm Referral",
        observation:
          "Existing customer referred SaaS founder — intro email opened within 6 minutes",
        source: "Specter referral tracking",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Reactivated Lead",
        observation:
          "Churned user returned after competitor price hike — requested demo",
        source: "Striker reactivation engine",
        urgency: 8,
        state: "auto-handle",
      },
      {
        signal: "Content Lead",
        observation:
          "Founder DMed after viral post — fits ICP, company stage matches",
        source: "Pulse inbound tracking",
        urgency: 7,
        state: "auto-handle",
      },
    ],
    handledAutomatically: [
      "Send personalized demo follow-up to reactivated lead",
      "Queue proposal template for referral lead after founder intro",
      "Score and route DM lead into pipeline with ICP match data",
    ],
    watchItems: [
      "Agency founder decision timeline — expected this week",
      "Referral conversion — tracking engagement after intro",
    ],
    founderDecisions: [
      {
        title: "Record personal Loom for agency founder lead",
        why: "Highest-intent lead this month. 4 pricing views + 3 emails opened. Personal touch closes this.",
        recommendation:
          "5-min Loom addressing their agency scaling pain. Send by Wednesday.",
        ifApproved:
          "Striker holds automated follow-up. Schedules send window for Thursday AM.",
      },
      {
        title: "Confirm referral intro message and offer",
        why: "Warm referral from a happy customer. Speed matters — they opened the intro in 6 minutes.",
        recommendation:
          "Send personal note within 24 hours. Offer extended trial as referral perk.",
        ifApproved:
          "Striker sends founder-authored intro. Tracks engagement and queues follow-up.",
      },
    ],
    agents: makeAgents({
      cortex: "Scoring deal probability across pipeline",
      specter: "Tracking referral and reactivation signals",
      striker: "Managing proposal and follow-up sequences",
      pulse: "Routing inbound content-driven leads",
    }),
    metrics: {
      hoursNotSpent: 3,
      tasksAbsorbed: 6,
      signalsUnderWatch: 2,
      pipelineRiskRecovered: 1,
      decisionsSimplified: 2,
      followUpsQueued: 4,
    },
  },
  {
    id: "slowing-growth",
    input: "What is slowing growth right now?",
    interpretation: [
      "2 growth blockers identified",
      "1 conversion bottleneck active",
      "1 channel underperforming",
      "3 fixes already in motion",
    ],
    attentionCards: [
      {
        signal: "Conversion Drop",
        observation:
          "Trial-to-paid conversion dropped 18% this month — onboarding friction is the cause",
        source: "Cortex funnel analysis",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Channel Fatigue",
        observation:
          "Cold outbound reply rates fell 40% — messaging needs refresh",
        source: "Striker outbound analytics",
        urgency: 8,
        state: "auto-handle",
      },
      {
        signal: "Activation Gap",
        observation:
          "52% of signups never complete setup wizard — drop-off at step 3",
        source: "Cortex activation tracking",
        urgency: 8,
        state: "escalate",
      },
      {
        signal: "SEO Plateau",
        observation:
          "Organic traffic flat for 6 weeks — no new ranking pages this quarter",
        source: "Pulse SEO monitoring",
        urgency: 5,
        state: "auto-handle",
      },
    ],
    handledAutomatically: [
      "A/B test 3 new outbound messaging variants this week",
      "Generate 5 SEO-targeted articles for underserved keywords",
      "Deploy step-3 tooltip and progress indicator to reduce drop-off",
    ],
    watchItems: [
      "Outbound reply rate recovery — tracking new variant performance",
      "SEO article indexing — monitoring ranking movement over 2 weeks",
      "Setup wizard completion rate — tracking tooltip impact",
    ],
    founderDecisions: [
      {
        title: "Approve onboarding redesign to fix conversion drop",
        why: "18% conversion decline traced to setup wizard step 3. 52% of users abandon there.",
        recommendation:
          "Simplify step 3 to one action. Move advanced config to post-activation.",
        ifApproved:
          "Cortex tracks conversion recovery. Pulse updates onboarding messaging.",
      },
      {
        title: "Decide whether to pause or pivot cold outbound",
        why: "Reply rates fell 40%. Current messaging has been running for 8 weeks without refresh.",
        recommendation:
          "Refresh messaging, don't pause. Outbound still generates 35% of pipeline.",
        ifApproved:
          "Striker deploys new variants. Specter adjusts targeting to higher-intent segments.",
      },
    ],
    agents: makeAgents({
      cortex: "Analyzing funnel bottlenecks and activation gaps",
      specter: "Adjusting targeting for outbound refresh",
      striker: "Testing new outbound messaging variants",
      pulse: "Generating SEO content and updating onboarding copy",
      sentinel: "Monitoring conversion and channel recovery metrics",
    }),
    metrics: {
      hoursNotSpent: 7,
      tasksAbsorbed: 10,
      signalsUnderWatch: 3,
      pipelineRiskRecovered: 0,
      decisionsSimplified: 2,
      followUpsQueued: 8,
    },
  },
  {
    id: "decisions-needed",
    input: "Where do I need to make a decision?",
    interpretation: [
      "4 pending decisions surfaced",
      "2 are time-sensitive this week",
      "1 has been deferred twice",
      "All include Ultron recommendations",
    ],
    attentionCards: [
      {
        signal: "Deferred Decision",
        observation:
          "Pricing test has been postponed twice — each week of delay costs ~$3K in unrealized revenue",
        source: "Cortex decision tracking",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Time-Sensitive",
        observation:
          "Partnership offer expires Friday — requires yes/no on co-marketing terms",
        source: "Specter partnership pipeline",
        urgency: 9,
        state: "escalate",
      },
      {
        signal: "Strategic Choice",
        observation:
          "Two ICP segments performing equally — resources split across both reducing impact",
        source: "Cortex segment analysis",
        urgency: 7,
        state: "escalate",
      },
      {
        signal: "Team Decision",
        observation:
          "First sales hire scope undefined — affects outbound strategy and agent configuration",
        source: "Striker capacity planning",
        urgency: 6,
        state: "escalate",
      },
    ],
    handledAutomatically: [
      "Compiled pricing test options with revenue projections for each",
      "Summarized partnership terms with comparable deal benchmarks",
      "Built segment comparison report with 90-day performance data",
    ],
    watchItems: [
      "Partnership deadline — 4 days remaining",
      "Pricing test revenue impact — tracking competitor pricing changes",
    ],
    founderDecisions: [
      {
        title: "Launch pricing test — basic vs. usage-based",
        why: "Deferred twice. $3K/week in unrealized revenue. Data supports usage-based model.",
        recommendation:
          "Run 30-day A/B test with 20% of new signups on usage-based pricing",
        ifApproved:
          "Striker segments test group. Cortex tracks revenue per user and churn delta.",
      },
      {
        title: "Accept or decline co-marketing partnership",
        why: "Partner has 12K email list in your ICP. Terms: co-branded webinar + email swap.",
        recommendation:
          "Accept. Low cost, high exposure. Their audience matches your top-converting segment.",
        ifApproved:
          "Pulse drafts co-branded content. Specter coordinates list integration.",
      },
      {
        title: "Choose primary ICP segment for Q2 focus",
        why: "Resources split across agencies and SaaS founders. Both convert but neither is getting full attention.",
        recommendation:
          "Lead with agencies (higher LTV). Maintain SaaS with automated sequences only.",
        ifApproved:
          "All agents reconfigure targeting. Specter rebuilds lists. Striker adjusts sequences.",
      },
      {
        title: "Define scope for first sales hire",
        why: "Unclear scope is blocking the hire and limiting outbound capacity.",
        recommendation:
          "Hire for demo-to-close. Let Ultron handle prospecting and qualification.",
        ifApproved:
          "Cortex generates job spec. Striker adjusts pipeline handoff rules.",
      },
    ],
    agents: makeAgents({
      cortex: "Compiling decision context and projections",
      specter: "Evaluating partnership and segment data",
      striker: "Preparing pipeline adjustments for each outcome",
      pulse: "Drafting content for partnership scenario",
      sentinel: "Tracking decision deadlines and cost of delay",
    }),
    metrics: {
      hoursNotSpent: 5,
      tasksAbsorbed: 7,
      signalsUnderWatch: 2,
      pipelineRiskRecovered: 0,
      decisionsSimplified: 4,
      followUpsQueued: 6,
    },
  },
];

export const PREBUILT_COMMANDS = COMMANDS.map((c) => c.input);

export function getCommandData(input: string): CommandData | null {
  const normalized = input.toLowerCase().trim().replace(/[?.]$/g, "");
  return (
    COMMANDS.find((c) => {
      const cmdNorm = c.input.toLowerCase().trim().replace(/[?.]$/g, "");
      return cmdNorm === normalized || normalized.includes(cmdNorm.slice(0, 20));
    }) || COMMANDS[0]
  );
}
