# Front-end behaviour reference

## Layout (every route)

- **Header** (`components/layout/Header.tsx`) — burger toggles `#mainnav.show`; dropdowns: only one is ever open, driven by the `openDD` state (CSS shows `li.open` only). Desktop (>960px): mouse hover or keyboard focus opens one and closes the others, leaving it closes it, a mouse click keeps it open; touch and the mobile menu toggle on tap (accordion). Outside click, Escape and navigation close them. Scroll: `.solid` after 55% of the viewport on home / 200px elsewhere (or while a menu is open); `.hide` when scrolling down, shown again when scrolling up, near the top, or (home) while focus is inside the header. Active item: on home, the section on screen (from `lib/activeSection`); elsewhere, Services, Solutions or Company on their routes.
- **WhatsApp widget** (`#wa-widget`, `#waBtn`) — toggles `.open`; closes on outside click / Escape.
- **ScrollManager** — top on new pages, section on `/#hash` URLs, saved position on back/forward.

## Home (`pages/HomePage.tsx`)

1. **Scroll engine** (`hooks/useHomeScroll.ts`) — "stack mode" on ≥900px without reduced motion: `.stack` sections are sticky cards; `--p` (0–1) drives a subtle scale/dim of the card being covered. Inertial smooth wheel/keyboard scrolling on mouse devices. Registers a scroller in `lib/scroll.ts` so HashLinks and `/#hash` URLs land exactly on a section. Reports the section on screen to the header. Everything (listeners, `html.stackmode`, inline styles, `scroll-behavior`) is removed on unmount.
2. **Reveal** (`useReveal('home')`) — `.reveal` → `.in` at 15% visibility, then the classes are removed after the transition; service cards also get `.drawn` (line-art drawing, `html.anim`).
3. **Hero slides** (`HeroSection`) — crossfade every 6.5 s between air / sea / road; indicator buttons (no text) jump to a slide and restart the progress bar; paused while the tab is hidden.
4. **Tracking** — empty submit focuses `#trk`; otherwise `trackShipment()` → `TrackingSection` shows (`#tracking.show`) and the page scrolls to it.
5. **Why Choose Us** — hovering a list item or pin highlights both (`.hot` / `.on`); the photo gets `.in` when 25% visible.
6. **About video** — `#aboutVideo` plays when visible, pauses off-screen; muted/loop/playsinline.
7. **Stats** — `CountUp` counts the number up once when 60% visible (static under reduced motion).
8. **Pickup form** — Branch (branches from `data/company.ts`, head office excluded), phone, mode, date and time; all required, then `submitPickup()` (the branch is the first line of the email).
   **Send a Message form** (Contact Us card) — three steps: name (first name required) → email (format-checked) → subject + message, then `await submitMessage()` (FormSubmit AJAX) and a thank-you screen with a confetti burst.

## Service and company pages

`useReveal('inner')`: `.reveal` → `.in` at 12% visibility (styles scoped to `main.inner`). Stats count up. The sidebar pickup form (`PickupForm defaultMode`) preselects the service's mode. Careers form validates name + email, then `submitApplication()`.

## `src/lib/api.ts`

`trackShipment(no)` → `Promise<TrackingResult>` · `submitPickup(f)` → message string · `submitMessage(f)` → `Promise<void>` (throws if not sent) · `submitApplication(f)` → message string. See TRACKING_API.md.

## Accessibility notes

Skip link · `aria-expanded` on menu/dropdowns/WhatsApp · visible `:focus-visible` ring · alt text on photos · breadcrumbs `aria-label` · `details/summary` for FAQ · `role="status"` form messages · reduced motion respected (except the logo-wing open animation).

## Gotchas

- `.steps` (tracking progress on home) and `.psteps` (service process) are different components; don't reuse the name.
- `.tgrid` is the tracking panel grid; `.tgroup` is one copy of the testimonials list inside the marquee. The testimonials block (`components/ui/TestimonialsSplit.tsx`: copy left, endless upward marquee right, still list below 900px and under reduced motion) is shared by the home `#testimonials` section and the About page (`.tpanel`). `.phone` is the country-code + number grid in the pickup form only.
- IDs used by CSS, tests or links: `#main`, `#mainnav`, `#burger`, `#home`, `#hero-track`, `#trk`, `#tracking`, `#steps`, `#hist`, `#about`, `#services`, `#why`, `#testimonials`, `#pickup`, `#contact`, `#pickupForm`, `#wa-widget`, `#waBtn`, `#aboutVideo`, `#applyForm`. Keep them.
- Only one `PickupForm` per page (its field ids are fixed).
- Code that touches the DOM directly (reveal classes, `pathLength` on the line art) relies on React not re-rendering those elements with different `className` props — keep their `className` static.

## Our Team showcase

`components/team/TeamShowcase.tsx` on `/our-team` (styles: `.tshow*` in `inner.css`). Shows one member at a time: the name as huge faint background type, a large portrait (photo if `photo` is set in `data/company.ts`, otherwise initials) with slowly turning orbit rings, a detail card (name, role, group, text, counter, prev/next) and a rail of avatars that slides to centre the active one (others greyed and shrunk by distance). Auto-advances every 6s with a progress line; pauses on hover/focus and in a hidden tab; stops after any manual choice; off under reduced motion. Arrow keys, swipe (touch) and the rail work. Team chips above the portrait (one per group in `teamGroups`) jump to the first member of that group and highlight the active member’s group; on phones they are one sideways-scrolling row that keeps the active chip in view. The showcase is the only team listing on the page (the old member-card grid was removed on 2026-10-21 at the client’s request).

## About page

`pages/AboutPage.tsx` (styles: `.journey`, `.jr-*`, `.vmv*` in `inner.css`). **Journey:** a "from Dubai" route map (`components/about/JourneyMap.tsx`, an SVG) of the 20 destinations the client ships to (UK, USA, Canada, Africa, France, Germany, Netherlands, Sweden, Norway, Rest of Europe, Australia, New Zealand, India, Pakistan, Bangladesh, Sri Lanka, Middle East, Nepal, China, Far East). It is an azimuthal projection centred on Dubai: each pin is at its true compass bearing, distance from the centre grows with the square root of the real distance. Regions use one representative city (Africa: Nairobi, Rest of Europe: Vienna, Middle East: Riyadh, Far East: Tokyo; USA: New York, Canada: Toronto, etc. — noted in `DESTINATIONS`). Names sit in a column each side of the map at the height where the pin direction meets the map edge, nudged apart where they would collide, with an elbow leader line to the pin. One destination is highlighted at a time (route, pin, leader and name turn red), cycling every 1.8s; hovering a destination takes over. Routes fade in staggered on reveal, white dots travel out along them, a radar sweep circles the map and Dubai pulses. On phones the side labels are hidden and the names show as chips under the map (the active one red). The home About stats (850+ Daily Shipment, 99.8% On-Time Delivery) float over the map corners on desktop and sit in a row under it on phones. Technology-Driven and GCC Network Experts sit under the copy as `.feat` rows. **Vision / Mission / Values:** a dark panel of three cards with outlined 01–03 numbers; a red line draws across each card top as it reveals (staggered), and hover turns the card brand red and lifts it (with the `translate` property, because the home reveal rule forces `transform:none!important` on revealed elements). Under reduced motion the sweep, moving dots, highlight cycling, bobbing and transitions are off.
