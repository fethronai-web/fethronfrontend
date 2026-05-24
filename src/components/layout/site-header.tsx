"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PAGE_INSET_X, PAGE_INSET_TOP } from "@/config/layout";
import { NAV_LINKS, SITE } from "@/config/site";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/brand-mark";
import { DiagonalArrow } from "@/components/ui/diagonal-arrow";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

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

  const onHero = !pastHero;

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
          "pointer-events-auto w-full transition-[background-color,box-shadow,border-radius] duration-300",
          onHero
            ? "bg-transparent"
            : "overflow-hidden rounded-2xl bg-black/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-md sm:rounded-full",
        )}
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
                "shrink-0",
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
                href={link.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
                  onHero
                    ? "text-black/80 hover:text-black"
                    : "text-off-white/55 hover:text-off-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="#contact"
              className="hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-accent transition-opacity hover:opacity-80 sm:flex"
            >
              Let&apos;s Build
              <DiagonalArrow />
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

        <nav
          id="mobile-nav"
          className={cn(
            "border-t px-4 py-3 lg:hidden",
            onHero ? "border-black/10" : "border-off-white/10",
            menuOpen ? "block" : "hidden",
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-0.5">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium uppercase tracking-wider",
                  onHero
                    ? "text-black/70 hover:bg-black/5 hover:text-black"
                    : "text-off-white/70 hover:bg-off-white/5 hover:text-off-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={closeMenu}
              className="mt-1 flex items-center gap-2 px-3 py-2.5 text-sm font-medium uppercase tracking-wider text-accent"
            >
              Let&apos;s Build
              <DiagonalArrow />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
