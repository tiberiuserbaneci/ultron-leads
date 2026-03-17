"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { TemplateConfig, TemplateField } from "./templateData";

/* ─── Types ─── */
type FieldValues = Record<string, string>;
type RowValues = Record<string, string[][]>;

/* ─── Editable Text Field ─── */
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
  const labelColor = theme === "dark" ? "text-[#555]" : "text-[#999]";
  const inputColor = theme === "dark" ? "text-[#ddd]" : "text-[#111]";
  const placeholderColor = theme === "dark" ? "placeholder:text-[#333]" : "placeholder:text-[#ccc]";
  const borderColor = theme === "dark" ? "hover:border-[#222] focus:border-[#DA4E24]" : "hover:border-[#ddd] focus:border-[#DA4E24]";

  const baseClasses = `w-full bg-transparent outline-none text-[14px] leading-relaxed ${inputColor} ${placeholderColor} border-b border-transparent ${borderColor} transition-colors print:text-black print:border-transparent`;

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-1 uppercase tracking-wider print:text-[#999] font-terminal`}>
        {field.label}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseClasses} resize-none min-h-[60px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

/* ─── Editable Date Field ─── */
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
  const labelColor = theme === "dark" ? "text-[#555]" : "text-[#999]";
  const inputColor = theme === "dark" ? "text-[#ddd]" : "text-[#111]";
  const placeholderColor = theme === "dark" ? "placeholder:text-[#333]" : "placeholder:text-[#ccc]";
  const borderColor = theme === "dark" ? "hover:border-[#222]" : "hover:border-[#ddd]";

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-1 uppercase tracking-wider print:text-[#999] font-terminal`}>
        {field.label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`w-full bg-transparent outline-none text-[14px] ${inputColor} ${placeholderColor} print:text-black border-b border-transparent ${borderColor} focus:border-[#DA4E24] transition-colors`}
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
  const labelColor = theme === "dark" ? "text-[#555]" : "text-[#999]";
  const thBorder = theme === "dark" ? "border-[#1a1a1a]" : "border-[#e5e5e5]";
  const thColor = theme === "dark" ? "text-[#555]" : "text-[#888]";
  const tdBorder = theme === "dark" ? "border-[#111]" : "border-[#f0f0f0]";
  const cellColor = theme === "dark" ? "text-[#ccc]" : "text-[#111]";
  const phColor = theme === "dark" ? "placeholder:text-[#333]" : "placeholder:text-[#ccc]";

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const updated = rows.map((r) => [...r]);
    updated[rowIdx][colIdx] = val;
    onChange(updated);
  };

  const addRow = () => {
    onChange([...rows, cols.map(() => "")]);
  };

  const removeRow = (idx: number) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      <label className={`block text-[11px] font-medium ${labelColor} mb-2 uppercase tracking-wider print:text-[#999] font-terminal`}>
        {field.label}
      </label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {cols.map((col) => (
                <th
                  key={col}
                  className={`text-left text-[10px] font-semibold ${thColor} uppercase tracking-wider pb-2 pr-3 border-b ${thBorder} print:border-[#ccc] font-terminal`}
                >
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
                  <button
                    onClick={() => removeRow(ri)}
                    className="opacity-0 group-hover/row:opacity-100 text-[#ccc] hover:text-[#DA4E24] transition-all text-xs"
                    title="Remove row"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addRow}
        className="mt-2 text-[11px] text-[#999] hover:text-[#DA4E24] transition-colors print:hidden"
      >
        + Add row
      </button>
    </div>
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

  // Save to localStorage
  const saveLocal = useCallback(() => {
    try {
      localStorage.setItem(
        `ck-${template.slug}`,
        JSON.stringify({ fields, rows, theme })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    }
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

  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const themeClasses = theme === "dark"
    ? "bg-black text-white"
    : "bg-white text-[#111]";

  const surfaceClasses = theme === "dark"
    ? "bg-[#0a0a0a] border-[#1a1a1a]"
    : "bg-white border-[#e5e5e5]";

  return (
    <div className={`min-h-screen transition-colors ${themeClasses}`} data-theme={theme}>
      {/* Utility Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 print:hidden">
        <div className={`border-b backdrop-blur-md ${theme === "dark" ? "bg-black/90 border-[#1a1a1a]" : "bg-white/90 border-[#e5e5e5]"}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
            {/* Left: back to library */}
            <Link
              href="/client-kit"
              className={`flex items-center gap-1.5 text-[12px] transition-colors ${theme === "dark" ? "text-[#666] hover:text-white" : "text-[#999] hover:text-black"}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Templates
            </Link>

            {/* Center: doc name */}
            <span className={`text-[12px] font-terminal hidden sm:block ${theme === "dark" ? "text-[#555]" : "text-[#999]"}`}>
              {template.name}
            </span>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={saveLocal}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  saved
                    ? "border-[#DA4E24]/30 text-[#DA4E24]"
                    : theme === "dark"
                    ? "border-[#222] text-[#666] hover:text-white hover:border-[#333]"
                    : "border-[#ddd] text-[#999] hover:text-black hover:border-[#bbb]"
                }`}
              >
                {saved ? "Saved" : "Save"}
              </button>
              <button
                onClick={toggleTheme}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${theme === "dark" ? "border-[#222] text-[#666] hover:text-white hover:border-[#333]" : "border-[#ddd] text-[#999] hover:text-black hover:border-[#bbb]"}`}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <button
                onClick={handlePrint}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${theme === "dark" ? "border-[#222] text-[#666] hover:text-white hover:border-[#333]" : "border-[#ddd] text-[#999] hover:text-black hover:border-[#bbb]"}`}
              >
                Print
              </button>
              <button
                onClick={resetTemplate}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${theme === "dark" ? "border-[#222] text-[#555] hover:text-[#DA4E24] hover:border-[#DA4E24]/30" : "border-[#ddd] text-[#bbb] hover:text-[#DA4E24] hover:border-[#DA4E24]/30"}`}
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
          <div className={`px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b ${theme === "dark" ? "border-[#1a1a1a]" : "border-[#e5e5e5]"} print:border-[#ddd]`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-[#111]"} print:text-black`}>
                  {template.name}
                </h1>
                <p className={`text-[13px] mt-1 ${theme === "dark" ? "text-[#666]" : "text-[#999]"} print:text-[#666]`}>
                  {template.shortDescription}
                </p>
              </div>
              <span className={`text-[10px] font-terminal px-2 py-0.5 rounded border flex-shrink-0 ${theme === "dark" ? "border-[#222] text-[#555]" : "border-[#ddd] text-[#bbb]"} print:border-[#ccc] print:text-[#999]`}>
                {template.badge}
              </span>
            </div>
          </div>

          {/* Document Sections */}
          {template.sections.map((section, si) => (
            <div
              key={section.id}
              className={`px-6 sm:px-10 py-6 ${si < template.sections.length - 1 ? `border-b ${theme === "dark" ? "border-[#1a1a1a]" : "border-[#e5e5e5]"} print:border-[#ddd]` : ""}`}
            >
              <h2 className={`text-[13px] font-bold uppercase tracking-wider mb-4 ${theme === "dark" ? "text-[#DA4E24]" : "text-[#DA4E24]"} print:text-[#DA4E24] font-terminal`}>
                {section.title}
              </h2>

              {section.fields.map((field) => {
                if (field.type === "rows") {
                  return (
                    <EditableRows
                      key={field.id}
                      field={field}
                      rows={rows[field.id] || []}
                      onChange={(val) => updateRows(field.id, val)}
                      theme={theme}
                    />
                  );
                }
                if (field.type === "date") {
                  return (
                    <EditableDate
                      key={field.id}
                      field={field}
                      value={fields[field.id] || ""}
                      onChange={(val) => updateField(field.id, val)}
                      theme={theme}
                    />
                  );
                }
                return (
                  <EditableText
                    key={field.id}
                    field={field}
                    value={fields[field.id] || ""}
                    onChange={(val) => updateField(field.id, val)}
                    theme={theme}
                  />
                );
              })}
            </div>
          ))}

          {/* Document Footer */}
          <div className={`px-6 sm:px-10 py-4 text-center border-t ${theme === "dark" ? "border-[#1a1a1a]" : "border-[#e5e5e5]"} print:border-[#ddd]`}>
            <p className={`text-[10px] font-terminal ${theme === "dark" ? "text-[#333]" : "text-[#ddd]"} print:text-[#ccc]`}>
              Created with Client Kit by Ultron
            </p>
          </div>
        </div>

        {/* Print hint */}
        <p className={`text-center text-[11px] mt-4 print:hidden ${theme === "dark" ? "text-[#333]" : "text-[#ccc]"}`}>
          Use Ctrl+P or Cmd+P to print. Your edits are preserved in the print output.
        </p>
      </div>
    </div>
  );
}
