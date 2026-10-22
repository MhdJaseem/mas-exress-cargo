# Design system

## Colour tokens (`:root` in `src/styles/main.css`)

| Token          | Value                | Use                                           |
| -------------- | -------------------- | --------------------------------------------- |
| `--brand`      | `#E31E24`            | Buttons, highlights, key panels (logo red)    |
| `--brand-deep` | `#B5141A`            | Hover / pressed                               |
| `--brand-text` | `#C4141A`            | Small red text on white (accessible contrast) |
| `--ink`        | `#151515`            | Headings, dark buttons, footer (logo black)   |
| `--paper`      | `#f6f5f3`            | Soft panels                                   |
| `--bg`         | `#ecebe9`            | Page backdrop                                 |
| `--muted`      | `#5d6166`            | Secondary text                                |
| `--line`       | `rgba(21,21,21,.11)` | Borders                                       |

Radii: `--r-lg 22px`, `--r-md 16px`, `--r-sm 12px`. Shadow `--shadow`. Easing `--ease: cubic-bezier(.2,.7,.2,1)`.

## Typography

Inter Tight 300/400/500/600. Base 14px / 1.5. Headings light (300) uppercase for section titles (`h2.big`, with `<em>` in brand red); hero H1 600 uppercase. `p.lead` 14.5px muted. Eyebrow: 12px, uppercase, 0.14em tracking with a red dash.

## Layout

`.frame` (max 1320px) → `.shell` (rounded white container) → sections. `.wrap` max 1180px. Header is a floating dark-glass pill group over the hero.

## Components

| Component   | Class                                                                   | Notes                                                                     |
| ----------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Buttons     | `.btn` (+ `.brand`, `.light`, `.btn-sq`)                                | 42px tall                                                                 |
| Cards       | `.card`, `.svc` (photo service card), `.fc` (feature card, inner pages) | hover lifts 4–5px                                                         |
| Stats       | `.stat.a` (red) / `.stat.b` (white)                                     | count-up on view                                                          |
| Steps       | `.psteps` (inner), `#steps` (tracking progress)                         | do not mix the two                                                        |
| FAQ         | `<details>`                                                             | plus icon rotates                                                         |
| Table       | `.tbl`                                                                  | scrolls horizontally on small screens                                     |
| Pickup form | `.pickup` `.pf` `.fld`                                                  | red panel, dark submit                                                    |
| WhatsApp    | `.wa`                                                                   | fixed bottom-right popover with two numbers                               |
| Icons       | `<svg class="i"><use href="#plane"/></svg>`                             | `<Icon name="plane" />`; sprite in `src/components/layout/IconSprite.tsx` |

Sprite symbols: arrow, plus, chev, menu, plane, ship, truck, warehouse, customs, bolt, tag, radar, users, globe, phone, mail, pin, wa, fb, xx, ig, in.

## Motion

- Reveal-on-scroll: `.reveal` → `.in` via IntersectionObserver, staggered with `--i`.
- Logo wings: closed → open on load (`wingL/wingR/bodyIn` keyframes; runs even under reduced motion by design).
- Hero slides: 6.5 s crossfade with slow zoom. Testimonials: vertical infinite marquee, pauses on hover.
- All other motion is wrapped for `prefers-reduced-motion`.

## Breakpoints

Home: 1180, 1100, 960, 900 (stack mode on/off at 900), 620. Inner pages: 980 (sidebar drops under content), 640. Test at 1440 / 1024 / 768 / 390.

## Photography

Real photos only (no illustrations): air (hero-air), sea (hero-sea), road (hero-road), warehouse aisle (card-warehouse), container-at-port (about-poster, used for Customs), plane-over-ship (why-cargo). Overlay gradients keep white text legible. Service page headers use the live site's own page photos (`img/pages/<page>.webp`).
