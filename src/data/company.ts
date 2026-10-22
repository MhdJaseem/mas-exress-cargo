/* Company content — as on www.masexpresscargo.com (about, our-team, our-branches; synced 2026-10-21).
   Do not paraphrase. Known source inconsistencies are listed in docs/CONTENT.md. */

import type { IconName } from '../components/ui/Icon';

export interface Testimonial {
  initials: string;
  name: string;
  where: string;
  quote: string;
}

/** Shown on the home page (marquee) and the About page (grid). The first one is highlighted in red. */
export const testimonials: Testimonial[] = [
  {
    initials: 'IA',
    name: 'Imran Ali',
    where: 'Abaya Wholesale & Distribution (UAE)',
    quote:
      'As an abaya distributor, timely delivery is very important for our business. Their cargo service is fast, secure, and dependable. We have been shipping regularly, and every consignment reaches safely without delays. A trusted logistics partner for our operations.',
  },
  {
    initials: 'RK',
    name: 'Rajesh Kumar',
    where: '(Kerala, India)',
    quote:
      'Very reliable cargo service. I sent household items from Sharjah to India and everything arrived safely and on time. Packing was done very well. Highly satisfied!',
  },
  {
    initials: 'FK',
    name: 'Faisal Khan',
    where: '(Sharjah, UAE)',
    quote: 'Best cargo service in Sharjah. Affordable rates and no hidden charges. Staff is very friendly and helpful.',
  },
  {
    initials: 'AR',
    name: 'Ayesha Rahman',
    where: '(Abu Dhabi, UAE)',
    quote: 'Door-to-door service was very convenient. Pickup was on time and delivery was smooth. Highly recommended!',
  },
];

export const TESTIMONIALS_LEAD =
  'MAS Express Cargo delivers reliable logistics solutions across the UAE, GCC, and global markets with safe and timely delivery.';

export const clients = [
  { file: 'iata', name: 'IATA' },
  { file: 'dp-world', name: 'DP World' },
  { file: 'damac', name: 'DAMAC' },
  { file: 'maersk', name: 'Maersk' },
  { file: 'tt-club', name: 'TT Club' },
  { file: 'allianz', name: 'Allianz' },
] as const;

/* ---------------- Team ---------------- */

export interface Member {
  name: string;
  role: string;
  text: string;
  /** Portrait, where we have one (only the CEO so far); others show their initials. */
  photo?: string;
}

export const ceo = {
  name: ['K.Abdul ', 'Hameed'] as const,
  fullName: 'K.Abdul Hameed',
  role: 'CEO, MAS Express Cargo',
  photo: '/img/pages/team-ceo.webp',
  message: [
    'At MAS Express Cargo, our mission is to provide reliable, efficient, and customer-focused logistics solutions across the UAE, GCC, and international markets. Since our inception, we have been committed to delivering excellence in every shipment we handle.',
    'We understand that trust is the foundation of the cargo and logistics industry. That is why we prioritize transparency, timely delivery, and the safety of every consignment entrusted to us. Our team continuously works to improve our services through innovation and customer feedback.',
    'As we grow, our vision remains clear — to become a leading logistics partner recognized for quality, reliability, and customer satisfaction. We thank our valued customers and partners for their continued trust and support.',
  ],
};

export const TEAM_LEAD =
  'A dedicated team of professionals working together to deliver excellence, ensure quality, and create value for our clients.';

export const teamGroups: { icon: IconName; title: string; members: Member[] }[] = [
  {
    icon: 'users',
    title: 'Leadership Team',
    members: [
      {
        name: 'Kaja Abdul Hameed',
        role: 'CEO / Managing Director',
        text: 'Leads the company’s vision and strategic growth.',
        photo: '/img/pages/team-ceo.webp',
      },
      {
        name: 'Raja Mohammad Kaja',
        role: 'Operations Manager',
        text: 'Ensures efficient and smooth daily operations.',
      },
      { name: 'Essa Mohaiudeen', role: 'Regional Manager', text: 'Oversees regional performance and consistency.' },
      { name: 'Rabeeck Raja', role: 'Sales Head', text: 'Drives sales growth and client acquisition.' },
      { name: 'Ifham Haji', role: 'Chief officer', text: 'Supports leadership & operational coordination.' },
      { name: 'Sheni Sherif', role: 'HR & Admin Manager', text: 'Manages human resources & Administration.' },
    ],
  },
  {
    icon: 'warehouse',
    title: 'Business & Branch Management',
    members: [
      { name: 'Shalini', role: 'Business Development Head', text: 'Leads partnerships & business expansion.' },
      { name: 'Nagoor Gani', role: 'Branch Manager', text: 'Oversees branch operations & performance.' },
      { name: 'Afsal', role: 'Branch Manager', text: 'Ensures efficient branch functioning.' },
      { name: 'Imran', role: 'Branch Manager', text: 'Manages daily branch activities.' },
      { name: 'Aslam', role: 'Branch Manager', text: 'Maintains service quality & operations.' },
      { name: 'Sharif', role: 'Branch Manager', text: 'Handles branch efficiency & workflow.' },
    ],
  },
  {
    icon: 'phone',
    title: 'Customer Service',
    members: [
      { name: 'Akbar Basha', role: 'Customer Support Leader', text: 'Leads customer service excellence.' },
      {
        name: 'Mehrin Taj',
        role: 'Customer Support Executive',
        text: 'Provides prompt & effective customer assistance.',
      },
    ],
  },
  {
    icon: 'mail',
    title: 'Marketing & Front Office',
    members: [
      { name: 'Sanju', role: 'Marketing Executive', text: 'Supports marketing campaigns & promotions.' },
      { name: 'Joy Custodio', role: 'Receptionist', text: 'Manages front desk operations & client coordinations.' },
    ],
  },
  {
    icon: 'tag',
    title: 'Finance & Operations Support',
    members: [
      { name: 'Aswan', role: 'Accounts Executive', text: 'Handles financial transactions & accounting processes.' },
      { name: 'Ibrahim', role: 'Store Supervisor', text: 'Oversees inventory management & store operations.' },
    ],
  },
];

