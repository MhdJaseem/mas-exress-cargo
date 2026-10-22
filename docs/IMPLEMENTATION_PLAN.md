# Implementation plan — from today to production

**Status (2026-10-21):** React + TypeScript + React Router single-page app (Vite 7). Home, 5 service pages and 4 company pages (About, Our Team, Our Branches, Careers) built with the live site's exact wording, plus a 404 page; clean URLs with redirects from the old `.html` paths. Tracking, pickup and careers forms work with placeholder logic (email drafts) until the backend exists.
**Target:** live site at www.masexpresscargo.com with working tracking, pickup requests, all pages, SEO, monitoring.
Effort is for one developer working with Claude Code. Phases 1–2 and 5 can overlap with the backend work in 3–4.

---

## Phase 0 — Project setup (½ day)

| #   | Task                                                                               | Done when                                                               |
| --- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 0.1 | `npm install`, run `npm run dev`; fix anything that differs from the headless test | **Done.** All pages render in the dev server, no console errors         |
| 0.2 | Git repo + GitHub, `main` protected, branches `feature/*`                          | Repo pushed; `.gitignore` excludes `node_modules`, `dist`, `.env.local` |
| 0.3 | Commit `CLAUDE.md` + `docs/`; add Prettier/EditorConfig                            | **Done** (Prettier + EditorConfig; commit pending 0.2)                  |
| 0.4 | Run `npm run build` + `npm run preview`                                            | **Done.** Build passes (incl. TypeScript); preview matches dev          |

## Phase 1 — Content fidelity (1 day) — _client input needed_

| #   | Task                                                                                | Done when                                            |
| --- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1.1 | Compare each service page with the live site; paste exact wording                   | **Done 2026-10-21.** Copy matches live site          |
| 1.2 | Resolve air-freight contradictions (14+ vs 20+ years; 200+ vs 12+ destinations)     | Client confirms correct figures; both places updated |
| 1.3 | Get real descriptions for items I wrote short blurbs for (feature/process sub-text) | Blurbs approved or replaced                          |
| 1.4 | Collect real testimonials, team and branch details if different from live           | Content list signed off                              |
| 1.5 | Confirm all phone numbers/WhatsApp/email/social links                               | Verified by client                                   |

## Phase 2 — Missing pages (2–3 days)

Build with `PageHero` + `.pbody` (service layout) or `.pbody.solo` (full width), see docs/MAINTENANCE.md.

| #   | Page                               | Notes                                                                                                                    |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | About (`/about`)                   | **Done 2026-10-21.** Company story, vision/mission/values, testimonials, client logos                                    |
| 2.2 | Our Team (`/our-team`)             | **Done.** CEO message + 18 members in 5 groups                                                                           |
| 2.3 | Our Branches (`/our-branches`)     | **Done** (no map links yet). Branch cards with phones and hours                                                          |
| 2.4 | Careers (`/careers`)               | **Done** (email draft until `/api/apply` exists)                                                                         |
| 2.5 | Solutions index + 4 solution pages | **4 pages done 2026-10-21** at `/solution/<slug>` (same URLs as live). Index page dropped (removed from nav, 2026-10-21) |
| 2.6 | Services index (`/services`)       | Dropped: removed from nav at client request (2026-10-21)                                                                 |
| 2.7 | Privacy Policy / Terms             | Required once forms store data                                                                                           |
| 2.8 | Custom 404 page                    | **Done.** `NotFoundPage` for any unknown URL                                                                             |

After each page: create `src/pages/XPage.tsx`, add the route in `src/router.tsx`, link it in `Header.tsx` / `Footer.tsx`, add it to the sitemap. **Acceptance:** no nav link leaves the new site except social links.

## Phase 3 — Live tracking (4–7 days) — _depends on backend choice_

| #   | Task                                                                                             | Done when                                            |
| --- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| 3.1 | **Decide data source**: existing logistics/ERP system API vs new database                        | Written decision; sample data from ops               |
| 3.2 | Define the six progress-step labels with ops                                                     | Labels match `#steps` markup                         |
| 3.3 | Build `GET /api/track/{no}` per `docs/TRACKING_API.md` (serverless or Node)                      | Returns contract JSON; 404 for unknown; rate-limited |
| 3.4 | Implement `trackShipment()` with `fetch`                                                         | Real number shows real data                          |
| 3.5 | UI states: loading spinner on Track button, "not found" message, network error, empty input hint | Each state visible and accessible (`role="status"`)  |
| 3.6 | Shareable results: `?track=MAS123` opens and runs the search                                     | Link works after refresh                             |
| 3.7 | Staff update path: admin screen or import (CSV/ERP sync) to create/update shipments & events     | Ops can update status without a developer            |
| 3.8 | Optional: email/WhatsApp status notifications                                                    | Opt-in only; consent logged                          |

## Phase 4 — Pickup requests and forms (2–3 days)

