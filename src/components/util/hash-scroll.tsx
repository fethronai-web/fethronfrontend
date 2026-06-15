"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** sessionStorage key a section link sets right before navigating home. */
export const SCROLL_TO_KEY = "fethron:scrollTo";

/**
 * Scrolls to a homepage section ONLY when it was explicitly requested:
 *  - a cross-route section link (e.g. /pricing → Process) sets a one-shot flag, or
 *  - the very first load lands on a real "/#section" URL (shared/deep links).
 *
 * It deliberately ignores the URL hash on later client navigations, so a stale
 * "#process" left in the address bar can never hijack an unrelated navigation
 * (e.g. clicking the logo to go home). App Router + smooth-scroll on a long,
 * media-heavy page also lands short, so we re-aim a few times as it settles.
 */
export function HashScroll() {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let target: string | null = null;
    try {
      const flag = sessionStorage.getItem(SCROLL_TO_KEY);
      if (flag) {
        target = flag;
        sessionStorage.removeItem(SCROLL_TO_KEY);
      }
    } catch {
      /* sessionStorage unavailable — ignore */
    }
    // Honour a real URL hash only on the initial mount (full load / shared link).
    if (!target && firstRun.current) {
      const h = window.location.hash;
      if (h.length > 1) target = decodeURIComponent(h.slice(1));
    }
    firstRun.current = false;
    if (!target) return;
    const id = target;

    let cancelled = false;
    const timers: number[] = [];
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto"; // corrective scrolls must be instant

    const cleanupListeners = () => {
      window.removeEventListener("wheel", onUser);
      window.removeEventListener("touchmove", onUser);
      window.removeEventListener("keydown", onUser);
    };
    function onUser() {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      cleanupListeners();
      html.style.scrollBehavior = prevBehavior;
    }
    // Attach the "user took over" guard slightly late so a stray wheel/scroll fired
    // during the route transition can't cancel the very first positioning passes.
    const listenTimer = window.setTimeout(() => {
      window.addEventListener("wheel", onUser, { passive: true });
      window.addEventListener("touchmove", onUser, { passive: true });
      window.addEventListener("keydown", onUser);
    }, 220);
    timers.push(listenTimer);

    const scrollToTarget = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      const header = document.querySelector("header");
      const offset = (header instanceof HTMLElement ? header.offsetHeight : 72) + 16;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "auto" });
    };

    // re-aim as the page settles (fonts, images, in-view animations)
    [0, 120, 300, 600, 1000].forEach((d) =>
      timers.push(window.setTimeout(scrollToTarget, d)),
    );
    timers.push(
      window.setTimeout(() => {
        html.style.scrollBehavior = prevBehavior;
        cleanupListeners();
      }, 1200),
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      cleanupListeners();
      html.style.scrollBehavior = prevBehavior;
    };
  }, [pathname]);

  return null;
}
