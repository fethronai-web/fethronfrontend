import type { Metadata } from "next";
import { Suspense } from "react";
import { SubmitLetter } from "@/components/sections/submit-letter";
import { SEO, studioPageMeta } from "@/config/seo";

export const metadata: Metadata = studioPageMeta(SEO.submit);

export default function SubmitPage() {
  return (
    <main id="main-content" className="flex-1">
      {/* Reserve full viewport height while the client form (useSearchParams)
          suspends, so the layout never collapses and the footer can't flash
          into view before the form mounts. */}
      <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
        <SubmitLetter />
      </Suspense>
    </main>
  );
}
