/* ─── Template data model ─── */

export interface TemplateSection {
  id: string;
  title: string;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "date" | "rows";
  /** Column config for "rows" type */
  columns?: string[];
  /** Default row count for "rows" type */
  defaultRows?: number;
}

export interface TemplateConfig {
  slug: string;
  name: string;
  shortDescription: string;
  badge: string;
  sections: TemplateSection[];
}

/* ─────────────────────────────────────────────
 *  1. Client Agreement
 * ───────────────────────────────────────────── */
const clientAgreement: TemplateConfig = {
  slug: "client-agreement",
  name: "Client Agreement",
  shortDescription: "Simple service agreement covering scope, payment, IP, and cancellation",
  badge: "Legal",
  sections: [
    {
      id: "parties",
      title: "Parties",
      fields: [
        { id: "provider_name", label: "Provider", placeholder: "Your name or company", type: "text" },
        { id: "provider_address", label: "Provider address", placeholder: "123 Main St, City, State", type: "text" },
        { id: "client_name", label: "Client", placeholder: "Client name or company", type: "text" },
        { id: "client_address", label: "Client address", placeholder: "456 Oak Ave, City, State", type: "text" },
        { id: "effective_date", label: "Effective date", placeholder: "March 1, 2026", type: "date" },
      ],
    },
    {
      id: "scope",
      title: "Scope of Work",
      fields: [
        { id: "project_description", label: "Project description", placeholder: "Describe the work being performed", type: "textarea" },
        { id: "deliverables", label: "Deliverables", placeholder: "List all deliverables", type: "textarea" },
        { id: "timeline", label: "Timeline", placeholder: "Expected start and end dates, key milestones", type: "textarea" },
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      fields: [
        { id: "total_fee", label: "Total fee", placeholder: "$5,000", type: "text" },
        { id: "payment_schedule", label: "Payment schedule", placeholder: "50% upfront, 50% on delivery", type: "text" },
        { id: "payment_method", label: "Payment method", placeholder: "Bank transfer, Stripe, PayPal", type: "text" },
        { id: "late_payment", label: "Late payment terms", placeholder: "Net 15. 1.5% monthly interest on overdue balances", type: "text" },
      ],
    },
    {
      id: "revisions",
      title: "Revisions and Changes",
      fields: [
        { id: "revision_rounds", label: "Included revision rounds", placeholder: "2 rounds of revisions included", type: "text" },
        { id: "change_process", label: "Change request process", placeholder: "Additional changes billed at $150/hr with written approval", type: "textarea" },
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation and Termination",
      fields: [
        { id: "notice_period", label: "Notice period", placeholder: "14 days written notice", type: "text" },
        { id: "cancellation_fee", label: "Cancellation terms", placeholder: "Work completed to date will be billed. Deposits are non-refundable", type: "textarea" },
      ],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      fields: [
        { id: "ip_ownership", label: "IP ownership", placeholder: "All deliverables transfer to Client upon final payment", type: "textarea" },
        { id: "portfolio_rights", label: "Portfolio rights", placeholder: "Provider retains right to display work in portfolio unless otherwise agreed", type: "text" },
      ],
    },
    {
      id: "signatures",
      title: "Signatures",
      fields: [
        { id: "provider_sig", label: "Provider signature", placeholder: "Name, title, date", type: "text" },
        { id: "client_sig", label: "Client signature", placeholder: "Name, title, date", type: "text" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  2. Invoice
 * ───────────────────────────────────────────── */
const invoice: TemplateConfig = {
  slug: "invoice",
  name: "Invoice",
  shortDescription: "Clean invoice with line items, totals, and payment instructions",
  badge: "Finance",
  sections: [
    {
      id: "header",
      title: "Invoice Details",
      fields: [
        { id: "invoice_number", label: "Invoice number", placeholder: "INV-001", type: "text" },
        { id: "issue_date", label: "Issue date", placeholder: "March 15, 2026", type: "date" },
        { id: "due_date", label: "Due date", placeholder: "March 30, 2026", type: "date" },
      ],
    },
    {
      id: "parties",
      title: "From / Bill To",
      fields: [
        { id: "from_name", label: "From", placeholder: "Your name or company", type: "text" },
        { id: "from_address", label: "From address", placeholder: "123 Main St, City, State", type: "text" },
        { id: "from_email", label: "From email", placeholder: "you@company.com", type: "text" },
        { id: "bill_to_name", label: "Bill to", placeholder: "Client name or company", type: "text" },
        { id: "bill_to_address", label: "Bill to address", placeholder: "456 Oak Ave, City, State", type: "text" },
        { id: "bill_to_email", label: "Bill to email", placeholder: "client@company.com", type: "text" },
      ],
    },
    {
      id: "items",
      title: "Line Items",
      fields: [
        {
          id: "line_items",
          label: "Items",
          placeholder: "",
          type: "rows",
          columns: ["Description", "Qty", "Rate", "Amount"],
          defaultRows: 3,
        },
      ],
    },
    {
      id: "totals",
      title: "Totals",
      fields: [
        { id: "subtotal", label: "Subtotal", placeholder: "$5,000.00", type: "text" },
        { id: "tax_rate", label: "Tax", placeholder: "0%", type: "text" },
        { id: "total", label: "Total", placeholder: "$5,000.00", type: "text" },
      ],
    },
    {
      id: "payment",
      title: "Payment Instructions",
      fields: [
        { id: "payment_instructions", label: "Payment instructions", placeholder: "Bank transfer to: ...\nOr pay via Stripe link: ...", type: "textarea" },
        { id: "notes", label: "Notes", placeholder: "Thank you for your business", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  3. Project Brief / Proposal
 * ───────────────────────────────────────────── */
const projectBrief: TemplateConfig = {
  slug: "project-brief",
  name: "Project Brief",
  shortDescription: "Proposal covering business context, deliverables, timeline, and success metrics",
  badge: "Planning",
  sections: [
    {
      id: "overview",
      title: "Overview",
      fields: [
        { id: "client_name", label: "Client", placeholder: "Client or company name", type: "text" },
        { id: "project_name", label: "Project name", placeholder: "Website Redesign Phase 2", type: "text" },
        { id: "prepared_by", label: "Prepared by", placeholder: "Your name", type: "text" },
        { id: "date", label: "Date", placeholder: "March 15, 2026", type: "date" },
      ],
    },
    {
      id: "context",
      title: "Business Context",
      fields: [
        { id: "background", label: "Background", placeholder: "Current situation and why this project exists", type: "textarea" },
        { id: "problem", label: "Problem statement", placeholder: "What specific problem does this project solve", type: "textarea" },
      ],
    },
    {
      id: "objective",
      title: "Objective",
      fields: [
        { id: "objective", label: "Project objective", placeholder: "The primary outcome this project will achieve", type: "textarea" },
        { id: "success_metric", label: "Success metric", placeholder: "How we will measure success", type: "text" },
      ],
    },
    {
      id: "deliverables",
      title: "Deliverables",
      fields: [
        { id: "deliverables", label: "Deliverables", placeholder: "1. Homepage redesign\n2. Mobile optimization\n3. CMS integration\n4. Performance audit", type: "textarea" },
      ],
    },
    {
      id: "timeline",
      title: "Timeline",
      fields: [
        { id: "timeline", label: "Timeline", placeholder: "Week 1-2: Discovery and wireframes\nWeek 3-4: Design\nWeek 5-6: Development\nWeek 7: Testing and launch", type: "textarea" },
        { id: "start_date", label: "Proposed start", placeholder: "April 1, 2026", type: "date" },
        { id: "end_date", label: "Target completion", placeholder: "May 15, 2026", type: "date" },
      ],
    },
    {
      id: "approvals",
      title: "Approvals and Constraints",
      fields: [
        { id: "approvals", label: "Approval process", placeholder: "Client signs off at each milestone before next phase begins", type: "textarea" },
        { id: "constraints", label: "Constraints", placeholder: "Budget: $10,000\nMust integrate with existing Shopify store\nLaunch before Q3", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  4. Discovery Call Notes
 * ───────────────────────────────────────────── */
const discoveryCall: TemplateConfig = {
  slug: "discovery-call",
  name: "Discovery Call Notes",
  shortDescription: "Structured notes from client discovery calls with goals and next steps",
  badge: "Sales",
  sections: [
    {
      id: "meta",
      title: "Call Details",
      fields: [
        { id: "client_name", label: "Client", placeholder: "Client or company name", type: "text" },
        { id: "call_date", label: "Date", placeholder: "March 15, 2026", type: "date" },
        { id: "attendees", label: "Attendees", placeholder: "Jane Smith (Client), John Doe (Us)", type: "text" },
        { id: "duration", label: "Duration", placeholder: "45 minutes", type: "text" },
      ],
    },
    {
      id: "goals",
      title: "Goals and Motivation",
      fields: [
        { id: "goals", label: "Primary goals", placeholder: "What does the client want to achieve", type: "textarea" },
        { id: "pain_points", label: "Pain points", placeholder: "Current frustrations and blockers", type: "textarea" },
        { id: "motivation", label: "Why now", placeholder: "What triggered this conversation", type: "textarea" },
      ],
    },
    {
      id: "current",
      title: "Current State",
      fields: [
        { id: "current_stack", label: "Current tools and stack", placeholder: "Notion, Slack, HubSpot, custom spreadsheets", type: "textarea" },
        { id: "current_process", label: "Current process", placeholder: "How they handle this workflow today", type: "textarea" },
        { id: "blockers", label: "Blockers", placeholder: "What is preventing them from solving this themselves", type: "textarea" },
      ],
    },
    {
      id: "next",
      title: "Next Steps",
      fields: [
        { id: "next_steps", label: "Agreed next steps", placeholder: "1. Send proposal by Friday\n2. Client sends brand assets\n3. Schedule kickoff call", type: "textarea" },
        { id: "follow_up_date", label: "Follow-up date", placeholder: "March 20, 2026", type: "date" },
        { id: "notes", label: "Additional notes", placeholder: "Any other observations or context", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  5. Welcome Doc
 * ───────────────────────────────────────────── */
const welcomeDoc: TemplateConfig = {
  slug: "welcome-doc",
  name: "Welcome Doc",
  shortDescription: "Onboarding document with engagement details, timeline, and communication guide",
  badge: "Onboarding",
  sections: [
    {
      id: "welcome",
      title: "Welcome",
      fields: [
        { id: "client_name", label: "Client name", placeholder: "Client or company name", type: "text" },
        { id: "project_name", label: "Project name", placeholder: "Website Redesign", type: "text" },
        { id: "welcome_message", label: "Welcome message", placeholder: "Thank you for choosing to work with us. We are excited to get started and committed to delivering great results.", type: "textarea" },
      ],
    },
    {
      id: "engagement",
      title: "How This Engagement Works",
      fields: [
        { id: "process", label: "Our process", placeholder: "1. Discovery and scoping\n2. Design and prototyping\n3. Development\n4. Review and revisions\n5. Launch and handoff", type: "textarea" },
        { id: "your_role", label: "What we need from you", placeholder: "Timely feedback on deliverables\nAccess to required accounts and assets\nAvailability for scheduled check-ins", type: "textarea" },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      fields: [
        { id: "primary_channel", label: "Primary channel", placeholder: "Slack, email, or project management tool", type: "text" },
        { id: "check_in_rhythm", label: "Check-in rhythm", placeholder: "Weekly video call every Tuesday at 2pm ET", type: "text" },
        { id: "response_time", label: "Expected response time", placeholder: "24 hours on business days", type: "text" },
        { id: "urgent_contact", label: "For urgent matters", placeholder: "Email urgent@company.com or text (555) 123-4567", type: "text" },
      ],
    },
    {
      id: "timeline",
      title: "Timeline",
      fields: [
        { id: "timeline_overview", label: "Timeline overview", placeholder: "Week 1-2: Discovery\nWeek 3-4: Design\nWeek 5-6: Build\nWeek 7: Launch", type: "textarea" },
        { id: "kickoff_date", label: "Kickoff date", placeholder: "April 1, 2026", type: "date" },
      ],
    },
    {
      id: "materials",
      title: "Sending Materials",
      fields: [
        { id: "how_to_send", label: "How to send files", placeholder: "Upload to shared Google Drive folder or send via Slack", type: "textarea" },
        { id: "what_we_need", label: "Materials we need to start", placeholder: "Logo files, brand guidelines, content docs, account access", type: "textarea" },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "your_contact", label: "Your primary contact", placeholder: "Name, email, phone", type: "text" },
        { id: "backup_contact", label: "Backup contact", placeholder: "Name, email", type: "text" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  6. Package Menu / Offer Menu
 * ───────────────────────────────────────────── */
const packageMenu: TemplateConfig = {
  slug: "package-menu",
  name: "Package Menu",
  shortDescription: "Service packages with clear outcomes, scope, and pricing for each tier",
  badge: "Sales",
  sections: [
    {
      id: "header",
      title: "Menu Header",
      fields: [
        { id: "business_name", label: "Business name", placeholder: "Your company name", type: "text" },
        { id: "tagline", label: "Tagline", placeholder: "Clear, practical automation for growing teams", type: "text" },
        { id: "intro", label: "Introduction", placeholder: "Choose the package that fits your needs. Each tier builds on the previous one.", type: "textarea" },
      ],
    },
    {
      id: "package_1",
      title: "Package 1",
      fields: [
        { id: "p1_name", label: "Package name", placeholder: "Starter", type: "text" },
        { id: "p1_for", label: "Best for", placeholder: "Solo founders who need the basics automated", type: "text" },
        { id: "p1_outcomes", label: "What you get", placeholder: "Lead capture automation\nInbox triage\nWeekly summary report", type: "textarea" },
        { id: "p1_scope", label: "Scope", placeholder: "1 workflow, 2 integrations, 1 revision round", type: "text" },
        { id: "p1_price", label: "Price", placeholder: "$2,500", type: "text" },
      ],
    },
    {
      id: "package_2",
      title: "Package 2",
      fields: [
        { id: "p2_name", label: "Package name", placeholder: "Growth", type: "text" },
        { id: "p2_for", label: "Best for", placeholder: "Small teams ready to scale operations", type: "text" },
        { id: "p2_outcomes", label: "What you get", placeholder: "Everything in Starter, plus:\nCRM integration\nClient onboarding flow\nMonthly reporting", type: "textarea" },
        { id: "p2_scope", label: "Scope", placeholder: "3 workflows, 5 integrations, 2 revision rounds", type: "text" },
        { id: "p2_price", label: "Price", placeholder: "$5,000", type: "text" },
      ],
    },
    {
      id: "package_3",
      title: "Package 3",
      fields: [
        { id: "p3_name", label: "Package name", placeholder: "Scale", type: "text" },
        { id: "p3_for", label: "Best for", placeholder: "Established teams who need a complete system", type: "text" },
        { id: "p3_outcomes", label: "What you get", placeholder: "Everything in Growth, plus:\nCustom AI agents\nFull workflow audit\nOngoing support (30 days)", type: "textarea" },
        { id: "p3_scope", label: "Scope", placeholder: "Unlimited workflows, full integration suite, 3 revision rounds", type: "text" },
        { id: "p3_price", label: "Price", placeholder: "$12,000", type: "text" },
      ],
    },
    {
      id: "addons",
      title: "Add-ons",
      fields: [
        { id: "addons", label: "Optional add-ons", placeholder: "Priority support: $500/mo\nAdditional workflow: $1,500 each\nTraining session: $750", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  7. Statement of Work / Delivery Guide
 * ───────────────────────────────────────────── */
const deliveryGuide: TemplateConfig = {
  slug: "delivery-guide",
  name: "Delivery Guide",
  shortDescription: "Statement of work with phases, dependencies, review windows, and handoff details",
  badge: "Operations",
  sections: [
    {
      id: "overview",
      title: "Project Overview",
      fields: [
        { id: "project_name", label: "Project name", placeholder: "AI Workflow Implementation", type: "text" },
        { id: "client_name", label: "Client", placeholder: "Client name", type: "text" },
        { id: "scope_summary", label: "Scope summary", placeholder: "Brief description of what this project covers", type: "textarea" },
      ],
    },
    {
      id: "phases",
      title: "Delivery Phases",
      fields: [
        { id: "phase_1", label: "Phase 1", placeholder: "Discovery and audit (Week 1-2)\nDeliverables: Requirements doc, workflow map\nReview window: 3 business days", type: "textarea" },
        { id: "phase_2", label: "Phase 2", placeholder: "Build and configure (Week 3-5)\nDeliverables: Working automations, integration setup\nReview window: 5 business days", type: "textarea" },
        { id: "phase_3", label: "Phase 3", placeholder: "Testing and launch (Week 6-7)\nDeliverables: QA report, go-live\nReview window: 3 business days", type: "textarea" },
      ],
    },
    {
      id: "dependencies",
      title: "Dependencies",
      fields: [
        { id: "client_deps", label: "From client", placeholder: "API credentials, brand assets, content, account access", type: "textarea" },
        { id: "our_deps", label: "From us", placeholder: "Staging environment, documentation, training materials", type: "textarea" },
      ],
    },
    {
      id: "review",
      title: "Review and Approval",
      fields: [
        { id: "review_process", label: "Review process", placeholder: "Each phase requires written approval before the next phase begins", type: "textarea" },
        { id: "feedback_window", label: "Feedback window", placeholder: "3 business days per review cycle", type: "text" },
      ],
    },
    {
      id: "handoff",
      title: "Handoff",
      fields: [
        { id: "handoff_details", label: "Handoff includes", placeholder: "Source code, documentation, admin access, 30-min walkthrough call", type: "textarea" },
        { id: "support_period", label: "Post-launch support", placeholder: "14 days of bug fixes included. Extended support available.", type: "text" },
      ],
    },
    {
      id: "boundaries",
      title: "Boundaries",
      fields: [
        { id: "in_scope", label: "In scope", placeholder: "Everything listed in delivery phases above", type: "textarea" },
        { id: "out_of_scope", label: "Out of scope", placeholder: "Content creation, third-party licensing, ongoing maintenance beyond support period", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  8. Task List / Delivery Checklist
 * ───────────────────────────────────────────── */
const taskList: TemplateConfig = {
  slug: "task-list",
  name: "Delivery Checklist",
  shortDescription: "Phased task list tracking internal and client tasks with status and due dates",
  badge: "Operations",
  sections: [
    {
      id: "meta",
      title: "Project Info",
      fields: [
        { id: "project_name", label: "Project name", placeholder: "Project name", type: "text" },
        { id: "client_name", label: "Client", placeholder: "Client name", type: "text" },
        { id: "last_updated", label: "Last updated", placeholder: "March 15, 2026", type: "date" },
      ],
    },
    {
      id: "phase_1",
      title: "Phase 1: Discovery",
      fields: [
        {
          id: "phase_1_tasks",
          label: "Tasks",
          placeholder: "",
          type: "rows",
          columns: ["Task", "Owner", "Status", "Due"],
          defaultRows: 4,
        },
      ],
    },
    {
      id: "phase_2",
      title: "Phase 2: Build",
      fields: [
        {
          id: "phase_2_tasks",
          label: "Tasks",
          placeholder: "",
          type: "rows",
          columns: ["Task", "Owner", "Status", "Due"],
          defaultRows: 5,
        },
      ],
    },
    {
      id: "phase_3",
      title: "Phase 3: Launch",
      fields: [
        {
          id: "phase_3_tasks",
          label: "Tasks",
          placeholder: "",
          type: "rows",
          columns: ["Task", "Owner", "Status", "Due"],
          defaultRows: 4,
        },
      ],
    },
    {
      id: "notes",
      title: "Notes",
      fields: [
        { id: "notes", label: "Notes", placeholder: "Additional context, blockers, or dependencies", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  9. Monthly Report
 * ───────────────────────────────────────────── */
const monthlyReport: TemplateConfig = {
  slug: "monthly-report",
  name: "Monthly Report",
  shortDescription: "Recurring report covering work completed, outcomes, blockers, and next priorities",
  badge: "Reporting",
  sections: [
    {
      id: "header",
      title: "Report Details",
      fields: [
        { id: "client_name", label: "Client", placeholder: "Client name", type: "text" },
        { id: "period", label: "Reporting period", placeholder: "March 2026", type: "text" },
        { id: "prepared_by", label: "Prepared by", placeholder: "Your name", type: "text" },
        { id: "date", label: "Date", placeholder: "March 31, 2026", type: "date" },
      ],
    },
    {
      id: "goals",
      title: "Goals This Period",
      fields: [
        { id: "goals", label: "Goals", placeholder: "1. Launch email automation\n2. Reduce manual data entry by 50%\n3. Onboard 3 new team members to system", type: "textarea" },
      ],
    },
    {
      id: "completed",
      title: "Work Completed",
      fields: [
        { id: "completed", label: "Completed work", placeholder: "1. Email automation live and processing 200+ emails/day\n2. CRM integration deployed\n3. Dashboard redesign shipped", type: "textarea" },
      ],
    },
    {
      id: "outcomes",
      title: "Outcomes and Metrics",
      fields: [
        { id: "outcomes", label: "Key outcomes", placeholder: "Manual data entry reduced by 62%\nEmail response time down from 4hr to 15min\nClient satisfaction score: 4.8/5", type: "textarea" },
        {
          id: "metrics_table",
          label: "Metrics",
          placeholder: "",
          type: "rows",
          columns: ["Metric", "Target", "Actual", "Status"],
          defaultRows: 4,
        },
      ],
    },
    {
      id: "blockers",
      title: "Blockers and Risks",
      fields: [
        { id: "blockers", label: "Current blockers", placeholder: "API rate limits on third-party service\nAwaiting client approval on Phase 3 scope", type: "textarea" },
      ],
    },
    {
      id: "next",
      title: "Next Period Priorities",
      fields: [
        { id: "priorities", label: "Upcoming priorities", placeholder: "1. Complete Phase 3 deployment\n2. Performance optimization\n3. Team training sessions", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  10. Feedback Request
 * ───────────────────────────────────────────── */
const feedbackRequest: TemplateConfig = {
  slug: "feedback-request",
  name: "Feedback Request",
  shortDescription: "Post-project feedback form with guided questions and testimonial prompt",
  badge: "Relationship",
  sections: [
    {
      id: "intro",
      title: "Introduction",
      fields: [
        { id: "client_name", label: "Client name", placeholder: "Client name", type: "text" },
        { id: "project_name", label: "Project", placeholder: "Project name", type: "text" },
        { id: "intro_message", label: "Message", placeholder: "Thank you for working with us. Your feedback helps us improve and serve future clients better. We would appreciate a few minutes of your time.", type: "textarea" },
      ],
    },
    {
      id: "questions",
      title: "Feedback Questions",
      fields: [
        { id: "q_experience", label: "How was your overall experience working with us?", placeholder: "Your response", type: "textarea" },
        { id: "q_communication", label: "How would you rate our communication throughout the project?", placeholder: "Your response", type: "textarea" },
        { id: "q_deliverables", label: "Did the deliverables meet your expectations?", placeholder: "Your response", type: "textarea" },
        { id: "q_improve", label: "What could we improve for next time?", placeholder: "Your response", type: "textarea" },
        { id: "q_recommend", label: "Would you recommend us to others? Why or why not?", placeholder: "Your response", type: "textarea" },
      ],
    },
    {
      id: "testimonial",
      title: "Testimonial (Optional)",
      fields: [
        { id: "testimonial", label: "If you are happy with our work, would you be willing to share a short testimonial we can use?", placeholder: "Your testimonial", type: "textarea" },
        { id: "attribution", label: "How should we credit you?", placeholder: "Name, title, company", type: "text" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  11. Thank You Doc
 * ───────────────────────────────────────────── */
const thankYouDoc: TemplateConfig = {
  slug: "thank-you",
  name: "Thank You Doc",
  shortDescription: "Project wrap-up document with delivery summary and next steps",
  badge: "Relationship",
  sections: [
    {
      id: "message",
      title: "Thank You",
      fields: [
        { id: "client_name", label: "Client name", placeholder: "Client name", type: "text" },
        { id: "message", label: "Closing message", placeholder: "Thank you for trusting us with this project. It was a pleasure working together and we are proud of what we built.", type: "textarea" },
      ],
    },
    {
      id: "delivered",
      title: "What Was Delivered",
      fields: [
        { id: "deliverables_summary", label: "Deliverables summary", placeholder: "1. Complete workflow automation system\n2. CRM integration with 3 data sources\n3. Custom dashboard with real-time metrics\n4. Documentation and training materials", type: "textarea" },
      ],
    },
    {
      id: "stay_in_touch",
      title: "Stay in Touch",
      fields: [
        { id: "contact_info", label: "How to reach us", placeholder: "Email: hello@company.com\nWebsite: company.com\nLinkedIn: linkedin.com/company/...", type: "textarea" },
        { id: "support", label: "Ongoing support", placeholder: "Your post-launch support window is active until April 15. Reach out anytime during this period.", type: "textarea" },
      ],
    },
    {
      id: "next",
      title: "What is Next",
      fields: [
        { id: "next_steps", label: "Potential next steps", placeholder: "Phase 2 expansion\nAdditional workflow automations\nTeam training session\nMonthly optimization retainer", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  12. B-Roll Checklist
 * ───────────────────────────────────────────── */
const brollChecklist: TemplateConfig = {
  slug: "broll-checklist",
  name: "B-Roll Checklist",
  shortDescription: "Shot list for video and content production with asset requirements",
  badge: "Creative",
  sections: [
    {
      id: "meta",
      title: "Project Details",
      fields: [
        { id: "project_name", label: "Project", placeholder: "Brand video shoot", type: "text" },
        { id: "shoot_date", label: "Shoot date", placeholder: "March 20, 2026", type: "date" },
        { id: "location", label: "Location", placeholder: "Office, studio, on-site", type: "text" },
      ],
    },
    {
      id: "required",
      title: "Required Shots",
      fields: [
        {
          id: "required_shots",
          label: "Must-have shots",
          placeholder: "",
          type: "rows",
          columns: ["Shot description", "Type", "Notes"],
          defaultRows: 6,
        },
      ],
    },
    {
      id: "optional",
      title: "Nice to Have",
      fields: [
        {
          id: "optional_shots",
          label: "Optional shots",
          placeholder: "",
          type: "rows",
          columns: ["Shot description", "Type", "Notes"],
          defaultRows: 4,
        },
      ],
    },
    {
      id: "delivery",
      title: "Delivery Format",
      fields: [
        { id: "format", label: "File format", placeholder: "MP4, MOV, or ProRes", type: "text" },
        { id: "resolution", label: "Resolution", placeholder: "4K (3840x2160) or 1080p", type: "text" },
        { id: "delivery_method", label: "Delivery method", placeholder: "Google Drive, WeTransfer, or Frame.io", type: "text" },
      ],
    },
    {
      id: "usage",
      title: "Usage Notes",
      fields: [
        { id: "usage_rights", label: "Usage rights", placeholder: "Full commercial use. All footage owned by client.", type: "textarea" },
        { id: "platforms", label: "Intended platforms", placeholder: "Website, Instagram, YouTube, LinkedIn", type: "text" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  13. Creative Brief
 * ───────────────────────────────────────────── */
const creativeBrief: TemplateConfig = {
  slug: "creative-brief",
  name: "Creative Brief",
  shortDescription: "Brief for creative projects covering audience, tone, deliverables, and references",
  badge: "Creative",
  sections: [
    {
      id: "overview",
      title: "Overview",
      fields: [
        { id: "project_name", label: "Project name", placeholder: "Brand refresh campaign", type: "text" },
        { id: "client_name", label: "Client", placeholder: "Client name", type: "text" },
        { id: "date", label: "Date", placeholder: "March 15, 2026", type: "date" },
      ],
    },
    {
      id: "objective",
      title: "Objective",
      fields: [
        { id: "objective", label: "What is the goal of this project?", placeholder: "Increase brand awareness among 25-35 year old professionals in the SaaS space", type: "textarea" },
        { id: "audience", label: "Target audience", placeholder: "Founders and operators at early-stage startups. Tech-savvy, time-constrained, skeptical of marketing fluff.", type: "textarea" },
      ],
    },
    {
      id: "tone",
      title: "Tone and Style",
      fields: [
        { id: "tone", label: "Tone of voice", placeholder: "Professional but approachable. Clear, not clever. Calm confidence.", type: "textarea" },
        { id: "visual_direction", label: "Visual direction", placeholder: "Minimal, dark, premium. Think: dark mode dashboard meets high-end editorial.", type: "textarea" },
        { id: "avoid", label: "What to avoid", placeholder: "Stock photo aesthetic, generic corporate language, bright/playful colors", type: "textarea" },
      ],
    },
    {
      id: "deliverables",
      title: "Deliverables",
      fields: [
        { id: "deliverables", label: "What needs to be created", placeholder: "1. Landing page design (desktop + mobile)\n2. Social media templates (5 variants)\n3. Email header graphics\n4. Brand guidelines update", type: "textarea" },
      ],
    },
    {
      id: "references",
      title: "References",
      fields: [
        { id: "references", label: "Reference links or inspiration", placeholder: "https://example.com - love the typography\nhttps://another.com - similar color palette", type: "textarea" },
        { id: "existing_assets", label: "Existing assets to use", placeholder: "Logo files in shared drive\nBrand colors: #000, #DA4E24, #1F77F6\nFont: Inter", type: "textarea" },
      ],
    },
    {
      id: "timeline",
      title: "Timeline",
      fields: [
        { id: "deadline", label: "Final deadline", placeholder: "April 30, 2026", type: "date" },
        { id: "milestones", label: "Key milestones", placeholder: "First draft: April 10\nRevisions: April 15-20\nFinal delivery: April 30", type: "textarea" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
 *  14. Handoff Notes
 * ───────────────────────────────────────────── */
const handoffNotes: TemplateConfig = {
  slug: "handoff-notes",
  name: "Handoff Notes",
  shortDescription: "Technical and operational handoff document for project transitions",
  badge: "Operations",
  sections: [
    {
      id: "overview",
      title: "Handoff Overview",
      fields: [
        { id: "project_name", label: "Project name", placeholder: "Project name", type: "text" },
        { id: "from", label: "Handing off from", placeholder: "Your name / team", type: "text" },
        { id: "to", label: "Handing off to", placeholder: "Recipient name / team", type: "text" },
        { id: "date", label: "Handoff date", placeholder: "March 15, 2026", type: "date" },
      ],
    },
    {
      id: "summary",
      title: "Project Summary",
      fields: [
        { id: "summary", label: "What was built", placeholder: "Brief summary of what was built and its current state", type: "textarea" },
        { id: "status", label: "Current status", placeholder: "Live in production / Staging / Ready for review", type: "text" },
      ],
    },
    {
      id: "access",
      title: "Access and Credentials",
      fields: [
        { id: "repos", label: "Repositories", placeholder: "GitHub repo URLs and branch information", type: "textarea" },
        { id: "environments", label: "Environments", placeholder: "Production: https://...\nStaging: https://...\nAdmin: https://...", type: "textarea" },
        { id: "credentials_note", label: "Credentials", placeholder: "All credentials shared via 1Password vault named [project-name]", type: "textarea" },
      ],
    },
    {
      id: "architecture",
      title: "Architecture Notes",
      fields: [
        { id: "stack", label: "Tech stack", placeholder: "Next.js, Tailwind, Supabase, Vercel", type: "textarea" },
        { id: "architecture", label: "Key architecture decisions", placeholder: "Document any non-obvious choices and why they were made", type: "textarea" },
        { id: "known_issues", label: "Known issues", placeholder: "List any known bugs, tech debt, or workarounds", type: "textarea" },
      ],
    },
    {
      id: "operations",
      title: "Operational Notes",
      fields: [
        { id: "deployment", label: "Deployment process", placeholder: "Push to main triggers auto-deploy via Vercel", type: "textarea" },
        { id: "monitoring", label: "Monitoring", placeholder: "Error tracking via Sentry. Uptime via Vercel analytics.", type: "textarea" },
        { id: "contacts", label: "Key contacts", placeholder: "Client contact: ...\nHosting support: ...\nAPI provider: ...", type: "textarea" },
      ],
    },
  ],
};

/* ─── Export all templates ─── */

export const templates: TemplateConfig[] = [
  clientAgreement,
  invoice,
  projectBrief,
  discoveryCall,
  welcomeDoc,
  packageMenu,
  deliveryGuide,
  taskList,
  monthlyReport,
  feedbackRequest,
  thankYouDoc,
  brollChecklist,
  creativeBrief,
  handoffNotes,
];

export function getTemplateBySlug(slug: string): TemplateConfig | undefined {
  return templates.find((t) => t.slug === slug);
}
