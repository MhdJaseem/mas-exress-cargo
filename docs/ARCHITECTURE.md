# Architecture

## Stack

React 19 · TypeScript 5.9 (strict) · React Router 7 (`createBrowserRouter`, library mode) · Vite 7 with `@vitejs/plugin-react` · Google Font _Inter Tight_ · Prettier. The output in `dist/` is a static single-page app: one `index.html`, hashed JS/CSS in `assets/`, and everything from `public/`.

Migrated on 2026-10-21 from the earlier vanilla multi-page Vite build. Markup, class names, copy and CSS were carried over unchanged, so the pages render pixel-identically; the old build is kept in `../mas-vite-vanilla-backup/` for reference.

## Folder structure

```
index.html            single HTML entry: meta, fonts, html.js flag, <div id="root">
src/main.tsx          createRoot + <RouterProvider>; imports styles/main.css and styles/inner.css
src/router.tsx        route table (see below)
src/components/
  layout/             RootLayout · Header · Footer (+ Socials) · WhatsAppWidget · IconSprite · ScrollManager
  ui/                 Icon · HashLink · PageHero · Heading/SectionHead · PickupForm · CountUp · TestimonialCard · TestimonialsSplit
  home/               HeroSection · TrackingSection · AboutSection · ServicesSection (+ ServiceArt) · WhySection ·
                      TestimonialsSection · PickupContactSection
  service/            ServiceBlocks (FeatureCard + one renderer per block kind)
  team/               TeamShowcase (Our Team carousel)
src/pages/            HomePage · ServicePage · SolutionPage · AboutPage · TeamPage · BranchesPage · CareersPage · NotFoundPage
src/data/             services.ts · solutions.ts · company.ts — all page copy that is not on the home page
src/hooks/            useHomeScroll · useReveal · useDocumentMeta
src/lib/              api.ts · site.ts · scroll.ts · activeSection.ts
src/styles/           main.css (global + home) · inner.css (service/company pages, scoped with main.inner)
public/               img/{brand,hero,services,sections,pages,clients} · video · _redirects
vercel.json           SPA rewrite + legacy redirects for Vercel
```

## Routing

`src/router.tsx` builds one layout route with children:

| Path                                                     | Element                               |
| -------------------------------------------------------- | ------------------------------------- |
| `/` (index)                                              | `HomePage`                            |
| `/<slug>` for each entry in `data/services.ts`           | `ServicePage service={…}`             |
| `/solution/<slug>` for each entry in `data/solutions.ts` | `SolutionPage solution={…}`           |
| `/about` `/our-team` `/our-branches` `/careers`          | company pages                         |
| `/index.html`, `/<page>.html`                            | `<Navigate replace>` to the clean URL |
| `*`                                                      | `NotFoundPage`                        |

`RootLayout` renders the sprite, skip link, `.frame > .shell` with `Header`, `<main id="main">` (the `<Outlet/>`) and `Footer`, then the WhatsApp widget and the `ScrollManager`. `<main>` has `key={pathname}`, so every navigation mounts the page fresh (reveal animations, forms and page effects start clean), and gets `className="inner"` on every route except `/`.

**Links:** `<Link to>` for pages; `<HashLink hash="…">` for sections (`top`, `hero-track`, `pickup`, `contact`, …). HashLink scrolls if the target id exists on the current page (e.g. the sidebar `#pickup` on service pages), otherwise navigates to `/#id`. Its `href` is the real URL, so open-in-new-tab works.

**Scrolling:** `ScrollManager` sets `history.scrollRestoration = 'manual'` and, on every location change: new page → top; URL with a hash → that section (one frame after mount, through `lib/scroll.ts`); back/forward → the saved position of that history entry.

**SPA fallback:** Vite dev and preview serve `index.html` for unknown paths. Production hosts need the same — `public/_redirects` (Netlify / Cloudflare Pages) and `vercel.json` provide it plus 301s for the old `.html` URLs.

## Page anatomy

**Home** — direct children of `<main>`, all with class `stack`: `#home` hero (slides + Track / Call / Pickup cards) · `#tracking` result panel (hidden until a search) · `#about` (video + stats) · `#services` (4 cards + chips) · `#why` (photo with pins) · `#testimonials` (marquee) · `#pickup` (form + `#contact`).
**Service pages** — `PageHero` (`.phero`: photo, breadcrumb, H1, lead, buttons) → `.pbody` grid: `.main-col` of blocks from `data/services.ts` + `aside.side` (Enquire now button, All Services, Tracking, Request Pickup with the page's mode preselected).
**Solution pages** — same layout as service pages: `PageHero` → `.pbody` with the live paragraphs, "Related Services" link cards, and a sidebar with "All Solutions".
**Company pages** — `PageHero` → `.pbody.solo` (full width, no sidebar).

## Data flow

```
form component → src/lib/api.ts → (future) backend at VITE_API_BASE
```

Only `api.ts` knows about the network. Page copy lives in `src/data/` and the home section components; contact details in `src/lib/site.ts`.

## Known trade-offs

- **Client-side rendering:** the HTML served for every URL is the same shell; content renders in the browser. Google renders JavaScript, but for best SEO and first paint consider pre-rendering each route at build time (React Router framework mode `prerender`, or a static-site plugin) before launch — see Implementation Plan, Phase 5.
- **Bundle:** React + React Router add ~115 KB gzipped of JavaScript. All routes are in one chunk; split with route `lazy()` if pages grow.
- Home page scroll engine is custom (`useHomeScroll`); it is disabled below 900px and under reduced motion.
- Fonts load from Google Fonts; self-host for stricter privacy/performance (Phase 5).
