"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  type RfpForm,
  EMPTY_FORM,
  SECTIONS,
  REQUIRED_FIELDS,
  SECTION_GUIDES,
  TEMPLATES,
  FIELD_LABELS,
  FIELD_EXAMPLES,
  INDUSTRY_OPTIONS,
  COMPANY_STAGE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  REVENUE_BAND_OPTIONS,
  TOOL_OPTIONS,
  MODEL_OPTIONS,
  APPROVAL_OPTIONS,
  SENSITIVITY_OPTIONS,
  URGENCY_OPTIONS,
  BUDGET_OPTIONS,
  AUTOMATION_CHIPS,
  getSectionCompletion,
  getTotalCompletion,
  isFieldFilled,
  isValidEmail,
} from "./data";
import { trackFormStarted, trackFormSubmitted } from "@/lib/analytics";

/* ─── Field components ───────────────────────────────────── */

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[13px] font-medium text-[#ccc] mb-1.5">
      {label}
      {required && <span className="text-[#DA4E24] ml-0.5">*</span>}
    </label>
  );
}

function FieldHint({ text }: { text: string }) {
  return <p className="text-[11px] text-[#888] mt-1 leading-relaxed">{text}</p>;
}

function ExampleToggle({ fieldKey }: { fieldKey: keyof RfpForm }) {
  const [open, setOpen] = useState(false);
  const example = FIELD_EXAMPLES[fieldKey];
  if (!example) return null;
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-[11px] text-[#999] hover:text-[#DA4E24] transition-colors"
      >
        {open ? "Hide example" : "Show example answer"}
      </button>
      {open && (
        <p className="text-[11px] text-[#aaa] mt-1 leading-relaxed pl-3 border-l border-[#333]">
          {example}
        </p>
      )}
    </div>
  );
}

