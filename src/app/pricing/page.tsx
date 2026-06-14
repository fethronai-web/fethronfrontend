import type { Metadata } from "next";
import { PricingContent } from "@/components/sections/pricing-content";
import { SEO, studioPageMeta } from "@/config/seo";
import { FaqSection } from "@/components/sections/faq-section";
import type { FaqItem } from "@/components/seo/structured-data";

export const metadata: Metadata = studioPageMeta(SEO.pricing);

const PRICING_FAQS: FaqItem[] = [
  {
    q: "Are Fethron's prices fixed?",
    a: "Prices shown are indicative starting points. Final pricing is confirmed in a written proposal scoped to your specific project.",
  },
  {
    q: "What payment terms does Fethron use?",
    a: "Standard terms are 50% advance to begin and 50% on delivery. Monthly services are billed per the agreed cycle.",
  },
  {
    q: "What is not included in the price?",
    a: "Prices do not include hosting, domain registration, third-party API costs, app store fees, or paid advertising spend.",
  },
  {
    q: "Is there ongoing support after delivery?",
    a: "Yes. Each tier includes a support period ranging from 2 weeks to 90 days. Monthly care plans are available after the included period ends.",
  },
  {
    q: "Are prices in INR?",
    a: "Yes, all prices are in Indian Rupees (INR) and are exclusive of applicable taxes such as GST.",
  },
  {
    q: "Can I get a custom quote outside the listed tiers?",
    a: "Yes. Contact Fethron via fethron.com/submit or WhatsApp for bespoke projects that fall outside standard tiers.",
  },
];

export default function PricingPage() {
  return (
    <main id="main-content" className="flex-1">
      <PricingContent />
      <FaqSection faqs={PRICING_FAQS} />
    </main>
  );
}