| #   | Task                                                                                  | Done when                                 |
| --- | ------------------------------------------------------------------------------------- | ----------------------------------------- |
| 4.1 | `POST /api/pickup` stores request, emails ops (and optional WhatsApp Business notice) | Request visible to ops within a minute    |
| 4.2 | Replace mailto in `submitPickup()`; add success/failure UI                            | User sees confirmation with reference ID  |
| 4.3 | Spam protection: honeypot + rate limit + Turnstile/hCaptcha                           | Bot submissions blocked                   |
| 4.4 | Server-side validation (phone format, date ≥ today, time)                             | Invalid data rejected with clear messages |
| 4.5 | Privacy text + consent line near the form                                             | Legal text approved                       |
| 4.6 | Optional: "Enquire now" captures the lead (WhatsApp stays as fallback)                | Lead stored                               |

## Phase 5 — Performance, SEO, accessibility (3 days)

| #   | Task                                                                                                                                                                                             | Done when                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 5.1 | Images → WebP/AVIF + `srcset`/`sizes`; `loading="lazy"`; `fetchpriority="high"` on LCP image                                                                                                     | Mobile LCP < 2.5 s                                                           |
| 5.2 | Self-host Inter Tight (woff2, subset)                                                                                                                                                            | No third-party font request                                                  |
| 5.3 | Video: WebM + MP4 sources, poster, don't preload on mobile data-saver                                                                                                                            | Initial payload reduced                                                      |
| 5.4 | SEO: **pre-render every route at build time** (the SPA ships one HTML shell), canonical, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD (`LocalBusiness`, `Service`, `FAQPage`) | Each URL's HTML has its own title/content; rich-results test passes          |
| 5.5 | Accessibility audit (axe + manual keyboard/screen reader)                                                                                                                                        | No serious/critical issues; AA contrast                                      |
| 5.6 | Clean URLs decision and redirects from old paths                                                                                                                                                 | **Done.** Clean URLs; `.html` paths 301 (`public/_redirects`, `vercel.json`) |
| 5.7 | Move service content to a data file + one template for the five pages                                                                                                                            | **Done.** `src/data/services.ts` + `ServicePage`                             |

## Phase 6 — Testing & CI (2 days)

| #   | Task                                                                                      | Done when                |
| --- | ----------------------------------------------------------------------------------------- | ------------------------ |
| 6.1 | Playwright smoke tests (load, console errors, overflow @390, link check, form validation) | `npm test` green         |
| 6.2 | GitHub Actions: build + tests on PR; Lighthouse CI                                        | Required check on `main` |
| 6.3 | Manual QA per `docs/TESTING_QA.md` on real iOS/Android + Safari                           | Checklist signed off     |
| 6.4 | UAT with MAS staff (tracking & pickup end to end)                                         | Written approval         |

## Phase 7 — Deployment & launch (1–2 days)

| #   | Task                                                                                            | Done when                   |
| --- | ----------------------------------------------------------------------------------------------- | --------------------------- |
| 7.1 | Host project (Cloudflare Pages/Netlify), env vars, preview deploys                              | Preview URL per PR          |
| 7.2 | Security headers + CSP (see `docs/DEPLOYMENT.md`)                                               | securityheaders.com grade A |
| 7.3 | DNS cut-over plan: lower TTL, switch `www`, redirect apex, verify SSL                           | Site live on domain         |
| 7.4 | Analytics (privacy-friendly, e.g. Plausible/GA4 with consent) + uptime monitor + error tracking | Dashboards live             |
| 7.5 | Search Console + Bing Webmaster: submit sitemap                                                 | Indexed                     |
| 7.6 | Rollback plan: keep old site reachable on a subdomain for 2 weeks                               | Documented                  |

## Phase 8 — Post-launch (ongoing)

Weekly review of analytics, tracking errors and pickup volume · monthly dependency updates (`npm audit`) · quarterly content refresh (testimonials, stats) · backlog ideas: Arabic version (RTL), live chat, instant quote calculator, customer portal with login, multi-shipment tracking, PDF documents download.

---

## Timeline (single developer)

| Week | Focus                              |
| ---- | ---------------------------------- |
| 1    | Phase 0, 1, start 2                |
| 2    | Finish 2; start 3 (decision + API) |
| 3    | Phase 3 and 4                      |
| 4    | Phase 5, 6                         |
| 5    | Phase 7 launch; Phase 8 begins     |

Backend scope (3.7, 3.8) can slip without blocking launch if tracking can be fed by CSV import first.

## Dependencies & decisions needed from MAS

1. Exact copy approval (Phase 1) and final stats.
2. Where shipment data lives today (ERP/Excel/none) and who will update it.
3. The six tracking milestone names.
4. Hosting account and domain/DNS access.
5. Legal text: privacy policy/terms; consent wording.
6. Arabic version — yes/no and when.

## Risks

| Risk                             | Mitigation                                                       |
| -------------------------------- | ---------------------------------------------------------------- |
| No existing shipment data source | Start with a simple database + CSV import; add integration later |
| Copy differs from live site      | Phase 1 diff before launch                                       |
| SEO drop after URL change        | Redirect map + sitemap + Search Console                          |
| Spam on forms                    | Honeypot, rate limit, CAPTCHA                                    |
| Heavy media on mobile            | Phase 5 image/video optimisation                                 |
| Single-developer bus factor      | These docs + `CLAUDE.md` + tests                                 |

## Definition of done (launch)

All nav links internal and working · tracking returns real data · pickup requests reach ops · Lighthouse mobile ≥ 90 on all pages · AA accessibility · legal pages live · analytics, monitoring and rollback in place · client sign-off.
