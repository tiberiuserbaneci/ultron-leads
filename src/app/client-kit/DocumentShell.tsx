"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { TemplateConfig, TemplateField } from "./templateData";

/* ─── Types ─── */
type FieldValues = Record<string, string>;
type RowValues = Record<string, string[][]>;

/* ─── Editable Text / Textarea ─── */
function EditableText({
  field,
  value,
  onChange,
  theme,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
  theme: "dark" | "light";
}) {
  const isTextarea = field.type === "textarea";
  const inputColor = theme === "dark" ? "text-[#ddd]" : "text-[#111]";
  const phColor = theme === "dark" ? "placeholder:text-[#444]" : "placeholder:text-[#bbb]";
  const hoverBorder = theme === "dark" ? "hover:border-[#333]" : "hover:border-[#ccc]";
  const labelColor = theme === "dark" ? "text-[#666]" : "text-[#888]";
  const base = `w-full bg-transparent outline-none text-[14px] leading-relaxed ${inputColor} ${phColor} border-b border-transparent ${hoverBorder} focus:border-[#DA4E24] transition-colors print:text-black print:border-transparent`;

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-1 uppercase tracking-wider print:text-[#888] font-terminal`}>
        {field.label}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${base} resize-none min-h-[60px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={base}
        />
      )}
    </div>
  );
}

/* ─── Editable Date ─── */
function EditableDate({
  field,
  value,
  onChange,
  theme,
}: {
  field: TemplateField;
  value: string;
  onChange: (v: string) => void;
  theme: "dark" | "light";
}) {
  const inputColor = theme === "dark" ? "text-[#ddd]" : "text-[#111]";
  const phColor = theme === "dark" ? "placeholder:text-[#444]" : "placeholder:text-[#bbb]";
  const hoverBorder = theme === "dark" ? "hover:border-[#333]" : "hover:border-[#ccc]";
  const labelColor = theme === "dark" ? "text-[#666]" : "text-[#888]";

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-1 uppercase tracking-wider print:text-[#888] font-terminal`}>
        {field.label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`w-full bg-transparent outline-none text-[14px] ${inputColor} ${phColor} print:text-black border-b border-transparent ${hoverBorder} focus:border-[#DA4E24] transition-colors`}
      />
    </div>
  );
}

/* ─── Editable Table Rows ─── */
function EditableRows({
  field,
  rows,
  onChange,
  theme,
}: {
  field: TemplateField;
  rows: string[][];
  onChange: (rows: string[][]) => void;
  theme: "dark" | "light";
}) {
  const cols = field.columns || [];
  const labelColor = theme === "dark" ? "text-[#666]" : "text-[#888]";
  const thBorder = theme === "dark" ? "border-[#1a1a1a]" : "border-[#e5e5e5]";
  const thColor = theme === "dark" ? "text-[#555]" : "text-[#888]";
  const tdBorder = theme === "dark" ? "border-[#111]" : "border-[#f0f0f0]";
  const cellColor = theme === "dark" ? "text-[#ccc]" : "text-[#111]";
  const phColor = theme === "dark" ? "placeholder:text-[#333]" : "placeholder:text-[#bbb]";

  const updateCell = (ri: number, ci: number, val: string) => {
    const updated = rows.map((r) => [...r]);
    updated[ri][ci] = val;
    onChange(updated);
  };
  const addRow = () => onChange([...rows, cols.map(() => "")]);
  const removeRow = (idx: number) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-2 uppercase tracking-wider print:text-[#888] font-terminal`}>
        {field.label}
      </label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {cols.map((col) => (
                <th key={col} className={`text-left text-[10px] font-semibold ${thColor} uppercase tracking-wider pb-2 pr-3 border-b ${thBorder} print:border-[#ccc] font-terminal`}>
                  {col}
                </th>
              ))}
              <th className="w-8 print:hidden" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="group/row">
                {row.map((cell, ci) => (
                  <td key={ci} className={`pr-3 py-1.5 border-b ${tdBorder} print:border-[#ddd]`}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      placeholder={`${cols[ci]}...`}
                      className={`w-full bg-transparent outline-none text-[13px] ${cellColor} ${phColor} print:text-black focus:text-[#DA4E24]`}
                    />
                  </td>
                ))}
                <td className="print:hidden">
                  <button onClick={() => removeRow(ri)} className="opacity-0 group-hover/row:opacity-100 text-[#555] hover:text-[#DA4E24] transition-all text-xs" title="Remove row">&times;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="mt-2 text-[11px] text-[#555] hover:text-[#DA4E24] transition-colors print:hidden">
        + Add row
      </button>
    </div>
  );
}

