"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FETHRON_AI } from "@/config/ai-tools";

/**
 * Warms the Fethron-Agent background videos into the browser cache *while the
 * user browses the rest of the site* — at the lowest priority and only after
 * everything essential has finished loading. So when they open /fethron-agent
 * the clips are already there and the background never flashes empty.
 *
 * Skipped on the agent page itself (it owns the videos there), and on
 * data-saver / 2G connections so low-end devices aren't taxed.
 */
let warmed = false;

export function VideoPreloader() {
  const pathname = usePathname();

  useEffect(() => {
    if (warmed) return;
    if (pathname?.startsWith("/fethron-agent")) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;

    const warm = () => {
      if (warmed) return;
      warmed = true;
      for (const href of [FETHRON_AI.videoBg, FETHRON_AI.videoBgDark]) {
        if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) continue;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "fetch";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    const schedule = () => {
      if (ric) ric(warm, { timeout: 5000 });
      else window.setTimeout(warm, 2500);
    };

    if (document.readyState === "complete") {
      schedule();
      return;
    }
    window.addEventListener("load", schedule, { once: true });
    return () => window.removeEventListener("load", schedule);
  }, [pathname]);

  return null;
}
