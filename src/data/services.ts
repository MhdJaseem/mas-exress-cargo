/* Service pages — content as on www.masexpresscargo.com (synced 2026-10-21, see docs/CONTENT.md).
   Each entry renders through pages/ServicePage.tsx at /<slug>. Adding a service = adding an entry here
   (plus its header photo in public/img/pages/). Do not paraphrase the copy. */

import type { IconName } from '../components/ui/Icon';
import type { Heading } from '../components/ui/Heading';
import type { ShipmentMode } from '../components/ui/PickupForm';

export interface Card {
  icon: IconName;
  title: string;
  text: string;
  /** Bullet list under the text (sea freight FCL / LCL / Specialized). */
  list?: string[];
}

export type Block =
  | { kind: 'paras'; eyebrow: string; heading: Heading; paras: string[] }
  | { kind: 'cards'; eyebrow: string; heading: Heading; cols: 2 | 3; cards: Card[] }
  | { kind: 'steps'; eyebrow: string; heading: Heading; steps: [title: string, text: string][] }
  | { kind: 'stats'; stats: { value: string; label: string }[] }
  | { kind: 'table'; eyebrow: string; heading: Heading; columns: string[]; rows: string[][] }
  | { kind: 'faq'; eyebrow: string; heading: Heading; lead?: string; items: [q: string, a: string][] };

export interface Service {
  slug: string;
  name: string;
  icon: IconName;
  /** Preselected option in the sidebar pickup form. */
  mode: ShipmentMode;
  heroImage: string;
  heroTitle: Heading;
  /** Hero tagline; also used as the meta description. */
  lead: string;
  blocks: Block[];
}

/** Live lists are written "Title: text" — split into a card. */
const card = (icon: IconName, s: string): Card => {
  const i = s.indexOf(':');
  return { icon, title: s.slice(0, i).trim(), text: s.slice(i + 1).trim() };
};