/** "Kaja Abdul Hameed" -> "KA", "Shalini" -> "S" */
export const initials = (name: string) =>
  name
    .replace(/^K\./, 'K ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/* ---------------- Branches ---------------- */

export interface BranchRow {
  label: string;
  text: string;
  /** tel: or mailto: link */
  href?: string;
}

export interface Branch {
  name: string;
  region: string;
  address?: string;
  rows: BranchRow[];
  main?: boolean;
}

const contact = (text: string, tel: string): BranchRow => ({ label: 'Contact', text, href: `tel:${tel}` });
const hours = (text: string): BranchRow => ({ label: 'Hours', text });
const UAE_HOURS = hours('8 AM–8 PM');
const IST_HOURS = hours('9 AM - 7 PM (IST)');

// Head office phone/email differ from the site header/footer on the live site — kept as-is (docs/CONTENT.md).
export const branches: Branch[] = [
  {
    name: 'Head Office & Main Warehouse',
    region: 'Sharjah, UAE',
    main: true,
    address: 'MAS Express Cargo LLC, Warehouse No 08, Industrial Area 17, Sharjah, UAE',
    rows: [
      { label: 'Office', text: '04 285 9004', href: 'tel:042859004' },
      { label: 'Toll Free', text: '+971 800 4786', href: 'tel:+9718004786' },
      { label: 'Email', text: 'info@masexpresscargo.com', href: 'mailto:info@masexpresscargo.com' },
      hours('Sun–Thu 8 AM–8 PM | Fri 9 AM–6 PM | Sat 9 AM–5 PM'),
    ],
  },
  {
    name: 'Deira',
    region: 'Dubai, UAE',
    address: 'Deira, Dubai (Near Deira City Center)',
    rows: [contact('058 212 6786', '0582126786'), UAE_HOURS],
  },
  {
    name: 'Jebel Ali',
    region: 'Dubai, UAE',
    address: 'Jebel Ali Free Zone, Dubai',
    rows: [contact('058 187 6786', '0581876786'), UAE_HOURS],
  },
  {
    name: 'Al Quoz',
    region: 'Dubai, UAE',
    address: 'Al Quoz Industrial Area, Dubai',
    rows: [contact('058 202 3786', '0582023786'), UAE_HOURS],
  },
  {
    name: 'Karama',
    region: 'Dubai, UAE',
    address: 'Karama, Dubai',
    rows: [contact('050 786 3335', '0507863335'), UAE_HOURS],
  },
  { name: 'Abu Dhabi', region: 'Abu Dhabi, UAE', rows: [contact('054 786 1414', '0547861414'), UAE_HOURS] },
  { name: 'Sharjah City', region: 'Sharjah, UAE', rows: [contact('050 644 4786', '0506444786'), UAE_HOURS] },
  { name: 'Rolla', region: 'Sharjah, UAE', rows: [contact('052 129 4786', '0521294786'), UAE_HOURS] },
  { name: 'DIP', region: 'Dubai, UAE', rows: [contact('058 154 1786', '0581541786'), UAE_HOURS] },
  { name: 'Sonapur', region: 'Dubai, UAE', rows: [contact('058 103 0786', '0581030786'), UAE_HOURS] },
  {
    name: 'Delhi Office',
    region: 'India',
    address: 'Delhi, India (Main Office)',
    rows: [contact('+91 99204 44786', '+919920444786'), IST_HOURS],
  },
  {
    name: 'Mumbai Office',
    region: 'India',
    address: 'Mumbai, India (Port Office)',
    rows: [contact('+91 98410 78786', '+919841078786'), IST_HOURS],
  },
];
