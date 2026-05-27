import { HeroSection } from "@/components/sections/hero-section";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { CompanySection } from "@/components/sections/company-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { ProcessSection } from "@/components/sections/process-section";
import { logger } from "@/lib/logger";

export default function HomePage() {
  logger.debug("Rendering home page");

  return (
    <main id="main-content" className="flex-1 bg-black">
      <HeroSection />
      <MarqueeStrip />
      <CompanySection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
    </main>
  );
}
