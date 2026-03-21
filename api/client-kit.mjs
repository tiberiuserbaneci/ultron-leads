import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "briefs@51ultron.com";
const NOTIFY_EMAIL = "catalin@nexitynetwork.org";
const INTERNAL_BCC_EMAIL = process.env.INTERNAL_BCC_EMAIL;

/* ── Validation ──────────────────────────────── */

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

/* ── Email HTML builder ─────────────────────── */

function row(label, value) {
  if (!value || (typeof value === "string" && !value.trim())) return "";
  const display = String(value).replace(/\n/g, "<br>");
  return `<tr><td style="padding:6px 12px 6px 0;color:#999;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#fff;font-size:13px;line-height:1.5">${display}</td></tr>`;
}

function sectionHeader(title) {
  return `<tr><td colspan="2" style="padding:20px 0 8px;border-bottom:1px solid #1a1a1a"><span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${title}</span></td></tr>`;
}

function tableBlock(columns, rows) {
  if (!rows || rows.length === 0) return "";
  const hasContent = rows.some((r) => r.some((c) => c && c.trim()));
  if (!hasContent) return "";

  let html = `<tr><td colspan="2" style="padding:8px 0"><table style="width:100%;border-collapse:collapse;font-size:12px">`;
  html += `<tr>`;
  for (const col of columns) {
    html += `<th style="text-align:left;padding:4px 8px;color:#888;border-bottom:1px solid #1a1a1a;font-size:10px;text-transform:uppercase;letter-spacing:0.05em">${col}</th>`;
  }
  html += `</tr>`;

  for (const r of rows) {
    const hasData = r.some((c) => c && c.trim());
    if (!hasData) continue;
    html += `<tr>`;
    for (const cell of r) {
      html += `<td style="padding:4px 8px;color:#ccc;border-bottom:1px solid #111">${cell || ""}</td>`;
    }
    html += `</tr>`;
  }

  html += `</table></td></tr>`;
  return html;
}

function buildDocumentHtml(data) {
  const { templateName, templateBadge, sections } = data;

  let tableRows = "";
  for (const section of sections) {
    tableRows += sectionHeader(section.title);
    for (const field of section.fields) {
      if (field.type === "rows" && field.rows) {
        tableRows += tableBlock(field.columns || [], field.rows);
      } else if (field.value) {
        tableRows += row(field.label, field.value);
      }
    }
  }

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:24px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${templateBadge}</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">${templateName}</h1>
    ${data.fromName ? `<p style="color:#999;font-size:13px;margin:0">From ${data.fromName}${data.fromEmail ? ` &middot; ${data.fromEmail}` : ""}</p>` : ""}
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${tableRows}
  </table>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron Client Kit
  </div>
</div>
</body></html>`;
}

function buildConfirmationHtml(data) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:16px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Document Sent</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">Your ${data.templateName} was delivered</h1>
  </div>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 16px">
    Your <strong style="color:#fff">${data.templateName}</strong> was sent to <strong style="color:#fff">${data.recipientEmail}</strong>.
  </p>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
    You can reply directly to continue the conversation.
  </p>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron Client Kit
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

  // Honeypot
  if (body._hp) {
    return res.status(200).json({ success: true });
  }

  // Rate limiting
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many submissions. Please try again later." });
  }

  // Validate
  if (!body.recipientEmail || !isValidEmail(body.recipientEmail)) {
    return res.status(400).json({ error: "Valid recipient email is required" });
  }
  if (!body.templateName) {
    return res.status(400).json({ error: "Template name is required" });
  }
  if (!body.sections || !Array.isArray(body.sections)) {
    return res.status(400).json({ error: "Document sections are required" });
  }

  if (body.fromEmail && !isValidEmail(body.fromEmail)) {
    return res.status(400).json({ error: "Invalid sender email" });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const subject = `${body.templateName}${body.fromName ? ` from ${body.fromName}` : ""}`;
    const bcc = [NOTIFY_EMAIL, ...(INTERNAL_BCC_EMAIL ? [INTERNAL_BCC_EMAIL] : [])];

    // Send document to recipient
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.recipientEmail,
      replyTo: body.fromEmail || undefined,
      bcc,
      subject,
      html: buildDocumentHtml(body),
    });

    // Send confirmation to sender if they provided their email
    if (body.fromEmail && isValidEmail(body.fromEmail)) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: body.fromEmail,
        subject: `Your ${body.templateName} was sent`,
        html: buildConfirmationHtml(body),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Client Kit email error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Failed to send: ${message}` });
  }
}
