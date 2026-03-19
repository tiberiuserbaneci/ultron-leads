"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";

/* ═══════════════════════════════════════════════════════════
 *  INFOGRAPHIC: Chat vs Cowork vs Projects
 *  Matches the reference layout exactly:
 *  - Warm beige background (#F5EDE3)
 *  - Terracotta/burnt orange accent (#C0462B)
 *  - Light cards, dark text
 *  - Editorial poster layout
 * ═══════════════════════════════════════════════════════════ */

const BG = "#F5EDE3";
const CARD = "#FFFFFF";
const ACCENT = "#C0462B";
const ACCENT_BG = "#C0462B";
const ACCENT_LIGHT = "rgba(192,70,43,0.08)";
const BORDER = "#E0D5C9";
const TEXT = "#2A2A2A";
const MUTED = "#7A7268";
const COWORK_BG = "#C0462B";
const COWORK_TEXT = "#FFFFFF";

export default function ChatVsCoworkVsProjects() {
  const ref = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { pixelRatio: 2, backgroundColor: BG });
    const link = document.createElement("a");
    link.download = "chat-vs-cowork-vs-projects.png";
    link.href = dataUrl;
    link.click();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>

      {/* Utility bar */}
      <div className="fixed top-0 left-0 right-0 z-50 print:hidden" style={{ background: `${BG}ee`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-[960px] mx-auto px-4 h-11 flex items-center justify-between">
          <Link href="/cheatsheets" className="text-[12px] hover:opacity-70 transition-opacity flex items-center gap-1.5" style={{ color: MUTED }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Cheatsheets
          </Link>
          <button onClick={handleDownload} className="text-[11px] px-2.5 py-1 rounded-md border transition-all flex items-center gap-1.5" style={{ borderColor: ACCENT, color: ACCENT }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            Download
          </button>
        </div>
      </div>

      {/* ═══ THE INFOGRAPHIC ═══ */}
      <div className="max-w-[960px] mx-auto pt-14 pb-4 px-4 print:pt-0 print:pb-0 print:px-0 print:max-w-none">
        <div ref={ref} id="infographic" className="overflow-hidden" style={{ background: BG }}>

          {/* ── HEADER ── */}
          <div className="text-center pt-6 pb-4 px-6">
            {/* Starburst icon */}
            <div className="flex items-center justify-center gap-3 mb-1">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={i} x1="22" y1="22" x2={22 + 18 * Math.cos((i * 30 * Math.PI) / 180)} y2={22 + 18 * Math.sin((i * 30 * Math.PI) / 180)} stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
                ))}
              </svg>
              <h1 className="text-[32px] font-bold tracking-tight" style={{ color: TEXT }}>
                Claude: Chat vs Cowork vs Projects
              </h1>
            </div>
            <p className="text-[15px]" style={{ color: MUTED }}>
              Same AI. Three different ways to use it. Here&apos;s how to pick:
            </p>
          </div>

          {/* ── QUICK OVERVIEW TABLE ── */}
          <div className="mx-6 mb-4 rounded-xl border overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
            {/* Column headers */}
            <div className="grid grid-cols-[100px_1fr_1fr_1fr]">
              <div />
              <div className="px-4 py-2.5 text-center border-l" style={{ borderColor: BORDER }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border" style={{ borderColor: BORDER, color: TEXT }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  Chat
                </span>
              </div>
              <div className="px-4 py-2.5 text-center border-l" style={{ borderColor: BORDER }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-white" style={{ background: ACCENT_BG }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                  Cowork
                </span>
              </div>
              <div className="px-4 py-2.5 text-center border-l" style={{ borderColor: BORDER }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border" style={{ borderColor: BORDER, color: TEXT }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
                  Projects
                </span>
              </div>
            </div>

            {/* Rows */}
            {[
              ["What it is:", "You type, Claude answers. Like a chatbot.", "Claude sits on your desktop. It reads your files, creates new ones.", "A saved workspace. You upload your stuff once, Claude remembers it."],
              ["Access:", "Browser, phone, or desktop app.", "Desktop app only (click the Cowork tab)", "Browser, phone, or desktop app."],
              ["Setup:", "Zero. Open and start typing.", "~10 minutes. Download app, pick a folder, add your files.", "~5 minutes. Create a project, upload files, write instructions."],
            ].map(([label, chat, cowork, projects], i) => (
              <div key={i} className="grid grid-cols-[100px_1fr_1fr_1fr] border-t" style={{ borderColor: BORDER }}>
                <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>{label}</div>
                <div className="px-4 py-3 text-[12px] border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT }}>{chat}</div>
                <div className="px-4 py-3 text-[12px] border-l leading-relaxed" style={{ borderColor: BORDER, background: i === 0 ? ACCENT_LIGHT : undefined, color: TEXT }}>
                  {i === 0 || i === 1 || i === 2 ? <span style={i === 1 || i === 2 ? { color: ACCENT_BG, fontWeight: 500 } : undefined}>{cowork}</span> : cowork}
                </div>
                <div className="px-4 py-3 text-[12px] border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT }}>{projects}</div>
              </div>
            ))}
          </div>

          {/* ── TWO-COLUMN: Real Difference + Feature Grid ── */}
          <div className="mx-6 mb-4 grid grid-cols-[260px_1fr] gap-4">

            {/* Left column: The Real Difference */}
            <div className="flex gap-2">
              {/* Vertical label - sits in its own column, no overlap */}
              <div className="flex items-center justify-center shrink-0" style={{ writingMode: "vertical-rl" }}>
                <span className="rotate-180 text-[11px] font-bold uppercase tracking-widest px-1.5 py-2 rounded" style={{ color: COWORK_TEXT, background: ACCENT_BG }}>The real difference</span>
              </div>

              <div className="flex-1 grid grid-rows-3 gap-3">
                {/* Chat */}
                <div className="rounded-lg border p-3.5 flex flex-col" style={{ borderColor: BORDER, background: CARD }}>
                  <p className="text-[12px] font-bold mb-2" style={{ color: TEXT }}>Chat:</p>
                  <div className="space-y-1 text-[11px] flex-1" style={{ color: TEXT }}>
                    <p><strong>The skill you need:</strong> clear prompts</p>
                    <p><strong>Output quality:</strong> generic unless you prompt very well</p>
                    <p><strong>The vibe:</strong> texting a very smart stranger</p>
                  </div>
                </div>

                {/* Cowork */}
                <div className="rounded-lg p-3.5 flex flex-col" style={{ background: ACCENT_BG, color: COWORK_TEXT }}>
                  <p className="text-[12px] font-bold mb-2">Cowork:</p>
                  <div className="space-y-1 text-[11px] flex-1">
                    <p><strong>The skill you need:</strong> clear context files (your style, your rules, your examples)</p>
                    <p><strong>Output quality:</strong> sounds like you. Because it read your files.</p>
                    <p><strong>The vibe:</strong> working with an assistant who read every brief</p>
                  </div>
                </div>

                {/* Projects */}
                <div className="rounded-lg border p-3.5 flex flex-col" style={{ borderColor: BORDER, background: CARD }}>
                  <p className="text-[12px] font-bold mb-2" style={{ color: TEXT }}>Projects:</p>
                  <div className="space-y-1 text-[11px] flex-1" style={{ color: TEXT }}>
                    <p><strong>The skill you need:</strong> picking the right files and clear instructions</p>
                    <p><strong>Output quality:</strong> sounds like you. Because it has your guides.</p>
                    <p><strong>The vibe:</strong> a team member who knows your playbook</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Feature Grid */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] text-[11px]">
                {/* Header */}
                <div className="px-3 py-2 font-bold text-[11px]" style={{ color: MUTED }}>What it can do:</div>
                <div className="px-3 py-2 font-bold text-center border-l" style={{ borderColor: BORDER, color: TEXT }}>Chat</div>
                <div className="px-3 py-2 font-bold text-center border-l text-white" style={{ borderColor: BORDER, background: ACCENT_BG }}>Cowork</div>
                <div className="px-3 py-2 font-bold text-center border-l" style={{ borderColor: BORDER, color: TEXT }}>Projects</div>

                {/* Rows */}
                {[
                  ["Answer questions", "Yes", "Yes", "Yes"],
                  ["Create real files (Excel, Word, Slides, PDF)", "Yes. Files can be saved or downloaded", "Yes. Files appear in your folders, ready to open.", "Yes. Files can be saved or downloaded"],
                  ["Build interactive things (calculators, trackers, charts)", "Yes, via Artifacts", "Yes, via Artifacts", "Yes, via Artifacts"],
                  ["Use plugins (extra skills for sales, marketing, data)", "No", "Yes, install from a library. Use slash commands.", "No"],
                  ["Connect to your tools (Slack, Google Drive, Notion)", "Yes", "Yes", "Yes"],
                  ["Search the internet", "Yes", "Yes", "Yes"],
                  ["Think before answering (Extended Thinking)", "Yes, you turn it on manually", "On by default", "Yes, you turn it on manually"],
                ].map(([label, chat, cowork, projects], i) => (
                  <div key={i} className="contents">
                    <div className="px-3 py-2 border-t leading-relaxed" style={{ borderColor: BORDER, color: MUTED }}>{label}</div>
                    <div className="px-3 py-2 border-t border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT, fontWeight: chat.startsWith("Yes") ? 500 : 400 }}>{chat}</div>
                    <div className="px-3 py-2 border-t border-l leading-relaxed" style={{ borderColor: BORDER, background: ACCENT_LIGHT, color: cowork.startsWith("Yes") || cowork.startsWith("On") ? ACCENT_BG : TEXT, fontWeight: 500 }}>{cowork}</div>
                    <div className="px-3 py-2 border-t border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT, fontWeight: projects.startsWith("Yes") ? 500 : 400 }}>{projects}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── WHEN TO USE ── */}
          <div className="mx-6 mb-4 grid grid-cols-3 gap-4">
            {/* Chat */}
            <div className="rounded-lg border p-4" style={{ borderColor: BORDER, background: CARD }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: TEXT }}>Start with Chat if...</p>
              <ul className="space-y-1 text-[11px]" style={{ color: TEXT }}>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You have a quick question.</li>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You want to brainstorm.</li>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You don&apos;t need it to know your style.</li>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You want an answer, fast.</li>
              </ul>
            </div>
            {/* Cowork */}
            <div className="rounded-lg p-4" style={{ background: ACCENT_BG, color: COWORK_TEXT }}>
              <p className="text-[11px] font-bold mb-2">Use Cowork when..</p>
              <ul className="space-y-1 text-[11px]">
                <li className="flex gap-2"><span>&#8226;</span>You&apos;re doing real work (analysis, spreadsheets).</li>
                <li className="flex gap-2"><span>&#8226;</span>You want Claude to create actual files.</li>
                <li className="flex gap-2"><span>&#8226;</span>You want it to sounds like you, not AI.</li>
                <li className="flex gap-2"><span>&#8226;</span>You need long, deep sessions that don&apos;t break.</li>
              </ul>
            </div>
            {/* Projects */}
            <div className="rounded-lg border p-4" style={{ borderColor: BORDER, background: CARD }}>
              <p className="text-[11px] font-bold mb-2" style={{ color: TEXT }}>Set up a Project when..</p>
              <ul className="space-y-1 text-[11px]" style={{ color: TEXT }}>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You do the same task every week (newsletter, reports).</li>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You&apos;re tired of repeating yourself.</li>
                <li className="flex gap-2"><span style={{ color: ACCENT }}>&#8226;</span>You want your context saved forever, not just for one session.</li>
              </ul>
            </div>
          </div>

          {/* ── CONTEXT TABLE ── */}
          <div className="mx-6 mb-4 rounded-xl border overflow-hidden" style={{ borderColor: BORDER, background: CARD }}>
            <div className="grid grid-cols-[120px_1fr_1fr_1fr] text-[11px]">
              <div />
              <div className="px-3 py-2 font-bold text-center border-l" style={{ borderColor: BORDER, color: TEXT }}>CHAT</div>
              <div className="px-3 py-2 font-bold text-center border-l text-white" style={{ borderColor: BORDER, background: ACCENT_BG }}>COWORK</div>
              <div className="px-3 py-2 font-bold text-center border-l" style={{ borderColor: BORDER, color: TEXT }}>PROJECTS</div>

              {[
                ["YOUR IDENTITY", "No. Every chat starts blank.", "Yes, if you put info about yourself in text files inside your folder.", "Yes, from the files and instructions you added to the project."],
                ["CONTEXT INPUT", "You copy-paste into the chat. Every. Single. Time.", "You write .md or .txt files once. Drop them in a folder. Point Claude to it.", "You upload files and write instructions once. They stick."],
                ["CONTEXT BETWEEN CHATS", "No. Gone when you start a new chat.", "Yes, as long as you're in the same folder.", "Yes. Every new chat inside the project has it."],
              ].map(([label, chat, cowork, projects], i) => (
                <div key={i} className="contents">
                  <div className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider border-t" style={{ borderColor: BORDER, color: MUTED }}>{label}</div>
                  <div className="px-3 py-2.5 border-t border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT }}>{chat}</div>
                  <div className="px-3 py-2.5 border-t border-l leading-relaxed" style={{ borderColor: BORDER, background: ACCENT_LIGHT, color: ACCENT_BG, fontWeight: 500 }}>{cowork}</div>
                  <div className="px-3 py-2.5 border-t border-l leading-relaxed" style={{ borderColor: BORDER, color: TEXT }}>{projects}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="mx-6 mb-4 grid grid-cols-[220px_1fr] gap-4">
            {/* Quick picks */}
            <div className="rounded-xl p-4 space-y-2" style={{ background: ACCENT_BG, color: COWORK_TEXT }}>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(255,255,255,0.2)" }}>&#9993;</span>
                <span className="text-[12px]"><strong>Quick tasks:</strong> Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(255,255,255,0.2)" }}>&#9881;</span>
                <span className="text-[12px]"><strong>Deep sessions:</strong> Cowork</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]" style={{ background: "rgba(255,255,255,0.2)" }}>&#8634;</span>
                <span className="text-[12px]"><strong>Recurring work:</strong> Projects or Cowork</span>
              </div>
            </div>

            {/* Pro Plan note */}
            <div className="rounded-xl border p-4 flex items-center" style={{ borderColor: BORDER, background: CARD }}>
              <p className="text-[14px] leading-relaxed" style={{ color: TEXT }}>
                Claude Cowork and Projects both need a <strong>Pro Plan ($20/mo)</strong>. Cowork is desktop only. Extended thinking works everywhere - always turn it on.
              </p>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="mx-6 pb-5 flex items-center justify-between">
            <p className="text-[11px]" style={{ color: MUTED }}>
              to download more infographics, go to <strong style={{ color: TEXT }}>work.51ultron.com/cheatsheets</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