export const services: Service[] = [
  {
    slug: 'air-freight',
    name: 'Air Freight',
    icon: 'plane',
    mode: 'Air Freight',
    heroImage: '/img/pages/air-freight.webp',
    heroTitle: ['Expedited Global Air Cargo Solutions ', 'from Dubai!'],
    lead: 'Fast, reliable air freight for time-sensitive shipments. IATA certified with real-time tracking and priority handling across GCC and global destinations.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Air Freight',
        heading: ['Why Choose Our ', 'Air Freight Services?'],
        paras: [
          "When speed and reliability are critical, MAS Express Cargo's air freight solutions deliver. Operating from Dubai International Airport (DXB) and Al Maktoum International Airport (DWC), we provide seamless air cargo services for urgent shipments, high-value goods, and time-sensitive supply chains.",
          'As an IATA certified carrier, we maintain the highest standards of safety, security, and operational excellence. Our partnerships with leading airlines ensure capacity and competitive rates for shipments to over 200 global destinations.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Benefits',
        heading: ['Benefits of ', 'MAS Express Air Freight'],
        cols: 3,
        cards: [
          card('bolt', 'Speed: GCC delivery in 24–48 hours, global in 3–5 days'),
          card('radar', 'Reliability: High on-time performance across GCC and global routes'),
          card('pin', 'Tracking: Real-time MAS Express tracking from pickup to delivery'),
          card('customs', 'Security: IATA certified handling and maximum insurance coverage'),
          card('users', 'Expertise: 14+ years of GCC air cargo experience'),
          card('globe', 'Flexibility: Solutions from small parcels to consolidated shipments'),
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Solutions',
        heading: ['Key ', 'Air Freight Solutions'],
        cols: 2,
        cards: [
          {
            icon: 'plane',
            title: 'Express Air Freight',
            text: 'Priority handling and boarding for urgent shipments with guaranteed space on the next available flight.',
          },
          {
            icon: 'bolt',
            title: 'Temperature-Controlled',
            text: 'Specialized handling for pharmaceuticals, perishables, and temperature-sensitive products.',
          },
          {
            icon: 'tag',
            title: 'High Value Cargo',
            text: 'Secure transport for electronics, jewelry, artworks, and other high-value items with enhanced insurance.',
          },
          {
            icon: 'truck',
            title: 'Door-to-Door Delivery',
            text: 'Complete logistics including pickup, air transport, customs clearance, and final delivery.',
          },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Air Freight Process'],
        steps: [
          [
            'Consultation & Booking',
            'We analyze your needs, provide optimal routing, and secure confirmed airline space.',
          ],
          [
            'Pickup & Documentation',
            'Our team handles pickup, professional packing, and all air waybill documentation.',
          ],
          [
            'Air Transport & Tracking',
            'Your shipment is monitored with real-time MAS internal tracking at every stage of the journey.',
          ],
          [
            'Customs & Final Delivery',
            'We manage customs clearance and deliver to your specified address with proof of delivery.',
          ],
        ],
      },
      {
        // Known source inconsistency kept as-is: 12+ vs "over 200" destinations, 20+ vs 14+ years (docs/CONTENT.md).
        kind: 'stats',
        stats: [
          { value: '12+', label: 'Global Destinations' },
          { value: '24/7', label: 'Operations' },
          { value: '95%', label: 'On-Time Performance' },
          { value: '20+', label: 'GCC Air Cargo Experience' },
        ],
      },
    ],
  },
  {
    slug: 'sea-freight',
    name: 'Sea Freight',
    icon: 'ship',
    mode: 'Sea Freight',
    heroImage: '/img/pages/sea-freight.webp',
    heroTitle: ['Reliable Sea Freight ', 'From Jebel Ali Port!'],
    lead: 'Cost-effective FCL & LCL container shipping with full port-to-port management, customs clearance, and real-time tracking for your global shipments.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Sea Freight',
        heading: ['Comprehensive ', 'Ocean Freight Services'],
        paras: [
          "MAS Express Cargo provides reliable and cost-effective sea freight solutions from the world-class Jebel Ali port to global destinations. Whether you're shipping full container loads (FCL) or consolidating smaller shipments (LCL), our ocean freight expertise ensures your cargo reaches its destination safely, on time, and within budget.",
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Why choose us',
        heading: ['Why Choose Our ', 'Sea Freight?'],
        cols: 3,
        cards: [
          // "CL" is a typo on the live site (likely "FCL") — kept verbatim, see docs/CONTENT.md.
          card('warehouse', 'CL & LCL Expertise: Full and Less-than-Container Load options'),
          card('customs', 'Customs Clearance: Included with all international shipments'),
          card('ship', 'Jebel Ali Port Access: Direct access to the Middle East’s largest port'),
          card('radar', 'Real-Time Tracking: Monitor shipment status with live updates'),
          card('globe', 'Global Network: Partnerships with major shipping lines worldwide'),
          card('tag', 'Cargo Insurance: Comprehensive coverage available'),
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'FCL Shipping · LCL Shipping · Specialized Cargo',
        heading: ['Sea Freight ', 'Solutions'],
        cols: 3,
        cards: [
          {
            icon: 'warehouse',
            title: 'Full Container Load (FCL)',
            text: 'Ideal for large volume shipments that require dedicated container space. We offer 20ft, 40ft, and 40ft High Cube containers with door-to-door service.',
            list: [
              'Dedicated container for your goods only',
              'Faster transit times with direct shipping',
              'Enhanced cargo security',
              'Cost-effective for shipments over 15 CBM',
            ],
          },
          {
            icon: 'tag',
            title: 'Less than Container Load (LCL)',
            text: "Perfect for smaller shipments that don't require a full container. We consolidate your cargo with other shipments for cost savings.",
            list: [
              'Pay only for space you use',
              'Weekly consolidation services',
              'Professional consolidation and deconsolidation',
              'Ideal for shipments under 15 CBM',
            ],
          },
          {
            icon: 'ship',
            title: 'Specialized Cargo',
            text: 'We handle specialized shipments requiring extra care and equipment.',
            list: [
              'Refrigerated containers (Reefers)',
              'Heavy lift and oversized cargo',
              'Hazardous materials (IMDG certified)',
              'Project cargo and breakbulk',
            ],
          },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Sea Freight Process'],
        steps: [
          ['Consultation & Quote', 'We analyze your needs and provide competitive pricing.'],
          ['Cargo Preparation', 'Professional packing, documentation, and customs paperwork.'],
          ['Port Operations', 'Container loading, port clearance, and vessel booking.'],
          ['Delivery & Tracking', 'Ocean transit, destination clearance, and final delivery.'],
        ],
      },
      {
        kind: 'table',
        eyebrow: 'Key destinations',
        heading: ['Key Destinations ', '& Transit Times'],
        columns: ['Destination', 'Transit Time', 'Main Port'],
        rows: [
          ['Shanghai, China', '18–22 days', 'Shanghai Port'],
          ['Rotterdam, Netherlands', '20–25 days', 'Port of Rotterdam'],
          ['Jawaharlal Nehru, India', '7–10 days', 'JNPT'],
          ['Jeddah, Saudi Arabia', '5–7 days', 'Jeddah Islamic Port'],
          ['Mombasa, Kenya', '12–16 days', 'Port of Mombasa'],
        ],
      },
    ],
  },
  {
    slug: 'gcc-road-transport',
    name: 'GCC Road Transport',
    icon: 'truck',
    mode: 'Land Transport',
    heroImage: '/img/pages/gcc-road-transport.webp',
    heroTitle: ['Seamless Cross-Border ', 'Road Freight!'],
    lead: 'Fast, reliable road transportation connecting all GCC countries. Your trusted partner for Dubai to Riyadh, Abu Dhabi to Doha, and beyond.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Your gateway',
        heading: ['Your Gateway to ', 'GCC Markets!'],
        paras: [
          'MAS Express Cargo specializes in cross-border road freight across the Gulf Cooperation Council (GCC) countries. With our dedicated fleet, experienced drivers, and deep knowledge of GCC regulations and border procedures, we ensure your goods move smoothly from the UAE to Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, and vice versa.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Why choose us',
        heading: ['Why Choose Our ', 'GCC Road Transport?'],
        cols: 2,
        cards: [
          card(
            'customs',
            'Pre-Cleared Border Crossings: Our established relationships and documentation expertise ensure minimal delays at GCC borders.',
          ),
          card(
            'radar',
            'Real-Time GPS Tracking: Track your shipment with live status updates and location visibility across the entire GCC route.',
          ),
          card(
            'truck',
            'Dedicated GCC Fleet: Modern trucks specifically maintained for long-distance GCC routes and varying terrain.',
          ),
          card(
            'bolt',
            'Temperature-Controlled Options: Refrigerated trucks available for perishable goods, pharmaceuticals, and sensitive materials.',
          ),
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'GCC Road Transport Process'],
        steps: [
          [
            'Route & Documentation Planning',
            'We analyze the optimal GCC route and prepare all necessary customs documents (GCC certificates of origin, commercial invoices, etc.).',
          ],
          [
            'Loading & Securing Cargo',
            'Professional loading and securing of your goods at our Dubai or Sharjah warehouse, with protective packaging if needed.',
          ],
          [
            'Cross-Border Transit',
            'Our experienced drivers transport your goods while managing all border formalities. Live shipment updates are provided throughout the journey.',
          ],
          [
            'Final Delivery & Proof',
            'On-time delivery to your specified GCC destination with digital proof of delivery (POD) and notification.',
          ],
        ],
      },
      {
        kind: 'faq',
        eyebrow: 'FAQ',
        heading: ['Frequently ', 'Asked Questions'],
        lead: 'Everything you need to know about our GCC road transport services',
        items: [
          [
            'What documents are required for GCC road freight?',
            'Typically required: Commercial Invoice, Packing List, Certificate of Origin (GCC approved), Bill of Lading/Air Waybill, and any specific product certificates. Our team will guide you through the exact requirements for your shipment.',
          ],
          [
            'What is the typical transit time from Dubai to Riyadh?',
            'Standard transit time for Dubai to Riyadh is 2-3 days, depending on border crossing traffic and final delivery location within the city. Express options are available for urgent shipments.',
          ],
          [
            'Do you handle customs clearance at GCC borders?',
            'Yes, customs clearance is a core part of our service. Our team handles all GCC border formalities, including duties and taxes calculation (if applicable), using our pre-established clearance processes to minimize delays.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'warehousing',
    name: 'Warehousing',
    icon: 'warehouse',
    mode: 'Land Transport',
    heroImage: '/img/pages/warehousing.webp',
    heroTitle: ['Secure Warehousing ', 'Solutions in Dubai!'],
    lead: 'State-of-the-art storage facilities with inventory management, temperature control, and GCC distribution capabilities.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Warehousing',
        heading: ['Your Strategic ', 'Storage Partner in the GCC'],
        paras: [
          'MAS Express Cargo provides comprehensive warehousing and storage solutions from our strategically located facilities in Sharjah Industrial Area. Our modern warehouses serve as the perfect logistics hub for businesses looking to store, manage, and distribute goods across the UAE and wider GCC region.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Value-added services',
        heading: ['Value-Added ', 'Services'],
        cols: 3,
        cards: [
          card('warehouse', 'Inventory Management: Real-time stock tracking and reporting.'),
          card('customs', 'Quality Inspections: Incoming and outgoing goods inspection.'),
          card('tag', 'Pick & Pack: Order fulfillment and preparation for distribution.'),
          card('globe', 'Cross-Docking: Direct transfer for faster distribution.'),
          card('tag', 'Labeling & Repackaging: Custom packaging to meet requirements.'),
          card('truck', 'Returns Processing: Efficient handling of returned goods.'),
        ],
      },
    ],
  },
  {
    slug: 'customs-clearance',
    name: 'Customs Clearance',
    icon: 'customs',
    mode: 'Air Freight',
    heroImage: '/img/pages/customs-clearance.webp',
    heroTitle: ['Professional Customs ', 'Clearance Services!'],
    lead: 'Navigating GCC & international customs regulations with expertise. We handle the paperwork, you focus on your business.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Customs',
        heading: ['Seamless Customs ', 'Clearance Across GCC!'],
        paras: [
          'Customs clearance is one of the most complex aspects of international shipping. At MAS Express Cargo, we specialize in navigating the intricate regulations of UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain, and global destinations. Our certified experts ensure your shipments clear customs quickly, correctly, and cost-effectively.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Why choose us',
        heading: ['Why Choose Our ', 'Customs Services?'],
        cols: 2,
        cards: [
          card('globe', 'GCC Specialists: Deep knowledge of all GCC customs regulations.'),
          card('bolt', 'Pre-Clearance: Advance documentation submission to minimize delays'),
          card('tag', 'Duty Optimization: Legitimate strategies to minimize duty payments.'),
          card('phone', 'Single Point of Contact: Dedicated customs coordinator for your account'),
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Solutions',
        heading: ['Comprehensive Customs ', 'Solutions for Business!'],
        cols: 2,
        cards: [
          {
            icon: 'customs',
            title: 'Import Customs Clearance',
            text: 'Full clearance for goods entering UAE and other GCC countries. We handle Dubai Customs, FTA, and all port authorities.',
          },
          {
            icon: 'plane',
            title: 'Export Customs Clearance',
            text: 'Preparation of all export documentation, certificates of origin, and compliance with destination country requirements.',
          },
          {
            icon: 'warehouse',
            title: 'Bonded Warehouse Clearance',
            text: 'Clearance for goods stored in bonded warehouses and free zones across the GCC, including JAFZA, DAFZA, and KIZAD.',
          },
          {
            icon: 'radar',
            title: 'Specialized Goods Clearance',
            text: 'Expert handling of restricted items: pharmaceuticals, chemicals, perishables, electronics, and high-value commodities.',
          },
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our 5-Step ', 'Customs Clearance Process'],
        steps: [
          [
            'Document Collection & Review',
            'We collect all required documents (commercial invoice, packing list, certificate of origin, etc.) and conduct a thorough review for accuracy and compliance with destination country regulations.',
          ],
          [
            'HS Code Classification & Duty Assessment',
            'Our experts assign the correct Harmonized System (HS) codes and calculate applicable duties, taxes, and fees. We identify any preferential treatment under trade agreements.',
          ],
          [
            'Pre-Clearance Submission',
            'We submit all documentation electronically to customs authorities before your shipment arrives, significantly reducing clearance time upon arrival.',
          ],
          [
            'Customs Examination & Payment',
            'We coordinate any physical examinations required by customs, pay duties and taxes on your behalf (with transparent invoicing), and handle all communications with authorities.',
          ],
          [
            'Release & Delivery',
            'Once cleared, we immediately arrange for pickup and final delivery to your specified location, with all release documentation provided to you.',
          ],
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Our strengths',
        heading: ['Customs ', 'Expertise'],
        cols: 3,
        cards: [
          {
            icon: 'customs',
            title: 'UAE Customs Expertise',
            text: 'Specialized knowledge of Dubai Customs, FTA, and all UAE emirate regulations.',
          },
          {
            icon: 'globe',
            title: 'GCC Customs Network',
            text: 'Strong connections with customs authorities across GCC countries for faster clearance.',
          },
          {
            icon: 'users',
            title: 'Global Customs Partners',
            text: 'Trusted global network ensuring smooth and reliable international customs handling.',
          },
        ],
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
