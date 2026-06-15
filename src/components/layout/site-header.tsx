"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PAGE_INSET_X, PAGE_INSET_TOP } from "@/config/layout";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";
import { NAV_LINKS, SITE } from "@/config/site";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/brand-mark";
import { DiagonalArrow } from "@/components/ui/diagonal-arrow";
import { TryMeButton } from "@/components/ui/try-me-button";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // Section anchors only exist on the landing page; from any other route send
  // them home first (e.g. "#work" → "/#work").
  const resolveHref = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href;

  // Section links scroll deterministically — never via the URL hash (a stale "#process"
  // must never hijack the logo). The header lives in the root layout, so it survives the
  // route change: after pushing "/" (scroll:false stops Next's jump-to-top) we poll from
  // here until the home page + section exist, then position on it and re-aim as it settles.
  const sectionOffset = () => {
    const headerEl = document.querySelector("header");
    return (headerEl instanceof HTMLElement ? headerEl.offsetHeight : 72) + 16;
  };

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return; // /pricing etc. — let the Link navigate
    const id = href.slice(1);
    event.preventDefault();
    setMenuOpen(false);

    if (isHome) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - sectionOffset();
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }

    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto"; // instant corrective scrolls
    router.push("/", { scroll: false });

    let waited = 0;
    let corrections = 0;
    const tick = () => {
      const el =
        window.location.pathname === "/" ? document.getElementById(id) : null;
      if (!el) {
        if (waited++ < 60) window.setTimeout(tick, 80);
        else html.style.scrollBehavior = prevBehavior;
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY - sectionOffset();
      window.scrollTo({ top, behavior: "auto" });
      if (corrections++ < 6) window.setTimeout(tick, 130);
      else html.style.scrollBehavior = prevBehavior;
    };
    window.setTimeout(tick, 60);
  };

  // Re-run on every route change. The header persists across navigations, so a
  // one-time observer would keep watching a detached #hero after you return to
  // home from /pricing or /submit — leaving `pastHero` stale (pill stuck on the
  // hero, or no pill on scroll). Off-home there's no hero → reset to transparent
  // (the pill there is driven by `isHome` in `onHero`).
  useEffect(() => {
    if (!isHome) {
      setPastHero(false);
      return;
    }
    const hero = document.getElementById("hero");
    if (!hero) {
      setPastHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => {
      const next = !open;
      logger.debug("Mobile navigation toggled", { open: next });
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Light ("on hero") styling only while the menu is closed. With the menu open
  // we force the solid dark treatment so the dropdown has an opaque backdrop and
  // its links use light text — otherwise dark links sit invisibly over the dark
  // hero card at the top of the page.
  const onHero = isHome && !pastHero && !menuOpen;

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50",
        PAGE_INSET_X,
        PAGE_INSET_TOP,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto w-full transition-[box-shadow,border-radius] duration-300",
          onHero
            ? "bg-transparent"
            : "rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] sm:rounded-full",
        )}
        style={
          onHero
            ? undefined
            : {
                // ~1.5px red gradient ring (padding reveals it); dark-maroon middle
                // instead of pure black so it stays visible on the dark page.
                padding: "1.5px",
                background:
                  "linear-gradient(130deg, #ef0606 0%, #7a0d0d 38%, #2a0606 52%, #7a0d0d 66%, #ef0606 100%)",
              }
        }
      >
        <div
          className={cn(
            "relative w-full",
            onHero ? "" : "overflow-hidden rounded-2xl backdrop-blur-md sm:rounded-full",
          )}
          style={onHero ? undefined : { background: "rgba(8,8,11,0.96)" }}
        >
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <Link
            href="/"
            className={cn(
              "flex min-w-0 max-w-[min(100%,480px)] items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors sm:gap-2.5 sm:px-3 sm:py-2",
              onHero
                ? "border-black/12 hover:border-black/25"
                : "border-off-white/12 hover:border-off-white/25",
            )}
            aria-label={`${SITE.name} home`}
          >
            <span className="h-6 w-6 shrink-0 sm:h-7 sm:w-7">
              <BrandMark variant="red" />
            </span>
            <span className="font-brand truncate text-[13px] font-semibold uppercase tracking-[0.22em] text-accent sm:text-[15px]">
              Fethron
            </span>
            <span
              className={cn(
                "hidden shrink-0 sm:inline",
                onHero ? "text-black/55" : "text-off-white/35",
              )}
            >
              /
            </span>
            <span
              className={cn(
                "hidden truncate text-[9px] font-medium uppercase tracking-[0.18em] sm:inline sm:text-[10px]",
                onHero ? "text-black/75" : "text-off-white/55",
              )}
            >
              Building Digital Monuments
            </span>
          </Link>

          <nav
            className="hidden items-center gap-5 lg:flex xl:gap-7"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={cn(
                  "relative text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                  onHero
                    ? "text-black/80 hover:text-black"
                    : "text-off-white/55 hover:text-off-white",
                )}
              >
                {link.label}
                {link.href === "/pricing" && (
                  <span className="discount-badge ml-1.5 inline-flex -translate-y-1.5 items-center rounded-full bg-accent px-1.5 py-[1.5px] text-[7.5px] font-bold leading-none tracking-[0.08em] text-white">
                    50% OFF
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-8">
            <TryMeButton />

            <Link
              href="/submit"
              className="group hidden items-center gap-2 text-[11px] uppercase tracking-[0.16em] lg:flex"
            >
              <span className="font-extrabold text-accent">Let&apos;s Build</span>
              <DiagonalArrow className="text-accent/70 transition-opacity group-hover:opacity-100" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border lg:hidden",
                onHero
                  ? "border-black/12 text-black"
                  : "border-off-white/12 text-off-white",
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMenu}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.nav
              key="mobile-nav"
              id="mobile-nav"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "overflow-hidden border-t px-4 lg:hidden",
                onHero ? "border-black/10" : "border-off-white/10",
              )}
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-0.5 py-3">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: reduce ? 0 : 0.08 + index * 0.05,
                    }}
                  >
                    <Link
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={resolveHref(link.href)}
                      onClick={(e) => {
                        handleAnchorClick(e, link.href);
                        closeMenu();
                      }}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium uppercase tracking-wider",
                        onHero
                          ? "text-black/70 hover:bg-black/5 hover:text-black"
                          : "text-off-white/70 hover:bg-off-white/5 hover:text-off-white",
                      )}
                    >
                      {link.label}
                      {link.href === "/pricing" && (
                        <span className="discount-badge ml-2 inline-flex items-center rounded-full bg-accent px-1.5 py-[1.5px] text-[8px] font-bold leading-none tracking-[0.08em] text-white">
                          50% OFF
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    delay: reduce ? 0 : 0.08 + NAV_LINKS.length * 0.05,
                  }}
                  className="mt-3 flex flex-col items-stretch gap-3 px-3"
                >
                  <Link
                    href={FETHRON_AGENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-accent-foreground"
                  >
                    Try Fethron AI Agent
                  </Link>
                  <Link
                    href="/submit"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 py-2 text-sm uppercase tracking-wider"
                  >
                    <span className="font-extrabold text-accent">Let&apos;s Build</span>
                    <DiagonalArrow className="text-accent/70" />
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
