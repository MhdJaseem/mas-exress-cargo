import { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrackingSection } from '../components/home/TrackingSection';
import { AboutSection } from '../components/home/AboutSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { WhySection } from '../components/home/WhySection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { PickupContactSection } from '../components/home/PickupContactSection';
import { trackShipment, type TrackingResult } from '../lib/api';
import { scrollToId } from '../lib/scroll';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useHomeScroll } from '../hooks/useHomeScroll';
import { useReveal } from '../hooks/useReveal';

/**
 * Home page. Its sections are direct children of <main> and carry the `stack` class:
 * on ≥900px they become sticky cards that slide over each other (hooks/useHomeScroll).
 */
export default function HomePage() {
  useDocumentMeta(
    'Mas Express Cargo – Transportation across the GCC and worldwide',
    'MAS Express Cargo specializes in secure, reliable, and timely transportation across the GCC and worldwide.',
  );
  useReveal('home');
  useHomeScroll();

  const [result, setResult] = useState<TrackingResult | null>(null);
  // bumps on every search so searching the same number again still scrolls to the result
  const [searches, setSearches] = useState(0);

  async function track(no: string) {
    setResult(await trackShipment(no));
    setSearches((n) => n + 1);
  }

  // once the result panel is visible, bring it on screen
  useEffect(() => {
    if (!searches) return;
    const raf = requestAnimationFrame(() => scrollToId('tracking'));
    return () => cancelAnimationFrame(raf);
  }, [searches]);

  return (
    <>
      <HeroSection onTrack={track} />
      <TrackingSection result={result} />
      <AboutSection />
      <ServicesSection />
      <WhySection />
      <TestimonialsSection />
      <PickupContactSection />
    </>
  );
}
