export interface SkillFile {
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  useCase: string;
  requiredInputs: string[];
  outputs: string[];
  files: SkillFile[];
  excerpt: string;
  keywords: string[];
  argumentHint: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export const categories: SkillCategory[] = [
  {
    id: "integrations",
    name: "Integrations",
    description: "Connect Claude to external platforms and services",
    skills: [
      {
        id: "composio",
        name: "composio",
        title: "Composio",
        category: "integrations",
        shortDescription: "Build AI agent integrations with 1000+ third-party apps",
        longDescription: "Connects AI agents to third-party applications using Composio. Supports GitHub, Gmail, Slack, Notion, Salesforce, and 1000+ apps via unified SDKs and MCP. Handles OAuth authentication, event triggers, and multi-app agent workflows.",
        useCase: "When you need Claude to interact with external SaaS tools, set up OAuth flows, or build multi-app agent workflows through a unified SDK.",
        requiredInputs: [
          "COMPOSIO_API_KEY environment variable",
          "ANTHROPIC_API_KEY environment variable",
          "Description of what to build or integrate",
        ],
        outputs: [
          "Composio session configuration",
          "Tool integration code (Python or TypeScript)",
          "OAuth authentication flows",
          "Event trigger configurations",
          "MCP URL for compatible clients",
        ],
        files: [
          { name: "SKILL.md", description: "Core skill definition, setup checklist, key concepts, and common workflows" },
          { name: "sdk-reference.md", description: "Python and TypeScript SDK patterns, sessions, tools, MCP integration" },
          { name: "auth-and-triggers.md", description: "OAuth/API key flows, connected accounts, triggers, webhooks" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "You are an expert at integrating AI agents with third-party applications using Composio. Sessions scope all operations by user_id. Use MCP mode for dynamic tool discovery to reduce token usage.",
        keywords: ["composio", "oauth", "mcp", "integrations", "github", "gmail", "slack", "notion", "salesforce", "api"],
        argumentHint: "[description of what to build or integrate]",
      },
      {
        id: "n8n",
        name: "n8n",
        title: "n8n",
        category: "integrations",
        shortDescription: "Build workflow automations, custom nodes, and integrations",
        longDescription: "Expert at building production-grade n8n workflow automations, custom nodes, and integrations. Covers workflow JSON structure, trigger types, expression syntax, error handling patterns, Code nodes in JavaScript and Python, and the full n8n REST API.",
        useCase: "When you need to create n8n workflows, build custom nodes, write expressions, configure triggers, handle errors, or set up webhook automations.",
        requiredInputs: [
          "n8n instance (self-hosted or cloud)",
          "Description of workflow or node to build",
        ],
        outputs: [
          "Workflow JSON configurations",
          "Custom node TypeScript code",
          "Expression templates",
          "Error handling patterns",
          "API integration code",
        ],
        files: [
          { name: "SKILL.md", description: "Core patterns, trigger types, expression syntax, critical rules" },
          { name: "workflow-reference.md", description: "Workflow design, triggers, flow control, error handling, data transformation" },
          { name: "custom-nodes-reference.md", description: "Building custom nodes with TypeScript, declarative vs programmatic" },
          { name: "api-reference.md", description: "n8n REST API for programmatic workflow management" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Every workflow needs a trigger node. Items are arrays. Use expressions over Code nodes when possible. Set executionOrder: v1 for predictable execution.",
        keywords: ["n8n", "workflow", "automation", "webhook", "trigger", "nodes", "api"],
        argumentHint: "[description of workflow or node to build]",
      },
      {
        id: "trigger-dev",
        name: "trigger-dev",
        title: "Trigger.dev",
        category: "integrations",
        shortDescription: "Build background jobs, automations, and workflows in TypeScript",
        longDescription: "Expert at building production-grade Trigger.dev v4 background tasks, workflows, and automations in TypeScript. Covers tasks, runs, queues, concurrency, retries, idempotency, wait functions, AI integration, streams, realtime, middleware, and scheduled tasks.",
        useCase: "When you need to create background tasks, scheduled jobs, AI agent workflows, queued processing, cron jobs, or any long-running async work with Trigger.dev.",
        requiredInputs: [
          "TRIGGER_SECRET_KEY environment variable",
          "@trigger.dev/sdk package installed",
          "Description of what to build",
        ],
        outputs: [
          "Task definitions in TypeScript",
          "trigger.config.ts configuration",
          "Queue and concurrency setups",
          "Scheduled task configurations",
          "Deployment commands",
        ],
        files: [
          { name: "SKILL.md", description: "Setup checklist, core patterns, critical rules" },
          { name: "core-reference.md", description: "Tasks, runs, triggering, queues, concurrency, retries, errors" },
          { name: "config-reference.md", description: "Configuration, build extensions, deployment, CLI" },
          { name: "advanced-reference.md", description: "AI integration, streams, realtime, middleware, lifecycle hooks" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Tasks are the core building block. Every task must have a unique id. Export tasks from files in your configured dirs. Use queues for concurrency control.",
        keywords: ["trigger.dev", "background jobs", "cron", "queue", "async", "typescript", "tasks"],
        argumentHint: "[description of what to build]",
      },
    ],
  },
  {
    id: "development",
    name: "Development",
    description: "Build better software with specialized coding skills",
    skills: [
      {
        id: "frontend-design",
        name: "frontend-design",
        title: "Frontend Design",
        category: "development",
        shortDescription: "Create distinctive, production-grade frontend interfaces",
        longDescription: "Guides creation of distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. Focuses on bold typography, cohesive color systems, meaningful motion, spatial composition, and atmospheric backgrounds. Supports HTML/CSS/JS, React, Vue, and more.",
        useCase: "When you need Claude to build web components, pages, or applications with high design quality and a distinctive visual identity.",
        requiredInputs: [
          "Description of the interface to build",
          "Purpose and audience context",
          "Technical constraints (framework, accessibility)",
        ],
        outputs: [
          "Production-grade component code",
          "Distinctive visual design",
          "CSS animations and micro-interactions",
          "Responsive layouts",
          "Cohesive color and typography systems",
        ],
        files: [
          { name: "SKILL.md", description: "Design thinking framework, aesthetics guidelines, critical anti-patterns" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Before coding, understand the context and commit to a BOLD aesthetic direction. Choose a clear conceptual direction and execute it with precision. Never use generic AI-generated aesthetics.",
        keywords: ["frontend", "design", "ui", "css", "react", "animations", "typography", "components"],
        argumentHint: "[description of interface to build]",
      },
      {
        id: "create-skill",
        name: "create-skill",
        title: "Skill Creator",
        category: "development",
        shortDescription: "Create high-quality Claude Code custom skills and slash commands",
        longDescription: "Expert at creating Claude Code skills including reusable slash commands and auto-activating knowledge modules. Covers the full skill creation workflow: clarifying purpose, determining scope, choosing frontmatter settings, writing SKILL.md, and adding supporting files.",
        useCase: "When you want to create a new Claude Code skill, build a custom command, make a slash command, or add a reusable workflow to your project.",
        requiredInputs: [
          "Description of the skill to create",
          "Skill type (task, research, knowledge, or dynamic)",
          "Scope preference (personal or project)",
        ],
        outputs: [
          "SKILL.md file with proper frontmatter",
          "Supporting reference files if needed",
          "Correct directory structure",
          "Tested skill invocation",
        ],
        files: [
          { name: "SKILL.md", description: "Skill creation workflow, frontmatter reference, structure guide" },
          { name: "reference.md", description: "Complete frontmatter field reference, variables, shell injection" },
          { name: "examples.md", description: "Real-world skill examples covering all pattern types" },
          { name: "Create Skill.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Step 1: Clarify purpose and type. Step 2: Determine scope. Step 3: Choose frontmatter settings. Step 4: Write the SKILL.md. Step 5: Add supporting files if needed.",
        keywords: ["skill", "slash command", "custom command", "claude code", "automation", "workflow"],
        argumentHint: "[description of the skill to create]",
      },
      {
        id: "security",
        name: "security",
        title: "Application Security",
        category: "development",
        shortDescription: "Secure web and desktop application development",
        longDescription: "Security-focused engineering covering OWASP Top 10, XSS, CSRF, SQL injection, SSRF, command injection, path traversal, and desktop app security for both Electron and Tauri. Provides immediate fix patterns for every common vulnerability type.",
        useCase: "When writing authentication, authorization, API endpoints, form handling, database queries, file uploads, Electron/Tauri apps, or when reviewing code for vulnerabilities.",
        requiredInputs: [
          "Code to review or area to secure",
          "Application type (web, desktop, API)",
        ],
        outputs: [
          "Security audit findings with severity levels",
          "Concrete fix implementations",
          "Security header configurations",
          "Input validation patterns",
          "Authentication/authorization code",
        ],
        files: [
          { name: "SKILL.md", description: "Security mindset, non-negotiable rules, vulnerability response patterns" },
          { name: "web-security.md", description: "XSS, CSRF, injection, SSRF, path traversal, security headers" },
          { name: "auth-and-secrets.md", description: "Authentication, JWT, OAuth2 PKCE, password hashing, secrets" },
          { name: "desktop-security.md", description: "Electron and Tauri hardening, IPC security, sandboxing" },
          { name: "database-and-deps.md", description: "SQL injection prevention, ORM security, dependency supply chain" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "What can an attacker control? Every external input is hostile. Validate at boundaries. Defense in depth. Never rely on a single security control.",
        keywords: ["security", "owasp", "xss", "csrf", "sql injection", "authentication", "electron", "tauri"],
        argumentHint: "[area to secure or review]",
      },
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Scale, optimize, and harden your systems",
    skills: [
      {
        id: "scalability",
        name: "scalability",
        title: "Software Scalability",
        category: "infrastructure",
        shortDescription: "Design and build systems that handle growth without rewriting",
        longDescription: "Expert at building scalable software systems. Covers database scaling, caching strategies, async processing, API design for scale, concurrency, frontend performance, observability, and infrastructure patterns. Focuses on identifying real bottlenecks before optimizing.",
        useCase: "When writing database queries, caching logic, API endpoints, message queues, background jobs, or reviewing code for performance bottlenecks.",
        requiredInputs: [
          "Area to scale or optimize",
          "Current bottleneck symptoms",
          "System metrics if available",
        ],
        outputs: [
          "Bottleneck analysis and identification",
          "Scaling strategy recommendations",
          "Optimized query/cache/queue implementations",
          "Infrastructure configuration",
          "Monitoring thresholds",
        ],
        files: [
          { name: "SKILL.md", description: "Bottleneck identification flow, quick wins, scaling decision matrix" },
          { name: "database-scaling.md", description: "Indexing, query optimization, connection pooling, read replicas, sharding" },
          { name: "caching-and-queues.md", description: "Redis patterns, cache invalidation, message queues, event-driven architecture" },
          { name: "api-and-services.md", description: "Pagination, rate limiting, circuit breakers, load balancing" },
          { name: "infrastructure.md", description: "Kubernetes autoscaling, serverless patterns, CDN, deployments" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Rule #1: Don't optimize what you haven't measured. Profile first, then fix the actual bottleneck. Start simple, scale when needed.",
        keywords: ["scalability", "performance", "database", "caching", "redis", "kubernetes", "load balancing"],
        argumentHint: "[area to scale or optimize]",
      },
      {
        id: "cost-reducer",
        name: "cost-reducer",
        title: "Cost Reducer",
        category: "infrastructure",
        shortDescription: "Reduce cloud, infrastructure, and operational costs",
        longDescription: "Cost-conscious engineering covering AWS/GCP/Vercel pricing, database optimization, serverless tuning, image pipelines, observability costs, and FinOps practices. Provides a cost impact hierarchy from architecture choices to observability tuning.",
        useCase: "When configuring cloud resources, optimizing bundles, setting up caching, choosing between services, sizing instances, or reviewing code for cost inefficiencies.",
        requiredInputs: [
          "Area to optimize or review for cost",
          "Current infrastructure or stack details",
          "Monthly spend estimates if available",
        ],
        outputs: [
          "Cost detection findings with savings estimates",
          "Optimized configurations",
          "Right-sizing recommendations",
          "Caching and storage strategies",
          "FinOps practice guidelines",
        ],
        files: [
          { name: "SKILL.md", description: "Cost impact hierarchy, quick wins, cost detection checklist" },
          { name: "code-level-savings.md", description: "Bundle optimization, image pipelines, query cost reduction, N+1 prevention" },
          { name: "cloud-and-infra.md", description: "Instance right-sizing, serverless tuning, storage tiers, data transfer" },
          { name: "services-and-finops.md", description: "Service pricing comparisons, observability costs, unit economics" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Rule #1: The cheapest code is code that doesn't run. Cache it, skip it, or make it smaller. Architecture choices create 10x cost differences.",
        keywords: ["cost", "aws", "gcp", "vercel", "finops", "optimization", "cloud", "infrastructure"],
        argumentHint: "[area to optimize or review for cost]",
      },
      {
        id: "self-healing",
        name: "self-healing",
        title: "Self-Healing",
        category: "infrastructure",
        shortDescription: "Continuously improve Claude by recognizing patterns and saving memory",
        longDescription: "A metacognitive system that observes work patterns, extracts reusable knowledge, and evolves capabilities over time. Handles pattern recognition, memory management, skill creation from discovered patterns, and project knowledge refinement.",
        useCase: "When Claude notices repeated workflows, encounters previously solved problems, or when you want Claude to improve itself, learn, remember, or get smarter over sessions.",
        requiredInputs: [
          "Optional: specific area to improve or review",
          "Session context and recent work patterns",
        ],
        outputs: [
          "Updated memory files (MEMORY.md, topic files)",
          "New skill files from discovered patterns",
          "Updated CLAUDE.md conventions",
          "Pattern analysis reports",
        ],
        files: [
          { name: "SKILL.md", description: "Core loop (observe, decide, act, verify), decision matrix, activation triggers" },
          { name: "memory-management.md", description: "How to organize, maintain, and evolve memory files" },
          { name: "pattern-recognition.md", description: "Detecting actionable patterns and deciding what to do with them" },
          { name: "skill-creation-guide.md", description: "When and how to create new skills from discovered patterns" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Core Loop: Observe, Decide, Act, Verify. Save to memory when you solve something tricky. Create skills when you see repeated workflows.",
        keywords: ["self-healing", "memory", "learning", "patterns", "continuous improvement", "metacognition"],
        argumentHint: "[optional: specific area to improve or review]",
      },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Supercharge research, support, and personalization",
    skills: [
      {
        id: "researcher",
        name: "researcher",
        title: "Deep Researcher",
        category: "productivity",
        shortDescription: "Deep research on any topic using web search and multi-source synthesis",
        longDescription: "Expert research analyst that conducts thorough, multi-source research on any topic. Follows a structured four-phase process: scope and plan, gather in parallel, analyze and cross-reference, then synthesize and deliver with sources.",
        useCase: "When you want to research a topic, investigate a question, compare technologies, understand a concept deeply, find best practices, or need a well-sourced analysis.",
        requiredInputs: [
          "Topic or question to research",
        ],
        outputs: [
          "Structured research report with TL;DR",
          "Key findings organized by sub-topic",
          "Comparison tables when applicable",
          "Actionable recommendations",
          "Numbered source list with URLs",
        ],
        files: [
          { name: "SKILL.md", description: "Four-phase research process, output format, research strategies by type" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Phase 1: Scope and plan. Phase 2: Gather in parallel with multiple varied searches. Phase 3: Analyze and cross-reference across sources. Phase 4: Synthesize and deliver.",
        keywords: ["research", "analysis", "comparison", "deep dive", "web search", "sources"],
        argumentHint: "[topic or question to research]",
      },
      {
        id: "customer-support",
        name: "customer-support",
        title: "Customer Support",
        category: "productivity",
        shortDescription: "Handle support tasks with professional, empathetic responses",
        longDescription: "Senior customer support specialist covering email replies, live chat, ticket management, escalation, tone calibration, and CSAT optimization. Includes response templates, escalation guides, ticket analysis mode, and help article creation.",
        useCase: "When drafting support responses, analyzing customer issues, triaging tickets, writing help articles, creating macros/templates, or reviewing support conversations for quality.",
        requiredInputs: [
          "Customer issue, ticket, or support task",
          "Context about the product or service",
        ],
        outputs: [
          "Personalized support responses",
          "Ticket analysis with sentiment and root cause",
          "Help articles and knowledge base content",
          "Escalation recommendations",
          "Response templates and macros",
        ],
        files: [
          { name: "SKILL.md", description: "Core principles, response structure, tone calibration, ticket analysis" },
          { name: "response-templates.md", description: "Templates for refunds, bugs, feature requests, outages, billing" },
          { name: "escalation-guide.md", description: "Escalation criteria, internal routing, SLA expectations, handoff protocols" },
          { name: "Explanation.docx", description: "Extended explanation and context" },
        ],
        excerpt: "Acknowledge first, solve second. One read, full understanding. Own the problem. Match energy, not emotion. Close the loop.",
        keywords: ["support", "customer service", "tickets", "escalation", "help articles", "CSAT"],
        argumentHint: "[customer issue, ticket, or support task]",
      },
      {
        id: "know-me",
        name: "know-me",
        title: "Know Me",
        category: "productivity",
        shortDescription: "Learn and remember user preferences across sessions",
        longDescription: "A thoughtful assistant that remembers. Observes preferences, habits, corrections, and context across sessions. Saves to memory topic files and references stored knowledge to personalize all future responses automatically.",
        useCase: "Auto-activates when you share personal info, correct Claude, express preferences, or describe your project. Makes every future session feel continuous.",
        requiredInputs: [
          "No explicit input required",
          "Auto-activates on preference signals",
        ],
        outputs: [
          "Updated MEMORY.md and topic files",
          "Personalized responses based on stored knowledge",
          "Preference-aware code suggestions",
          "Correction tracking to prevent repeated mistakes",
        ],
        files: [
          { name: "SKILL.md", description: "Core loop (listen, save, recall, apply), auto-activation triggers, privacy rules" },
          { name: "what-to-track.md", description: "Categories of information to observe and save" },
          { name: "memory-operations.md", description: "How to store, organize, update, and recall user knowledge" },
        ],
        excerpt: "Listen for signals. Save to memory topic files. Recall before responding. Apply to personalize everything. Never save secrets or credentials.",
        keywords: ["memory", "preferences", "personalization", "learning", "context", "sessions"],
        argumentHint: "",
      },
    ],
  },
];

export const totalSkills = categories.reduce((sum, cat) => sum + cat.skills.length, 0);
export const totalCategories = categories.length;
export const totalFiles = categories.reduce(
  (sum, cat) => sum + cat.skills.reduce((s, sk) => s + sk.files.length, 0),
  0
);
