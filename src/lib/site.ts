/* Company contact data used across the site.
   Wording and numbers come from www.masexpresscargo.com — do not change without client approval
   (see docs/CONTENT.md). */

export const SITE_NAME = 'MAS Express Cargo L.L.C';

export const CONTACT = {
  phone: { label: '050 944 4786', href: 'tel:+971509444786' },
  tollFree: { label: '+971 800 4786', href: 'tel:+9718004786' },
  emails: ['masexpresscargodubai@gmail.com', 'sales@masexpress.in'],
  address: 'MAS Express Cargo. Warehouse number - 08 , Industrial area - 17, Near - Diana Trade , Sharjah UAE.',
  /** The home Contact Us card prints the address without the space before the comma after "Diana Trade". */
  addressContactCard:
    'MAS Express Cargo. Warehouse number - 08 , Industrial area - 17, Near - Diana Trade, Sharjah UAE.',
} as const;

export const WHATSAPP = [
  { number: '+971 50 644 4786', href: 'https://wa.me/971506444786', label: 'Customer support & Admin' },
  { number: '+971 52 166 8786', href: 'https://wa.me/971521668786', label: 'Customer support & Admin' },
] as const;

export const SOCIALS = [
  { href: 'https://www.facebook.com/masexpresscargodubai/directory_travel', label: 'Facebook', icon: 'fb' },
  { href: 'https://x.com/masexpresscargo', label: 'X', icon: 'xx' },
  { href: 'https://www.instagram.com/masexpresscargodubai/', label: 'Instagram', icon: 'ig' },
  { href: 'https://www.linkedin.com/in/mas-express-cargo-uae-91304b445/', label: 'LinkedIn', icon: 'in' },
] as const;

/** WhatsApp "Enquire now" link with a prefilled message for a service. */
export const enquireHref = (service: string) =>
  `https://wa.me/971506444786?text=${encodeURIComponent(`Hello MAS Express Cargo, I would like to enquire about ${service}`)}`;

export const pageTitle = (name: string) => `${name} | ${SITE_NAME}`;
