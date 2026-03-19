"use client";

import { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
 *  INFOGRAPHIC: Code vs Cowork vs Projects
 *  Designed as a single-page visual poster for PDF/screenshot
 * ═══════════════════════════════════════════════════════ */

export default function CodeVsCoworkVsProjects() {
  const [showUI, setShowUI] = useState(true);

  return (
    <div className="min-h-screen bg-black">

      {/* ── Utility bar (hidden in print and screenshot mode) ── */}
      {showUI && (
        <div className="fixed top-0 left-0 right-0 z-50 print:hidden bg-black/90 border-b border-[#1a1a1a] backdrop-blur-md">
          <div className="max-w-[1100px] mx-auto px-4 h-11 flex items-center justify-between">
            <Link href="/cheatsheets" className="text-[12px] text-[#666] hover:text-white transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Cheatsheets
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowUI(false)} className="text-[11px] px-2.5 py-1 rounded-md border border-[#DA4E24]/30 text-[#DA4E24] hover:bg-[#DA4E24]/10 transition-all">
                Screenshot mode
              </button>
              <button onClick={() => window.print()} className="text-[11px] px-2.5 py-1 rounded-md border border-[#222] text-[#666] hover:text-white hover:border-[#333] transition-all">
                Print / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Escape screenshot mode ── */}
      {!showUI && (
        <button
          onClick={() => setShowUI(true)}
          className="fixed top-3 right-3 z-50 print:hidden text-[10px] px-2 py-1 rounded bg-[#111] border border-[#222] text-[#555] hover:text-white transition-colors"
        >
          Exit screenshot mode
        </button>
      )}

      {/* ═══════════════════════════════════════════
       *  THE INFOGRAPHIC
       * ═══════════════════════════════════════════ */}
      <div className={`max-w-[1100px] mx-auto px-6 ${showUI ? "pt-16" : "pt-6"} pb-6 print:pt-0 print:pb-0 print:px-0 print:max-w-none`}>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden print:border-0 print:rounded-none" id="infographic">

          {/* ── HEADER ── */}
          <div className="px-8 pt-7 pb-5 border-b border-[#1a1a1a] text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#DA4E24]/10 border border-[#DA4E24]/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>
              </div>
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-white">
              Claude: Code vs Cowork vs Projects
            </h1>
            <p className="text-[14px] text-[#888] mt-1">
              Same AI. Three different ways to use it. Here is how to pick.
            </p>
          </div>

          {/* ── QUICK OVERVIEW ── */}
          <div className="px-8 py-5 border-b border-[#1a1a1a]">
            <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-0 text-[12px]">
              {/* Header row */}
              <div />
              <div className="px-3 py-2 text-center"><span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">Code</span></div>
              <div className="px-3 py-2 text-center"><span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">Cowork</span></div>
              <div className="px-3 py-2 text-center"><span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">Projects</span></div>

              {/* What it is */}
              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal flex items-start">What it is</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">You describe what you want built. Claude Code builds it. Like a technical assistant on your team.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Claude sits on your desktop. It reads your files and creates new ones.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">A saved workspace. You upload your stuff once, Claude remembers it.</div>

              {/* Access */}
              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal flex items-start">Access</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">Browser, desktop app, or code editor</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">Desktop app only (Cowork tab)</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">Browser, phone, or desktop app</div>

              {/* Setup */}
              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal flex items-start">Setup</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">~5 min. Install, log in, start building.</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">~10 min. Download, pick a folder, add files.</div>
              <div className="px-3 py-2.5 text-[#999] border-t border-[#111]">~5 min. Create a project, upload files.</div>
            </div>
          </div>

          {/* ── TWO-COLUMN: The Real Difference + Feature Grid ── */}
          <div className="grid grid-cols-[280px_1fr] border-b border-[#1a1a1a]">

            {/* Left: The Real Difference */}
            <div className="border-r border-[#1a1a1a] px-5 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-0.5 h-4 bg-[#DA4E24] rounded-full" />
                <span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">The real difference</span>
              </div>

              {/* Code */}
              <div className="mb-4 bg-[#111] border border-[#1a1a1a] rounded-lg p-3.5">
                <p className="text-[12px] font-bold text-white mb-2">Code</p>
                <div className="space-y-1.5 text-[11px]">
                  <p><span className="text-[#666]">Skill needed:</span> <span className="text-[#ccc]">describe clearly what you want built</span></p>
                  <p><span className="text-[#666]">Output:</span> <span className="text-[#ccc]">extremely high. It sees your whole project and runs things itself.</span></p>
                  <p><span className="text-[#666]">The vibe:</span> <span className="text-[#DA4E24]">a developer who builds what you describe</span></p>
                </div>
              </div>

              {/* Cowork */}
              <div className="mb-4 bg-[#111] border border-[#1a1a1a] rounded-lg p-3.5">
                <p className="text-[12px] font-bold text-white mb-2">Cowork</p>
                <div className="space-y-1.5 text-[11px]">
                  <p><span className="text-[#666]">Skill needed:</span> <span className="text-[#ccc]">clear context files (your style, rules, examples)</span></p>
                  <p><span className="text-[#666]">Output:</span> <span className="text-[#ccc]">sounds like you. Because it read your files.</span></p>
                  <p><span className="text-[#666]">The vibe:</span> <span className="text-[#DA4E24]">an assistant who read every brief</span></p>
                </div>
              </div>

              {/* Projects */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-3.5">
                <p className="text-[12px] font-bold text-white mb-2">Projects</p>
                <div className="space-y-1.5 text-[11px]">
                  <p><span className="text-[#666]">Skill needed:</span> <span className="text-[#ccc]">picking the right files and clear instructions</span></p>
                  <p><span className="text-[#666]">Output:</span> <span className="text-[#ccc]">sounds like you. Because it has your guides.</span></p>
                  <p><span className="text-[#666]">The vibe:</span> <span className="text-[#DA4E24]">a team member who knows your playbook</span></p>
                </div>
              </div>
            </div>

            {/* Right: Feature Grid */}
            <div className="px-5 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-0.5 h-4 bg-[#DA4E24] rounded-full" />
                <span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">What it can do</span>
              </div>

              <div className="text-[11px]">
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-0">
                  {/* Header */}
                  <div className="px-2 py-1.5 font-semibold text-[#555]" />
                  <div className="px-2 py-1.5 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Code</div>
                  <div className="px-2 py-1.5 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Cowork</div>
                  <div className="px-2 py-1.5 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Projects</div>

                  {/* Rows */}
                  {[
                    ["Answer questions", "Yes", "Yes", "Yes"],
                    ["Create real files (Excel, Word, PDF)", "Yes. Saves into your project folder.", "Yes. Files appear in your folders.", "Yes. Files can be saved or downloaded."],
                    ["Build interactive things", "Not just previews. Builds real apps.", "Yes, via Artifacts.", "Yes, via Artifacts."],
                    ["Use plugins and add-ons", "Yes. Connect any tool.", "Yes. Install from a library.", "No"],
                    ["Connect to tools (Slack, Jira, etc.)", "Yes. Jira, GitHub, Slack, and more.", "Yes", "Yes"],
                    ["Search the internet", "Yes", "Yes", "Yes"],
                    ["Extended Thinking", "On by default", "On by default", "You turn it on manually"],
                  ].map(([label, code, cowork, projects], i) => (
                    <div key={i} className="contents">
                      <div className={`px-2 py-2 text-[#888] font-medium border-t border-[#111]`}>{label}</div>
                      <div className={`px-2 py-2 text-[#ccc] border-t border-[#111] ${code === "Yes" ? "text-[#ccc]" : ""}`}>{code}</div>
                      <div className={`px-2 py-2 text-[#ccc] border-t border-[#111]`}>{cowork}</div>
                      <div className={`px-2 py-2 border-t border-[#111] ${projects === "No" ? "text-[#555]" : "text-[#ccc]"}`}>{projects}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── WHEN TO USE EACH ── */}
          <div className="px-8 py-5 border-b border-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-4">
              {/* Code */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
                <p className="text-[11px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal mb-2.5">Use Code when...</p>
                <ul className="space-y-1.5 text-[11px] text-[#ccc]">
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want to build software or a website</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want Claude to write and save code</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You need changes across many files at once</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want help publishing project updates</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You need long, hands-free building sessions</li>
                </ul>
              </div>

              {/* Cowork */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
                <p className="text-[11px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal mb-2.5">Use Cowork when...</p>
                <ul className="space-y-1.5 text-[11px] text-[#ccc]">
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You are doing real work (analysis, spreadsheets)</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want Claude to create actual files</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want it to sound like you</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You need long, deep sessions that do not break</li>
                </ul>
              </div>

              {/* Projects */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
                <p className="text-[11px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal mb-2.5">Set up a Project when...</p>
                <ul className="space-y-1.5 text-[11px] text-[#ccc]">
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You do the same task every week</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You are tired of repeating yourself</li>
                  <li className="flex gap-2"><span className="text-[#DA4E24] flex-shrink-0">&#8226;</span>You want context saved forever, not just for one session</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── CONTEXT TABLE ── */}
          <div className="px-8 py-5 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-[#DA4E24] rounded-full" />
              <span className="text-[10px] font-bold text-[#DA4E24] uppercase tracking-widest font-terminal">How context works</span>
            </div>

            <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-0 text-[11px]">
              <div />
              <div className="px-3 py-2 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Code</div>
              <div className="px-3 py-2 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Cowork</div>
              <div className="px-3 py-2 text-[10px] font-bold text-[#DA4E24] uppercase tracking-wider font-terminal">Projects</div>

              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal border-t border-[#111]">Your identity</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Write instructions in your project. Claude reads them every time.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Put info about yourself in text files inside your folder.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">From the files and instructions you added to the project.</div>

              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal border-t border-[#111]">Context input</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Instructions file + your entire project. Reads it all automatically.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Write .md or .txt files once. Drop in a folder. Point Claude to it.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Upload files and write instructions once. They stick.</div>

              <div className="px-3 py-2.5 text-[10px] font-semibold text-[#666] uppercase tracking-wider font-terminal border-t border-[#111]">Persistence</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Project instructions stay. Resume where you left off.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Yes, as long as you are in the same folder.</div>
              <div className="px-3 py-2.5 text-[#ccc] border-t border-[#111] leading-relaxed">Every new chat inside the project has it.</div>
            </div>
          </div>

          {/* ── BOTTOM BAR: Quick picks + note ── */}
          <div className="px-8 py-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Quick picks */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DA4E24]" />
                <span className="text-[11px]"><span className="text-[#777]">Building:</span> <span className="text-white font-medium">Code</span></span>
              </div>
              <span className="text-[#222]">|</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DA4E24]" />
                <span className="text-[11px]"><span className="text-[#777]">Deep sessions:</span> <span className="text-white font-medium">Cowork</span></span>
              </div>
              <span className="text-[#222]">|</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DA4E24]" />
                <span className="text-[11px]"><span className="text-[#777]">Recurring work:</span> <span className="text-white font-medium">Projects or Cowork</span></span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px sm:h-4 w-full sm:w-px bg-[#1a1a1a]" />

            {/* Note */}
            <p className="text-[11px] text-[#777] text-center sm:text-left">
              All three need a <strong className="text-white">Pro Plan ($20/mo)</strong>. Cowork is desktop only. Extended Thinking works everywhere. Always turn it on.
            </p>
          </div>

          {/* ── FOOTER ── */}
          <div className="px-8 py-3 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[10px] text-[#333] font-terminal">work.51ultron.com/cheatsheets</span>
            <span className="text-[10px] text-[#333] font-terminal">Ultron Cheatsheets</span>
          </div>

        </div>
      </div>
    </div>
  );
}
