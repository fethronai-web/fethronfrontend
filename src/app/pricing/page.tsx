import type { Metadata } from "next";
import { PricingContent } from "@/components/sections/pricing-content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent engagement tiers — from first launch to bespoke, end-to-end builds. Strategy, design, and engineering, priced to endure.",
};

export default function PricingPage() {
  return (
    <main id="main-content" className="flex-1">
      <PricingContent />
    </main>
  );
}
