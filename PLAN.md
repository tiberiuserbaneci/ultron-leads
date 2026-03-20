# Nexity Network Corporate Page — Implementation Plan

## Overview
Build a light-themed (cream/beige, Anthropic-inspired) corporate landing page at `/nexity` for nexitynetwork.org. This is the parent company page that bridges the blockchain project (NXT/RWA OS) and AI product (Ultron) under one umbrella.

---

## Phase 1: Infrastructure & Routing

### 1a. Vercel domain routing (`vercel.json`)
Add rewrites so `nexitynetwork.org` serves the `/nexity` route as its homepage:

```json
{
  "rewrites": [
    { "source": "/", "has": [{ "type": "host", "value": "nexitynetwork.org" }], "destination": "/nexity/" },
    { "source": "/:path*", "has": [{ "type": "host", "value": "nexitynetwork.org" }], "destination": "/nexity/:path*" }
  ]
}
```

> **Note:** Static export (`output: 'export'`) does NOT support Vercel rewrites with host conditions. We need to **remove `output: 'export'`** from `next.config.js` and switch to standard Vercel deployment. This also means removing `images: { unoptimized: true }` (or keeping it if preferred). The `vercel.json` outputDirectory and framework settings will need updating too.

### 1b. Cloudflare DNS (manual — user does this)
- Keep all subdomain records (app., investors., dealmaker., etc.) untouched
- Point root `nexitynetwork.org` → `cname.vercel-dns.com` (CNAME)
- Add the domain in Vercel project settings

---

## Phase 2: New Files to Create

### Layout & Components
| File | Purpose |
|------|---------|
| `src/app/nexity/layout.tsx` | Nexity layout — light theme, NexityNav + NexityFooter |
| `src/app/nexity/page.tsx` | Corporate landing page |
| `src/components/NexityNav.tsx` | Corporate navbar (light theme) |
| `src/components/NexityFooter.tsx` | Minimal corporate footer |

### Future (not now)
| File | Purpose |
|------|---------|
| `src/app/nexity/deck/page.tsx` | Investment pitch deck page |

---

## Phase 3: NexityNav Component

**Style:** Light background, dark text, Anthropic-inspired clean design.

**Desktop layout:**
```
[Nexity Logo]     News    Investment Deck    Investor Relations    Contact Sales    [Try Ultron ▾]
```

**"Try Ultron" dropdown** (like Anthropic's "Try Claude"):
- **Products**
  - Ultron Dashboard → app.51ultron.com
  - Interactive Demo → 51ultron.com/demo
  - Agents Map → 51ultron.com/agents-map
- **Get Started**
  - Sign Up → app.51ultron.com/signup
  - Documentation → docs.51ultron.com
  - Contact Sales → /nexity/contact (or /contact)

**Mobile:** Hamburger menu with same items, sticky "Try Ultron" CTA at bottom.

**Nav link destinations:**
- News → placeholder section anchor (no blog yet, scrolls to news section)
- Investment Deck → /nexity/deck (placeholder page for now)
- Investor Relations → investors.nexitynetwork.org (external)
- Contact Sales → /contact or mailto

---

## Phase 4: Landing Page Sections (`/nexity/page.tsx`)

### Section 1: Hero
- **Light cream/beige background** (like Anthropic's `#f5f0ea` or similar)
- Big bold serif headline: **"AI and blockchain infrastructure for the autonomous economy"** (or similar — combining both worlds)
- Subtitle on the right: brief description of Nexity Network as the parent entity
- Clean, minimal — no video, just strong typography

### Section 2: Products Grid
Simple boxes, 2 columns on desktop. Each box has: icon/small visual, title, one-liner, and a link.

**Box 1: Ultron**
- AI employees for founder-led growth
- "Hire AI employees, set goals and go from zero to autonomous company in one command."
- CTA: "Explore Ultron →" → 51ultron.com

**Box 2: NXT — RWA OS**
- The operating system for on-chain trade
- "Coordinate orders, contracts, payments, and liquidity on a single programmable layer."
- CTA: "Explore NXT →" → (blockchain app URL, e.g., app.nexitynetwork.org or the existing domain)

**Box 3: DealMaker**
- Deal structuring & negotiation
- "Structure milestone-based deals with embedded compliance, payments, and audit trails."
- CTA: "Open DealMaker →" → dealmaker.nexitynetwork.org

### Section 3: News / Latest Releases (Anthropic-style cards)
- 2-3 hardcoded announcement cards with dates and categories
- Example entries:
  - "Ultron Launch" — Date, Category: Product
  - "NXT RWA OS Update" — Date, Category: Infrastructure
  - A third relevant announcement
- Simple card design: title, description, date, category label, "Read more →"

### Section 4: Investor Center
- Clean section with heading: "Investor Relations"
- Two simple CTAs:
  - "View Investment Deck →" (links to /nexity/deck — placeholder for now)
  - "Contact Investor Relations →" (links to investors.nexitynetwork.org or email)
- Maybe a brief line about the company's positioning

### Section 5: Footer (NexityFooter)
- Minimal, light-themed
- Columns: Products (Ultron, NXT, DealMaker), Company (About, Contact, Investors), Legal (Privacy, Terms)
- Copyright: © 2025 Nexity Network
- Social links if applicable

---

## Phase 5: Styling

### Light Theme Approach
The Nexity pages need their own color scheme isolated from Ultron's dark theme:

- **Background:** `#f5f0ea` (warm cream) or `#faf8f5`
- **Cards:** `#ede8e0` (slightly darker cream, like Anthropic's cards)
- **Text:** `#1a1a1a` (near-black)
- **Muted text:** `#666666`
- **Accent/CTA:** `#1a1a1a` (black buttons, like Anthropic) or brand orange for "Try Ultron"
- **Font:** Keep Inter but use a serif for headlines (or just bold Inter)

All styles scoped to the `/nexity` layout via Tailwind classes — no global CSS changes needed.

---

## Phase 6: Config Changes

### `next.config.js`
- Remove `output: 'export'` (needed for host-based rewrites)
- Keep `trailingSlash: true`
- Can re-enable Next.js image optimization

### `vercel.json`
- Add host-based rewrites for nexitynetwork.org
- Update build config (remove `framework: null` and `outputDirectory` since Next.js handles it natively)

---

## Implementation Order

1. **Config changes** — next.config.js, vercel.json (enable server-side routing)
2. **NexityNav component** — navbar with Try Ultron dropdown
3. **NexityFooter component** — minimal footer
4. **Nexity layout** — light theme wrapper
5. **Landing page** — all sections (hero, products, news, investor center)
6. **Test locally** — verify both domains route correctly
7. **Commit & push**

---

## What the user does manually (not code):
- Add `nexitynetwork.org` domain in Vercel project settings
- Update Cloudflare DNS: root `nexitynetwork.org` → `cname.vercel-dns.com`
- Verify subdomain records are untouched
