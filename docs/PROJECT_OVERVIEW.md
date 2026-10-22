# Project overview

**Client:** MAS Express Cargo L.L.C — Warehouse 08, Industrial Area 17, near Diana Trade, Sharjah, UAE. Tagline: "From your doorstep to their smile".
**Goal:** replace masexpresscargo.com's front end with a faster, more modern red-and-white design, **keeping all text and contact details identical**, then add a working shipment-tracking system.

## Scope

**Delivered (front end):** React + TypeScript + React Router single-page app (Vite) with clean URLs — home page, five service pages (Air Freight, Sea Freight, GCC Road Transport, Warehousing, Customs Clearance), four solution pages, About, Our Team, Our Branches, Careers and a 404 page; tracking, pickup and careers UI; WhatsApp widget; responsive layouts.
**Not yet built:** live tracking backend, pickup/CRM and careers submission, pre-rendering for SEO, analytics, deployment.

## UX problems found in the original site and the response

| Problem                                           | Redesign answer                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Generic, dense template look; weak brand presence | Brand red `#E31E24` from the logo, large photography, single bold hero                                         |
| Hero doesn't show what the company moves          | Photo hero cycling air / sea / road with real photos                                                           |
| Tracking is not prominent                         | Tracking card in the hero and a result panel with progress steps                                               |
| Services hard to compare                          | Four photo cards + chips linking to all five services                                                          |
| Long pages, no hierarchy                          | Short sections, consistent headings, sticky-card scroll on home                                                |
| Inconsistent spacing/typography                   | One token set, 14px base type, Inter Tight                                                                     |
| Heavy/slow assets, weak mobile                    | Compressed photos & video, mobile-first breakpoints, no overflow                                               |
| Social proof buried                               | Testimonials with copy left and an infinite vertical comment marquee (pauses on hover; stacked list on mobile) |
| Contact/pickup scattered                          | One section combining Request Pickup form + Contact Us; WhatsApp widget on every page                          |
| Nav always covering content                       | Transparent header over hero; hides on scroll down, returns on scroll up                                       |

## Constraints agreed with the client

- Same words, same contact details, same brand colours (red/white + logo black).
- No top progress bar, no side page dots, no text on slide indicators.
- Industry Solutions section removed from the home page (Solutions remain in the nav/footer).
