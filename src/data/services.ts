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
  /** Photo on top of the card in the carousel, /img/cards/<service>/<name>.webp (16:9). */
  img?: string;
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
  /** 'delivery': one of the delivery-option pages (Door to Door…), listed separately in the menus. */
  group?: 'delivery';
  /** Which Delivery Options this page shows (titles from DELIVERY_OPTIONS), in this order. */
  delivery: DeliveryTitle[];
}

/** Live lists are written "Title: text" — split into a card. */
const card = (icon: IconName, s: string, img?: string): Card => {
  const i = s.indexOf(':');
  return { icon, title: s.slice(0, i).trim(), text: s.slice(i + 1).trim(), img };
};

const AIR = '/img/cards/air-freight/';
const SEA = '/img/cards/sea-freight/';
const ROAD = '/img/cards/gcc-road-transport/';
const WH = '/img/cards/warehousing/';
const CUS = '/img/cards/customs-clearance/';

export const services: Service[] = [
  {
    slug: 'air-freight',
    delivery: ['Door to Door', 'Airport to Airport'],
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
          card('bolt', 'Speed: GCC delivery in 24–48 hours, global in 3–5 days', `${AIR}speed.webp`),
          card('radar', 'Reliability: High on-time performance across GCC and global routes', `${AIR}reliability.webp`),
          card('pin', 'Tracking: Real-time MAS Express tracking from pickup to delivery', `${AIR}tracking.webp`),
          card('customs', 'Security: IATA certified handling and maximum insurance coverage', `${AIR}security.webp`),
          card('users', 'Expertise: 14+ years of GCC air cargo experience', `${AIR}expertise.webp`),
          card(
            'globe',
            'Flexibility: Solutions from small parcels to consolidated shipments',
            `${AIR}flexibility.webp`,
          ),
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
            img: `${AIR}express.webp`,
          },
          {
            icon: 'bolt',
            title: 'Temperature-Controlled',
            text: 'Specialized handling for pharmaceuticals, perishables, and temperature-sensitive products.',
            img: `${AIR}temperature-controlled.webp`,
          },
          {
            icon: 'tag',
            title: 'High Value Cargo',
            text: 'Secure transport for electronics, jewelry, artworks, and other high-value items with enhanced insurance.',
            img: `${AIR}high-value.webp`,
          },
          {
            icon: 'truck',
            title: 'Door-to-Door Delivery',
            text: 'Complete logistics including pickup, air transport, customs clearance, and final delivery.',
            img: `${AIR}door-to-door.webp`,
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
    delivery: ['Door to Door', 'Door to Port', 'Port to Port'],
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
          card('warehouse', 'CL & LCL Expertise: Full and Less-than-Container Load options', `${SEA}fcl-lcl.webp`),
          card('customs', 'Customs Clearance: Included with all international shipments'),
          card(
            'ship',
            'Jebel Ali Port Access: Direct access to the Middle East’s largest port',
            `${SEA}jebel-ali.webp`,
          ),
          card('radar', 'Real-Time Tracking: Monitor shipment status with live updates', `${SEA}tracking.webp`),
          card(
            'globe',
            'Global Network: Partnerships with major shipping lines worldwide',
            `${SEA}global-network.webp`,
          ),
          card('tag', 'Cargo Insurance: Comprehensive coverage available', `${SEA}insurance.webp`),
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
    delivery: ['Door to Door', 'Door to Port'],
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
            `${ROAD}border-crossing.webp`,
          ),
          card(
            'radar',
            'Real-Time GPS Tracking: Track your shipment with live status updates and location visibility across the entire GCC route.',
            `${ROAD}gps-tracking.webp`,
          ),
          card(
            'truck',
            'Dedicated GCC Fleet: Modern trucks specifically maintained for long-distance GCC routes and varying terrain.',
            `${ROAD}fleet.webp`,
          ),
          card(
            'bolt',
            'Temperature-Controlled Options: Refrigerated trucks available for perishable goods, pharmaceuticals, and sensitive materials.',
            `${ROAD}reefer-truck.webp`,
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
    delivery: ['Door to Door', 'Door to Port'],
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
          card('warehouse', 'Inventory Management: Real-time stock tracking and reporting.', `${WH}inventory.webp`),
          card('customs', 'Quality Inspections: Incoming and outgoing goods inspection.', `${WH}inspection.webp`),
          card('tag', 'Pick & Pack: Order fulfillment and preparation for distribution.', `${WH}pick-pack.webp`),
          card('globe', 'Cross-Docking: Direct transfer for faster distribution.', `${WH}cross-docking.webp`),
          card('tag', 'Labeling & Repackaging: Custom packaging to meet requirements.', `${WH}labeling.webp`),
          card('truck', 'Returns Processing: Efficient handling of returned goods.', `${WH}returns.webp`),
        ],
      },
    ],
  },
  {
    slug: 'customs-clearance',
    delivery: ['Door to Door', 'Door to Port', 'Port to Port', 'Airport to Airport'],
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
          card(
            'globe',
            'GCC Specialists: Deep knowledge of all GCC customs regulations.',
            `${CUS}gcc-specialists.webp`,
          ),
          card(
            'bolt',
            'Pre-Clearance: Advance documentation submission to minimize delays',
            `${CUS}pre-clearance.webp`,
          ),
          card('tag', 'Duty Optimization: Legitimate strategies to minimize duty payments.', `${CUS}duty.webp`),
          card(
            'phone',
            'Single Point of Contact: Dedicated customs coordinator for your account',
            `${CUS}contact.webp`,
          ),
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
            img: `${CUS}import.webp`,
          },
          {
            icon: 'plane',
            title: 'Export Customs Clearance',
            text: 'Preparation of all export documentation, certificates of origin, and compliance with destination country requirements.',
            img: `${CUS}export.webp`,
          },
          {
            icon: 'warehouse',
            title: 'Bonded Warehouse Clearance',
            text: 'Clearance for goods stored in bonded warehouses and free zones across the GCC, including JAFZA, DAFZA, and KIZAD.',
            img: `${CUS}bonded-warehouse.webp`,
          },
          {
            icon: 'radar',
            title: 'Specialized Goods Clearance',
            text: 'Expert handling of restricted items: pharmaceuticals, chemicals, perishables, electronics, and high-value commodities.',
            img: `${CUS}specialized-goods.webp`,
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
            img: `${CUS}uae-customs.webp`,
          },
          {
            icon: 'globe',
            title: 'GCC Customs Network',
            text: 'Strong connections with customs authorities across GCC countries for faster clearance.',
            img: `${CUS}gcc-network.webp`,
          },
          {
            icon: 'users',
            title: 'Global Customs Partners',
            text: 'Trusted global network ensuring smooth and reliable international customs handling.',
            img: `${CUS}global-partners.webp`,
          },
        ],
      },
    ],
  },

  /* ---------- Delivery option pages ----------
     NEW copy written 2026-10-26 at the client's request (not from the live site); see docs/CONTENT.md.
     They reuse existing photos; swap in dedicated ones when available. */
  {
    slug: 'door-to-door',
    group: 'delivery',
    delivery: [],
    name: 'Door to Door',
    icon: 'door',
    mode: 'Land Transport',
    heroImage: '/img/hero/hero-road-truck.webp',
    heroTitle: ['Door to Door Delivery, ', 'Handled End to End!'],
    lead: 'From your doorstep to theirs: pickup, packing, freight, customs clearance at both ends and final delivery, managed by one team with real-time tracking.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Door to Door',
        heading: ['Complete ', 'Door-to-Door Delivery'],
        paras: [
          "Door to door is our most complete service. We collect your goods from your home, office or warehouse, take care of packing, documentation, freight and customs clearance at both ends, and deliver to the receiver's doorstep, with one team accountable for the whole journey.",
          'Whether your cargo travels by air, by sea or by road across the GCC, we choose the right mode for your budget and timeline and keep you updated with MAS Express Cargo tracking from pickup to proof of delivery.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Benefits',
        heading: ['Why Choose ', 'Door to Door'],
        cols: 3,
        cards: [
          card(
            'door',
            'One Point of Contact: A single team manages pickup, freight, customs and delivery',
            `${AIR}door-to-door.webp`,
          ),
          card(
            'pin',
            'Real-Time Tracking: Follow your shipment from collection to the final doorstep',
            `${ROAD}gps-tracking.webp`,
          ),
          card(
            'customs',
            'Customs Handled: Export and import clearance managed for you at both ends',
            `${CUS}import.webp`,
          ),
          card('tag', 'Professional Packing: Goods packed and labelled to travel safely', `${AIR}security.webp`),
          card(
            'globe',
            'Any Mode: Air, sea or GCC road, chosen to match your budget and deadline',
            `${SEA}global-network.webp`,
          ),
          card(
            'truck',
            "Final-Mile Delivery: Delivered to the receiver's address with proof of delivery",
            `${ROAD}fleet.webp`,
          ),
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Door to Door Process'],
        steps: [
          [
            'Quote & Booking',
            'Tell us what you are sending and where; we recommend the best mode and confirm your booking.',
          ],
          [
            'Pickup & Packing',
            'We collect from your address, pack and label your goods, and prepare all shipping documents.',
          ],
          [
            'Freight & Clearance',
            'Your cargo travels by air, sea or road, with export and import customs clearance handled for you.',
          ],
          ['Doorstep Delivery', "We deliver to the receiver's address and confirm with proof of delivery."],
        ],
      },
      {
        kind: 'faq',
        eyebrow: 'FAQ',
        heading: ['Door to Door ', 'Questions'],
        items: [
          [
            'What does door-to-door include?',
            "Pickup from your address, packing, shipping documents, freight, export and import customs clearance, and delivery to the receiver's door.",
          ],
          [
            'Where can you deliver door to door?',
            'Across the UAE and GCC, and to our international destinations including India, Pakistan, Bangladesh, Sri Lanka, Nepal, the UK, Europe, the USA, Canada, Australia and New Zealand.',
          ],
          [
            'Are destination duties and taxes included?',
            'Duties and taxes depend on the goods and the destination country. We explain what applies when we quote, so there are no surprises on delivery.',
          ],
          [
            'How do I track my shipment?',
            'Enter your tracking number in the Track Your Shipment box on our home page to see its latest status and history.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'door-to-port',
    group: 'delivery',
    delivery: [],
    name: 'Door to Port',
    icon: 'truck',
    mode: 'Sea Freight',
    heroImage: '/img/sections/about-poster.jpg',
    heroTitle: ['Door to Port Shipping ', 'from the UAE!'],
    lead: 'We collect from your premises, clear export customs and ship your cargo to the destination port, ready for your buyer or their agent to take over.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Door to Port',
        heading: ['Door to Port ', 'Shipping Made Simple'],
        paras: [
          'With door to port, we collect your cargo from your premises, handle export packing, documentation and customs clearance in the UAE, and ship it to the destination port of your choice. From there, your buyer or their agent takes over import clearance and onward delivery.',
          'It is a practical choice for exporters and traders whose customers have their own clearing agents at destination, keeping your costs clear while we manage everything on the UAE side.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Benefits',
        heading: ['Why Choose ', 'Door to Port'],
        cols: 3,
        cards: [
          card(
            'truck',
            'Pickup Included: We collect from your warehouse, factory or office anywhere in the UAE',
            `${ROAD}fleet.webp`,
          ),
          card(
            'customs',
            'Export Clearance: UAE export documentation and customs formalities handled for you',
            `${CUS}export.webp`,
          ),
          card('ship', 'Port Network: Sailings from Jebel Ali to major ports worldwide', `${SEA}jebel-ali.webp`),
          card(
            'tag',
            'Clear Costs: You pay for the UAE side and the freight; destination charges stay with your buyer',
            `${CUS}duty.webp`,
          ),
          card(
            'pin',
            'Tracking: MAS Express tracking until your cargo reaches the destination port',
            `${SEA}tracking.webp`,
          ),
          card('radar', 'Cargo Insurance: Cover available for the sea leg of the journey', `${SEA}insurance.webp`),
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Door to Port Process'],
        steps: [
          ['Booking & Documents', 'We confirm your booking and prepare the commercial and shipping documents.'],
          ['Collection & Packing', 'Our team collects from your premises and packs your cargo for the voyage.'],
          ['Export Clearance & Loading', 'We clear UAE export customs and load your cargo at the port of departure.'],
          [
            'Arrival at Destination Port',
            'Your cargo arrives at the destination port, ready for your buyer or agent to clear and collect.',
          ],
        ],
      },
      {
        kind: 'faq',
        eyebrow: 'FAQ',
        heading: ['Door to Port ', 'Questions'],
        items: [
          [
            'Who handles import clearance at destination?',
            "Your buyer or their clearing agent. If you'd like us to take care of it and deliver to their door, choose our Door to Door service instead.",
          ],
          [
            'Which documents do I need?',
            'Usually a commercial invoice and packing list. We tell you exactly what your shipment needs and prepare the shipping documents for you.',
          ],
          [
            'Do you ship full containers and smaller loads?',
            'Yes. Full container loads (FCL) and shared container space (LCL) are both available.',
          ],
          [
            'Can I track my cargo after it leaves the UAE?',
            'Yes. Use your tracking number in the Track Your Shipment box on our home page until your cargo reaches the destination port.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'port-to-port',
    group: 'delivery',
    delivery: [],
    name: 'Port to Port',
    icon: 'ship',
    mode: 'Sea Freight',
    heroImage: '/img/hero/hero-sea.jpg',
    heroTitle: ['Cost-Effective ', 'Port to Port Shipping!'],
    lead: 'Ocean freight from port to port with FCL and LCL options, bills of lading and voyage tracking, for shippers who manage their own transport at each end.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Port to Port',
        heading: ['Port to Port ', 'Ocean Freight'],
        paras: [
          'Port to port is ocean freight in its simplest form. You deliver your cargo to the origin port, and we book space with our shipping line partners, prepare the bill of lading and shipping documents, and manage the voyage through to the destination port.',
          'Ideal for experienced importers and exporters who have their own transport and clearing agents at each end, it offers competitive full and shared container options with MAS Express Cargo tracking throughout the voyage.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Benefits',
        heading: ['Why Choose ', 'Port to Port'],
        cols: 3,
        cards: [
          card('ship', 'FCL & LCL: Full containers or shared space for smaller consignments', `${SEA}fcl-lcl.webp`),
          card(
            'globe',
            'Global Reach: Sailings from Jebel Ali to ports across Asia, Europe, Africa and the Americas',
            `${SEA}jebel-ali.webp`,
          ),
          card(
            'tag',
            'Competitive Rates: Partner shipping line rates on major trade lanes',
            `${SEA}global-network.webp`,
          ),
          card(
            'customs',
            'Documentation: Bills of lading and shipping documents prepared for you',
            `${CUS}export.webp`,
          ),
          card('pin', 'Voyage Tracking: Updates from departure to arrival', `${SEA}tracking.webp`),
          card('radar', 'Cargo Insurance: Cover available for the ocean leg', `${SEA}insurance.webp`),
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Port to Port Process'],
        steps: [
          ['Quote & Booking', 'We compare sailings and rates and secure space on the right vessel.'],
          ['Delivery to Port', 'You deliver your cargo to the origin port by the agreed cut-off.'],
          ['Loading & Voyage', 'Your cargo is loaded and tracked throughout the voyage.'],
          [
            'Arrival & Release',
            'At the destination port we release the documents so your agent can clear and collect.',
          ],
        ],
      },
      {
        kind: 'faq',
        eyebrow: 'FAQ',
        heading: ['Port to Port ', 'Questions'],
        items: [
          [
            'What is the difference between FCL and LCL?',
            'FCL (full container load) gives you a whole container. LCL (less than container load) lets you share container space and pay only for the volume you use.',
          ],
          [
            'Is customs clearance included?',
            'No. With port to port, customs clearance at each end is arranged by you or your agents. Our Door to Port and Door to Door services include it.',
          ],
          [
            'Can you add pickup or delivery later?',
            'Yes. Ask us to upgrade your booking to Door to Port or Door to Door at any time before the cargo is delivered to the port.',
          ],
          [
            'How do I follow my shipment?',
            'Enter your tracking number in the Track Your Shipment box on our home page for voyage updates.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'airport-to-airport',
    group: 'delivery',
    delivery: [],
    name: 'Airport to Airport',
    icon: 'plane',
    mode: 'Air Freight',
    heroImage: '/img/hero/hero-air.jpg',
    heroTitle: ['Fast Airport to Airport ', 'Air Freight!'],
    lead: 'The speed of air freight for shippers who handle their own pickup and delivery: airline space, air waybill and IATA certified handling from DXB and DWC.',
    blocks: [
      {
        kind: 'paras',
        eyebrow: 'Airport to Airport',
        heading: ['Airport to Airport ', 'Air Freight'],
        paras: [
          "Airport to airport gives you the speed of air freight without paying for services you don't need. You drop your cargo at the origin airport; we book space with our airline partners, prepare the air waybill and complete the security formalities, and your shipment flies to the destination airport, ready for collection.",
          'Operating from Dubai International Airport (DXB) and Al Maktoum International Airport (DWC), we provide IATA certified handling and real-time tracking for urgent and time-sensitive cargo.',
        ],
      },
      {
        kind: 'cards',
        eyebrow: 'Benefits',
        heading: ['Why Choose ', 'Airport to Airport'],
        cols: 3,
        cards: [
          card('bolt', 'Speed: The fastest way to move urgent cargo between airports', `${AIR}speed.webp`),
          card('plane', 'Airline Partners: Space on leading airlines from DXB and DWC', `${AIR}express.webp`),
          card('customs', 'IATA Certified: Safe, secure handling to international standards', `${AIR}security.webp`),
          card('pin', 'Tracking: Real-time updates from departure to arrival', `${AIR}tracking.webp`),
          card(
            'tag',
            'Cost-Effective: Pay only for the air leg when you handle pickup and delivery',
            `${AIR}flexibility.webp`,
          ),
          card('radar', 'Reliability: High on-time performance across GCC and global routes', `${AIR}reliability.webp`),
        ],
      },
      {
        kind: 'steps',
        eyebrow: 'How it works',
        heading: ['Our ', 'Airport to Airport Process'],
        steps: [
          ['Booking & Air Waybill', 'We confirm airline space and prepare the air waybill for your shipment.'],
          ['Drop-Off at Airport', 'You deliver your cargo to the origin airport cargo terminal by the cut-off time.'],
          ['Flight & Tracking', 'Your cargo flies on the booked flight with real-time tracking.'],
          [
            'Arrival & Collection',
            'Your cargo is ready for you or your agent to clear and collect at the destination airport.',
          ],
        ],
      },
      {
        kind: 'faq',
        eyebrow: 'FAQ',
        heading: ['Airport to Airport ', 'Questions'],
        items: [
          [
            'Which airports do you ship from?',
            'Dubai International Airport (DXB) and Al Maktoum International Airport (DWC).',
          ],
          [
            'Can you collect the cargo for me?',
            'Yes. Choose our Door to Door service and we will pick up from your address and deliver to the receiver as well.',
          ],
          [
            'Can I send restricted or dangerous goods?',
            'Some goods need special handling or are not allowed by air. Tell us what you are sending and we will advise before booking.',
          ],
          [
            'How do I track my air shipment?',
            'Enter your tracking number in the Track Your Shipment box on our home page for flight and status updates.',
          ],
        ],
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/* Delivery options — each service page shows the ones listed in its 'delivery' field (components/service/DeliveryOptions.tsx).
   NEW copy written 2026-10-26 at the client's request (not from the live site); see docs/CONTENT.md. */
export type DeliveryTitle = 'Door to Door' | 'Door to Port' | 'Port to Port' | 'Airport to Airport';

export interface DeliveryOption {
  title: DeliveryTitle;
  /** Its own service page. */
  slug: string;
  /** Route graphic: where we pick up → where we hand over. */
  from: { icon: IconName; label: string };
  to: { icon: IconName; label: string };
  text: string;
  bestFor: string;
}

export const DELIVERY_HEADING: Heading = ['Flexible ', 'Delivery Options'];
export const DELIVERY_LEAD =
  'Choose how much of the journey we handle, from complete door-to-door service to terminal-to-terminal freight.';

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    title: 'Door to Door',
    slug: 'door-to-door',
    from: { icon: 'door', label: 'Your door' },
    to: { icon: 'door', label: 'Their door' },
    text: 'We collect from your premises and deliver to the receiver’s doorstep. Pickup, packing, documentation, freight, customs clearance at both ends and final delivery are all handled by one team.',
    bestFor: 'Businesses and individuals who want one point of contact for the whole journey.',
  },
  {
    title: 'Door to Port',
    slug: 'door-to-port',
    from: { icon: 'door', label: 'Your door' },
    to: { icon: 'ship', label: 'Destination port' },
    text: 'We pick up from your premises, complete export clearance and ship your cargo to the destination port, ready for your buyer or their agent to collect.',
    bestFor: 'Exporters whose buyers arrange import clearance and onward delivery.',
  },
  {
    title: 'Port to Port',
    slug: 'port-to-port',
    from: { icon: 'ship', label: 'Origin port' },
    to: { icon: 'ship', label: 'Destination port' },
    text: 'You deliver to the origin port; we book space with our shipping line partners and manage the freight and documentation through to the destination port.',
    bestFor: 'Experienced importers and exporters with their own local partners at each end.',
  },
  {
    title: 'Airport to Airport',
    slug: 'airport-to-airport',
    from: { icon: 'plane', label: 'Origin airport' },
    to: { icon: 'plane', label: 'Destination airport' },
    text: 'Drop your cargo at the origin airport and it flies with our airline partners to the destination airport, ready for collection. Fast, cost-effective air freight when you handle the first and last mile.',
    bestFor: 'Urgent shipments where you arrange your own pickup and delivery.',
  },
];
