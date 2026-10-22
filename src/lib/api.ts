/* ------------------------------------------------------------------
   API layer: the ONLY place the site talks to a backend.
   Replace the bodies below when the tracking system / CRM is ready.
   Contract: docs/TRACKING_API.md
   ------------------------------------------------------------------ */

// e.g. https://api.masexpresscargo.com — set VITE_API_BASE in .env.local
export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export interface TrackingEvent {
  date: string;
  activity: string;
  location: string;
}

export interface TrackingResult {
  no: string;
  lastStatusDate?: string;
  shipper?: string;
  consignee?: string;
  bookingDate?: string;
  lastStatus?: string;
  origin?: string;
  destination?: string;
  serviceType?: string;
  pieces?: number | string;
  weight?: string;
  /** Index of the current step in the progress bar, 0..5 (-1 = none). */
  stage: number;
  history: TrackingEvent[];
}

/**
 * Look up a shipment.
 * Example once the backend exists:
 *   const r = await fetch(`${API_BASE}/api/track/${encodeURIComponent(no)}`);
 *   if (!r.ok) throw new Error('Shipment not found');
 *   return r.json();
 */
export async function trackShipment(no: string): Promise<TrackingResult> {
  return { no, stage: -1, history: [] }; // placeholder: no backend connected yet
}

export interface PickupRequest {
  /** Country code option text, e.g. "🇦🇪 UAE (+971)" */
  cc: string;
  /** Phone number */
  n: string;
  /** Shipment mode */
  m: string;
  /** Pickup date, yyyy-mm-dd */
  d: string;
  /** Pickup time, hh:mm */
  t: string;
}

/**
 * Submit a pickup request. Returns the message shown under the form.
 * Currently opens an email draft; swap for a POST to your backend / CRM.
 */
export function submitPickup(f: PickupRequest): string {
  const body =
    'Pickup request%0D%0A%0D%0APhone: ' +
    encodeURIComponent(f.cc + ' ' + f.n) +
    '%0D%0AShipment Mode: ' +
    encodeURIComponent(f.m) +
    '%0D%0APickup Date: ' +
    f.d +
    '%0D%0APickup Time: ' +
    f.t;
  window.location.href =
    'mailto:masexpresscargodubai@gmail.com?subject=' + encodeURIComponent('Request Pickup') + '&body=' + body;
  return 'Opening your email app with the pickup details…';
}

export interface ContactMessage {
  first: string;
  last: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Submit a "Send a Message" enquiry (home Contact card). Returns the message shown under the form.
 * Currently opens an email draft; swap for a POST to your backend / CRM.
 */
export function submitMessage(f: ContactMessage): string {
  const name = (f.first + ' ' + f.last).trim();
  const body =
    'Website enquiry%0D%0A%0D%0AName: ' +
    encodeURIComponent(name) +
    '%0D%0AEmail Address: ' +
    encodeURIComponent(f.email) +
    '%0D%0ASubject: ' +
    encodeURIComponent(f.subject) +
    '%0D%0A%0D%0A' +
    encodeURIComponent(f.message);
  window.location.href =
    'mailto:masexpresscargodubai@gmail.com?subject=' + encodeURIComponent(f.subject + ' - ' + name) + '&body=' + body;
  return 'Opening your email app with your message…';
}

export interface JobApplication {
  name: string;
  email: string;
  phone: string;
  exp: string;
  /** Selected CV file name, or '' */
  cv: string;
}

/**
 * Submit a job application (careers page). Returns the message shown under the form.
 * No backend yet: opens an email draft. A mailto link cannot carry attachments,
 * so the applicant is asked to attach the CV themselves.
 * Swap for a multipart POST to `${API_BASE}/api/apply` (see docs/TRACKING_API.md).
 */
export function submitApplication(f: JobApplication): string {
  const body =
    'Job application%0D%0A%0D%0AFull Name: ' +
    encodeURIComponent(f.name) +
    '%0D%0AEmail Address: ' +
    encodeURIComponent(f.email) +
    '%0D%0APhone Number: ' +
    encodeURIComponent(f.phone) +
    '%0D%0AExperience: ' +
    encodeURIComponent(f.exp) +
    (f.cv ? '%0D%0ACV: ' + encodeURIComponent(f.cv) + ' (attached)' : '');
  window.location.href =
    'mailto:masexpresscargodubai@gmail.com?subject=' +
    encodeURIComponent('Job Application - ' + f.name) +
    '&body=' +
    body;
  return 'Opening your email app with your application. Please attach your CV to the email before sending.';
}
