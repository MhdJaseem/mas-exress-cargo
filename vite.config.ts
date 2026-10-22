import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single-page app: index.html is the only HTML entry; React Router handles every URL.
// Vite's default `appType: 'spa'` serves index.html for unknown paths in dev and preview,
// so deep links such as /air-freight work locally. Production hosts need the same
// fallback — see public/_redirects (Netlify / Cloudflare Pages) and vercel.json.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173 },
});
