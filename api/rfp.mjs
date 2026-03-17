import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "briefs@51ultron.com";
const INTERNAL_BCC_EMAIL = process.env.INTERNAL_BCC_EMAIL;

/* ── Validation ───────────────────────────────────── */

const REQUIRED = [
  "recipientEmail",
  "clientName",
  "clientEmail",
  "company",
  "industry",
  "companyStage",
  "teamSize",
  "businessSummary",
  "automationRequest",
  "desiredOutcome",
  "bottleneck",
  "expectedOutputs",
  "toolsInvolved",
  "triggers",
  "workflowSteps",
  "approvalRules",
  "sensitivityLevel",
  "successMetric",
  "urgency",
  "successDefinition",
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Rate limiting (in-memory, per-instance) ──────── */

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

/* ── Email HTML builders ──────────────────────────── */

function row(label, value) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  if (!display) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#999;font-size:13px;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#fff;font-size:13px">${display}</td></tr>`;
}

function sectionHeader(title) {
  return `<tr><td colspan="2" style="padding:20px 0 8px;border-bottom:1px solid #1a1a1a"><span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">${title}</span></td></tr>`;
}

function buildBriefHtml(data) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;margin:0">
<div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:32px">
  <div style="margin-bottom:24px">
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">AI Workflow Brief</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">${data.company}</h1>
    <p style="color:#999;font-size:13px;margin:0">From ${data.clientName} &middot; ${data.clientEmail}</p>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${sectionHeader("Routing")}
    ${row("Recipient", data.recipientEmail)}
    ${row("From", `${data.clientName} (${data.clientEmail})`)}
    ${row("Company", data.company)}
    ${row("Role", data.role)}
    ${row("Website", data.website)}
    ${row("Location", data.location)}
    ${sectionHeader("Business Context")}
    ${row("Industry", data.industry)}
    ${row("Stage", data.companyStage)}
    ${row("Team size", data.teamSize)}
    ${row("Summary", data.businessSummary)}
    ${row("Revenue", data.revenueBand)}
    ${row("Market", data.mainMarket)}
    ${row("Growth stage", data.growthStage)}
    ${sectionHeader("Automation Request")}
    ${row("Title", data.workflowTitle)}
    ${row("Request", data.automationRequest)}
    ${row("Desired outcome", data.desiredOutcome)}
    ${row("Bottleneck", data.bottleneck)}
    ${row("Expected outputs", data.expectedOutputs)}
    ${row("End users", data.endUsers)}
    ${row("Manual process", data.currentManualProcess)}
    ${sectionHeader("Stack and Tools")}
    ${row("Tools involved", data.toolsInvolved)}
    ${row("Automation tools", data.automationTools)}
    ${row("Data sources", data.dataSources)}
    ${row("Models", data.modelsInUse)}
    ${row("Stack details", data.stackDetails)}
    ${sectionHeader("Workflow Design")}
    ${row("Triggers", data.triggers)}
    ${row("Steps", data.workflowSteps)}
    ${row("Approval rules", data.approvalRules)}
    ${row("Sensitivity", data.sensitivityLevel)}
    ${row("Edge cases", data.edgeCases)}
    ${row("Failure risks", data.failureRisks)}
    ${row("Security notes", data.securityNotes)}
    ${row("Access constraints", data.accessConstraints)}
    ${sectionHeader("Delivery and Success")}
    ${row("Success metric", data.successMetric)}
    ${row("Urgency", data.urgency)}
    ${row("Success definition", data.successDefinition)}
    ${row("Budget range", data.budgetRange)}
    ${row("Communication", data.communicationStyle)}
    ${row("Reference links", data.referenceLinks)}
    ${row("Extra context", data.extraContext)}
  </table>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron workflow intake
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
    <span style="color:#DA4E24;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Brief Confirmed</span>
    <h1 style="color:#fff;font-size:20px;margin:8px 0 4px;font-weight:700">Your workflow brief was delivered</h1>
  </div>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 16px">
    Your AI workflow brief for <strong style="color:#fff">${data.company}</strong> was sent to <strong style="color:#fff">${data.recipientEmail}</strong>.
  </p>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0 0 16px">
    The brief includes your automation request, stack details, workflow design, and success criteria. The recipient has everything needed to begin scoping.
  </p>
  <p style="color:#999;font-size:14px;line-height:1.6;margin:0">
    You can reply directly to continue the conversation. Additional details or changes can be shared over email.
  </p>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #1a1a1a;color:#555;font-size:11px">
    Sent via Ultron workflow intake
  </div>
</div>
</body></html>`;
}

/* ── Handler ──────────────────────────────────────── */

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

  // Validate required fields
  const missing = [];
  for (const field of REQUIRED) {
    const val = body[field];
    if (Array.isArray(val) ? val.length === 0 : !val || !String(val).trim()) {
      missing.push(field);
    }
  }
  if (missing.length > 0) {
    return res.status(400).json({ error: "Missing required fields", fields: missing });
  }

  // Validate emails
  if (!isValidEmail(body.recipientEmail)) {
    return res.status(400).json({ error: "Invalid recipient email" });
  }
  if (!isValidEmail(body.clientEmail)) {
    return res.status(400).json({ error: "Invalid client email" });
  }

  // Check for Resend API key
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service not configured" });
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    // Email 1: Full brief to recipient
    const bcc = INTERNAL_BCC_EMAIL ? [INTERNAL_BCC_EMAIL] : undefined;
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.recipientEmail,
      replyTo: body.clientEmail,
      bcc,
      subject: `New RFP from ${body.clientName} — ${body.company}`,
      html: buildBriefHtml(body),
    });

    // Email 2: Confirmation to client
    await resend.emails.send({
      from: FROM_EMAIL,
      to: body.clientEmail,
      subject: "We received your workflow brief",
      html: buildConfirmationHtml(body),
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `Failed to send brief: ${message}` });
  }
}
