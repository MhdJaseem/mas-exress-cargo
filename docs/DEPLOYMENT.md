# Deployment

## Build

`npm ci && npm run build` (type-check + Vite build) → static files in `dist/`. Node 20.19+ or 22.12+.

This is a **single-page app**: every URL (`/air-freight`, `/about`, …) must serve `dist/index.html`, and React Router renders the page. Any static host works as long as it has this "SPA fallback". Without it, opening a deep link or refreshing a page gives the host's 404.

| Host                      | Fallback + redirects                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Netlify, Cloudflare Pages | `public/_redirects` (copied to `dist/`) — legacy `.html` 301s, then `/* /index.html 200` |
| Vercel                    | `vercel.json` — same redirects + rewrite to `/index.html`, long cache for `/assets/*`    |
| Nginx (VPS)               | `try_files $uri $uri/ /index.html;` and `return 301` rules for the old `.html` paths     |
| Apache                    | `FallbackResource /index.html` in `.htaccess`                                            |

## Recommended hosts

Cloudflare Pages · Netlify · Vercel (all free tiers suit this site; global CDN + HTTPS automatic). A UAE VPS with Nginx also works.

## Steps (Cloudflare Pages / Netlify style)

1. Push the repo to GitHub.
2. Create a project from the repo. Build command `npm run build`, output directory `dist`.
3. Add env var `VITE_API_BASE` (production API URL).
4. Attach domain `www.masexpresscargo.com`; update DNS (CNAME) once approved; redirect apex → www.
5. Keep the old site live until QA passes.

## Clean URLs

Decided: the site uses clean URLs (`/air-freight`, `/about`, …), matching the old WordPress paths (`/air-freight/` also works — React Router accepts the trailing slash). The `.html` addresses of the interim multi-page build redirect (301 at the host, `<Navigate>` in the app as a fallback). Before launch, add 301s for any other old WordPress URL that changes (e.g. `/solution/...` once the Solutions pages exist).

## SEO note

The HTML for every route is the same shell until JavaScript runs. Google renders JavaScript, but social previews (Open Graph) and some crawlers do not. Before launch, pre-render each route at build time (Implementation Plan 5.4) so every URL ships its own title, description and content.

## CI (GitHub Actions, optional)

On pull request: `npm ci`, `npm run build` (fails on type errors), `npm run format:check`, upload `dist` as artifact; Lighthouse CI against the preview URL.

## Environments

| Env        | Branch | API            |
| ---------- | ------ | -------------- |
| Local      | any    | `.env.local`   |
| Preview    | PRs    | staging API    |
| Production | `main` | production API |

## Headers (set at host)

`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a Content-Security-Policy allowing self + fonts + WhatsApp links. Long cache for `/assets/*` (hashed); short cache for HTML.
