"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SOCIAL, SOCIAL_ICON } from "@/config/social";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";

type Channel = "whatsapp" | "discord" | "support";

const ALL: Record<Channel, { label: string; href: string; icon: string; glow: string }> = {
  whatsapp: { label: "Chat on WhatsApp", href: SOCIAL.whatsapp, icon: SOCIAL_ICON.whatsapp, glow: "rgba(37,211,102,0.55)" },
  discord: { label: "Join our Discord", href: SOCIAL.discord, icon: SOCIAL_ICON.discord, glow: "rgba(88,101,242,0.55)" },
  support: { label: "Support — ask our AI", href: FETHRON_AGENT_URL, icon: "/icons/support.svg", glow: "rgba(239,6,6,0.5)" },
};

/**
 * Minimalist floating contact dock. Placements:
 *  - "bottom-right" (studio): WhatsApp + Discord + Support, hidden over the hero,
 *    revealed once it scrolls away.
 *  - "right-center": vertically centred on the right edge.
 *  - "agent" (Fethron AI chat): right-centre below `lg` so the dock clears the
 *    bottom composer; corner placement from `lg` up. The hub uses "bottom-right".
 * A gentle idle bob + soft halo (off under reduced-motion); hover lifts the icon
 * and slides its label out to the left. Hidden when printing.
 */
export function FloatingSocial({
  channels = ["whatsapp", "discord", "support"],
  placement = "bottom-right",
  alwaysVisible = false,
}: {
  channels?: Channel[];
  placement?: "bottom-right" | "right-center" | "agent";
  alwaysVisible?: boolean;
}) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) return;
    const hero = document.getElementById("hero");
    if (!hero) {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-120px 0px 0px 0px" },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [pathname, alwaysVisible]);

  const items = channels.map((c) => ALL[c]);
  const positionClass =
    placement === "right-center"
      ? "right-3 top-1/2 -translate-y-1/2 sm:right-4"
      : placement === "agent"
        ? "right-3 top-1/2 -translate-y-1/2 sm:right-4 lg:top-auto lg:right-6 lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:translate-y-0"
        : "bottom-5 right-4 sm:bottom-6 sm:right-6";
  const iconSizeClass =
    placement === "agent" ? "h-10 w-10 lg:h-[52px] lg:w-[52px]" : "h-12 w-12 sm:h-[52px] sm:w-[52px]";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="social-dock"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-none fixed z-40 flex flex-col gap-2.5 print:hidden sm:gap-3 ${positionClass}`}
        >
          {items.map((it, i) => (
            <motion.a
              key={it.label}
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={it.label}
              title={it.label}
              className={`group pointer-events-auto relative flex items-center justify-center rounded-2xl ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-200 will-change-transform hover:scale-110 ${iconSizeClass}`}
              style={{ boxShadow: `0 8px 24px -8px ${it.glow}` }}
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
              }
            >
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-2xl"
                  style={{ boxShadow: `0 0 0 0 ${it.glow}` }}
                  animate={{ boxShadow: [`0 0 0 0 ${it.glow}`, `0 0 0 7px rgba(0,0,0,0)`] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.5 }}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.icon} alt="" className="h-full w-full rounded-2xl object-contain" />

              <span className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-black/85 px-3 py-1.5 text-[12px] font-medium text-off-white opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200 [transform:translateX(6px)] group-hover:translate-x-0 group-hover:opacity-100">
                {it.label}
              </span>
            </motion.a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
