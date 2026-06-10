import type { Metadata } from "next";
import { PricingContent } from "@/components/sections/pricing-content";
import { SEO, studioPageMeta } from "@/config/seo";

export const metadata: Metadata = studioPageMeta(SEO.pricing);

export default function PricingPage() {
  return (
    <main id="main-content" className="flex-1">
      <PricingContent />
    </main>
  );
}
