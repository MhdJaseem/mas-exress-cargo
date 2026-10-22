# MAS Express Cargo — website (React + TypeScript + React Router, Vite)

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # type-check, then build to dist/
npm run preview        # serve dist/ on http://localhost:4173
npm run typecheck      # TypeScript only
npm run format:check   # Prettier check (npm run format to apply)
```

Requires Node 20.19+ or 22.12+.

## Routes

| URL                                                                                     | Page                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `/`                                                                                     | Home                                                         |
| `/air-freight` `/sea-freight` `/gcc-road-transport` `/warehousing` `/customs-clearance` | Service pages (one template, data in `src/data/services.ts`) |
| `/about` `/our-team` `/our-branches` `/careers`                                         | Company pages                                                |
| anything else                                                                           | 404 page                                                     |

All routes are defined in [`src/router.tsx`](src/router.tsx). Old addresses such as `/air-freight.html` redirect to the clean URL.

## Project structure

```
mas-vite/
├── index.html              single HTML entry (fonts, <div id="root">)
├── src/
│   ├── main.tsx            mounts the router, imports the stylesheets
│   ├── router.tsx          every route, legacy redirects, 404
│   ├── components/
│   │   ├── layout/         RootLayout, Header, Footer, WhatsAppWidget, IconSprite, ScrollManager
│   │   ├── ui/             Icon, HashLink, PageHero, SectionHead, PickupForm, CountUp, TestimonialCard
│   │   ├── home/           home page sections (hero, tracking, about, services, why, testimonials, pickup)
│   │   └── service/        ServiceBlocks — renders the blocks of a service page
│   ├── pages/              HomePage, ServicePage, AboutPage, TeamPage, BranchesPage, CareersPage, NotFoundPage
│   ├── data/               services.ts (service pages), company.ts (testimonials, team, branches, clients)
│   ├── hooks/              useHomeScroll, useReveal, useDocumentMeta
│   ├── lib/                api.ts (the only backend layer), site.ts (contact data), scroll.ts, activeSection.ts
│   └── styles/             main.css (global + home), inner.css (service + company pages)
├── public/                 copied as-is to the site root
│   ├── img/brand|hero|services|sections|pages|clients/
│   ├── video/
│   └── _redirects          Netlify / Cloudflare Pages: SPA fallback + legacy redirects
├── vercel.json             same rules for Vercel
├── docs/                   project documentation
├── vite.config.ts
└── tsconfig*.json
```

- **Editing copy:** service pages → `src/data/services.ts`; testimonials, team, branches, client logos → `src/data/company.ts`; contact details → `src/lib/site.ts`; home sections → `src/components/home/`.
- `src/lib/api.ts` is **the only place that talks to a backend**: `trackShipment()`, `submitPickup()`, `submitApplication()`. Set `VITE_API_BASE` in `.env.local` (see `.env.example`).
- Hosting needs an SPA fallback (every path serves `index.html`); `public/_redirects` and `vercel.json` provide it. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Next: live tracking

1. Build an endpoint that returns the `TrackingResult` shape in `src/lib/api.ts`.
2. Replace the placeholder body of `trackShipment()` with a `fetch()` call. The tracking panel on the home page already renders it.
3. Do the same for `submitPickup()` and `submitApplication()` (POST to your backend instead of the email draft).

## Documentation

See [`docs/`](docs/README.md) — overview, architecture, design system, content, behaviour, API contract, **implementation plan**, deployment, QA, maintenance. `CLAUDE.md` holds the rules for Claude Code.
