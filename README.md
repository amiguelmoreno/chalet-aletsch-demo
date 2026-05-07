# Chalet Aletsch

A showcase project by **Morenodev** — a fictional traditional Swiss alpine guest house in Riederalp, Wallis, used to demonstrate a full production stack to prospective clients.

> *"Im Schatten des Aletschgletschers, ein Berghaus seit hundert Jahren."*

---

## Why this exists

Most "modern" hotel sites end up looking the same — gradient hero, slate cards, Inter sans-serif, generic stock imagery. Chalet Aletsch deliberately goes the other way: editorial, typographic, hand-drawn. It also wires up the technical features Swiss SMEs actually need (Twint, GDPR, multilingual, Schema.org, GA-free analytics, etc.).

The goal: when a prospective client opens the site, the design alone is the sales pitch.

---

## Phase status

This repository is at **Phase 1A — Foundations**.

| Phase | Status | Scope |
|---|---|---|
| 1A | ✅ done | Scaffolding, design system, i18n, public pages with hardcoded content |
| 1B | ✅ done | Auth.js (Google + magic link), Sanity CMS + studio, Prisma client + seed, cookie banner, blog page |
| 2  | ✅ done | Pricing engine + availability engine, 5-step booking flow, react-email confirmation, /booking/new + /booking/[ref]/confirm |
| 3  | ✅ done | Stripe + Twint Checkout (gated by env), webhook handler, hold expiry cron, admin role auto-promote, /admin overview + /admin/bookings list+detail with status edit |
| 4  | ✅ done | Guest portal (/account/bookings list + detail + cancel), JSON-LD (Hotel/LodgingBusiness/Breadcrumb/FAQ), sitemap.xml, robots.txt, page metadata, OpenGraph |
| 5  | ✅ done | Dynamic OG image per locale, review submit + moderation, home guestbook reads real reviews, aggregateRating in JSON-LD |
| 6  | ✅ done | Admin CRUD (rooms, pricing rules, experiences), FullCalendar drag-friendly admin calendar, full admin nav |
| 7  | ⏳ next | Stripe wiring (waiting on user creds), deploy to Vercel + DNS for chalet.morenodev.ch |
| 3  | ⏳ | Stripe + Twint, deposit/balance logic, Swiss QR-bill on PDF |
| 4  | ⏳ | Member area, admin (calendar, CRUD, moderation) |
| 5  | ⏳ | Marketing layer (newsletter, chatbot, reviews, OG, sitemap) |
| 6  | ⏳ | Polish, Lighthouse, deploy |

See [`docs/architecture.md`](./docs/architecture.md) — to be added.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind 3 with custom Swiss design tokens |
| i18n | next-intl (DE default, EN) |
| DB | PostgreSQL via Prisma (target: Neon free tier) |
| Auth | Auth.js v5 *(scaffolded, wired in 1B)* |
| Payments | Stripe Checkout with native Twint support |
| CMS | Sanity *(added in 1B)* |
| Email | Resend + react-email |
| Images | Cloudinary |
| Maps | Leaflet + OpenStreetMap |
| Hosting | Vercel Hobby |

---

## Design language

The brief was **anti-AI**: avoid every cliché of 2024–25 generated websites.

**Choices that signal "made by hand":**

- **Type as the visual lead** — Fraunces (display, with optical sizing) + EB Garamond (text). No Inter, no Geist.
- **Sharp corners** — `borderRadius` is overridden to `0` across the Tailwind theme. No rounded cards, no soft shadows, no glassmorphism.
- **Editorial layout** — asymmetric grids, generous whitespace, type-driven hierarchy. No card grid + icon set.
- **Swiss-traditional palette** — deep alpine forest green, parchment cream, aged oak, ink charcoal, Swiss red used sparingly like a wax seal. No gradients.
- **Custom hand-drawn SVGs** — the chalet, the edelweiss, the mountain rule, the ornament rules, the house crest are all bespoke (`src/components/ornaments/`). No icon libraries.
- **Roman numerals for sections** — sections are I, II, III. Pages feel like chapters of a book, not modules.
- **Small caps & letter-spacing** for menu/labels — references Swiss railway and hotel typography of the early 20th century.
- **Drop caps** on key body paragraphs.
- **A subtle paper grain** overlaid on every page (`src/app/globals.css`, `body::before`).
- **Old-style figures** (`font-variant-numeric: oldstyle-nums`) — numerals sit on the baseline like a printed book, not LCD digits.
- **Voice/copy** — written like a heritage Swiss inn, not a SaaS landing page. No "Discover", "Unleash", "Crafted for". Authentic Walliser references (Riederalp, Aletschwald, Konkordiaplatz, Mund, Naters, the Imboden family chronicle).

