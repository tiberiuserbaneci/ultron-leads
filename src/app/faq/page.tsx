import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description:
    "Get answers to common questions about Ultron's AI agents, pricing, setup, security, and how the 5-agent system replaces a full growth team for founders.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Ultron",
    description:
      "Get answers to common questions about Ultron's AI agents, pricing, setup, security, and how the 5-agent system replaces a full growth team for founders.",
    url: "/faq",
  },
};

/* ─── FAQ Data ─── */

type FAQItem = { question: string; answer: string };
type FAQSection = { title: string; items: FAQItem[] };

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "General",
    items: [
      {
        question: "What is Ultron?",
        answer:
          "Ultron is an AI-powered growth platform built for founder-led businesses. It deploys 5 specialized AI agents that handle research, lead generation, sales follow-up, content creation, and competitive monitoring — running autonomously 24/7 so founders can focus on strategy instead of execution.",
      },
      {
        question: "Who is Ultron built for?",
        answer:
          "Ultron is designed for founders, solopreneurs, and small teams who need the output of a full growth team without the cost of hiring one. Whether you run an agency, a SaaS company, or a consulting practice, Ultron handles the repetitive work that scales your business.",
      },
      {
        question: "How is Ultron different from ChatGPT or other AI tools?",
        answer:
          "ChatGPT and similar tools are single-purpose — you type a prompt, get a response, and start over. Ultron is a connected system of 5 agents that share context, feed each other data, and execute workflows end-to-end. Instead of managing 8+ separate tools, you get one platform where research informs lead generation, which feeds sales follow-up, which generates content, while monitoring runs in the background.",
      },
      {
        question: "What are the 4 levels of AI automation?",
        answer:
          "Level 1: Copy-paste prompting with ChatGPT (10-15 hours/week wasted). Level 2: Using one AI tool for a single task like writing or lead finding (8-12 hours/week, tools don't connect). Level 3: Multiple agents with manual routing — you become the bottleneck coordinating between tools (6-10 hours/week). Level 4: A fully connected system that runs without you — agents feed each other, revenue compounds, and you spend 2 hours/week reviewing results. Ultron operates at Level 4.",
      },
      {
        question: "Is Ultron fully autonomous?",
        answer:
          "Yes. Once deployed, Ultron's agents run 24/7 across your connected channels including Telegram, WhatsApp, and the Ultron dashboard. You receive alerts and summaries, but the system executes without requiring manual input. In a documented 72-hour period with zero human input, Ultron researched 23 companies, found 12 qualified leads, drafted 8 cold emails, wrote 5 LinkedIn posts, completed 3 competitor analyses, and flagged 2 deal opportunities.",
      },
    ],
  },
  {
    title: "The 5 Agents",
    items: [
      {
        question: "What are the 5 AI agents and what do they do?",
        answer:
          "CORTEX researches your market and ideal customer profile landscape. SPECTER finds and qualifies matching prospects. STRIKER picks up replies, triages your inbox, and moves deals forward. PULSE turns intelligence into authority content. SENTINEL monitors everything and alerts you to opportunities and threats. Together, they replace the work of a full growth team.",
      },
      {
        question: "How do the agents work together?",
        answer:
          "The agents operate as an interconnected system, not isolated tools. CORTEX feeds market research to SPECTER for smarter lead targeting. SPECTER passes qualified leads to STRIKER for outreach. STRIKER's deal insights inform PULSE's content strategy. SENTINEL monitors across all channels and feeds alerts back to every agent. Removing any single agent breaks the chain — for example, without CORTEX, SPECTER targets blindly; without STRIKER, qualified leads go cold.",
      },
      {
        question: "Can I use individual agents instead of the full system?",
        answer:
          "All 5 agents are included in every plan because they are designed to work as a system. Each agent's output becomes another agent's input. Using them individually would be like hiring a sales team but only keeping the researcher — you'd generate insights with no one to act on them.",
      },
      {
        question: "How many agents can I deploy?",
        answer:
          "The Starter and Max plans include the core 5-agent system. The Enterprise plan ($297/month) supports up to 1,000 agents with custom AI skills and white-label deployment — ideal for agencies that want to sell AI automation as a service to their own clients.",
      },
      {
        question: "What does the Agents Map show?",
        answer:
          "The Agents Map breaks down 50+ specialized agent capabilities organized by department — sales, marketing, operations, support, and finance. It shows how all of these capabilities map to Ultron's 5 core agents, including what each replaces, the tools used, and example outputs. You don't need 50 separate agents; Ultron bundles them into 5.",
      },
    ],
  },
  {
    title: "Pricing and Plans",
    items: [
      {
        question: "How much does Ultron cost?",
        answer:
          "Ultron offers three plans. Starter is free and includes 10 conversations per day, planning and evaluation tools, the command center, and integrations. Max is $19/month and adds execution and deployment, Agent Squad access, and unlimited conversations. Enterprise is $297/month and includes custom AI skills, white-label deployment, custom integrations, and support for up to 1,000 agents.",
      },
      {
        question: "What does the $19/month Max plan replace?",
        answer:
          "The Max plan replaces what would typically cost $15,000-$20,000/month in freelancers and SaaS tools. A traditional setup requires 5+ freelancers, 8+ separate software subscriptions, 20+ hours per week of coordination, and 3-6 months to get running. Ultron consolidates all of this into one subscription with a 10-minute setup.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "The Starter plan is free with no credit card required. It includes planning and evaluation tools, the command center, and integrations — enough to see how Ultron works before upgrading. No time limit.",
      },
      {
        question: "What is the ROI of using Ultron?",
        answer:
          "Based on Ultron's revenue model: 20 qualified leads per month from SPECTER, at a 25% close rate driven by STRIKER's follow-ups, yields approximately 5 deals. At an average deal size of $2,000, that produces $10,000/month in revenue from a $19/month investment. Individual results vary based on industry and offer, and you can estimate your specific ROI with the calculator on the site.",
      },
      {
        question: "Can I cancel at any time?",
        answer:
          "Yes. There are no long-term contracts. You can upgrade, downgrade, or cancel your plan at any time.",
      },
    ],
  },
  {
    title: "Setup and Getting Started",
    items: [
      {
        question: "How long does it take to set up Ultron?",
        answer:
          "Deployment takes approximately 10 minutes. The process has 3 steps: talk to Ultron about your business, connect your apps and channels, and Ultron begins executing 24/7. No technical expertise is required.",
      },
      {
        question: "What tools and platforms does Ultron integrate with?",
        answer:
          "Ultron connects to your existing tools and channels including Telegram, WhatsApp, email, CRMs, and the Ultron dashboard. The Enterprise plan supports custom integrations for specific workflows and proprietary systems.",
      },
      {
        question: "Do I need technical skills to use Ultron?",
        answer:
          "No. Ultron is designed for founders, not engineers. The setup is conversational — you describe your business, your ideal customers, and your goals. Ultron handles the rest. The Automation Assessment quiz on the site can help you identify where AI agents will have the highest impact for your specific business.",
      },
      {
        question: "What is the Automation Assessment?",
        answer:
          "It's a 10-question evaluation that identifies where manual work is costing you time and deals. Most founders score between 2 and 4 out of 10 before using Ultron. Max plan users typically score 8 or higher. The assessment pinpoints exactly where AI agents will make the biggest difference.",
      },
    ],
  },
  {
    title: "Features and Capabilities",
    items: [
      {
        question: "What is the Agent Blueprint?",
        answer:
          "The Agent Blueprint is a detailed breakdown of how Ultron's 5-agent system works, including each agent's role, interdependencies, and a direct cost comparison between a traditional team ($20,000/month) and Ultron ($19/month). It shows exactly what breaks when any single agent is removed from the system.",
      },
      {
        question: "What is the Command Center?",
        answer:
          "The Command Center (also called Brain) is Ultron's dashboard where you monitor all agent activity in real time. It displays agent status, revenue impact, pipeline funnels, task distribution, content performance, outreach metrics, competitor tracking, and system health — all in one view. It's available on all plans.",
      },
      {
        question: "What is the Client Engine?",
        answer:
          "The Client Engine is a growth engine simulator that shows how Ultron's system architecture maps to your specific business. It models different engine types with customizable parameters — including whether you want to use Ultron for your own business or sell it as a service to clients. It projects outcomes across week 1, month 1, and quarter 1 timelines.",
      },
      {
        question: "What resources are included?",
        answer:
          "Ultron includes a resource library with 12 production-ready Claude skills, visual cheatsheets for AI prompt engineering, 14 professional client templates (agreements, invoices, briefs, reports), an RFP builder for defining automation scopes, and a ROI calculator. All resources are free to access.",
      },
      {
        question: "What is the RFP Builder?",
        answer:
          "The RFP Builder is a structured 7-section intake form for defining AI workflow scopes. It covers routing, business context, build requirements, tech stack, workflow design, delivery expectations, and a review checklist. It's useful for agencies scoping automation projects for clients.",
      },
    ],
  },
  {
    title: "Results and Performance",
    items: [
      {
        question: "What results can I expect in the first 72 hours?",
        answer:
          "In a documented 72-hour run with zero human input, one business saw: 23 companies researched, 12 qualified leads found, 8 cold emails drafted, 5 LinkedIn posts written, 3 competitor analyses completed, 2 deal opportunities flagged, and 1 security audit completed. Results vary by industry, but the system begins producing output immediately after deployment.",
      },
      {
        question: "How much time will I save?",
        answer:
          "Max plan users report getting approximately 20 hours per week back. At Level 4 automation, you spend roughly 2 hours per week reviewing results instead of 20+ hours executing tasks manually. The system handles research, lead generation, outreach, content creation, and monitoring without your involvement.",
      },
      {
        question: "How many founders use Ultron?",
        answer:
          "Over 2,500 founders use Ultron, with more than 12,800 agents deployed and 89,600+ tasks completed across the platform.",
      },
      {
        question: "What happens if my competitors use AI and I do not?",
        answer:
          "The gap compounds over time. In a modeled quarter, a competitor using AI automation generates 47 leads, closes 12 deals, and publishes 60 pieces of content — while a founder doing everything manually closes 3 deals and publishes 8 posts. The difference is not talent, funding, or time. It is infrastructure.",
      },
    ],
  },
  {
    title: "Enterprise and Agencies",
    items: [
      {
        question: "What does the Enterprise plan include?",
        answer:
          "The Enterprise plan ($297/month) includes everything in Max plus custom AI skills tailored to your business, white-label deployment so you can offer Ultron under your own brand, custom integrations with proprietary systems, and support for up to 1,000 agents. It's built for agencies and larger operations.",
      },
      {
        question: "Can I sell Ultron's automation to my own clients?",
        answer:
          "Yes. The Enterprise plan supports white-label deployment, meaning you can deploy Ultron-powered automation under your own brand for your clients. The Client Engine includes a dedicated mode for modeling this as a revenue stream, and the RFP Builder helps you scope client projects.",
      },
      {
        question: "How do I contact sales for custom requirements?",
        answer:
          "Visit the Contact Sales page to discuss enterprise agreements, rate limit increases, business associate agreements, zero data retention options, monthly invoicing, or product support. You can also schedule a direct call through the enterprise scheduling link on the contact page.",
      },
    ],
  },
  {
    title: "Security and Privacy",
    items: [
      {
        question: "How does Ultron handle my data?",
        answer:
          "Ultron takes data privacy seriously. Full details are available in the Privacy Policy on the site. Enterprise customers can request zero data retention agreements and business associate agreements through the Contact Sales page.",
      },
      {
        question: "Is there a privacy policy and terms of service?",
        answer:
          "Yes. Both the Privacy Policy and Terms & Conditions are available on the site and linked in the footer of every page. They cover data handling, usage terms, and your rights as a user.",
      },
    ],
  },
];

/* Flatten all Q&A for JSON-LD */
const allFAQs = FAQ_SECTIONS.flatMap((s) => s.items);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFAQs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

/* ─── Page Component ─── */

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#999] text-lg">
            Everything you need to know about Ultron, the 5-agent system, pricing, and getting started.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-16">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-white mb-8 pb-3 border-b border-[#222]">
                {section.title}
              </h2>
              <div className="space-y-8">
                {section.items.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-[15px] font-medium text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-[15px] text-[#999] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 pt-10 border-t border-[#222] text-center">
          <p className="text-[#999] text-sm mb-4">
            Still have questions?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-6 py-2 hover:border-[#555] transition-colors"
            >
              Contact Sales
            </Link>
            <Link
              href="/assess"
              className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-6 py-2 hover:bg-[#DA4E24]/10 transition-colors"
            >
              Take the Assessment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
