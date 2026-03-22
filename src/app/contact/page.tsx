"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { trackFormStarted, trackFormSubmitted, trackCtaClicked } from "@/lib/analytics";

/* ═══════════════════════════════════════════════════════════════ */
/*                         DATA                                    */
/* ═══════════════════════════════════════════════════════════════ */

const HELP_OPTIONS = [
  "Contact sales",
  "Increase rate limits",
  "Business associate agreement",
  "Zero data retention",
  "Monthly invoicing",
  "Product support",
] as const;

type HelpType = (typeof HELP_OPTIONS)[number];

const PRODUCT_OPTIONS = [
  "Ultron Starter Plan",
  "Ultron Growth Plan",
  "Ultron Enterprise Plan",
  "API Access",
  "DealMaker",
  "OpenClaw",
  "Custom Solution",
];

const INDUSTRY_OPTIONS = [
  "Software",
  "Software - Healthtech",
  "Software - Fintech",
  "Software - Cybersecurity",
  "Financial Services",
  "Healthcare & Life Sciences",
  "Legal Services",
  "Professional Services",
  "Telecommunications",
  "Manufacturing & Industrial",
  "Retail & Consumer Goods",
  "Government & Public Sector",
  "Nonprofit",
  "Education",
  "Other",
];

const COUNTRY_OPTIONS = [
  "Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bangladesh","Barbados","Belgium","Belize","Benin","Bhutan","Bolivia","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso",
  "Cabo Verde","Canada","Chile","Colombia","Comoros","Congo, Republic of the","Costa Rica","Côte d'Ivoire","Croatia","Cyprus","Czechia (Czech Republic)",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","El Salvador","Estonia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Holy See (Vatican City)","Honduras","Hungary",
  "Iceland","India","Indonesia","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan",
  "Latvia","Lebanon","Lesotho","Liberia","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Niger","Nigeria","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","South Africa","South Korea","Spain","Sri Lanka","Suriname","Sweden","Switzerland",
  "Taiwan","Tanzania","Thailand","Timor-Leste, Democratic Republic of","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Tuvalu",
  "Uganda","Ukraine (except Crimea, Donetsk, and Luhansk regions)","United Arab Emirates","United Kingdom","United States of America","Uruguay",
  "Vanuatu","Vietnam",
  "Zambia",
];

const EMPLOYEE_OPTIONS = ["1-500", "501-2,500", "2,501+"];

const JOURNEY_OPTIONS = [
  "Just curious for now",
  "Actively exploring solutions for an enterprise deployment",
  "I know what I want, just need to talk to a sales person",
];

const HEARD_OPTIONS = [
  "Friend or family",
  "Google or search engine",
  "Social media",
  "Television ad",
  "Online ad",
  "News",
  "Event",
  "Podcast",
  "Billboard",
  "Other",
];

const EU_UK_OPTIONS = ["Yes", "No"];

/* Which help types show the agreement/BAA form vs the sales form */
const AGREEMENT_TYPES: HelpType[] = [
  "Increase rate limits",
  "Business associate agreement",
  "Zero data retention",
  "Monthly invoicing",
];

/* ═══════════════════════════════════════════════════════════════ */
/*                     FORM COMPONENTS                             */
/* ═══════════════════════════════════════════════════════════════ */

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[14px] text-[#ccc] mb-2">
      {children}
      {required && <span className="text-[#DA4E24] ml-0.5">*</span>}
    </label>
  );
}

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  hint,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#DA4E24]/50 transition-colors"
      />
      {hint && <p className="text-[11px] text-[#555] mt-1.5 pl-1">{hint}</p>}
    </div>
  );
}

