import type { Metadata } from "next";
import { SEO, BRAND_KEYWORDS } from "@/config/seo";
import { HeroSection } from "@/components/sections/hero-section";
import { MarqueeStrip } from "@/components/sections/marquee-strip";
import { CompanySection } from "@/components/sections/company-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WorkSection } from "@/components/sections/work-section";
import { ProcessSection } from "@/components/sections/process-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HashScroll } from "@/components/util/hash-scroll";
import { logger } from "@/lib/logger";

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
  keywords: [...SEO.home.keywords, ...BRAND_KEYWORDS],
  alternates: { canonical: "https://fethron.com" },
  openGraph: {
    title: "Fethron — Digital Product Studio",
    description: SEO.home.description,
    url: "https://fethron.com",
    type: "website",
  },
};

export default function HomePage() {
  logger.debug("Rendering home page");

  return (
    <main id="main-content" className="flex-1 bg-black">
      <HashScroll />
      <HeroSection />
      <MarqueeStrip />
      <CompanySection />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <FaqSection />
    </main>
  );
}
