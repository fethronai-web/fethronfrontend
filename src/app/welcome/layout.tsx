import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SEO, studioPageMeta } from "@/config/seo";

// The welcome page is a "use client" standalone component, so its metadata lives
// here in a server layout. This layout only carries metadata — no extra chrome.
export const metadata: Metadata = studioPageMeta(SEO.welcome);

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return children;
}
