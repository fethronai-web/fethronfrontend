"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BrandMark } from "@/components/ui/brand-mark";
import { FETHRON_AGENT_ROUTE } from "@/config/ai-tools";

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
      <Link href={FETHRON_AGENT_ROUTE} onClick={onClick} className="shrink-0" aria-label="Fethron AI home">
        {mark}
      </Link>
    );
  }

  return mark;
}

export function AiBrandWordmark({ variant = "bar" }: { variant?: "bar" | "sidebar" }) {
  const onBar = variant === "bar";

  return (
    <motion.span
      layoutId={BRAND_WORDMARK_LAYOUT_ID}
      initial={false}
      className={`font-brand min-w-0 truncate text-[12px] font-semibold uppercase tracking-[0.2em] sm:text-[13px] ${
        onBar ? "text-[var(--ai-bar-text)]" : "text-[var(--ai-text)]"
      }`}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      Fethron{" "}
      <span className={onBar ? "text-[var(--ai-bar-accent)]" : "text-[var(--ai-brown)]"}>AI</span>
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
      href={FETHRON_AGENT_ROUTE}
      onClick={onClick}
      className="flex min-w-0 items-center gap-2.5 sm:gap-3"
    >
      <AiBrandMark className={markClassName} />
      <AiBrandWordmark variant={variant} />
    </Link>
  );
}
