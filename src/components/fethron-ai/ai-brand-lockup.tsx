"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BrandMark } from "@/components/ui/brand-mark";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";

const BRAND_MARK_LAYOUT_ID = "fethron-ai-brand-mark";
const BRAND_WORDMARK_LAYOUT_ID = "fethron-ai-brand-wordmark";

export function AiBrandMark({
  className = "h-8 w-8",
  link = false,
  onClick,
}: {
  className?: string;
  link?: boolean;
  onClick?: () => void;
}) {
  const mark = (
    <motion.span
      layoutId={BRAND_MARK_LAYOUT_ID}
      initial={false}
      className={`relative block shrink-0 ${className}`}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <BrandMark variant="red" />
    </motion.span>
  );

  if (link) {
    return (
      <Link href={FETHRON_AGENT_URL} onClick={onClick} className="shrink-0" aria-label="Fethron AI home">
        {mark}
      </Link>
    );
  }

  return mark;
}

export function AiBrandWordmark({ variant: _variant = "bar" }: { variant?: "bar" | "sidebar" }) {
  // The agent's backdrop is now a theme surface (light in day, dark in night) in
  // BOTH hub and chat, so the wordmark uses readable theme text in every case —
  // the old cream "bar" colour vanished on the light chat scrim.
  return (
    <motion.span
      layoutId={BRAND_WORDMARK_LAYOUT_ID}
      initial={false}
      className="font-brand min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ai-text)] sm:text-[13px] sm:tracking-[0.2em]"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      Fethron <span className="text-[var(--ai-text-muted)]">AI</span>
    </motion.span>
  );
}

export function AiBrandLockup({
  variant = "bar",
  markClassName = "h-8 w-8 sm:h-9 sm:w-9",
  onClick,
}: {
  variant?: "bar" | "sidebar";
  markClassName?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={FETHRON_AGENT_URL}
      onClick={onClick}
      className="flex min-w-0 items-center gap-2 sm:gap-3"
      aria-label="Fethron AI home"
    >
      <AiBrandMark className={markClassName} />
      <AiBrandWordmark variant={variant} />
    </Link>
  );
}
