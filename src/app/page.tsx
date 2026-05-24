import { HeroSection } from "@/components/sections/hero-section";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { ProcessSection } from "@/components/sections/process-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { logger } from "@/lib/logger";

export default function HomePage() {
  logger.debug("Rendering home page");

  return (
    <main id="main-content" className="flex-1 bg-black">
      <HeroSection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
