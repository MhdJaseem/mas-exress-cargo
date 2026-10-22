# Tracking & pickup API contract

The front end is ready; the backend is not. This is the contract `src/lib/api.ts` expects (the `TrackingResult`, `PickupRequest` and `JobApplication` types there mirror it).

## 1. Track a shipment

`GET {VITE_API_BASE}/api/track/{trackingNo}`

**200 response**

```json
{
  "no": "MAS123456",
  "lastStatusDate": "2026-10-21 14:05",
  "shipper": "ABC Trading LLC",
  "consignee": "XYZ Co.",
  "bookingDate": "2026-10-18",
  "lastStatus": "In transit",
  "origin": "Sharjah, UAE",
  "destination": "Riyadh, KSA",
  "serviceType": "GCC Road Transport",
  "pieces": 12,
  "weight": "340 kg",
  "stage": 2,
  "history": [
    { "date": "2026-10-19 09:10", "activity": "Picked up", "location": "Sharjah" },
    { "date": "2026-10-20 16:40", "activity": "Departed hub", "location": "Sharjah" }
  ]
}
```

- `stage` = index of the current step in the `#steps` progress bar on the home page (0–5; `-1` = none). Agree the six step labels with ops and keep them in sync with `STEPS` in `src/components/home/TrackingSection.tsx`.
- **404** → "Shipment not found" (make `trackShipment` throw; the UI should show an inline error — to build in Phase 3).
- Rate-limit by IP; never return personal data beyond what is shown above.

Implementation in `src/lib/api.ts`:

```ts
export async function trackShipment(no: string): Promise<TrackingResult> {
  const r = await fetch(`${API_BASE}/api/track/${encodeURIComponent(no)}`);
  if (!r.ok) throw new Error('Shipment not found');
  return r.json();
}
```

## 2. Request pickup

`POST {VITE_API_BASE}/api/pickup`

```json
{ "phone": "+971 501234567", "mode": "Air Freight", "date": "2026-10-25", "time": "10:00" }
```

Responses: `201 {id}`; `400 {errors:[...]}`. Server should (a) store the request, (b) email ops, (c) optionally notify via WhatsApp Business API. Add a honeypot field + rate limit/CAPTCHA to prevent spam.

## Security & privacy

CORS allow-list the site origin only · HTTPS only · validate/sanitise all fields server-side · no PII in URLs or logs · privacy note near the pickup form once data is stored.

## Backend options

| Option                                                                                         | When                                                     |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Serverless (Cloudflare Workers / Vercel / Netlify functions) + managed DB (Supabase, Firebase) | Fastest; low ops                                         |
| Node (Express/Fastify) + PostgreSQL on a small VPS                                             | Full control, integrates with an internal system         |
| Connect to existing logistics/ERP system via its API                                           | If MAS already has a shipment system — **confirm first** |

## 3. Job application (careers page)

`POST {VITE_API_BASE}/api/apply` as `multipart/form-data`: `name`, `email`, `phone`, `experience`, `cv` (PDF/DOC, max ~5 MB).
Responses: `201 {id}`; `400 {errors:[...]}`. Until this exists, `submitApplication()` in `src/lib/api.ts` opens an email draft to masexpresscargodubai@gmail.com and asks the applicant to attach the CV by hand (a mailto link cannot carry attachments). Confirm the recipient address with MAS. Scan uploads and never expose them publicly.
