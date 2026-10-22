# Testing & QA

## Per-release checklist

- [ ] `npm run build` succeeds (includes the TypeScript check); `npm run preview` loads every route
- [ ] Routing: each URL opens directly (deep link + refresh), back/forward restore the scroll position, unknown URLs show the 404 page, old `/x.html` URLs redirect to `/x`
- [ ] Section links: Track Shipment / Contact / Request Pickup work from every page (scroll on the same page, otherwise go to `/#section`)
- [ ] Leaving the home page leaves no `stackmode` class and normal scrolling on the next page
- [ ] Widths 390 / 768 / 1024 / 1440: no horizontal scroll, nothing clipped
- [ ] Header: transparent on hero, solid after scroll, hides down / shows up; mobile menu opens/closes; dropdowns work by mouse, keyboard and touch; never two open at once (click one, then hover another)
- [ ] Logo wings animate closed → open on load/refresh
- [ ] Hero slides cycle; indicators work; About video plays (autoplay needs muted)
- [ ] Testimonials marquee scrolls, pauses on hover; mobile shows stacked list
- [ ] Tracking: empty submit focuses field; valid number shows result panel (once API live)
- [ ] Pickup form: validation message; submit works on each page; mode preselected on service pages
- [ ] Every internal link resolves; external links open correctly; WhatsApp numbers correct
- [ ] Copy matches the live site (see CONTENT.md caveat)

## Accessibility

Target WCAG 2.1 AA. Check colour contrast (red `#E31E24` on white is OK for large text/UI; use `--brand-text` for small text), keyboard-only navigation, focus order, screen-reader landmarks, reduced-motion mode, zoom to 200%.

## Performance targets (mobile, Lighthouse)

Performance ≥ 90 · LCP < 2.5 s · CLS < 0.1 · TBT < 200 ms. Levers: WebP/AVIF images with `srcset`, `loading="lazy"`, `fetchpriority="high"` on the first hero image, self-hosted fonts with `font-display: swap`, compress the About video (≈830 KB now) and add a WebM source.

## SEO

Unique `<title>` and meta description per route (set client-side by `useDocumentMeta`; pre-render routes so they are in the served HTML — Implementation Plan 5.4) · add canonical URLs, Open Graph/Twitter tags, `sitemap.xml`, `robots.txt` · JSON-LD (`LocalBusiness`/`Organization` with address and phones; `Service` on service pages; `FAQPage` on GCC Road Transport) · keep one H1 per page.

## Cross-browser

Latest Chrome, Safari (iOS + macOS), Firefox, Edge. Safari: verify `backdrop-filter` header and autoplay video.

## Automated tests (Phase 6)

Playwright smoke tests: each route loads without console errors, no overflow at 390px, links resolve, pickup and careers form validation, back/forward and hash navigation. The React migration (2026-10-21) was verified with throw-away scripts covering exactly this (56 behaviour checks, text and pixel comparison against the previous build); turn them into a committed `npm test` suite in Phase 6.
