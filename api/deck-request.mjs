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
const RATE_LIMIT = 10;
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

function buildNotificationHtml(data) {
  const docs = data.documents.join(", ");
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:24px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Investor Document Request</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">New request from ${data.email}</h1>
  </div>
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:6px 12px 6px 0;color:#999;font-size:13px;vertical-align:top;white-space:nowrap">Email</td><td style="padding:6px 0;color:#fff;font-size:13px">${data.email}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#999;font-size:13px;vertical-align:top;white-space:nowrap">Documents</td><td style="padding:6px 0;color:#fff;font-size:13px">${docs}</td></tr>
  </table>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron investor deck page
  </div>
</div>
</body></html>`;
}

function buildConfirmationHtml(data) {
  const docs = data.documents.join(", ");
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:16px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Request Received</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">We received your document request</h1>
  </div>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 16px">
    You requested: <strong style="color:#fff">${docs}</strong>
  </p>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
    Our team will review your request and send the documents to your email shortly.
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

  // Validate
  if (!body.email || !isValidEmail(body.email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }
  if (!body.documents || !Array.isArray(body.documents) || body.documents.length === 0) {
    return res.status(400).json({ error: "At least one document must be selected" });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    // Email 1: Notification to you
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: body.email,
      subject: `Investor doc request from ${body.email} — ${body.documents.join(", ")}`,
      html: buildNotificationHtml(body),
    });

    // Email 2: Confirmation to the requester
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.email,
      subject: "Your document request — NXT Enterprises",
      html: buildConfirmationHtml(body),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Deck request email error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Failed to send: ${message}` });
  }
}
