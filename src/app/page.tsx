// src/app/page.tsx
import HeroSection from '@/components/HeroSection';
import RdpCardsSection from '@/components/RdpCardsSection';
import VpsCardsSection from '@/components/VpsCardsSection';
import FeaturesSection from '@/components/FeaturesSection';
import TeamSection from '@/components/TeamSection';
import MapSection from '@/components/MapSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FaqSection from '@/components/FaqSection';
import CtaSection from '@/components/CtaSection'; // Import CTA Section

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RdpCardsSection />
      <VpsCardsSection />
      <FeaturesSection />
      <TeamSection />
      <MapSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection /> {/* Add CTA Section Before Footer */}
    </>
  );
}