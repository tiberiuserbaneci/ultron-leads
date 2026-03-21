import posthog from "posthog-js";

/* ── UTM helpers ──────────────────────────────── */

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const val = sp.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

function getReferrer() {
  if (typeof window === "undefined") return {};
  const ref = document.referrer;
  if (!ref) return {};
  try {
    const host = new URL(ref).hostname;
    if (host === window.location.hostname) return {};
    return { referrer: ref };
  } catch {
    return {};
  }
}

function baseProps() {
  return {
    ...getUtmParams(),
    ...getReferrer(),
  };
}

/* ── Event tracking ───────────────────────────── */

export function trackCtaClicked(ctaText: string, ctaLocation: string, targetUrl?: string) {
  posthog.capture("cta_clicked", {
    cta_text: ctaText,
    cta_location: ctaLocation,
    target_url: targetUrl,
    page_slug: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...baseProps(),
  });
}

export function trackDemoClicked(ctaLocation: string) {
  posthog.capture("demo_clicked", {
    cta_location: ctaLocation,
    page_slug: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...baseProps(),
  });
}

export function trackPricingViewed() {
  posthog.capture("pricing_viewed", {
    page_type: "pricing",
    page_slug: "/pricing",
    ...baseProps(),
  });
}

export function trackFormStarted(formType: string, pageSlug?: string) {
  posthog.capture("form_started", {
    page_type: "form",
    form_type: formType,
    page_slug: pageSlug || (typeof window !== "undefined" ? window.location.pathname : undefined),
    ...baseProps(),
  });
}

export function trackFormSubmitted(formType: string, pageSlug?: string) {
  posthog.capture("form_submitted", {
    page_type: "form",
    form_type: formType,
    page_slug: pageSlug || (typeof window !== "undefined" ? window.location.pathname : undefined),
    ...baseProps(),
  });
}

export function trackBlogPostViewed(postSlug: string) {
  posthog.capture("blog_post_viewed", {
    page_type: "blog",
    post_slug: postSlug,
    page_slug: `/company/news/${postSlug}`,
    ...baseProps(),
  });
}

export function trackBlogToProductClicked(postSlug: string, ctaText: string, targetUrl: string) {
  posthog.capture("blog_to_product_clicked", {
    post_slug: postSlug,
    cta_text: ctaText,
    target_url: targetUrl,
    ...baseProps(),
  });
}

export function trackNavClicked(label: string, href: string, section?: string) {
  posthog.capture("nav_clicked", {
    cta_text: label,
    target_url: href,
    cta_location: section ? `nav_${section}` : "nav",
    ...baseProps(),
  });
}

export function trackOutboundLinkClicked(targetUrl: string, ctaText: string, ctaLocation: string) {
  posthog.capture("outbound_link_clicked", {
    target_url: targetUrl,
    cta_text: ctaText,
    cta_location: ctaLocation,
    page_slug: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...baseProps(),
  });
}
