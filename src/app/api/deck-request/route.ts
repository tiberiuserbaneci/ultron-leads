import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, documents } = await req.json();

    if (!email || !documents?.length) {
      return NextResponse.json({ error: "Missing email or documents" }, { status: 400 });
    }

    // Track the request via PostHog (server-side)
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (posthogKey && posthogHost) {
      fetch(`${posthogHost}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: posthogKey,
          event: "deck_document_request",
          distinct_id: email,
          properties: { email, documents },
        }),
      }).catch(() => {});
    }

    console.log("[deck-request]", { email, documents });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