function TextInput({
  label, value, onChange, required, placeholder, type = "text", hint,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string; hint?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-[#222] px-0 py-2 text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#DA4E24]/50 transition-colors"
      />
      {hint && <FieldHint text={hint} />}
    </div>
  );
}

function TextArea({
  label, value, onChange, required, placeholder, rows = 3, fieldKey, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; rows?: number; fieldKey?: keyof RfpForm; hint?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent border border-[#1a1a1a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#DA4E24]/40 transition-colors resize-y"
      />
      {hint && <FieldHint text={hint} />}
      {fieldKey && <ExampleToggle fieldKey={fieldKey} />}
    </div>
  );
}

function SelectInput({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#222] px-0 py-2 text-sm text-white focus:outline-none focus:border-[#DA4E24]/50 transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23555' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0 center" }}
      >
        <option value="" className="bg-black">Select...</option>
        {options.map((o) => <option key={o} value={o} className="bg-black">{o}</option>)}
      </select>
    </div>
  );
}

function ChipSelect({
  label, value, onChange, options, required, multi = false,
}: {
  label: string; value: string | string[]; onChange: (v: string | string[]) => void; options: string[]; required?: boolean; multi?: boolean;
}) {
  const selected = multi ? (value as string[]) : (value ? [value as string] : []);
  const toggle = (opt: string) => {
    if (multi) {
      const arr = value as string[];
      (onChange as (v: string[]) => void)(arr.includes(opt) ? arr.filter((v) => v !== opt) : [...arr, opt]);
    } else {
      (onChange as (v: string) => void)((value as string) === opt ? "" : opt);
    }
  };
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap gap-1.5 mt-0.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`text-[11px] px-2.5 py-1.5 rounded-md transition-all duration-150 ${
              selected.includes(o)
                ? "bg-[#DA4E24]/8 text-[#DA4E24] border border-[#DA4E24]/25"
                : "text-[#999] border border-transparent hover:text-[#ccc] hover:border-[#333]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step Rail ──────────────────────────────────────────── */

function StepRail({
  activeSection,
  form,
  onNavigate,
}: {
  activeSection: number;
  form: RfpForm;
  onNavigate: (idx: number) => void;
}) {
  return (
    <>
      {/* Desktop vertical rail */}
      <nav className="hidden lg:flex flex-col gap-0.5 w-44 flex-shrink-0 pt-1">
        {SECTIONS.map((section, i) => {
          const sc = getSectionCompletion(form, section);
          const isActive = i === activeSection;
          const isDone = sc.complete && sc.total > 0;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(i)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group ${
                isActive ? "bg-[#111]" : "hover:bg-[#0a0a0a]"
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-terminal flex-shrink-0 ${
                isDone
                  ? "bg-[#DA4E24]/10 text-[#DA4E24]"
                  : isActive
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-transparent text-[#777]"
              }`}>
                {isDone ? (
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-[12px] transition-colors ${
                isActive ? "text-white font-medium" : "text-[#999] group-hover:text-[#ccc]"
              }`}>
                {section.shortTitle}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile compact progress */}
      <div className="lg:hidden flex items-center gap-1 mb-5 overflow-x-auto scrollbar-none">
        {SECTIONS.map((section, i) => {
          const sc = getSectionCompletion(form, section);
          const isActive = i === activeSection;
          const isDone = sc.complete && sc.total > 0;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-[#111] text-white"
                  : isDone
                  ? "text-[#DA4E24]"
                  : "text-[#888] hover:text-[#ccc]"
              }`}
            >
              {isDone && <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
              {section.shortTitle}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ─── Guide Panel ────────────────────────────────────────── */

function GuidePanel({
  sectionId,
  form,
  guideTab,
  setGuideTab,
}: {
  sectionId: string;
  form: RfpForm;
  guideTab: "guide" | "preview";
  setGuideTab: (t: "guide" | "preview") => void;
}) {
  const guide = SECTION_GUIDES[sectionId];
  if (!guide) return null;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-5 border-b border-[#111]">
        {(["guide", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setGuideTab(tab)}
            className={`pb-2 text-[11px] font-terminal uppercase tracking-widest transition-colors border-b-2 ${
              guideTab === tab
                ? "text-[#DA4E24] border-[#DA4E24]"
                : "text-[#888] border-transparent hover:text-[#bbb]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {guideTab === "guide" ? (
        <div className="space-y-5">
          <p className="text-[13px] text-[#bbb] leading-relaxed">{guide.purpose}</p>

          <div className="space-y-2">
            {guide.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] text-[#aaa]">
                <span className="text-[#DA4E24] mt-px flex-shrink-0">+</span>
                {tip}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#111]">
            <span className="text-[10px] font-terminal text-[#888] uppercase tracking-widest">Good example</span>
            <p className="text-[12px] text-[#aaa] mt-1.5 leading-relaxed">{guide.example}</p>
          </div>

          <div>
            <span className="text-[10px] font-terminal text-[#888] uppercase tracking-widest">Common mistake</span>
            <p className="text-[12px] text-[#999] mt-1.5 leading-relaxed">{guide.avoid}</p>
          </div>
        </div>
      ) : (
        <EmailPreview form={form} />
      )}
    </div>
  );
}

/* ─── Email Preview ──────────────────────────────────────── */

interface PreviewSection {
  title: string;
  rows: { label: string; value: string; empty: boolean }[];
}

function EmailPreview({ form }: { form: RfpForm }) {
  const r = (label: string, val: string | string[], placeholder = "..."): { label: string; value: string; empty: boolean } => {
    const v = Array.isArray(val) ? val.join(", ") : val;
    return { label, value: v || placeholder, empty: !v };
  };

  const sections: PreviewSection[] = [
    {
      title: "Routing",
      rows: [
        r("To", form.recipientEmail, "recipient@..."),
        r("From", form.clientName ? `${form.clientName} (${form.clientEmail})` : form.clientEmail, "your name (email)"),
        r("Company", form.company),
      ],
    },
    {
      title: "Business",
      rows: [
        r("Industry", form.industry),
        r("Stage", form.companyStage),
        r("Team", form.teamSize),
        r("Summary", form.businessSummary),
      ],
    },
    {
      title: "Automation",
      rows: [
        r("Request", form.automationRequest),
        r("Outcome", form.desiredOutcome),
        r("Bottleneck", form.bottleneck),
        r("Outputs", form.expectedOutputs),
      ],
    },
    {
      title: "Stack",
      rows: [
        r("Tools", form.toolsInvolved),
        r("Models", form.modelsInUse),
      ],
    },
    {
      title: "Workflow",
      rows: [
        r("Triggers", form.triggers),
        r("Steps", form.workflowSteps),
        r("Approval", form.approvalRules),
        r("Sensitivity", form.sensitivityLevel),
      ],
    },
    {
      title: "Delivery",
      rows: [
        r("Success", form.successMetric),
        r("Urgency", form.urgency),
        r("V1 definition", form.successDefinition),
        r("Budget", form.budgetRange),
      ],
    },
  ];

  const hasContent = form.company || form.recipientEmail || form.automationRequest;

  return (
    <div>
      <div className="mb-3 pb-2 border-b border-[#111]">
        <p className="text-[10px] text-[#888] font-terminal uppercase tracking-widest">Subject</p>
        <p className="text-[13px] text-white mt-0.5">
          {hasContent
            ? `New RFP from ${form.clientName || "..."} — ${form.company || "..."}`
            : "New RFP from ... — ..."
          }
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const hasAny = section.rows.some((r) => !r.empty);
          return (
            <div key={section.title} className={hasAny ? "" : "opacity-30"}>
              <span className="text-[10px] font-terminal text-[#DA4E24]/60 uppercase tracking-widest">{section.title}</span>
              <div className="mt-1.5 space-y-1">
                {section.rows.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[11px] text-[#888] flex-shrink-0 w-20">{row.label}</span>
                    <span className={`text-[11px] break-words ${row.empty ? "text-[#555]" : "text-[#ccc]"}`}>
                      {row.value.length > 120 ? row.value.slice(0, 120) + "..." : row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Review section ─────────────────────────────────────── */

function ReviewSection({ form, onNavigate }: { form: RfpForm; onNavigate: (idx: number) => void }) {
  return (
    <div className="space-y-6">
      {SECTIONS.filter((s) => s.id !== "review").map((section, sIdx) => {
        const { filled, total, complete } = getSectionCompletion(form, section);
        return (
          <div key={section.id}>
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => onNavigate(sIdx)}
                className="text-[13px] font-medium text-white hover:text-[#DA4E24] transition-colors"
              >
                {section.title}
              </button>
              {total > 0 && (
                <span className={`text-[10px] font-terminal ${complete ? "text-[#DA4E24]" : "text-[#888]"}`}>
                  {complete ? "Done" : `${filled}/${total}`}
                </span>
              )}
            </div>
            <div className="space-y-0.5 pl-0.5">
              {section.fields.map((field) => {
                const val = form[field];
                const display = Array.isArray(val) ? val.join(", ") : val;
                const label = FIELD_LABELS[field] || field;
                const isRequired = section.requiredFields.includes(field);
                const isFilled = isFieldFilled(form, field);
                if (!isRequired && !isFilled) return null;
                return (
                  <div key={field} className="flex gap-2 py-0.5">
                    <span className="text-[11px] text-[#888] flex-shrink-0 w-36 truncate">{label}</span>
                    <span className={`text-[11px] break-words min-w-0 ${
                      isFilled ? "text-[#ccc]" : "text-[#DA4E24]/60"
                    }`}>
                      {isFilled
                        ? (display.length > 80 ? display.slice(0, 80) + "..." : display)
                        : "Required"
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function RfpPage() {
  const [form, setForm] = useState<RfpForm>({ ...EMPTY_FORM });
  const [activeSection, setActiveSection] = useState(0);
  const [guideTab, setGuideTab] = useState<"guide" | "preview">("guide");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rfpStarted = useRef(false);

  useEffect(() => setVisible(true), []);

  const set = useCallback(<K extends keyof RfpForm>(key: K, value: RfpForm[K]) => {
    if (!rfpStarted.current) {
      rfpStarted.current = true;
      trackFormStarted("rfp");
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setStr = useCallback((key: keyof RfpForm) => (value: string) => {
    set(key, value as RfpForm[typeof key]);
  }, [set]);

  const setArr = useCallback((key: keyof RfpForm) => (value: string[]) => {
    set(key, value as RfpForm[typeof key]);
  }, [set]);

  const completion = useMemo(() => getTotalCompletion(form), [form]);
  const currentSection = SECTIONS[activeSection];

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    setActiveSection(clamped);
    // Scroll the section content into view
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const applyTemplate = useCallback((tpl: typeof TEMPLATES[number]) => {
    setForm((prev) => ({ ...prev, ...tpl.data }));
    // Navigate to build section to show the prefilled content
    setActiveSection(2);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    const missing = REQUIRED_FIELDS.filter((f) => !isFieldFilled(form, f));
    if (missing.length > 0) {
      setError(`${missing.length} required fields still missing.`);
      return;
    }
    if (!isValidEmail(form.recipientEmail)) {
      setError("Invalid recipient email address.");
      return;
    }
    if (!isValidEmail(form.clientEmail)) {
      setError("Invalid client email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _hp: "" }),
      });
      if (!res.ok) {
        let msg = `Server error (${res.status})`;
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch { /* response wasn't JSON */ }
        setError(msg);
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        trackFormSubmitted("rfp");
        setSubmitted(true);
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : "Request failed"}. Check your connection and try again.`);
    }
    setSubmitting(false);
  }, [form]);

  /* Success state */
  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md text-center animate-fade-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#DA4E24]/10 mb-6">
            <svg className="w-6 h-6 text-[#DA4E24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Brief delivered</h1>
          <p className="text-[#bbb] text-sm mb-1">
            Sent to <span className="text-white">{form.recipientEmail}</span>
          </p>
          <p className="text-[#999] text-sm mb-8">
            Confirmation copy sent to {form.clientEmail}
          </p>
          <div className="text-left mb-8 space-y-2">
            {["Review typically begins directly from this brief", "Share additional details by replying to the confirmation email", "Watch your inbox for follow-up"].map((t, i) => (
              <p key={i} className="flex items-start gap-2 text-[13px] text-[#aaa]">
                <span className="text-[#DA4E24] mt-px">+</span> {t}
              </p>
            ))}
          </div>
          <Link href="/" className="text-sm text-[#999] hover:text-[#DA4E24] transition-colors">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Header */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-4 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Request For Proposal</h1>
            <p className="text-[13px] text-[#999] mt-0.5">Structured intake for any AI build</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-1 bg-[#111] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-[#DA4E24]"
                style={{ width: `${completion.percent}%`, opacity: completion.percent === 0 ? 0.3 : 1 }}
              />
            </div>
            <span className="text-[11px] font-terminal text-[#999]">{completion.filled}/{completion.total}</span>
          </div>
        </div>

        {/* Templates */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-terminal text-[#888] uppercase tracking-widest">Templates</span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => applyTemplate(tpl)}
              className="text-[11px] text-[#999] hover:text-[#DA4E24] transition-colors px-2 py-1"
              title={tpl.description}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Step rail */}
          <StepRail activeSection={activeSection} form={form} onNavigate={goTo} />

          {/* Form workspace */}
          <div className="flex-1 min-w-0 w-full lg:max-w-[55%]" ref={sectionRef}>
            {/* Section header */}
            <div className="mb-6 pt-1">
              <h2 className="text-base font-semibold text-white">{currentSection.title}</h2>
              <p className="text-[13px] text-[#999] mt-0.5">{currentSection.description}</p>
            </div>

            {/* Form content */}
            <div className="space-y-5">
              {currentSection.id === "routing" && (
                <>
                  <TextInput label={FIELD_LABELS.recipientEmail} value={form.recipientEmail} onChange={setStr("recipientEmail")} required placeholder="who@receives-this.com" type="email" hint="The person or team who will scope and build the work" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <TextInput label={FIELD_LABELS.clientName} value={form.clientName} onChange={setStr("clientName")} required placeholder="Your full name" />
                    <TextInput label={FIELD_LABELS.clientEmail} value={form.clientEmail} onChange={setStr("clientEmail")} required placeholder="you@company.com" type="email" />
                  </div>
                  <TextInput label={FIELD_LABELS.company} value={form.company} onChange={setStr("company")} required placeholder="Company name" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <TextInput label={FIELD_LABELS.role} value={form.role} onChange={setStr("role")} placeholder="e.g. Founder, CTO, Head of Ops" />
                    <TextInput label={FIELD_LABELS.website} value={form.website} onChange={setStr("website")} placeholder="https://..." />
                    <TextInput label={FIELD_LABELS.location} value={form.location} onChange={setStr("location")} placeholder="City, country" />
                  </div>
                </>
              )}

              {currentSection.id === "business" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <SelectInput label={FIELD_LABELS.industry} value={form.industry} onChange={setStr("industry")} options={INDUSTRY_OPTIONS} required />
                    <SelectInput label={FIELD_LABELS.companyStage} value={form.companyStage} onChange={setStr("companyStage")} options={COMPANY_STAGE_OPTIONS} required />
                    <ChipSelect label={FIELD_LABELS.teamSize} value={form.teamSize} onChange={(v) => set("teamSize", v as string)} options={TEAM_SIZE_OPTIONS} required />
                  </div>
                  <TextArea label={FIELD_LABELS.businessSummary} value={form.businessSummary} onChange={setStr("businessSummary")} required placeholder="What does the business do? Who are the customers? What problem does it solve? Include scale if relevant." rows={4} fieldKey="businessSummary" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <SelectInput label={FIELD_LABELS.revenueBand} value={form.revenueBand} onChange={setStr("revenueBand")} options={REVENUE_BAND_OPTIONS} />
                    <TextInput label={FIELD_LABELS.mainMarket} value={form.mainMarket} onChange={setStr("mainMarket")} placeholder="e.g. US, DACH, Global" />
                    <TextInput label={FIELD_LABELS.growthStage} value={form.growthStage} onChange={setStr("growthStage")} placeholder="e.g. Scaling, Plateaued" />
                  </div>
                </>
              )}

              {currentSection.id === "build" && (
                <>
                  <div>
                    <span className="text-[10px] font-terminal text-[#888] uppercase tracking-widest">Quick start</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {AUTOMATION_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!form.automationRequest.includes(chip)) {
                              set("automationRequest", (form.automationRequest ? `${form.automationRequest}. ${chip}` : chip) as RfpForm["automationRequest"]);
                            }
                          }}
                          className="text-[11px] text-[#999] hover:text-[#DA4E24] transition-colors px-2 py-1"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextInput label={FIELD_LABELS.workflowTitle} value={form.workflowTitle} onChange={setStr("workflowTitle")} placeholder="Short name for this workflow, e.g. Lead enrichment pipeline" />
                  <TextArea label={FIELD_LABELS.automationRequest} value={form.automationRequest} onChange={setStr("automationRequest")} required placeholder="Describe what you want automated. Be specific about what the system does, what it watches, and what it produces." rows={5} fieldKey="automationRequest" />
                  <TextArea label={FIELD_LABELS.desiredOutcome} value={form.desiredOutcome} onChange={setStr("desiredOutcome")} required placeholder="What should be true when this system is running well? Name measurable outcomes." rows={3} fieldKey="desiredOutcome" />
                  <TextArea label={FIELD_LABELS.bottleneck} value={form.bottleneck} onChange={setStr("bottleneck")} required placeholder="What is currently slow, manual, or broken? How much time does it take? Why is it a problem now?" rows={3} fieldKey="bottleneck" />
                  <TextArea label={FIELD_LABELS.expectedOutputs} value={form.expectedOutputs} onChange={setStr("expectedOutputs")} required placeholder="List every output: emails sent, data updated, reports generated, Slack notifications, CRM records created" rows={3} fieldKey="expectedOutputs" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <TextInput label={FIELD_LABELS.endUsers} value={form.endUsers} onChange={setStr("endUsers")} placeholder="e.g. Founder only, sales team, all employees" />
                    <TextArea label={FIELD_LABELS.currentManualProcess} value={form.currentManualProcess} onChange={setStr("currentManualProcess")} placeholder="Step-by-step: what do you do manually today?" rows={2} />
                  </div>
                </>
              )}

              {currentSection.id === "stack" && (
                <>
                  <ChipSelect label={FIELD_LABELS.toolsInvolved} value={form.toolsInvolved} onChange={(v) => set("toolsInvolved", v as string[])} options={TOOL_OPTIONS} required multi />
                  <TextInput label={FIELD_LABELS.automationTools} value={form.automationTools} onChange={setStr("automationTools")} placeholder="e.g. Zapier, n8n, Make, custom scripts, none" hint="Include tools you have tried and stopped using" />
                  <TextInput label={FIELD_LABELS.dataSources} value={form.dataSources} onChange={setStr("dataSources")} placeholder="e.g. Google Sheets, Postgres, REST APIs, webhooks" />
                  <ChipSelect label={FIELD_LABELS.modelsInUse} value={form.modelsInUse} onChange={(v) => set("modelsInUse", v as string[])} options={MODEL_OPTIONS} multi />
                  <TextArea label={FIELD_LABELS.stackDetails} value={form.stackDetails} onChange={setStr("stackDetails")} placeholder="Hosting, deployment, or infrastructure details worth noting" rows={2} />
                </>
              )}

              {currentSection.id === "workflow" && (
                <>
                  <TextArea label={FIELD_LABELS.triggers} value={form.triggers} onChange={setStr("triggers")} required placeholder="What starts this workflow? New email, form submission, daily schedule, API webhook, manual trigger?" rows={3} fieldKey="triggers" hint="Name every trigger event. Most workflows have 1-2 primary triggers." />
                  <TextArea label={FIELD_LABELS.workflowSteps} value={form.workflowSteps} onChange={setStr("workflowSteps")} required placeholder="List the steps in order. Number them. What should the system do from trigger to final output?" rows={6} fieldKey="workflowSteps" hint="The more specific, the more accurate the scope. 5-10 steps is typical." />
                  <ChipSelect label={FIELD_LABELS.approvalRules} value={form.approvalRules} onChange={(v) => set("approvalRules", v as string[])} options={APPROVAL_OPTIONS} required multi />
                  <ChipSelect label={FIELD_LABELS.sensitivityLevel} value={form.sensitivityLevel} onChange={(v) => set("sensitivityLevel", v as string)} options={SENSITIVITY_OPTIONS} required />
                  <TextArea label={FIELD_LABELS.edgeCases} value={form.edgeCases} onChange={setStr("edgeCases")} placeholder="What could go wrong? Unusual inputs, duplicate data, missing fields, rate limits?" rows={2} />
                  <TextArea label={FIELD_LABELS.failureRisks} value={form.failureRisks} onChange={setStr("failureRisks")} placeholder="What happens if the system fails or produces bad output? What is the fallback?" rows={2} />
                  <TextInput label={FIELD_LABELS.securityNotes} value={form.securityNotes} onChange={setStr("securityNotes")} placeholder="Privacy requirements, PII handling, data residency rules" />
                  <TextInput label={FIELD_LABELS.accessConstraints} value={form.accessConstraints} onChange={setStr("accessConstraints")} placeholder="Who should and should not have access to this system?" />
                </>
              )}

              {currentSection.id === "delivery" && (
                <>
                  <TextArea label={FIELD_LABELS.successMetric} value={form.successMetric} onChange={setStr("successMetric")} required placeholder="How do you measure success? Name a number or clear measurable outcome." rows={3} fieldKey="successMetric" hint="Examples: hours saved per week, response time reduced, leads contacted per day" />
                  <ChipSelect label={FIELD_LABELS.urgency} value={form.urgency} onChange={(v) => set("urgency", v as string)} options={URGENCY_OPTIONS} required />
                  <TextArea label={FIELD_LABELS.successDefinition} value={form.successDefinition} onChange={setStr("successDefinition")} required placeholder="What does a successful first version look like? What is the minimum viable scope?" rows={4} fieldKey="successDefinition" hint="V1 can be simpler than the full vision. Describe what ships first." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ChipSelect label={FIELD_LABELS.budgetRange} value={form.budgetRange} onChange={(v) => set("budgetRange", v as string)} options={BUDGET_OPTIONS} />
                    <TextInput label={FIELD_LABELS.communicationStyle} value={form.communicationStyle} onChange={setStr("communicationStyle")} placeholder="e.g. Async-first, weekly sync, Slack, Loom" />
                  </div>
                  <TextArea label={FIELD_LABELS.referenceLinks} value={form.referenceLinks} onChange={setStr("referenceLinks")} placeholder="Links to similar tools, docs, examples, or inspiration (one per line)" rows={2} />
                  <TextArea label={FIELD_LABELS.extraContext} value={form.extraContext} onChange={setStr("extraContext")} placeholder="Anything else the recipient should know before scoping" rows={3} />
                </>
              )}

              {currentSection.id === "review" && (
                <>
                  <ReviewSection form={form} onNavigate={goTo} />

                  {error && (
                    <p className="text-sm text-[#DA4E24] mt-4">{error}</p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 mt-4 border-t border-[#111]">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || completion.percent < 100}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit brief
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </>
                      )}
                    </button>
                    {completion.percent < 100 && (
                      <span className="text-[11px] text-[#888]">
                        {completion.total - completion.filled} required fields remaining
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Section navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t border-[#111]">
              <button
                onClick={() => goTo(activeSection - 1)}
                disabled={activeSection === 0}
                className="text-[13px] text-[#888] hover:text-[#DA4E24] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => goTo(activeSection + 1)}
                disabled={activeSection === SECTIONS.length - 1}
                className="text-[13px] text-[#999] hover:text-[#DA4E24] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Next section
              </button>
            </div>
          </div>

          {/* Right panel */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <GuidePanel
                sectionId={currentSection.id}
                form={form}
                guideTab={guideTab}
                setGuideTab={setGuideTab}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile guide panel */}
      <div className="lg:hidden max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <details className="group">
          <summary className="text-[11px] font-terminal text-[#888] uppercase tracking-widest cursor-pointer hover:text-[#ccc] transition-colors py-2">
            Section guide and preview
          </summary>
          <div className="pt-2">
            <GuidePanel
              sectionId={currentSection.id}
              form={form}
              guideTab={guideTab}
              setGuideTab={setGuideTab}
            />
          </div>
        </details>
      </div>

      {/* Honeypot */}
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true" />
    </div>
  );
}