/* ─── Send Modal ─── */
function SendModal({
  template,
  fields,
  rows,
  onClose,
  theme,
}: {
  template: TemplateConfig;
  fields: FieldValues;
  rows: RowValues;
  onClose: () => void;
  theme: "dark" | "light";
}) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme === "dark";
  const surfaceBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-[#e5e5e5]";
  const inputBg = isDark ? "bg-[#111]" : "bg-[#f9f9f9]";
  const inputBorder = isDark ? "border-[#222]" : "border-[#ddd]";
  const inputText = isDark ? "text-[#ddd]" : "text-[#111]";
  const labelText = isDark ? "text-[#666]" : "text-[#888]";
  const phColor = isDark ? "placeholder:text-[#444]" : "placeholder:text-[#bbb]";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSend = async () => {
    if (!recipientEmail.trim()) { setError("Recipient email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) { setError("Enter a valid email address"); return; }

    setSending(true);
    setError("");

    // Build sections payload
    const sections = template.sections.map((section) => ({
      title: section.title,
      fields: section.fields.map((field) => {
        if (field.type === "rows") {
          return {
            label: field.label,
            type: "rows" as const,
            columns: field.columns,
            rows: rows[field.id] || [],
          };
        }
        return {
          label: field.label,
          type: field.type,
          value: fields[field.id] || "",
        };
      }),
    }));

    try {
      const res = await fetch("/api/client-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          fromName: fromName.trim(),
          fromEmail: fromEmail.trim(),
          templateName: template.name,
          templateBadge: template.badge,
          sections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send");
        setSending(false);
        return;
      }
      setSent(true);
      setSending(false);
    } catch {
      setError("Network error. Please try again.");
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md ${surfaceBg} border ${borderColor} rounded-2xl overflow-hidden animate-fade-in`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${borderColor}`}>
          <div>
            <h3 className={`text-[14px] font-semibold ${isDark ? "text-white" : "text-[#111]"}`}>
              {sent ? "Document sent" : "Send document"}
            </h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              {sent ? "Check your inbox for a confirmation" : template.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex items-center justify-center w-7 h-7 rounded-lg border ${isDark ? "border-[#222] text-[#555] hover:text-white" : "border-[#ddd] text-[#bbb] hover:text-black"} transition-colors`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full border border-[#DA4E24]/30 flex items-center justify-center mx-auto mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DA4E24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className={`text-[13px] ${isDark ? "text-[#999]" : "text-[#666]"}`}>
                Sent to <strong className={isDark ? "text-white" : "text-[#111]"}>{recipientEmail}</strong>
              </p>
              <button
                onClick={onClose}
                className="mt-4 text-[12px] text-[#DA4E24] hover:underline"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Recipient */}
              <div className="mb-3">
                <label className={`block text-[11px] font-medium ${labelText} mb-1 uppercase tracking-wider font-terminal`}>
                  Send to <span className="text-[#DA4E24]">*</span>
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@company.com"
                  className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} text-[13px] ${inputText} ${phColor} outline-none focus:border-[#DA4E24] transition-colors`}
                />
              </div>

              {/* From name */}
              <div className="mb-3">
                <label className={`block text-[11px] font-medium ${labelText} mb-1 uppercase tracking-wider font-terminal`}>
                  Your name
                </label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your name"
                  className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} text-[13px] ${inputText} ${phColor} outline-none focus:border-[#DA4E24] transition-colors`}
                />
              </div>

              {/* From email */}
              <div className="mb-4">
                <label className={`block text-[11px] font-medium ${labelText} mb-1 uppercase tracking-wider font-terminal`}>
                  Your email <span className={`font-normal normal-case tracking-normal ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>(for confirmation copy)</span>
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full px-3 py-2 rounded-lg ${inputBg} border ${inputBorder} text-[13px] ${inputText} ${phColor} outline-none focus:border-[#DA4E24] transition-colors`}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-[12px] text-[#DA4E24] mb-3">{error}</p>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full text-[13px] font-semibold text-white border border-[#DA4E24] rounded-full py-2.5 hover:bg-[#DA4E24]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  "Sending..."
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                    </svg>
                    Send document
                  </>
                )}
              </button>

              <p className={`text-[10px] text-center mt-2 ${isDark ? "text-[#444]" : "text-[#bbb]"}`}>
                Document content will be formatted and sent as an email
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Utility button helper ─── */
function BarButton({
  onClick,
  label,
  active,
  theme,
}: {
  onClick: () => void;
  label: string;
  active?: boolean;
  theme: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const cls = active
    ? "border-[#DA4E24]/30 text-[#DA4E24]"
    : isDark
    ? "border-[#222] text-[#666] hover:text-white hover:border-[#333]"
    : "border-[#ddd] text-[#999] hover:text-black hover:border-[#bbb]";
  return (
    <button onClick={onClick} className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${cls}`}>
      {label}
    </button>
  );
}

/* ─── Main Document Shell ─── */
export default function DocumentShell({ template }: { template: TemplateConfig }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fields, setFields] = useState<FieldValues>({});
  const [rows, setRows] = useState<RowValues>(() => {
    const initial: RowValues = {};
    for (const section of template.sections) {
      for (const field of section.fields) {
        if (field.type === "rows" && field.columns) {
          initial[field.id] = Array.from({ length: field.defaultRows || 3 }, () =>
            field.columns!.map(() => "")
          );
        }
      }
    }
    return initial;
  });
  const [saved, setSaved] = useState(false);
  const [showSend, setShowSend] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`ck-${template.slug}`);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.fields) setFields(data.fields);
        if (data.rows) setRows(data.rows);
        if (data.theme) setTheme(data.theme);
      }
    } catch {
      // ignore
    }
  }, [template.slug]);

  const saveLocal = useCallback(() => {
    try {
      localStorage.setItem(`ck-${template.slug}`, JSON.stringify({ fields, rows, theme }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* ignore */ }
  }, [fields, rows, theme, template.slug]);

  const updateField = useCallback((id: string, value: string) => {
    setFields((prev) => ({ ...prev, [id]: value }));
  }, []);

  const updateRows = useCallback((id: string, value: string[][]) => {
    setRows((prev) => ({ ...prev, [id]: value }));
  }, []);

  const resetTemplate = useCallback(() => {
    setFields({});
    const initial: RowValues = {};
    for (const section of template.sections) {
      for (const field of section.fields) {
        if (field.type === "rows" && field.columns) {
          initial[field.id] = Array.from({ length: field.defaultRows || 3 }, () =>
            field.columns!.map(() => "")
          );
        }
      }
    }
    setRows(initial);
    localStorage.removeItem(`ck-${template.slug}`);
  }, [template]);

  const isDark = theme === "dark";
  const themeClasses = isDark ? "bg-black text-white" : "bg-white text-[#111]";
  const surfaceClasses = isDark ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-white border-[#e5e5e5]";
  const borderDiv = isDark ? "border-[#1a1a1a]" : "border-[#e5e5e5]";

  return (
    <div className={`min-h-screen transition-colors ${themeClasses}`} data-theme={theme}>
      {/* Utility Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 print:hidden">
        <div className={`border-b backdrop-blur-md ${isDark ? "bg-black/90 border-[#1a1a1a]" : "bg-white/90 border-[#e5e5e5]"}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
            {/* Left */}
            <Link
              href="/client-kit"
              className={`flex items-center gap-1.5 text-[12px] transition-colors ${isDark ? "text-[#666] hover:text-white" : "text-[#999] hover:text-black"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Templates
            </Link>

            {/* Center */}
            <span className={`text-[12px] font-terminal hidden sm:block ${isDark ? "text-[#555]" : "text-[#999]"}`}>
              {template.name}
            </span>

            {/* Right */}
            <div className="flex items-center gap-2">
              <BarButton onClick={saveLocal} label={saved ? "Saved" : "Save"} active={saved} theme={theme} />
              <button
                onClick={() => setShowSend(true)}
                className="text-[11px] px-2.5 py-1 rounded-md border transition-all border-[#DA4E24]/30 text-[#DA4E24] hover:bg-[#DA4E24]/10 flex items-center gap-1.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                </svg>
                Send
              </button>
              <BarButton onClick={() => window.print()} label="Print" theme={theme} />
              <BarButton onClick={() => setTheme(isDark ? "light" : "dark")} label={isDark ? "Light" : "Dark"} theme={theme} />
              <button
                onClick={resetTemplate}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all hidden sm:block ${isDark ? "border-[#222] text-[#444] hover:text-[#DA4E24] hover:border-[#DA4E24]/30" : "border-[#ddd] text-[#ccc] hover:text-[#DA4E24] hover:border-[#DA4E24]/30"}`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document */}
      <div className="pt-16 pb-20 px-4 sm:px-6 print:pt-0 print:pb-0 print:px-0">
        <div className={`max-w-3xl mx-auto rounded-xl border print:border-0 print:rounded-none print:max-w-none ${surfaceClasses}`}>

          {/* Document Header */}
          <div className={`px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b ${borderDiv} print:border-[#ddd]`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-[#111]"} print:text-black`}>
                  {template.name}
                </h1>
                <p className={`text-[13px] mt-1 ${isDark ? "text-[#777]" : "text-[#888]"} print:text-[#666]`}>
                  {template.shortDescription}
                </p>
              </div>
              <span className={`text-[10px] font-terminal px-2 py-0.5 rounded border flex-shrink-0 ${isDark ? "border-[#222] text-[#555]" : "border-[#ddd] text-[#bbb]"} print:border-[#ccc] print:text-[#999]`}>
                {template.badge}
              </span>
            </div>
          </div>

          {/* Sections */}
          {template.sections.map((section, si) => (
            <div
              key={section.id}
              className={`px-6 sm:px-10 py-6 ${si < template.sections.length - 1 ? `border-b ${borderDiv} print:border-[#ddd]` : ""}`}
            >
              <h2 className="text-[13px] font-bold uppercase tracking-wider mb-4 text-[#DA4E24] print:text-[#DA4E24] font-terminal">
                {section.title}
              </h2>
              {section.fields.map((field) => {
                if (field.type === "rows") {
                  return <EditableRows key={field.id} field={field} rows={rows[field.id] || []} onChange={(val) => updateRows(field.id, val)} theme={theme} />;
                }
                if (field.type === "date") {
                  return <EditableDate key={field.id} field={field} value={fields[field.id] || ""} onChange={(val) => updateField(field.id, val)} theme={theme} />;
                }
                return <EditableText key={field.id} field={field} value={fields[field.id] || ""} onChange={(val) => updateField(field.id, val)} theme={theme} />;
              })}
            </div>
          ))}

          {/* Footer */}
          <div className={`px-6 sm:px-10 py-4 text-center border-t ${borderDiv} print:border-[#ddd]`}>
            <p className={`text-[10px] font-terminal ${isDark ? "text-[#333]" : "text-[#ddd]"} print:text-[#ccc]`}>
              Created with Client Kit by Ultron
            </p>
          </div>
        </div>

        <p className={`text-center text-[11px] mt-4 print:hidden ${isDark ? "text-[#333]" : "text-[#ccc]"}`}>
          Ctrl+P or Cmd+P to print. Your edits are preserved in the output.
        </p>
      </div>

      {/* Send Modal */}
      {showSend && (
        <SendModal
          template={template}
          fields={fields}
          rows={rows}
          onClose={() => setShowSend(false)}
          theme={theme}
        />
      )}
    </div>
  );
}
