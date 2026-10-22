# Content inventory

Source of truth for wording: the original site https://www.masexpresscargo.com. **Do not alter copy without client approval.**

## Contact data (appears in header cards, footer, contact section, WhatsApp)

- Phone (06) 566 0886 · Toll-free +971 800 4786 (shown as "Call Us Anytime")
- Email masexpresscargodubai@gmail.com · sales@masexpress.in
- Address: MAS Express Cargo. Warehouse number - 08 , Industrial area - 17, Near - Diana Trade , Sharjah UAE.
- WhatsApp: +971 50 644 4786 (wa.me/971506444786) · +971 52 166 8786 (wa.me/971521668786)
- Social: facebook / x / instagram: `masexpresscargo`; LinkedIn `company/masexpresscargo`

## Pages

| Page               | URL                   | Where the copy lives                                                      | Key content                                                                                                                    |
| ------------------ | --------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Home               | `/`                   | `src/components/home/*Section.tsx`, testimonials in `src/data/company.ts` | Hero "Transportation across the GCC and worldwide", tracking, About, 4 services, Why Choose Us, Testimonials, Pickup + Contact |
| Air Freight        | `/air-freight`        | `src/data/services.ts`                                                    | Why choose, 6 benefits, 4 solutions, 4-step process, 4 stats                                                                   |
| Sea Freight        | `/sea-freight`        | `src/data/services.ts`                                                    | Benefits, FCL/LCL/Specialized, 4-step process, destinations & transit table                                                    |
| GCC Road Transport | `/gcc-road-transport` | `src/data/services.ts`                                                    | Gateway intro, 4 reasons, 4-step process, 3-question FAQ                                                                       |
| Warehousing        | `/warehousing`        | `src/data/services.ts`                                                    | Strategic storage intro, 6 value-added services                                                                                |
| Customs Clearance  | `/customs-clearance`  | `src/data/services.ts`                                                    | Intro, 4 reasons, 4 solutions, 5-step process, 3 strengths                                                                     |
| About              | `/about`              | `src/pages/AboutPage.tsx` + `src/data/company.ts`                         | Logistics journey, Technology-Driven / GCC Network Experts, Vision / Mission / Values, 4 testimonials, 6 client logos          |
| Our Team           | `/our-team`           | `src/data/company.ts`                                                     | CEO message (K.Abdul Hameed), 18 team members in 5 groups, shown in the animated team showcase                                 |
| Our Branches       | `/our-branches`       | `src/data/company.ts`                                                     | Head office + 9 UAE branches + Delhi and Mumbai offices, phones and hours                                                      |
| Solutions (4)      | `/solution/<slug>`    | `src/data/solutions.ts`                                                   | E-commerce Fulfillment, Cold Chain Logistics, Heavy Lift & Project Cargo, Retail Distribution: title + 1–2 paragraphs each     |
| Careers            | `/careers`            | `src/pages/CareersPage.tsx`                                               | "Ready to Apply?" form: name, email, phone, CV upload, experience                                                              |

Site-wide contact details (header, footer, contact card, WhatsApp, sidebars) live in `src/lib/site.ts`.

No Services or Solutions index page: removed from the nav dropdowns at the client's request (2026-10-21). Every nav link now stays on the new site.

Solution pages (added 2026-10-21) carry the live wording exactly. The live pages have only a title, the paragraphs and one photo (740px wide, now WebP in `public/img/pages/solution-*.webp`). Our additions, not live copy: the "Solutions" eyebrow, the "Related Services" cards (service names and taglines reused from the service pages) and the sidebar; the meta description is the first sentence of the copy.

## Destinations (About page map)

The 20 countries/regions MAS ships to, as given by the client (2026-10-21): UK, USA, Canada, Africa, France, Germany, Netherlands, Sweden, Norway, Rest of Europe, Australia, New Zealand, India, Pakistan, Bangladesh, Sri Lanka, Middle East, Nepal, China, Far East. Edit them in `DESTINATIONS` in `src/components/about/JourneyMap.tsx`.

## Known inconsistencies in the ORIGINAL air-freight page (kept as-is — ask the client)

1. "14+ years of experience" (benefits) vs "20+ GCC Air Cargo Experience" (stats).
2. "200+ global destinations" (text) vs "12+ Global Destinations" (stats).

## Contact data that differs on the ORIGINAL branches page (kept as-is — ask the client)

- Head office phone is "04 285 9004" there, but "(06) 566 0886" in the site header/footer.
- Head office email is "info@masexpresscargo.com" there, but the site elsewhere uses masexpresscargodubai@gmail.com and sales@masexpress.in.

## Known typo in the ORIGINAL sea-freight page (kept as-is — ask the client)

- "Why Choose Our Sea Freight?" first item reads **"CL & LCL Expertise"**; almost certainly meant "FCL & LCL Expertise".

## Content status

The four company pages (About, Our Team, Our Branches, Careers) were added on 2026-10-21 with the exact live wording; the team-group emojis were replaced by sprite icons.
On 2026-10-21 the five service pages were updated to the **exact wording** of the live pages (hero tagline, every section, list, process step, FAQ, table and stat). Meta descriptions use each page's hero tagline. Eyebrow labels (small red text above headings) are design labels, not source copy. The sea freight "Sea Freight Solutions" and customs "Customs Expertise" headings are ours too, because the live site has no heading there. Header photos are the live pages' own photos, compressed to WebP in `public/img/pages/`.

## Request Pickup form fields

Phone (country code select + number) · Shipment Mode (Air Freight / Sea Freight / Land Transport) · Pickup Date · Pickup Time.
