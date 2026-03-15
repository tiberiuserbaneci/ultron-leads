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
  getStrengthLabel,
  isFieldFilled,
  isValidEmail,
} from "./data";

/* ─── Reusable field components ──────────────────────────── */

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-[#999] mb-1.5">
      {label}
      {required && <span className="text-[#DA4E24] ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  label, value, onChange, required, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#DA4E24]/40 transition-colors"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, required, placeholder, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#DA4E24]/40 transition-colors resize-y"
      />
    </div>
  );
}

function SelectInput({
  label, value, onChange, options, required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#DA4E24]/40 transition-colors appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      >
        <option value="" className="bg-[#111]">{placeholder || "Select..."}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#111]">{o}</option>
        ))}
      </select>
    </div>
  );
}

function MultiChipSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string[]; onChange: (v: string[]) => void; options: string[]; required?: boolean;
}) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggle(o)}
            className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
              value.includes(o)
                ? "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]"
                : "bg-[#111] border-[#222] text-[#666] hover:text-[#999] hover:border-[#333]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function SegmentSelect({
  label, value, onChange, options, required,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(value === o ? "" : o)}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              value === o
                ? "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]"
                : "bg-[#111] border-[#222] text-[#666] hover:text-[#999] hover:border-[#333]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
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
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#1a1a1a]">
        <button
          onClick={() => setGuideTab("guide")}
          className={`flex-1 px-4 py-3 text-[11px] font-terminal uppercase tracking-widest transition-colors ${
            guideTab === "guide" ? "text-[#DA4E24] bg-[#DA4E24]/5" : "text-[#555] hover:text-[#999]"
          }`}
        >
          Guide
        </button>
        <button
          onClick={() => setGuideTab("preview")}
          className={`flex-1 px-4 py-3 text-[11px] font-terminal uppercase tracking-widest transition-colors ${
            guideTab === "preview" ? "text-[#DA4E24] bg-[#DA4E24]/5" : "text-[#555] hover:text-[#999]"
          }`}
        >
          Preview
        </button>
      </div>

      {guideTab === "guide" ? (
        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-xs font-bold text-white mb-1">{guide.title}</h3>
            <p className="text-[13px] text-[#888] leading-relaxed">{guide.purpose}</p>
          </div>

          <div className="bg-green-500/5 border border-green-500/15 rounded-lg p-3">
            <span className="text-[10px] font-terminal text-green-400 uppercase tracking-widest">Strong answer</span>
            <p className="text-[12px] text-[#999] mt-1 leading-relaxed">{guide.strongAnswer}</p>
          </div>

          <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-3">
            <span className="text-[10px] font-terminal text-red-400 uppercase tracking-widest">Weak answer</span>
            <p className="text-[12px] text-[#999] mt-1 leading-relaxed">{guide.weakAnswer}</p>
          </div>

          <div>
            <span className="text-[10px] font-terminal text-[#666] uppercase tracking-widest">Tips</span>
            <ul className="mt-2 space-y-1.5">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#888]">
                  <span className="text-[#DA4E24] mt-0.5 flex-shrink-0">+</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <EmailPreview form={form} />
      )}
    </div>
  );
}

/* ─── Email Preview ──────────────────────────────────────── */

