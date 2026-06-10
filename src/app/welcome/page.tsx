"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/ui/brand-mark";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";
import { SOCIAL, SOCIAL_ICON } from "@/config/social";

type Mode = "studio" | "light";

const THEME = {
  studio: {
    bg: "#050505",
    glow: "rgba(239,6,6,0.16)",
    card: "rgba(211,204,199,0.05)",
    cardHover: "rgba(211,204,199,0.1)",
    border: "rgba(211,204,199,0.14)",
    text: "#efeee8",
    sub: "rgba(239,238,232,0.55)",
    accent: "#ef0606",
    toggleBg: "rgba(211,204,199,0.08)",
  },
  light: {
    bg: "#f4efe4",
    glow: "rgba(197,48,42,0.12)",
    card: "#ffffff",
    cardHover: "#fffdf8",
    border: "rgba(26,44,54,0.1)",
    text: "#1a2c36",
    sub: "rgba(26,44,54,0.6)",
    accent: "#c5302a",
    toggleBg: "rgba(26,44,54,0.06)",
  },
} as const;

const SOCIAL_LINKS = [
  { label: "Chat on WhatsApp", href: SOCIAL.whatsapp, icon: SOCIAL_ICON.whatsapp },
  { label: "Join our Discord", href: SOCIAL.discord, icon: SOCIAL_ICON.discord },
  { label: "Instagram", href: SOCIAL.instagram, icon: SOCIAL_ICON.instagram },
  { label: "X (Twitter)", href: SOCIAL.x, icon: SOCIAL_ICON.x },
  { label: "LinkedIn", href: SOCIAL.linkedin, icon: SOCIAL_ICON.linkedin },
  { label: "Threads", href: SOCIAL.threads, icon: SOCIAL_ICON.threads },
  { label: "Facebook", href: SOCIAL.facebook, icon: SOCIAL_ICON.facebook },
];

const STUDIO_LINKS = [
  { label: "Visit fethron.com", href: "https://fethron.com", emoji: "↗" },
  { label: "See Pricing — 50% Off", href: "/pricing", emoji: "₹" },
  { label: "Try the Fethron AI Agent", href: FETHRON_AGENT_URL, emoji: "✦" },
  { label: "Write to Us", href: "/submit", emoji: "✉" },
];

function Row({
  href,
  label,
  icon,
  emoji,
  t,
  reduce,
  i,
}: {
  href: string;
  label: string;
  icon?: string;
  emoji?: string;
  t: (typeof THEME)[Mode];
  reduce: boolean | null;
  i: number;
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="text-[17px] font-semibold" style={{ color: t.accent }}>
            {emoji}
          </span>
        )}
      </span>
      <span className="flex-1 text-[15px] font-semibold">{label}</span>
      <span className="text-lg opacity-40 transition-transform duration-200 group-hover:translate-x-1">→</span>
    </>
  );
  // transition-colors ONLY — Framer owns transform/opacity, CSS owns the theme
  // colour fade. Mixing transition-all + Framer caused the mode-switch glitch.
  const className =
    "group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 backdrop-blur-sm transition-colors duration-300";
  const style = {
    background: t.card,
    borderColor: t.border,
    color: t.text,
  } as const;

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 * i },
      };

  // Every link on the welcome hub opens in a NEW TAB so visitors keep this page.
  return (
    <motion.a
      {...motionProps}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      whileHover={reduce ? undefined : { y: -3 }}
      whileTap={reduce ? undefined : { y: 0 }}
    >
      {inner}
    </motion.a>
  );
}

export default function LinksPage() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("studio");
  const t = THEME[mode];

  return (
    <main
      className="relative min-h-dvh px-5 py-12 transition-colors duration-500 sm:py-16"
      style={{ background: t.bg, color: t.text }}
    >
      {/* minimal atmospheric backdrop — present in both themes, with a theme-matched
          scrim so the cards stay perfectly legible */}
      <Image
        src="/images/background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center transition-opacity duration-500"
        style={{ opacity: mode === "studio" ? 0.28 : 0.2 }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-500"
        style={{ background: mode === "studio" ? "rgba(5,5,5,0.5)" : "rgba(244,239,228,0.58)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(70% 45% at 50% 0%, ${t.glow}, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* theme toggle */}
      <button
        type="button"
        onClick={() => setMode((m) => (m === "studio" ? "light" : "studio"))}
        aria-label={`Switch to ${mode === "studio" ? "light" : "studio"} theme`}
        className="absolute right-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm transition-colors sm:right-8 sm:top-8"
        style={{ background: t.toggleBg, borderColor: t.border, color: t.sub }}
      >
        {mode === "studio" ? "☾ Studio" : "☀ Light"}
      </button>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        {/* brand — logo on the left, name + label stacked to its right */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-center gap-3.5"
        >
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center">
            <BrandMark variant="red" />
          </span>
          <span className="flex flex-col text-left">
            <h1 className="font-display text-3xl font-semibold leading-none tracking-[0.04em]">Fethron</h1>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
              Digital Studio
            </span>
          </span>
        </motion.div>
        <p className="mt-5 max-w-lg text-center text-sm leading-relaxed" style={{ color: t.sub }}>
          We design and engineer digital experiences built to endure. Everything we
          make — and every way to reach us — in one place.
        </p>

        {/* studio links */}
        <div className="mt-9 flex w-full flex-col gap-2.5">
          {STUDIO_LINKS.map((l, i) => (
            <Row key={l.label} {...l} t={t} reduce={reduce} i={i} />
          ))}
        </div>

        {/* divider */}
        <div className="mt-8 flex w-full items-center gap-3">
          <span className="h-px flex-1" style={{ background: t.border }} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: t.sub }}>
            Follow & Connect
          </span>
          <span className="h-px flex-1" style={{ background: t.border }} />
        </div>

        {/* social links */}
        <div className="mt-6 flex w-full flex-col gap-2.5">
          {SOCIAL_LINKS.map((l, i) => (
            <Row key={l.label} {...l} t={t} reduce={reduce} i={i + STUDIO_LINKS.length} />
          ))}
        </div>

        <p className="mt-12 text-center text-[11px] uppercase tracking-[0.18em]" style={{ color: t.sub }}>
          © {new Date().getFullYear()} Fethron · Built to Endure
        </p>
      </div>
    </main>
  );
}
