"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Shared cell component ─── */
function Cell({ children, highlight, className = "" }: { children: React.ReactNode; highlight?: boolean; className?: string }) {
  return (
    <td className={`px-4 py-3 text-[13px] leading-relaxed ${highlight ? "text-[#ddd]" : "text-[#999]"} ${className}`}>
      {children}
    </td>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal text-left">
      {children}
    </th>
  );
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-[11px] font-semibold text-[#777] uppercase tracking-wider font-terminal whitespace-nowrap align-top">
      {children}
    </td>
  );
}

/* ─── Accent tag ─── */
function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`inline-block text-[11px] font-terminal px-2 py-0.5 rounded border ${
      accent ? "border-[#DA4E24]/30 text-[#DA4E24] bg-[#DA4E24]/5" : "border-[#1a1a1a] text-[#555]"
    }`}>
      {children}
    </span>
  );
}

/* ─── Yes/Feature tag ─── */
function Yes({ children, note }: { children?: React.ReactNode; note?: string }) {
  return (
    <span className="text-[13px] text-[#ddd]">
      {children || "Yes"}
      {note && <span className="text-[#777]">. {note}</span>}
    </span>
  );
}

/* ─── Vibe card ─── */
function VibeCard({
  name,
  color,
  skill,
  quality,
  vibe,
}: {
  name: string;
  color: string;
  skill: string;
  quality: string;
  vibe: string;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#333] transition-colors">
      <h4 className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        {name}
      </h4>
      <div className="space-y-2.5">
        <div>
          <span className="text-[11px] font-terminal text-[#666] uppercase tracking-wider">The skill you need</span>
          <p className="text-[13px] text-[#ccc] mt-0.5">{skill}</p>
        </div>
        <div>
          <span className="text-[11px] font-terminal text-[#666] uppercase tracking-wider">Output quality</span>
          <p className="text-[13px] text-[#ccc] mt-0.5">{quality}</p>
        </div>
        <div>
          <span className="text-[11px] font-terminal text-[#666] uppercase tracking-wider">The vibe</span>
          <p className="text-[13px] text-[#DA4E24] mt-0.5 font-medium">{vibe}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── When-to-use card ─── */
function WhenCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
      <h4 className="text-[13px] font-bold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-[12px] text-[#999] flex items-start gap-2">
            <span className="text-[#DA4E24] mt-0.5 flex-shrink-0">&#8226;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Section divider ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="h-px flex-1 bg-[#1a1a1a]" />
      <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest font-terminal">{children}</span>
      <div className="h-px flex-1 bg-[#1a1a1a]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════
 *  MAIN CHEATSHEET
 * ═══════════════════════════════════════════════ */
export default function CodeVsCoworkVsProjects() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* ── Hero ── */}
        <div className={`text-center mb-12 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#555] mb-6 font-terminal">
            <Link href="/cheatsheets" className="hover:text-[#999] transition-colors">cheatsheets</Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#DA4E24]">code-vs-cowork-vs-projects</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Claude: Code vs Cowork vs Projects
          </h1>
          <p className="text-[15px] text-[#999] max-w-xl mx-auto leading-relaxed">
            Same AI. Three different ways to use it. Here is how to pick.
          </p>

          <div className="flex items-center justify-center gap-3 mt-5">
            <Tag accent>Pro Plan required</Tag>
            <Tag>Print friendly</Tag>
          </div>
        </div>

        {/* ── Quick Overview Table ── */}
        <div className={`transition-all duration-500 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="w-[120px]" />
                    <HeaderCell>Code</HeaderCell>
                    <HeaderCell>Cowork</HeaderCell>
                    <HeaderCell>Projects</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#111]">
                    <RowLabel>What it is</RowLabel>
                    <Cell highlight>You describe what you want built. Claude Code builds it. Like a technical assistant on your team.</Cell>
                    <Cell highlight>Claude sits on your desktop. It reads your files, creates new ones.</Cell>
                    <Cell highlight>A saved workspace. You upload your stuff once, Claude remembers it.</Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Access</RowLabel>
                    <Cell>Your browser, desktop app, or code editor (VS Code, etc.)</Cell>
                    <Cell>Desktop app only (click the Cowork tab)</Cell>
                    <Cell>Browser, phone, or desktop app</Cell>
                  </tr>
                  <tr>
                    <RowLabel>Setup</RowLabel>
                    <Cell>~5 minutes. Install the app, log in, and start building.</Cell>
                    <Cell>~10 minutes. Download app, pick a folder, add your files.</Cell>
                    <Cell>~5 minutes. Create a project, upload files, write instructions.</Cell>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── The Real Difference ── */}
        <SectionLabel>The real difference</SectionLabel>

        <div className={`grid sm:grid-cols-3 gap-4 transition-all duration-500 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <VibeCard
            name="Code"
            color="#DA4E24"
            skill="Describe clearly what you want built"
            quality="Extremely high. Because it sees your whole project and can run things itself."
            vibe="Having a developer who builds what you describe"
          />
          <VibeCard
            name="Cowork"
            color="#DA4E24"
            skill="Clear context files (your style, your rules, your examples)"
            quality="Sounds like you. Because it read your files."
            vibe="Working with an assistant who read every brief"
          />
          <VibeCard
            name="Projects"
            color="#DA4E24"
            skill="Picking the right files and clear instructions"
            quality="Sounds like you. Because it has your guides."
            vibe="A team member who knows your playbook"
          />
        </div>

        {/* ── Feature Comparison Grid ── */}
        <SectionLabel>What it can do</SectionLabel>

        <div className={`transition-all duration-500 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="w-[200px]" />
                    <HeaderCell>Code</HeaderCell>
                    <HeaderCell>Cowork</HeaderCell>
                    <HeaderCell>Projects</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Answer questions</RowLabel>
                    <Cell><Yes /></Cell>
                    <Cell><Yes /></Cell>
                    <Cell><Yes /></Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Create real files</RowLabel>
                    <Cell><Yes note="Saves files directly into your project folder" /></Cell>
                    <Cell><Yes note="Files appear in your folders, ready to open" /></Cell>
                    <Cell><Yes note="Files can be saved or downloaded" /></Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Build interactive things</RowLabel>
                    <Cell><Yes note="Not just previews. It builds real apps you can run" /></Cell>
                    <Cell><Yes note="Via Artifacts" /></Cell>
                    <Cell><Yes note="Via Artifacts" /></Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Use plugins</RowLabel>
                    <Cell><Yes note="Connect any tool with add-ons" /></Cell>
                    <Cell><Yes note="Install from a library. Use slash commands" /></Cell>
                    <Cell><span className="text-[13px] text-[#555]">No</span></Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Connect to tools</RowLabel>
                    <Cell><Yes note="Connects to Jira, GitHub, Slack, and more" /></Cell>
                    <Cell><Yes /></Cell>
                    <Cell><Yes /></Cell>
                  </tr>
                  <tr className="border-b border-[#111]">
                    <RowLabel>Search the internet</RowLabel>
                    <Cell><Yes /></Cell>
                    <Cell><Yes /></Cell>
                    <Cell><Yes /></Cell>
                  </tr>
                  <tr>
                    <RowLabel>Extended Thinking</RowLabel>
                    <Cell><Yes note="On by default" /></Cell>
                    <Cell><Yes note="On by default" /></Cell>
                    <Cell><Yes note="You turn it on manually" /></Cell>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── When to Use ── */}
        <SectionLabel>When to use each</SectionLabel>

        <div className="grid sm:grid-cols-3 gap-4">
          <WhenCard
            title="Use Code when..."
            color="#DA4E24"
            items={[
              "You want to build software or a website",
              "You want Claude to write and save code",
              "You need changes across many files at once",
              "You want help publishing project updates",
              "You need long, hands-free building sessions",
            ]}
          />
          <WhenCard
            title="Use Cowork when..."
            color="#DA4E24"
            items={[
              "You are doing real work (analysis, spreadsheets)",
              "You want Claude to create actual files",
              "You want it to sound like you",
              "You need long, deep sessions that do not break",
            ]}
          />
          <WhenCard
            title="Set up a Project when..."
            color="#DA4E24"
            items={[
              "You do the same task every week (newsletter, reports)",
              "You are tired of repeating yourself",
              "You want your context saved forever, not just for one session",
            ]}
          />
        </div>

        {/* ── Context Comparison ── */}
        <SectionLabel>How context works</SectionLabel>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="w-[160px]" />
                  <HeaderCell>Code</HeaderCell>
                  <HeaderCell>Cowork</HeaderCell>
                  <HeaderCell>Projects</HeaderCell>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#111]">
                  <RowLabel>Your identity</RowLabel>
                  <Cell>You write a short instructions file in your project. Claude reads it every time.</Cell>
                  <Cell>Yes, if you put info about yourself in text files inside your folder.</Cell>
                  <Cell>Yes, from the files and instructions you added to the project.</Cell>
                </tr>
                <tr className="border-b border-[#111]">
                  <RowLabel>Context input</RowLabel>
                  <Cell>Your instructions file + your entire project. Claude reads it all automatically.</Cell>
                  <Cell>You write .md or .txt files once. Drop them in a folder. Point Claude to it.</Cell>
                  <Cell>You upload files and write instructions once. They stick.</Cell>
                </tr>
                <tr>
                  <RowLabel>Context between chats</RowLabel>
                  <Cell>Your project instructions stay. You can also resume where you left off.</Cell>
                  <Cell>Yes, as long as you are in the same folder.</Cell>
                  <Cell>Yes. Every new chat inside the project has it.</Cell>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Bottom Summary ── */}
        <SectionLabel>Quick picks</SectionLabel>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#DA4E24] flex-shrink-0" />
            <div>
              <p className="text-[12px] text-[#777]">Building software</p>
              <p className="text-[14px] font-semibold text-white">Code</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#DA4E24] flex-shrink-0" />
            <div>
              <p className="text-[12px] text-[#777]">Deep working sessions</p>
              <p className="text-[14px] font-semibold text-white">Cowork</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#DA4E24] flex-shrink-0" />
            <div>
              <p className="text-[12px] text-[#777]">Recurring work</p>
              <p className="text-[14px] font-semibold text-white">Projects or Cowork</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 text-center">
          <p className="text-[14px] text-[#ccc] leading-relaxed">
            All three need a <strong className="text-white">Pro Plan ($20/mo)</strong>.
            Cowork is desktop only.
            Extended Thinking works everywhere. Always turn it on.
          </p>
        </div>

        {/* ── Cross-links ── */}
        <div className="grid sm:grid-cols-3 gap-3 mt-10">
          {[
            { label: "Browse all cheatsheets", href: "/cheatsheets" },
            { label: "Scope a workflow", href: "/rfp" },
            { label: "Client document templates", href: "/client-kit" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between gap-2 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl hover:border-[#333] hover:bg-[#111] transition-all group text-sm text-[#999] hover:text-white"
            >
              <span>{link.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-[#333] group-hover:text-[#DA4E24] transition-colors">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
