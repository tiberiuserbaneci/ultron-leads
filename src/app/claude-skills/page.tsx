"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { skillFileContents } from "./skillContents";
import {
  categories,
  totalSkills,
  totalCategories,
  totalFiles,
  type Skill,
  type SkillCategory,
} from "./skillData";

/* ─── Copy button ─── */
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111] border border-[#1a1a1a] text-[11px] text-[#999] hover:text-white hover:border-[#333] transition-all"
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          {label}
        </>
      )}
    </button>
  );
}

/* ─── File badge (clickable) ─── */
function FileBadge({
  name,
  description,
  skillId,
  onOpen,
}: {
  name: string;
  description: string;
  skillId: string;
  onOpen: (skillId: string, fileName: string) => void;
}) {
  const ext = name.split(".").pop() || "";
  const color = ext === "md" ? "#DA4E24" : "#666";
  const hasContent = !!skillFileContents[`${skillId}/${name}`];
  return (
    <button
      onClick={() => hasContent && onOpen(skillId, name)}
      disabled={!hasContent}
      className={`w-full flex items-start gap-2 py-2 px-2 rounded-lg text-left transition-all ${
        hasContent
          ? "hover:bg-[#111] cursor-pointer group"
          : "opacity-50 cursor-default"
      }`}
    >
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-terminal border flex-shrink-0 mt-px"
        style={{ borderColor: color + "40", color }}
      >
        .{ext}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-[12px] text-[#ccc] font-medium group-hover:text-white transition-colors">{name}</span>
        <p className="text-[11px] text-[#666] mt-0.5">{description}</p>
      </div>
      {hasContent && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 mt-1 group-hover:stroke-[#DA4E24] transition-colors"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

/* ─── File Viewer Overlay ─── */
function FileViewer({
  skillId,
  fileName,
  onClose,
}: {
  skillId: string;
  fileName: string;
  onClose: () => void;
}) {
  const content = skillFileContents[`${skillId}/${fileName}`] || "";
  const [copied, setCopied] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const copyAll = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Viewer panel */}
      <div
        ref={viewerRef}
        className="relative w-full max-w-3xl max-h-[80vh] bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a1a1a] flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-terminal text-[#DA4E24] bg-[#DA4E24]/10 border border-[#DA4E24]/20 px-2 py-0.5 rounded flex-shrink-0">
              .{fileName.split(".").pop()}
            </span>
            <span className="text-sm font-terminal text-white truncate">{skillId}/{fileName}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={copyAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111] border border-[#1a1a1a] text-[11px] text-[#999] hover:text-white hover:border-[#333] transition-all"
            >
              {copied ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copy all
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#111] border border-[#222] text-[#555] hover:text-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 md-viewer">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0 pb-2 border-b border-[#1a1a1a]">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-semibold text-[#ddd] mb-2 mt-4">{children}</h3>,
              h4: ({ children }) => <h4 className="text-sm font-semibold text-[#ccc] mb-2 mt-3">{children}</h4>,
              p: ({ children }) => <p className="text-[13px] text-[#aaa] leading-relaxed mb-3">{children}</p>,
              ul: ({ children }) => <ul className="text-[13px] text-[#aaa] mb-3 ml-4 space-y-1 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="text-[13px] text-[#aaa] mb-3 ml-4 space-y-1 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#DA4E24] hover:underline">{children}</a>,
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
              em: ({ children }) => <em className="text-[#bbb] italic">{children}</em>,
              hr: () => <hr className="border-[#1a1a1a] my-4" />,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-[#DA4E24]/40 pl-4 my-3 text-[13px] text-[#888] italic">{children}</blockquote>,
              table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-[12px] text-[#aaa] border-collapse">{children}</table></div>,
              thead: ({ children }) => <thead className="border-b border-[#222]">{children}</thead>,
              th: ({ children }) => <th className="text-left px-3 py-2 text-[11px] font-semibold text-[#888] uppercase tracking-wider">{children}</th>,
              td: ({ children }) => <td className="px-3 py-2 border-b border-[#111]">{children}</td>,
              code: ({ className, children }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className="bg-[#111] border border-[#1a1a1a] rounded px-1.5 py-0.5 text-[12px] text-[#DA4E24] font-terminal">{children}</code>;
                }
                return (
                  <div className="relative group/code mb-3">
                    <pre className="bg-[#080808] border border-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
                      <code className="text-[12px] font-terminal text-[#ccc] leading-relaxed">{children}</code>
                    </pre>
                  </div>
                );
              },
              pre: ({ children }) => <>{children}</>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

/* ─── Keyword badge ─── */
function KeywordBadge({ keyword }: { keyword: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#111] border border-[#1a1a1a] text-[#888]">
      {keyword}
    </span>
  );
}

/* ─── Skill Detail Panel ─── */
function SkillDetail({
  skill,
  onClose,
  onOpenFile,
}: {
  skill: Skill;
  onClose: () => void;
  onOpenFile: (skillId: string, fileName: string) => void;
}) {
  return (
    <div className="animate-fade-in">
      {/* Mobile close */}
      <button
        onClick={onClose}
        className="lg:hidden flex items-center gap-1.5 text-xs text-[#555] hover:text-white mb-4 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to tree
      </button>

      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">{skill.title}</h3>
              <span className="text-[10px] font-terminal text-[#555] bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded">/{skill.name}</span>
            </div>
            <p className="text-sm text-[#999]">{skill.shortDescription}</p>
          </div>
          <button
            onClick={onClose}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-[#111] border border-[#222] text-[#555] hover:text-white transition-colors flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* What it does */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">What it does</h4>
          <p className="text-sm text-[#ccc] leading-relaxed">{skill.longDescription}</p>
        </div>

        {/* Use case */}
        <div className="mb-5 p-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-1.5">When to use</h4>
          <p className="text-[13px] text-[#ccc] leading-relaxed">{skill.useCase}</p>
        </div>

        {/* Inputs / Outputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Required inputs</h4>
            <div className="space-y-1">
              {skill.requiredInputs.map((input, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[12px] text-[#aaa]">
                  <span className="text-[#DA4E24] mt-px flex-shrink-0">+</span>
                  {input}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Outputs</h4>
            <div className="space-y-1">
              {skill.outputs.map((output, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[12px] text-[#aaa]">
                  <span className="text-[#DA4E24] mt-px flex-shrink-0">+</span>
                  {output}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key instruction excerpt */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Key instruction</h4>
          <div className="p-3 rounded-xl bg-black border border-[#1a1a1a]">
            <pre className="text-xs font-terminal text-[#ccc] whitespace-pre-wrap leading-relaxed">{skill.excerpt}</pre>
          </div>
          <div className="mt-2">
            <CopyButton text={skill.excerpt} label="Copy excerpt" />
          </div>
        </div>

        {/* Files included */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Files included ({skill.files.length})</h4>
            <CopyButton
              text={skill.files
                .map((f) => skillFileContents[`${skill.id}/${f.name}`] || "")
                .filter(Boolean)
                .join("\n\n---\n\n")}
              label="Copy all files"
            />
          </div>
          <div className="space-y-0.5 -mx-2">
            {skill.files.map((f) => (
              <FileBadge
                key={f.name}
                name={f.name}
                description={f.description}
                skillId={skill.id}
                onOpen={onOpenFile}
              />
            ))}
          </div>
          <p className="text-[10px] text-[#444] mt-2">Click any .md file to view and copy its full contents</p>
        </div>

        {/* Keywords */}
        <div className="mb-5">
          <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {skill.keywords.map((kw) => (
              <KeywordBadge key={kw} keyword={kw} />
            ))}
          </div>
        </div>

        {/* Argument hint */}
        {skill.argumentHint && (
          <div>
            <h4 className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">Invocation</h4>
            <div className="flex items-center gap-2">
              <code className="text-xs font-terminal text-[#ccc] bg-[#111] border border-[#1a1a1a] rounded px-2.5 py-1.5">
                /{skill.name} {skill.argumentHint}
              </code>
              <CopyButton text={`/${skill.name}`} label="Copy" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Skill Tree Item ─── */
function SkillTreeItem({
  skill,
  selected,
  onClick,
  index,
  isLast,
}: {
  skill: Skill;
  selected: boolean;
  onClick: () => void;
  index: number;
  isLast: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 py-1.5 pl-10 pr-3 text-left transition-all duration-150 rounded-lg group ${
        selected
          ? "bg-[#DA4E24]/10 text-[#DA4E24]"
          : "text-[#999] hover:text-white hover:bg-[#111]"
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Tree connector */}
      <span className="text-[#333] text-xs flex-shrink-0">{isLast ? "\u2514" : "\u251C"}</span>
      {/* Skill icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke={selected ? "#DA4E24" : "#555"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 transition-colors group-hover:stroke-[#DA4E24]"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="text-sm font-terminal truncate">{skill.name}</span>
    </button>
  );
}

/* ─── Category Folder ─── */
function CategoryFolder({
  category,
  expanded,
  onToggle,
  selectedSkill,
  onSelectSkill,
}: {
  category: SkillCategory;
  expanded: boolean;
  onToggle: () => void;
  selectedSkill: string | null;
  onSelectSkill: (skill: Skill) => void;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-150 rounded-lg hover:bg-[#111] group"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 transition-transform duration-200 text-[#555] ${expanded ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {/* Folder icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={expanded ? "#DA4E24" : "none"}
          stroke={expanded ? "#DA4E24" : "#555"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 transition-colors"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-sm font-terminal font-medium">{category.name.toLowerCase()}/</span>
        <span className="text-[10px] text-[#444] ml-auto">{category.skills.length} skills</span>
      </button>

      {/* Skills */}
      {expanded && (
        <div className="ml-2 mt-0.5 mb-1">
          {category.skills.map((skill, i) => (
            <SkillTreeItem
              key={skill.id}
              skill={skill}
              selected={selectedSkill === skill.id}
              onClick={() => onSelectSkill(skill)}
              index={i}
              isLast={i === category.skills.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Search ─── */
function SearchResults({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (skill: Skill) => void;
}) {
  const q = query.toLowerCase();
  const results = categories
    .flatMap((c) => c.skills)
    .filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
    );

  if (results.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-sm text-[#555]">No skills match &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-0.5">
      {results.map((skill) => (
        <button
          key={skill.id}
          onClick={() => onSelect(skill)}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-[#999] hover:text-white hover:bg-[#111] transition-all group"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 group-hover:stroke-[#DA4E24] transition-colors"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="min-w-0">
            <span className="text-sm font-terminal block truncate">{skill.name}</span>
            <span className="text-[11px] text-[#555] block truncate">{skill.shortDescription}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── How To Use Section ─── */
function HowToUse() {
  const steps = [
    {
      step: "1",
      title: "Download the skill pack",
      description: "Get the full library as a zip. Each skill is a self-contained folder with SKILL.md and reference files.",
    },
    {
      step: "2",
      title: "Copy into your project",
      description: "Drop individual skill folders into .claude/skills/ for project scope, or ~/.claude/skills/ for personal scope.",
    },
    {
      step: "3",
      title: "Use slash commands or let skills auto-activate",
      description: "Skills with slash commands are invoked via /skill-name. Others activate automatically when Claude detects a matching context.",
    },
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How to use these skills</h2>
        <p className="text-sm text-[#999] max-w-lg mx-auto">
          Claude Code skills are reusable knowledge modules. Drop them into your project and they activate automatically.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {steps.map((s) => (
          <div key={s.step} className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#DA4E24]/10 text-[#DA4E24] text-xs font-bold font-terminal mb-3">
              {s.step}
            </span>
            <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
            <p className="text-xs text-[#888] leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Copy All Skills Button ─── */
function CopyAllSkillsButton() {
  const [copied, setCopied] = useState(false);
  const copyAll = () => {
    const allContent = Object.entries(skillFileContents)
      .map(([path, content]) => `// === ${path} ===\n\n${content}`)
      .join("\n\n" + "=".repeat(60) + "\n\n");
    navigator.clipboard.writeText(allContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <button
      onClick={copyAll}
      className="btn-gradient glow-accent text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all inline-flex items-center gap-2"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          Copied entire library
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          Copy entire skill library
        </>
      )}
    </button>
  );
}

/* ─── MAIN PAGE ─── */
export default function ClaudeSkillsPage() {
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [openFile, setOpenFile] = useState<{ skillId: string; fileName: string } | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleCat = (catId: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setSearchQuery("");
    // Auto-expand the category
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.add(skill.category);
      return next;
    });
    // On mobile, scroll to detail
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const handleOpenFile = useCallback((skillId: string, fileName: string) => {
    setOpenFile({ skillId, fileName });
  }, []);

  const handleExpandAll = () => {
    if (expandedCats.size === categories.length) {
      setExpandedCats(new Set());
    } else {
      setExpandedCats(new Set(categories.map((c) => c.id)));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div
        className={`text-center mb-10 transition-all duration-500 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="inline-flex items-center gap-2 bg-[#DA4E24]/10 border border-[#DA4E24]/20 rounded-full px-4 py-1.5 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
          <span className="text-[#DA4E24] text-sm font-medium">Free Resource</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
          The Claude Skills Library
        </h1>
        <p className="text-lg text-[#999] max-w-xl mx-auto">
          {totalSkills} production-ready skills for Claude Code. Browse by category, inspect each skill, and download the full pack.
        </p>
        <p className="text-xs text-[#444] mt-3">{totalCategories} categories / {totalSkills} skills / {totalFiles} files</p>

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <CopyAllSkillsButton />
          <button
            onClick={() => {
              setExpandedCats(new Set(categories.map((c) => c.id)));
              setTimeout(() => {
                document.getElementById("skill-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-[#999] border border-[#1a1a1a] hover:border-[#333] hover:text-white transition-all"
          >
            Browse all skills
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-[#555] mt-3">Open any file directly. Copy individual skills or the entire library.</p>
      </div>

      {/* File Tree + Detail Panel */}
      <div
        id="skill-explorer"
        className={`scroll-mt-20 transition-all duration-500 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left: File Tree */}
          <div className="lg:w-[45%]">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Tree header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-terminal font-bold text-[#DA4E24]">claude-skills/</span>
                </div>
                <button
                  onClick={handleExpandAll}
                  className="text-[10px] text-[#555] hover:text-white font-terminal transition-colors"
                >
                  {expandedCats.size === categories.length ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {/* Search */}
              <div className="px-3 pt-3 pb-1">
                <div className="relative">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#555"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full bg-[#111] border border-[#1a1a1a] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#DA4E24]/40 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Tree or search results */}
              {searchQuery ? (
                <SearchResults query={searchQuery} onSelect={handleSelectSkill} />
              ) : (
                <div className="p-2 space-y-0.5">
                  {categories.map((cat) => (
                    <CategoryFolder
                      key={cat.id}
                      category={cat}
                      expanded={expandedCats.has(cat.id)}
                      onToggle={() => toggleCat(cat.id)}
                      selectedSkill={selectedSkill?.id || null}
                      onSelectSkill={handleSelectSkill}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div ref={detailRef} className="lg:w-[55%] lg:sticky lg:top-20 lg:self-start scroll-mt-20">
            {selectedSkill ? (
              <SkillDetail skill={selectedSkill} onClose={() => setSelectedSkill(null)} onOpenFile={handleOpenFile} />
            ) : (
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <p className="text-sm text-[#555]">Click any skill to see full details</p>
                <p className="text-xs text-[#333] mt-1">What it does, required inputs, files included, key instructions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How to use */}
      <HowToUse />

      {/* Cross-page links */}
      <div className="grid sm:grid-cols-3 gap-3 mt-10">
        {[
          { label: "Need a workflow scoped first?", href: "/rfp" },
          { label: "See the full agent architecture", href: "/agents-map" },
          { label: "Watch agents execute in real time", href: "/demo" },
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

      {/* File Viewer Overlay */}
      {openFile && (
        <FileViewer
          skillId={openFile.skillId}
          fileName={openFile.fileName}
          onClose={() => setOpenFile(null)}
        />
      )}
    </div>
  );
}