function Select({
  options,
  value,
  onChange,
  placeholder = "Please select",
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:border-[#DA4E24]/50 transition-colors pr-10 ${
          value ? "text-white" : "text-[#444]"
        }`}
      >
        <option value="" className="text-[#444]">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-white bg-[#111]">
            {opt}
          </option>
        ))}
      </select>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-[14px] text-white placeholder-[#444] focus:outline-none focus:border-[#DA4E24]/50 transition-colors resize-none"
    />
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-5">{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════ */
/*                     SALES FORM                                  */
/* ═══════════════════════════════════════════════════════════════ */

function SalesForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    jobTitle: "",
    industry: "",
    country: "",
    product: "",
    employees: "",
    journey: "",
    message: "",
    heardFrom: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formStarted = useRef(false);

  const set = (key: keyof typeof form) => (v: string) => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStarted("sales");
    }
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = async () => {
    setError("");
    const required: (keyof typeof form)[] = ["firstName", "lastName", "email", "phone", "company", "website", "jobTitle", "industry", "country", "product", "journey", "message"];
    const missing = required.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType: "sales" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      trackFormSubmitted("sales");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold mb-1">Message sent</p>
        <p className="text-[#888] text-sm">Our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Row>
        <div>
          <Label required>First name</Label>
          <Input value={form.firstName} onChange={set("firstName")} />
        </div>
        <div>
          <Label required>Last name</Label>
          <Input value={form.lastName} onChange={set("lastName")} />
        </div>
      </Row>

      <div>
        <Label required>Business email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={set("email")}
          hint="If you're an existing user, please enter your account email."
        />
      </div>

      <div>
        <Label required>Phone number</Label>
        <Input type="tel" value={form.phone} onChange={set("phone")} />
      </div>

      <Row>
        <div>
          <Label required>Company or organization name</Label>
          <Input value={form.company} onChange={set("company")} />
        </div>
        <div>
          <Label required>Company or organization website</Label>
          <Input value={form.website} onChange={set("website")} placeholder="https://" />
        </div>
      </Row>

      <div>
        <Label required>Job title</Label>
        <Input value={form.jobTitle} onChange={set("jobTitle")} />
      </div>

      <div>
        <Label required>Industry</Label>
        <Select options={INDUSTRY_OPTIONS} value={form.industry} onChange={set("industry")} />
      </div>

      <div>
        <Label required>Company headquarters location</Label>
        <Select options={COUNTRY_OPTIONS} value={form.country} onChange={set("country")} />
      </div>

      <div>
        <Label required>Primary product interest</Label>
        <Select options={PRODUCT_OPTIONS} value={form.product} onChange={set("product")} />
      </div>

      <div>
        <Label>What is your company&apos;s employee count?</Label>
        <Select options={EMPLOYEE_OPTIONS} value={form.employees} onChange={set("employees")} />
      </div>

      <div>
        <Label required>Where are you in your evaluation journey?</Label>
        <Select options={JOURNEY_OPTIONS} value={form.journey} onChange={set("journey")} />
      </div>

      <div>
        <Label required>
          Please share a bit more about why you&apos;re contacting us and how the Ultron team can
          support you.
        </Label>
        <Textarea value={form.message} onChange={set("message")} />
      </div>

      <div>
        <Label>How did you hear about us?</Label>
        <Select options={HEARD_OPTIONS} value={form.heardFrom} onChange={set("heardFrom")} />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-2 text-sm font-semibold text-black bg-white rounded-full px-8 py-3 hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                   AGREEMENT FORM                                */
/* ═══════════════════════════════════════════════════════════════ */

function AgreementForm({ helpType }: { helpType: HelpType }) {
  const [form, setForm] = useState({
    signerFirst: "",
    signerLast: "",
    email: "",
    legalName: "",
    product: "",
    orgId: "",
    euUk: "",
    useCase: "",
    apiOnly: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formStarted = useRef(false);

  const set = (key: keyof typeof form) => (v: string) => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStarted("agreement");
    }
    setForm((prev) => ({ ...prev, [key]: v }));
  };

  const handleSubmit = async () => {
    setError("");
    const required: (keyof typeof form)[] = ["signerFirst", "signerLast", "email", "legalName", "product", "orgId", "euUk", "useCase"];
    const missing = required.filter((f) => !String(form[f]).trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType: "agreement", helpType }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      trackFormSubmitted("agreement");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold mb-1">Request submitted</p>
        <p className="text-[#888] text-sm">Our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Row>
        <div>
          <Label required>Signer first name</Label>
          <Input value={form.signerFirst} onChange={set("signerFirst")} />
        </div>
        <div>
          <Label required>Signer last name</Label>
          <Input value={form.signerLast} onChange={set("signerLast")} />
        </div>
      </Row>

      <div>
        <Label required>Business email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={set("email")}
          hint="If you're an existing user, please enter your account email."
        />
      </div>

      <div>
        <Label required>Legal company name</Label>
        <Input value={form.legalName} onChange={set("legalName")} />
      </div>

      <div>
        <Label required>Primary product interest</Label>
        <Select options={PRODUCT_OPTIONS} value={form.product} onChange={set("product")} />
      </div>

      <div>
        <Label required>What is your Ultron Organization ID?</Label>
        <Input
          value={form.orgId}
          onChange={set("orgId")}
          hint="Open your Ultron account at app.51ultron.com. Go to Settings → Your Organization to find your Organization ID."
        />
      </div>

      <div>
        <Label required>Does your company have any business entities in UK, EU, or Switzerland?</Label>
        <Select options={EU_UK_OPTIONS} value={form.euUk} onChange={set("euUk")} />
      </div>

      <div>
        <Label required>Please share your use case</Label>
        <Textarea value={form.useCase} onChange={set("useCase")} />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.apiOnly}
          onChange={(e) => setForm((prev) => ({ ...prev, apiOnly: e.target.checked }))}
          className="mt-1 w-4 h-4 rounded border-[#333] bg-[#111] accent-[#DA4E24]"
        />
        <span className="text-[13px] text-[#999]">
          I understand that this request applies to the Ultron API only
        </span>
      </label>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-2 text-sm font-semibold text-black bg-white rounded-full px-8 py-3 hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                   SUPPORT MESSAGE                               */
/* ═══════════════════════════════════════════════════════════════ */

function SupportMessage() {
  function openIntercom() {
    if (typeof window !== "undefined" && typeof (window as any).Intercom === "function") {
      const w = window as any;
      w.Intercom("update", w.intercomSettings);
      w.Intercom("show");
    }
  }

  return (
    <p className="text-[15px] text-[#999] mt-6">
      For product support, please{" "}
      <button
        onClick={openIntercom}
        className="text-[#DA4E24] hover:text-white underline underline-offset-4 transition-colors"
      >
        click here
      </button>{" "}
      to chat with our team.
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*                       PAGE                                      */
/* ═══════════════════════════════════════════════════════════════ */

export default function ContactPage() {
  const [helpType, setHelpType] = useState<HelpType | "">("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const isSales = helpType === "Contact sales";
  const isAgreement = helpType !== "" && AGREEMENT_TYPES.includes(helpType as HelpType);
  const isSupport = helpType === "Product support";
  const showForm = isSales || isAgreement;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-20">
        {/* Header */}
        <div
          className={`mb-10 transition-all duration-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Contact sales</h1>
          <p className="text-[17px] text-[#999] leading-relaxed">
            Our sales team can provide additional resources and support for the Ultron platform and
            Ultron for Business.
          </p>
        </div>

        {/* Form card */}
        <div
          className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 transition-all duration-500 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Help type selector — always visible */}
          <div className="mb-6">
            <Label required>What can we help you with?</Label>
            <Select
              options={[...HELP_OPTIONS]}
              value={helpType}
              onChange={(v) => setHelpType(v as HelpType | "")}
            />
          </div>

          {/* Conditional form */}
          {isSales && <SalesForm />}
          {isAgreement && <AgreementForm helpType={helpType as HelpType} />}
        </div>

        {/* Support message — outside card */}
        {isSupport && <SupportMessage />}
      </div>

      {/* ─── BOTTOM CTA + FOOTER ─── */}
      <section className="relative mt-24 lg:mt-32 overflow-hidden">
        <div className="absolute inset-0 z-0 scale-[1.4]">
          <Image
            src="/footer-background.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-40 z-[1] bg-gradient-to-b from-black to-transparent" />

        <div className="relative z-10 pt-24 lg:pt-40 text-center">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Ultron"
              width={64}
              height={64}
              className="rounded-lg animate-logo-spin"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] mb-4">
            Scale quality of your work
            <br />
            not size of your team
          </h2>
          <p className="text-[#999] text-lg mb-8">Run your business on autopilot</p>

          <div className="flex items-center justify-center gap-4 mb-16 lg:mb-24">
            <Link
              href="https://app.51ultron.com/signup"
              onClick={() => trackCtaClicked("Try for free", "contact_bottom", "https://app.51ultron.com/signup")}
              className="text-sm font-semibold text-white border border-[#DA4E24] rounded-full px-8 py-3 hover:bg-[#DA4E24]/10 transition-all"
            >
              Try for free
            </Link>
            <Link
              href="/pricing"
              onClick={() => trackCtaClicked("View Pricing", "contact_bottom", "/pricing")}
              className="text-sm font-semibold text-white border border-[#333] rounded-full px-8 py-3 hover:border-[#555] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="relative z-10">
          <Footer />
        </div>
      </section>
    </div>
  );
}
