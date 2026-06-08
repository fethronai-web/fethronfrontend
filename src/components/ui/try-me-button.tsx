"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FETHRON_AGENT_ROUTE } from "@/config/ai-tools";
import { cn } from "@/lib/cn";

interface TryMeButtonProps {
  className?: string;
  onClick?: () => void;
}

/**
 * Passive attention magnet — ripples + ring + glow breathe + periodic
 * double-flash. Text stays still; no hover gimmicks needed to notice it.
 */
export function TryMeButton({ className, onClick }: TryMeButtonProps) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={FETHRON_AGENT_ROUTE}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn("relative inline-flex shrink-0 rounded-full", className)}
    >
      {!reduce && (
        <>
          {/* Ripples shoot outward — catches peripheral vision */}
          {[0, 1.25].map((delay) => (
            <motion.span
              key={delay}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
              initial={{ scale: 1, opacity: 0.65 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay,
                ease: "easeOut",
              }}
            />
          ))}

          <span className="try-me-ring" aria-hidden="true" />
        </>
      )}

      <motion.span
        className={cn(
          "relative z-10 inline-flex h-9 items-center justify-center rounded-full bg-accent px-5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-accent-foreground sm:h-10 sm:px-6 sm:text-[11px]",
        )}
        animate={
          reduce
            ? undefined
            : {
                // Slow float — always moving in a static header
                y: [0, -4, 0, -2, 0],
                // Glow breathes in/out
                boxShadow: [
                  "0 0 18px rgba(239,6,6,0.45), 0 4px 24px rgba(239,6,6,0.35)",
                  "0 0 36px rgba(239,6,6,0.85), 0 4px 40px rgba(239,6,6,0.55)",
                  "0 0 18px rgba(239,6,6,0.45), 0 4px 24px rgba(239,6,6,0.35)",
                  "0 0 28px rgba(239,6,6,0.65), 0 4px 32px rgba(239,6,6,0.45)",
                  "0 0 18px rgba(239,6,6,0.45), 0 4px 24px rgba(239,6,6,0.35)",
                ],
                // Every ~5s: double flash — "look here" blink
                scale: [1, 1.02, 1, 1, 1, 1.15, 1, 1.15, 1],
                filter: [
                  "brightness(1)",
                  "brightness(1.08)",
                  "brightness(1)",
                  "brightness(1)",
                  "brightness(1)",
                  "brightness(1.45)",
                  "brightness(1)",
                  "brightness(1.45)",
                  "brightness(1)",
                ],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.12, 0.24, 0.5, 0.62, 0.66, 0.7, 0.74, 1],
        }}
        whileTap={{ scale: 0.96 }}
      >
        Try Me
      </motion.span>
    </Link>
  );
}
