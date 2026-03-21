import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "briefs@51ultron.com";
const NOTIFY_EMAIL = "catalin@nexitynetwork.org";

/* ── Validation ───────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Rate limiting (in-memory, per-instance) ──── */

const submissions = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const times = (submissions.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  submissions.set(ip, times);
  if (times.length >= RATE_LIMIT) return true;
  times.push(now);
  return false;
}

/* ── Email HTML builders ──────────────────────── */

function row(label, value) {
  if (!value || (typeof value === "string" && !value.trim())) return "";
  const display = String(value).replace(/\n/g, "<br>");
  return `<tr><td style="padding:6px 12px 6px 0;color:#999;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#fff;font-size:13px">${display}</td></tr>`;
}

function sectionHeader(title) {
  return `<tr><td colspan="2" style="padding:20px 0 8px;border-bottom:1px solid #1a1a1a"><span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${title}</span></td></tr>`;
}

function buildSalesHtml(data) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:24px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Sales Inquiry</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">${data.firstName} ${data.lastName}</h1>
    <p style="color:#999;font-size:13px;margin:0">${data.email} &middot; ${data.company}</p>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${sectionHeader("Contact")}
    ${row("Name", `${data.firstName} ${data.lastName}`)}
    ${row("Email", data.email)}
    ${row("Phone", data.phone)}
    ${row("Company", data.company)}
    ${row("Website", data.website)}
    ${row("Job title", data.jobTitle)}
    ${sectionHeader("Company")}
    ${row("Industry", data.industry)}
    ${row("Country", data.country)}
    ${row("Employees", data.employees)}
    ${sectionHeader("Interest")}
    ${row("Product", data.product)}
    ${row("Journey stage", data.journey)}
    ${row("Heard from", data.heardFrom)}
    ${sectionHeader("Message")}
    ${row("Message", data.message)}
  </table>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron contact form
  </div>
</div>
</body></html>`;
}

function buildAgreementHtml(data) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:24px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${data.helpType}</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">${data.signerFirst} ${data.signerLast}</h1>
    <p style="color:#999;font-size:13px;margin:0">${data.email} &middot; ${data.legalName}</p>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${sectionHeader("Signer")}
    ${row("Name", `${data.signerFirst} ${data.signerLast}`)}
    ${row("Email", data.email)}
    ${row("Legal company name", data.legalName)}
    ${sectionHeader("Request Details")}
    ${row("Request type", data.helpType)}
    ${row("Product interest", data.product)}
    ${row("Organization ID", data.orgId)}
    ${row("EU/UK business", data.euUk)}
    ${row("API only", data.apiOnly ? "Yes" : "No")}
    ${sectionHeader("Use Case")}
    ${row("Use case", data.useCase)}
  </table>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron contact form
  </div>
</div>
</body></html>`;
}

function buildConfirmationHtml(name, formType) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:16px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Request Received</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">We got your message, ${name}</h1>
  </div>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 16px">
    Thank you for reaching out. Our team will review your <strong style="color:#fff">${formType}</strong> request and get back to you shortly.
  </p>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
    If you need immediate assistance, you can reach us via the chat widget on our website.
  </p>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron
  </div>
</div>
</body></html>`;
}

/* ── Handler ──────────────────────────────────── */

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;

  // Honeypot check
  if (body._hp) {
    return res.status(200).json({ success: true });
  }

  // Rate limiting
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many submissions. Please try again later." });
  }

  const formType = body.formType; // "sales" or "agreement"

  // Validate by form type
  if (formType === "sales") {
    const required = ["firstName", "lastName", "email", "phone", "company", "website", "jobTitle", "industry", "country", "product", "journey", "message"];
    const missing = required.filter((f) => !body[f] || !String(body[f]).trim());
    if (missing.length > 0) {
      return res.status(400).json({ error: "Missing required fields", fields: missing });
    }
  } else if (formType === "agreement") {
    const required = ["signerFirst", "signerLast", "email", "legalName", "product", "orgId", "euUk", "useCase"];
    const missing = required.filter((f) => !body[f] || !String(body[f]).trim());
    if (missing.length > 0) {
      return res.status(400).json({ error: "Missing required fields", fields: missing });
    }
  } else {
    return res.status(400).json({ error: "Invalid form type" });
  }

  if (!isValidEmail(body.email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const isSales = formType === "sales";
    const name = isSales ? `${body.firstName} ${body.lastName}` : `${body.signerFirst} ${body.signerLast}`;
    const company = isSales ? body.company : body.legalName;
    const subject = isSales
      ? `New sales inquiry from ${name} — ${company}`
      : `New ${body.helpType || "agreement"} request from ${name} — ${company}`;

    // Email 1: Notification to you
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: body.email,
      subject,
      html: isSales ? buildSalesHtml(body) : buildAgreementHtml(body),
    });

    // Email 2: Confirmation to the submitter
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.email,
      subject: "We received your request — Ultron",
      html: buildConfirmationHtml(name, isSales ? "sales inquiry" : body.helpType || "agreement"),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact form email error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Failed to send: ${message}` });
  }
}
