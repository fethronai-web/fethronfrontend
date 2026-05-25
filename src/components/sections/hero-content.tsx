"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";
import { useReady } from "@/components/layout/ready-context";

const PAGE_BACKGROUND = "/images/background.webp";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Right-hand "showreel" — each row crops the foggy backdrop differently for variety. */
const SERVICE_REEL = [
  { no: "01", label: "Strategy", position: "object-[18%_28%]" },
  { no: "02", label: "Design", position: "object-[82%_38%]" },
  { no: "03", label: "Development", position: "object-[50%_62%]" },
  { no: "04", label: "Performance", position: "object-[90%_72%]" },
  { no: "05", label: "Brand Systems", position: "object-[12%_82%]" },
] as const;

function RightArrow({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path
        d="M1 5h11.5M9 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceReel() {
  return (
    <div className="hidden w-[15.5rem] flex-col gap-5 lg:flex">
      <p className="text-right text-sm font-medium tabular-nums tracking-[0.12em] text-off-white">
        00:00:37
        <span className="text-swirl/35"> / 01:25:00</span>
      </p>

      <ul className="flex flex-col gap-4">
        {SERVICE_REEL.map((item, index) => {
          const active = index === 0;
          return (
            <li key={item.no} className="flex items-center justify-end gap-4">
              {active ? (
                <span className="h-px w-7 bg-accent" aria-hidden="true" />
              ) : null}
              <div className="text-right leading-none">
                <span
                  className={cn(
                    "block text-lg font-bold tabular-nums",
                    active ? "text-off-white" : "text-swirl/55",
                  )}
                >
                  {item.no}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em]",
                    active ? "text-off-white/80" : "text-swirl/45",
                  )}
                >
                  {item.label}
                </span>
              </div>
              <div
                className={cn(
                  "relative h-12 w-[4.75rem] shrink-0 overflow-hidden rounded-md ring-1",
                  active ? "ring-accent/60" : "ring-off-white/10",
                )}
              >
                <Image
                  src={PAGE_BACKGROUND}
                  alt=""
                  fill
                  sizes="76px"
                  className={cn("object-cover", item.position)}
                />
                <span className="absolute inset-0 bg-black/20" />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The hero card content. Elements rise + fade in a staggered sequence on load,
 * and the whole block drifts subtly with the pointer (parallax — foreground
 * layer, desktop only). Both are disabled under prefers-reduced-motion.
 */
export function HeroContent() {
  const reduce = useReducedMotion();
  const { x, y } = usePointerParallax(6);
  const { ready } = useReady();

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 22 },
          animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <motion.div
      className="relative flex flex-1 flex-col p-6 sm:p-8 lg:p-10 xl:p-14"
      style={{ x, y }}
    >
      {/* Top row */}
      <div className="flex items-start">
        <motion.p
          {...rise(0.15)}
          className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-swirl/70"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          A Digital Studio
        </motion.p>
      </div>

      {/* Middle: headline + reel */}
      <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          <h1 className="uppercase">
            <motion.span
              {...rise(0.3)}
              className="block font-sans text-[clamp(3.5rem,9vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.02em] text-off-white"
            >
              Digital
            </motion.span>
            <motion.span
              {...rise(0.42)}
              className="-mt-1 block font-display text-[clamp(3rem,8vw,7.25rem)] font-light leading-[0.95] tracking-[0.01em] text-off-white sm:-mt-2"
            >
              Monuments
            </motion.span>
          </h1>

          <motion.p
            {...rise(0.56)}
            className="mt-6 text-lg font-medium text-off-white sm:text-xl"
          >
            Crafting websites and Automation AI systems for{" "}
            <span className="text-accent">ambitious</span> brands.
          </motion.p>

          <motion.p
            {...rise(0.66)}
            className="mt-4 max-w-md text-sm leading-relaxed text-swirl/60"
          >
            We design and build premium websites and AI automation that elevate
            your brand, engage your audience, and perform for years to come.
          </motion.p>
        </div>

        <motion.div
          {...rise(0.8)}
          className="flex items-center justify-end lg:self-stretch"
        >
          <ServiceReel />
        </motion.div>
      </div>

      {/* Bottom: latest project */}
      <motion.div {...rise(0.92)} className="flex items-end gap-5">
        <span className="font-display text-[3.5rem] font-light leading-[0.8] text-off-white/25 sm:text-[4rem]">
          01
        </span>
        <div className="pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-swirl/45">
            Latest Project
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold uppercase tracking-[0.14em] text-off-white">
           Telshi
            <span className="text-swirl/30" aria-hidden="true">
              —
            </span>
            <Link
              href="#work"
              className="inline-flex items-center gap-2 text-accent transition-opacity hover:opacity-80"
            >
              View Case Study
              <RightArrow />
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