function EmailPreview({ form }: { form: RfpForm }) {
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, val: string | string[]) => {
    const v = Array.isArray(val) ? val.join(", ") : val;
    if (v) rows.push({ label, value: v });
  };

  add("Recipient", form.recipientEmail);
  add("From", form.clientName ? `${form.clientName} (${form.clientEmail})` : form.clientEmail);
  add("Company", form.company);
  add("Role", form.role);
  add("Industry", form.industry);
  add("Stage", form.companyStage);
  add("Team size", form.teamSize);
  add("Summary", form.businessSummary);
  add("Automation request", form.automationRequest);
  add("Desired outcome", form.desiredOutcome);
  add("Bottleneck", form.bottleneck);
  add("Expected outputs", form.expectedOutputs);
  add("Tools", form.toolsInvolved);
  add("Models", form.modelsInUse);
  add("Triggers", form.triggers);
  add("Steps", form.workflowSteps);
  add("Approval rules", form.approvalRules);
  add("Sensitivity", form.sensitivityLevel);
  add("Success metric", form.successMetric);
  add("Urgency", form.urgency);
  add("Success definition", form.successDefinition);
  add("Budget", form.budgetRange);

  return (
    <div className="p-5">
      <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Email preview</span>
      {form.company ? (
        <div className="mt-3 bg-[#111] border border-[#1a1a1a] rounded-lg p-4">
          <div className="mb-3 pb-3 border-b border-[#1a1a1a]">
            <p className="text-[10px] text-[#555]">Subject</p>
            <p className="text-xs text-white">New AI workflow brief from {form.clientName || "..."} - {form.company}</p>
          </div>
          <div className="space-y-2">
            {rows.length === 0 ? (
              <p className="text-[12px] text-[#444]">Start filling the form to see the preview</p>
            ) : (
              rows.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[11px] text-[#555] flex-shrink-0 w-28">{r.label}</span>
                  <span className="text-[11px] text-[#999] break-words">{r.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <p className="text-[12px] text-[#444] mt-3">Fill in company name and fields to see the outgoing email preview</p>
      )}
    </div>
  );
}

/* ─── Review section ─────────────────────────────────────── */

function ReviewSection({ form }: { form: RfpForm }) {
  const sectionData = SECTIONS.filter((s) => s.id !== "review");

  return (
    <div className="space-y-4">
      {sectionData.map((section) => {
        const { filled, total, complete } = getSectionCompletion(form, section);
        return (
          <div key={section.id} className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white">{section.title}</h4>
              <span className={`text-[10px] font-terminal px-2 py-0.5 rounded border ${
                complete
                  ? "text-green-400 border-green-400/20 bg-green-400/5"
                  : "text-amber-400 border-amber-400/20 bg-amber-400/5"
              }`}>
                {complete ? "Complete" : `${filled}/${total}`}
              </span>
            </div>
            <div className="space-y-1">
              {section.fields.map((field) => {
                const val = form[field];
                const display = Array.isArray(val) ? val.join(", ") : val;
                const label = FIELD_LABELS[field] || field;
                const isRequired = section.requiredFields.includes(field);
                const isFilled = isFieldFilled(form, field);
                if (!isRequired && !isFilled) return null;
                return (
                  <div key={field} className="flex gap-2">
                    <span className="text-[11px] text-[#555] flex-shrink-0 w-40 truncate">{label}{isRequired ? " *" : ""}</span>
                    <span className={`text-[11px] break-words ${isFilled ? "text-[#999]" : "text-red-400"}`}>
                      {isFilled ? display : "Missing"}
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
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => setVisible(true), []);

  const set = useCallback(<K extends keyof RfpForm>(key: K, value: RfpForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setStr = useCallback((key: keyof RfpForm) => (value: string) => {
    set(key, value as RfpForm[typeof key]);
  }, [set]);

  const setArr = useCallback((key: keyof RfpForm) => (value: string[]) => {
    set(key, value as RfpForm[typeof key]);
  }, [set]);

  const completion = useMemo(() => getTotalCompletion(form), [form]);
  const strengthLabel = useMemo(() => getStrengthLabel(completion.percent), [completion.percent]);

  const currentSection = SECTIONS[activeSection];
  const sectionCompletion = useMemo(
    () => getSectionCompletion(form, currentSection),
    [form, currentSection]
  );

  const goTo = useCallback((idx: number) => {
    setActiveSection(idx);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const applyTemplate = useCallback((tpl: typeof TEMPLATES[number]) => {
    setForm((prev) => ({ ...prev, ...tpl.data }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);

    // Client-side validation
    const missing = REQUIRED_FIELDS.filter((f) => !isFieldFilled(form, f));
    if (missing.length > 0) {
      setError(`Missing ${missing.length} required fields. Check the review section.`);
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
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  }, [form]);

  // Submitted success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-lg text-center animate-fade-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
            <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Brief delivered</h1>
          <p className="text-[#999] mb-2">
            Your workflow brief for <span className="text-white">{form.company}</span> was sent to <span className="text-white">{form.recipientEmail}</span>.
          </p>
          <p className="text-[#999] mb-6">
            A confirmation copy was sent to <span className="text-white">{form.clientEmail}</span>.
          </p>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-left mb-8">
            <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Next steps</span>
            <ul className="mt-2 space-y-1.5">
              <li className="flex items-start gap-2 text-sm text-[#888]">
                <span className="text-[#DA4E24] mt-0.5">+</span>
                Review typically begins directly from this brief
              </li>
              <li className="flex items-start gap-2 text-sm text-[#888]">
                <span className="text-[#DA4E24] mt-0.5">+</span>
                Additional details can be shared by replying to the confirmation email
              </li>
              <li className="flex items-start gap-2 text-sm text-[#888]">
                <span className="text-[#DA4E24] mt-0.5">+</span>
                Keep an eye on your inbox for follow-up
              </li>
            </ul>
          </div>
          <Link href="/" className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DA4E24] pulse-soft" />
              <span className="text-[10px] font-terminal text-[#999] uppercase tracking-widest">Workflow Brief</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI workflow intake</h1>
            <p className="text-sm text-[#666] mt-1">Scope and deliver a structured brief for any AI build</p>
          </div>

          {/* Completion meter */}
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-4 py-3">
            <div className="w-32 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${completion.percent}%`,
                  background: completion.percent === 100
                    ? "linear-gradient(90deg, #22c55e, #4ade80)"
                    : "linear-gradient(90deg, #DA4E24, #FF7847)",
                }}
              />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-terminal text-[#DA4E24]">{completion.filled}/{completion.total}</span>
              <p className="text-[10px] text-[#555]">{strengthLabel}</p>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest self-center mr-1">Templates</span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.label}
              onClick={() => applyTemplate(tpl)}
              className="text-[11px] text-[#666] bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-2.5 py-1.5 hover:text-[#DA4E24] hover:border-[#DA4E24]/30 transition-all duration-200"
              title={tpl.description}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Form workspace */}
          <div className="flex-1 lg:max-w-[63%]">
            {/* Section nav */}
            <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-none pb-1">
              {SECTIONS.map((section, i) => {
                const sc = getSectionCompletion(form, section);
                const isActive = i === activeSection;
                return (
                  <button
                    key={section.id}
                    onClick={() => goTo(i)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all duration-200 border ${
                      isActive
                        ? "bg-[#DA4E24]/10 border-[#DA4E24]/30 text-[#DA4E24]"
                        : "bg-[#0a0a0a] border-[#1a1a1a] text-[#555] hover:text-[#999] hover:border-[#333]"
                    }`}
                  >
                    {sc.complete && sc.total > 0 && (
                      <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                    {section.title}
                  </button>
                );
              })}
            </div>

            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{currentSection.title}</h2>
                {sectionCompletion.total > 0 && (
                  <span className={`text-[10px] font-terminal px-2 py-0.5 rounded border ${
                    sectionCompletion.complete
                      ? "text-green-400 border-green-400/20 bg-green-400/5"
                      : "text-[#666] border-[#1a1a1a]"
                  }`}>
                    {sectionCompletion.complete ? "Section complete" : `${sectionCompletion.filled}/${sectionCompletion.total} required`}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#555] mt-0.5">{currentSection.description}</p>
            </div>

            {/* Form sections */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 sm:p-6">
              {currentSection.id === "routing" && (
                <div className="space-y-4">
                  <TextInput label={FIELD_LABELS.recipientEmail} value={form.recipientEmail} onChange={setStr("recipientEmail")} required placeholder="who@receives-this.com" type="email" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label={FIELD_LABELS.clientName} value={form.clientName} onChange={setStr("clientName")} required placeholder="Your full name" />
                    <TextInput label={FIELD_LABELS.clientEmail} value={form.clientEmail} onChange={setStr("clientEmail")} required placeholder="you@company.com" type="email" />
                  </div>
                  <TextInput label={FIELD_LABELS.company} value={form.company} onChange={setStr("company")} required placeholder="Company name" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextInput label={FIELD_LABELS.role} value={form.role} onChange={setStr("role")} placeholder="e.g. Founder, CTO" />
                    <TextInput label={FIELD_LABELS.website} value={form.website} onChange={setStr("website")} placeholder="https://..." />
                    <TextInput label={FIELD_LABELS.location} value={form.location} onChange={setStr("location")} placeholder="City, country" />
                  </div>
                </div>
              )}

              {currentSection.id === "business" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectInput label={FIELD_LABELS.industry} value={form.industry} onChange={setStr("industry")} options={INDUSTRY_OPTIONS} required />
                    <SelectInput label={FIELD_LABELS.companyStage} value={form.companyStage} onChange={setStr("companyStage")} options={COMPANY_STAGE_OPTIONS} required />
                    <SegmentSelect label={FIELD_LABELS.teamSize} value={form.teamSize} onChange={setStr("teamSize")} options={TEAM_SIZE_OPTIONS} required />
                  </div>
                  <TextArea label={FIELD_LABELS.businessSummary} value={form.businessSummary} onChange={setStr("businessSummary")} required placeholder="What does the business do? Who are the customers? What problem does it solve?" rows={4} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectInput label={FIELD_LABELS.revenueBand} value={form.revenueBand} onChange={setStr("revenueBand")} options={REVENUE_BAND_OPTIONS} />
                    <TextInput label={FIELD_LABELS.mainMarket} value={form.mainMarket} onChange={setStr("mainMarket")} placeholder="e.g. US, DACH, Global" />
                    <TextInput label={FIELD_LABELS.growthStage} value={form.growthStage} onChange={setStr("growthStage")} placeholder="e.g. Scaling, Plateaued" />
                  </div>
                </div>
              )}

              {currentSection.id === "build" && (
                <div className="space-y-4">
                  {/* Helper chips */}
                  <div>
                    <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Quick start</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {AUTOMATION_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!form.automationRequest.includes(chip)) {
                              set("automationRequest", form.automationRequest ? `${form.automationRequest}. ${chip}` : chip as RfpForm["automationRequest"]);
                            }
                          }}
                          className="text-[11px] text-[#666] bg-[#111] border border-[#222] rounded-lg px-2.5 py-1.5 hover:text-[#DA4E24] hover:border-[#DA4E24]/30 transition-all duration-200"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextInput label={FIELD_LABELS.workflowTitle} value={form.workflowTitle} onChange={setStr("workflowTitle")} placeholder="Short name for this workflow" />
                  <TextArea label={FIELD_LABELS.automationRequest} value={form.automationRequest} onChange={setStr("automationRequest")} required placeholder="Describe what you want automated. Be as specific as possible." rows={4} />
                  <TextArea label={FIELD_LABELS.desiredOutcome} value={form.desiredOutcome} onChange={setStr("desiredOutcome")} required placeholder="What should be true when this system is running well?" rows={3} />
                  <TextArea label={FIELD_LABELS.bottleneck} value={form.bottleneck} onChange={setStr("bottleneck")} required placeholder="What is currently slow, manual, or broken?" rows={3} />
                  <TextArea label={FIELD_LABELS.expectedOutputs} value={form.expectedOutputs} onChange={setStr("expectedOutputs")} required placeholder="What does the system produce? Emails, reports, data, actions?" rows={3} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput label={FIELD_LABELS.endUsers} value={form.endUsers} onChange={setStr("endUsers")} placeholder="Who will use this system?" />
                    <TextArea label={FIELD_LABELS.currentManualProcess} value={form.currentManualProcess} onChange={setStr("currentManualProcess")} placeholder="Describe the current manual workflow" rows={2} />
                  </div>
                </div>
              )}

              {currentSection.id === "stack" && (
                <div className="space-y-4">
                  <MultiChipSelect label={FIELD_LABELS.toolsInvolved} value={form.toolsInvolved} onChange={setArr("toolsInvolved")} options={TOOL_OPTIONS} required />
                  <TextInput label={FIELD_LABELS.automationTools} value={form.automationTools} onChange={setStr("automationTools")} placeholder="e.g. Zapier, n8n, Make, custom scripts" />
                  <TextInput label={FIELD_LABELS.dataSources} value={form.dataSources} onChange={setStr("dataSources")} placeholder="e.g. Google Sheets, Postgres, APIs" />
                  <MultiChipSelect label={FIELD_LABELS.modelsInUse} value={form.modelsInUse} onChange={setArr("modelsInUse")} options={MODEL_OPTIONS} />
                  <TextArea label={FIELD_LABELS.stackDetails} value={form.stackDetails} onChange={setStr("stackDetails")} placeholder="Hosting, deployment, or infrastructure details" rows={2} />
                </div>
              )}

              {currentSection.id === "workflow" && (
                <div className="space-y-4">
                  <TextArea label={FIELD_LABELS.triggers} value={form.triggers} onChange={setStr("triggers")} required placeholder="What starts this workflow? New email, form submission, schedule, API event?" rows={3} />
                  <TextArea label={FIELD_LABELS.workflowSteps} value={form.workflowSteps} onChange={setStr("workflowSteps")} required placeholder="List the steps in order. What should the system do from trigger to output?" rows={5} />
                  <MultiChipSelect label={FIELD_LABELS.approvalRules} value={form.approvalRules} onChange={setArr("approvalRules")} options={APPROVAL_OPTIONS} required />
                  <SegmentSelect label={FIELD_LABELS.sensitivityLevel} value={form.sensitivityLevel} onChange={setStr("sensitivityLevel")} options={SENSITIVITY_OPTIONS} required />
                  <TextArea label={FIELD_LABELS.edgeCases} value={form.edgeCases} onChange={setStr("edgeCases")} placeholder="What could go wrong? What unusual inputs might appear?" rows={2} />
                  <TextArea label={FIELD_LABELS.failureRisks} value={form.failureRisks} onChange={setStr("failureRisks")} placeholder="What happens if the system fails? What is the fallback?" rows={2} />
                  <TextInput label={FIELD_LABELS.securityNotes} value={form.securityNotes} onChange={setStr("securityNotes")} placeholder="Privacy requirements, data handling rules" />
                  <TextInput label={FIELD_LABELS.accessConstraints} value={form.accessConstraints} onChange={setStr("accessConstraints")} placeholder="Who should and should not have access?" />
                </div>
              )}

              {currentSection.id === "delivery" && (
                <div className="space-y-4">
                  <TextArea label={FIELD_LABELS.successMetric} value={form.successMetric} onChange={setStr("successMetric")} required placeholder="How do you measure success? Name a number or clear outcome." rows={3} />
                  <SegmentSelect label={FIELD_LABELS.urgency} value={form.urgency} onChange={setStr("urgency")} options={URGENCY_OPTIONS} required />
                  <TextArea label={FIELD_LABELS.successDefinition} value={form.successDefinition} onChange={setStr("successDefinition")} required placeholder="What does a successful first version look like? What is the minimum viable version?" rows={4} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SegmentSelect label={FIELD_LABELS.budgetRange} value={form.budgetRange} onChange={setStr("budgetRange")} options={BUDGET_OPTIONS} />
                    <TextInput label={FIELD_LABELS.communicationStyle} value={form.communicationStyle} onChange={setStr("communicationStyle")} placeholder="e.g. Async, weekly sync, Slack" />
                  </div>
                  <TextArea label={FIELD_LABELS.referenceLinks} value={form.referenceLinks} onChange={setStr("referenceLinks")} placeholder="Links to similar tools, examples, docs, or inspiration" rows={2} />
                  <TextArea label={FIELD_LABELS.extraContext} value={form.extraContext} onChange={setStr("extraContext")} placeholder="Anything else the recipient should know" rows={3} />
                </div>
              )}

              {currentSection.id === "review" && (
                <div className="space-y-4">
                  <ReviewSection form={form} />

                  {error && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || completion.percent < 100}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-gradient glow-accent text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Submit brief
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                    {completion.percent < 100 && (
                      <span className="text-[11px] text-[#555]">
                        {completion.total - completion.filled} required fields remaining
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section navigation */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => goTo(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => goTo(Math.min(SECTIONS.length - 1, activeSection + 1))}
                disabled={activeSection === SECTIONS.length - 1}
                className="text-sm text-[#555] hover:text-[#DA4E24] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next section
              </button>
            </div>
          </div>

          {/* Right column: Guide panel (sticky on desktop) */}
          <div className="lg:w-[37%] lg:min-w-[340px]">
            <div className="lg:sticky lg:top-20">
              <GuidePanel
                sectionId={currentSection.id}
                form={form}
                guideTab={guideTab}
                setGuideTab={setGuideTab}
              />

              {/* Estimated time */}
              <div className="mt-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Estimated time</span>
                  <span className="text-[11px] text-[#888]">10-15 min</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-terminal text-[#555] uppercase tracking-widest">Sections</span>
                  <span className="text-[11px] text-[#888]">
                    {SECTIONS.filter((s) => s.id !== "review").filter((s) => getSectionCompletion(form, s).complete).length}/{SECTIONS.length - 1} done
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Honeypot - hidden from users */}
      <input type="text" name="_hp" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true" />
    </div>
  );
}
