"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Preloader } from "@/components/layout/preloader";
import { ReadyProvider } from "@/components/layout/ready-context";
import { FETHRON_AGENT_ROUTE } from "@/config/ai-tools";

/** Studio chrome — skipped on Fethron AI routes. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAiRoute = pathname.startsWith(FETHRON_AGENT_ROUTE);

  if (isAiRoute) {
    return <>{children}</>;
  }

  return (
    <ReadyProvider>
      <div className="relative z-10 flex min-h-dvh flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Preloader />
      </div>
    </ReadyProvider>
  );
}
