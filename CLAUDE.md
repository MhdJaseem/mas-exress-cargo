# CLAUDE.md — MAS Express Cargo website

Guidance for Claude Code working in this repo. Read `docs/` for detail.

## What this is

Marketing site for MAS Express Cargo L.L.C (Sharjah, UAE). **React 19 + TypeScript + React Router 7**, built with **Vite 7** as a single-page app. Red + white brand taken from the company logo. Routes: `/` · `/air-freight` `/sea-freight` `/gcc-road-transport` `/warehousing` `/customs-clearance` · `/solution/e-commerce-fulfillment` `/solution/cold-chain-logistics` `/solution/heavy-lift-project-cargo` `/solution/retail-distribution` · `/about` `/our-team` `/our-branches` `/careers` · `*` (404). Old `*.html` URLs redirect to these.

## Layout

```
index.html                 single HTML entry (fonts, #root)
src/main.tsx               mounts <RouterProvider>, imports the two stylesheets
src/router.tsx             ALL routes (+ legacy .html redirects, 404)
src/components/layout/     RootLayout (shell), Header, Footer, WhatsAppWidget, IconSprite, ScrollManager
src/components/ui/         Icon, HashLink, PageHero, Heading/SectionHead, PickupForm, CountUp, TestimonialCard, TestimonialsSplit
src/components/home/       the home page sections
src/components/service/    ServiceBlocks (renders data/services.ts blocks)
src/components/team/       TeamShowcase (animated member carousel on /our-team)
src/pages/                 one component per route (ServicePage is the template for all five services, SolutionPage for the four solutions)
src/data/                  services.ts (service pages), solutions.ts (solution pages), company.ts (testimonials, team, branches, clients)
src/hooks/                 useHomeScroll (stacking cards + smooth scroll), useReveal, useDocumentMeta
src/lib/                   api.ts (backend), site.ts (contact data), scroll.ts, activeSection.ts
src/styles/                main.css (global + home), inner.css (service/company pages)
public/                    img/{brand,hero,services,sections,pages,clients}, video, _redirects
```

## Commands

`npm run dev` (5173) · `npm run build` (type-check + build to `dist/`) · `npm run preview` (4173) · `npm run typecheck` · `npm run format` / `format:check`

## Rules that matter

1. **Content fidelity:** wording comes from the original masexpresscargo.com. Do not rewrite copy, contact details or stats unless asked. Copy lives in `src/data/*.ts` and the home section components. Known source inconsistencies are listed in `docs/CONTENT.md` — don't silently "fix" them.
2. **Design tokens:** use the CSS variables in `src/styles/main.css` `:root` (`--brand #E31E24`, `--brand-deep`, `--ink`, `--paper`, radii `--r-lg/md/sm`). No new hard-coded colours. Keep existing class names — the CSS targets them.
3. **Routing:** add routes only in `src/router.tsx`. Internal links use `<Link to="/path">`; links to a section use `<HashLink hash="pickup">` (scrolls if the section is on the page, otherwise goes to `/#pickup`). Never use plain `<a href="/…">` for internal pages.
4. **Backend calls only in `src/lib/api.ts`** (`trackShipment`, `submitPickup`, `submitApplication`). Don't `fetch` from elsewhere.
5. **Icons:** `<Icon name="plane" />`; new symbols go in `src/components/layout/IconSprite.tsx` and the `IconName` type. Don't reuse a symbol id as an element id (`wa` is the WhatsApp icon; the widget is `#wa-widget`).
6. **Images** go in `public/img/<group>/` (`brand`, `hero`, `services`, `sections`, `pages`, `clients`), referenced as `/img/<group>/name.ext`. Keep photos ≤ ~250 KB; prefer WebP.
7. **Effects must clean up.** Pages mount/unmount on navigation (`<main>` is keyed by path). Any listener, observer, timer or class on `<html>` added in an effect must be removed in its cleanup (see `useHomeScroll`).
8. **Accessibility/motion:** keep `prefers-reduced-motion` fallbacks, visible focus rings, alt text, 44px-ish touch targets. Test at 390px and 1440px; there must be no horizontal overflow.
9. Home sections are "stacking cards" on ≥900px (`html.stackmode`, `hooks/useHomeScroll.ts`). Service and company pages get `main.inner` and a normal flow layout.

## Definition of done for a change

`npm run build` passes (includes `tsc`) · all routes checked at 390px and 1440px · deep links and back/forward work · no console errors · copy unchanged unless requested.