---

## Repository layout

```
src/
├── app/
│   ├── layout.tsx              ← root, fonts loaded here
│   ├── globals.css
│   └── [locale]/
│       ├── layout.tsx          ← header/footer + NextIntlClientProvider
│       ├── page.tsx            ← editorial homepage
│       ├── rooms/page.tsx
│       ├── story/page.tsx
│       ├── contact/page.tsx
│       ├── legal/imprint/page.tsx
│       ├── legal/privacy/page.tsx
│       └── not-found.tsx
├── components/
│   ├── layout/                 ← Header, Footer, LanguageSwitcher
│   ├── ui/                     ← Button, Container, Eyebrow, RomanNumeral
│   ├── ornaments/              ← Monogram, Edelweiss, MountainRule, OrnamentRule, ChaletSketch
│   └── marketing/              ← Hero, AtAGlance, StoryExcerpt, RoomsLedger, Guestbook, AvailabilityNudge
├── i18n/
│   ├── routing.ts
│   └── request.ts
├── lib/
│   └── cn.ts
└── middleware.ts
messages/
├── de.json                     ← default locale
└── en.json
prisma/
└── schema.prisma               ← full Phase 1 model (not yet wired)
```

---

## Running locally

```bash
# install
npm install

# dev — works without DB or external services
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/de`.

### Connect external services

All external services degrade gracefully when not configured. Add credentials when you want them.

```bash
cp .env.example .env
# then fill any subset of:

# Database — Neon free tier
DATABASE_URL="postgres://…"
npm run db:push     # apply schema
npm run db:seed     # load 4 rooms + 4 experiences + sample property + 1 pricing rule

# Auth — set either or both providers
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
RESEND_API_KEY=""        # enables magic-link email
EMAIL_FROM="Chalet Aletsch <…>"

# CMS — Sanity studio embedded at /studio
NEXT_PUBLIC_SANITY_PROJECT_ID="…"   # without this, /studio loads a placeholder; /blog shows "coming soon"
NEXT_PUBLIC_SANITY_DATASET="production"

# Analytics — Microsoft Clarity, only loads after consent
NEXT_PUBLIC_CLARITY_ID=""
```

### What works without any env vars

- Every public page (`/`, `/rooms`, `/story`, `/blog`, `/contact`, `/legal/*`)
- The cookie banner, with consent persisted to localStorage + cookie
- The sign-in page (shows a "not configured" notice)
- The blog page (shows the "coming soon" empty state)
- The Sanity studio at `/studio` (will throw at runtime until you set the project ID)

---

## Customising for a real client

The design system is the asset. To re-skin for a different vertical:

1. **Swap fonts** in `src/app/layout.tsx` (next/font Google).
2. **Swap palette** in `tailwind.config.ts` — keep the structure (forest/parchment/oak/ink), change the values.
3. **Swap ornaments** in `src/components/ornaments/` — the SVGs are the brand fingerprint.
4. **Rewrite copy** in `messages/{de,en}.json` — keep voice editorial, not promotional.
5. **Replace the chalet sketch** in `src/components/ornaments/ChaletSketch.tsx` with the appropriate hand-drawn illustration of the new property.

The rest (i18n, schema, layout, design tokens, primitives) is reusable across heritage hotels, restaurants, wine estates, ateliers, retreats.

---

## Credits

Designed and developed by [Morenodev](https://morenodev.ch) · Set in Fraunces & EB Garamond · Illustrations drawn for this project.
