/* Solution pages — content as on www.masexpresscargo.com/solution/<slug>/ (synced 2026-10-21, see docs/CONTENT.md).
   Each entry renders through pages/SolutionPage.tsx at /solution/<slug> (same path as the live site).
   The live pages are a title, the paragraphs below and one photo. Do not paraphrase the copy. */

import type { IconName } from '../components/ui/Icon';
import type { Heading } from '../components/ui/Heading';
import type { ShipmentMode } from '../components/ui/PickupForm';

export interface Solution {
  slug: string;
  name: string;
  icon: IconName;
  /** Preselected option in the sidebar pickup form. */
  mode: ShipmentMode;
  /** The live page's photo, compressed to WebP (740px wide — the largest the live site has). */
  image: string;
  heroTitle: Heading;
  paras: string[];
  /** Service slugs (data/services.ts) shown as "Related Services" cards. Our choice, not live copy. */
  related: string[];
}

export const solutions: Solution[] = [
  {
    slug: 'e-commerce-fulfillment',
    name: 'E-commerce Fulfillment',
    icon: 'tag',
    mode: 'Land Transport',
    image: '/img/pages/solution-e-commerce-fulfillment.webp',
    heroTitle: ['E-commerce ', 'Fulfillment'],
    paras: [
      'Our e-commerce fulfillment service is designed to optimize every stage of your order lifecycle, from inbound inventory to final delivery. We provide secure, well-managed warehousing supported by advanced inventory tracking systems that offer real-time visibility and control. Our efficient pick, pack, and dispatch processes ensure each order is handled with accuracy and speed.',
      'With seamless integration into your eCommerce platforms, order management becomes simple, scalable, and efficient. Our robust last-mile delivery network ensures timely and reliable shipments, enhancing customer satisfaction and brand loyalty. Whether managing daily volumes or peak-season demand, our flexible solutions help reduce operational costs, improve efficiency, and support the consistent growth of your online business.',
    ],
    related: ['warehousing', 'gcc-road-transport', 'customs-clearance'],
  },
  {
    slug: 'cold-chain-logistics',
    name: 'Cold Chain Logistics',
    icon: 'bolt',
    mode: 'Air Freight',
    image: '/img/pages/solution-cold-chain-logistics.webp',
    heroTitle: ['Cold Chain ', 'Logistics'],
    paras: [
      'We provide advanced cold chain logistics solutions to safeguard temperature-sensitive products at every stage of the supply chain. Utilizing state-of-the-art refrigerated storage, temperature-controlled transportation, and continuous monitoring systems, we maintain strict compliance with industry standards. Whether it’s perishable food, pharmaceuticals, or specialty chemicals, our solutions ensure product quality, safety, and reliability from origin to final delivery.',
    ],
    related: ['air-freight', 'warehousing', 'gcc-road-transport'],
  },
  {
    slug: 'heavy-lift-project-cargo',
    name: 'Heavy Lift & Project Cargo',
    icon: 'ship',
    mode: 'Sea Freight',
    image: '/img/pages/solution-heavy-lift-project-cargo.webp',
    heroTitle: ['Heavy Lift & ', 'Project Cargo'],
    paras: [
      'Our heavy lift and project cargo services are tailored to handle the most complex and oversized shipments with precision and expertise. From detailed route surveys and regulatory approvals to specialized equipment and expert handling, we manage every aspect of transportation. Whether moving industrial machinery, construction materials, or large-scale infrastructure components, we ensure safe, timely, and cost-effective delivery with complete project coordination.',
    ],
    related: ['sea-freight', 'gcc-road-transport', 'customs-clearance'],
  },
  {
    slug: 'retail-distribution',
    name: 'Retail Distribution',
    icon: 'truck',
    mode: 'Land Transport',
    image: '/img/pages/solution-retail-distribution.webp',
    heroTitle: ['Retail ', 'Distribution'],
    paras: [
      'We deliver end-to-end retail distribution solutions designed to keep your supply chain agile, efficient, and responsive across the GCC. Our services go beyond basic delivery, covering vendor coordination, demand planning, centralized warehousing, and advanced inventory management to ensure seamless operations. With a strong focus on just-in-time delivery, we help retailers maintain optimal stock levels, avoid overstocking or shortages, and respond quickly to market demands.',
      'Our optimized routing, real-time tracking, and dedicated logistics support ensure timely deliveries to multiple retail outlets with complete visibility at every stage. By improving supply chain efficiency, reducing operational costs, and enhancing delivery accuracy, we empower businesses to achieve consistent performance, strengthen retail partnerships, and deliver a superior customer experience.',
    ],
    related: ['warehousing', 'gcc-road-transport', 'customs-clearance'],
  },
];

export const solutionPath = (s: Solution) => `/solution/${s.slug}`;
