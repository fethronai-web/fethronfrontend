"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useReady } from "@/components/layout/ready-context";
import { BrandMark } from "@/components/ui/brand-mark";

const PAGE_BACKGROUND = "/images/background.webp";
const CARD_BACKGROUND = "/images/herobackground.webp";
const LEFT_HAND = "/images/left-hand-cut2.webp";
const RIGHT_HAND = "/images/right-hand-cut2.webp";
const BALL = "/images/ball2-cut.webp";

const LOAD_MS = 4200; // time for the counter to climb 0 -> 100
const HAND_OUT = 240; // px the hands sit out at 0%, easing to 0 (touch) at 99%

type Phase = "load" | "drop" | "exit";

/**
 * Physics-flavoured "Creation of Adam" preloader.
 *
 * As the counter climbs, the two stone arms ease inward toward a marble sphere
 * in the centre. At ~99% the fingertips meet the sphere's edges; it then loses
 * balance and falls with gravity, the whole screen drops away downward, and the
 * hero is revealed — at which point it plays its own entrance (gated via the
 * ready context). Lives in the layout so it only shows on full loads/refreshes.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const { reveal } = useReady();
  const progress = useMotionValue(0); // 0..100 — drives the hands on the GPU
  const [pct, setPct] = useState(0); // integer mirror, only for the % label
  const [phase, setPhase] = useState<Phase>("load");
  const [visible, setVisible] = useState(true);

  // Hands ease inward straight off the motion value — no per-frame React render.
  const leftX = useTransform(progress, [0, 99], [-HAND_OUT, 0], { clamp: true });
  const rightX = useTransform(progress, [0, 99], [HAND_OUT, 0], { clamp: true });

  // Mirror the rounded % into state only when it changes (cheap, decoupled).
  useMotionValueEvent(progress, "change", (v) => {
    const r = Math.round(v);
    setPct((prev) => (prev === r ? prev : r));
  });

  // Climb the counter 0 -> 100
  useEffect(() => {
    const duration = reduce ? 700 : LOAD_MS;
    const start = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 1.8);
      progress.set(eased * 100);
      if (t < 1) raf = requestAnimationFrame(tick);
      else progress.set(100);
    });
    return () => cancelAnimationFrame(raf);
  }, [reduce, progress]);

  // At 99% the hands touch -> the ball drops
  useEffect(() => {
    if (phase === "load" && pct >= 99) setPhase("drop");
  }, [pct, phase]);

  // drop -> screen slides away -> (reveal hero as it clears) -> unmount
  useEffect(() => {
    if (phase === "drop") {
      const t = setTimeout(() => setPhase("exit"), reduce ? 100 : 650);
      return () => clearTimeout(t);
    }
    if (phase === "exit") {
      // Reveal + unmount together, only once the slide is fully off-screen, so
      // the hero's heavy entrance never competes with the slide (that overlap
      // was the end-of-slide jank).
      const t = setTimeout(
        () => {
          setVisible(false);
          reveal();
        },
        reduce ? 250 : 1050,
      );
      return () => clearTimeout(t);
    }
  }, [phase, reduce, reveal]);

  // Lock scroll while the preloader is up
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  if (!visible) return null;

  const activeDot = Math.min(4, Math.floor(pct / 20));
  const dropping = phase !== "load";

  return (
    <motion.div
      className="fixed inset-0 z-60 bg-[#cfc8c2]"
      initial={{ y: 0, opacity: 1 }}
      animate={
        phase === "exit"
          ? reduce
            ? { opacity: 0 }
            : { y: "100%" }
          : { y: 0, opacity: 1 }
      }
      transition={{ duration: reduce ? 0.3 : 0.95, ease: [0.7, 0, 0.25, 1] }}
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      {/* Foggy ruins backdrop (matches the hero so the reveal morphs) */}
      <div className="absolute inset-0">
        <Image
          src={PAGE_BACKGROUND}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 110% at 50% 25%, transparent 45%, rgba(0,0,0,0.22) 100%)",
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 flex min-h-dvh flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6 xl:px-14">
        <div className="relative flex min-h-[32rem] w-full flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,0.65)] sm:rounded-[2rem] lg:rounded-[2.5rem]">
          {/* Cloud backdrop */}
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={CARD_BACKGROUND}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Left arm — outer div positions, inner div eases in with progress */}
          <div className="pointer-events-none absolute left-[-13.7%] top-[40%] w-[64%] -translate-y-1/2">
            <motion.div style={{ x: leftX, willChange: "transform" }}>
              <Image
                src={LEFT_HAND}
                alt=""
                width={1448}
                height={1086}
                preload
                className="h-auto w-full"
              />
            </motion.div>
          </div>
          <div className="pointer-events-none absolute right-[-12.9%] top-[43%] w-[64%] -translate-y-1/2">
            <motion.div style={{ x: rightX, willChange: "transform" }}>
              <Image
                src={RIGHT_HAND}
                alt=""
                width={1448}
                height={1086}
                preload
                className="h-auto w-full"
              />
            </motion.div>
          </div>

          {/* Marble sphere — idle float, then loses balance and falls */}
          <div className="pointer-events-none absolute left-1/2 top-[43%] w-[15%] min-w-[110px] max-w-[200px] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={dropping ? { y: 1300, x: 70, rotate: 560 } : { y: 0, rotate: 0 }}
              transition={
                dropping ? { duration: 1.4, ease: [0.45, 0, 0.9, 1] } : { duration: 0 }
              }
              style={{ willChange: "transform" }}
            >
              <Image
                src={BALL}
                alt=""
                width={1254}
                height={1254}
                preload
                className="h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>

          {/* Title + loading panel */}
          <div className="absolute inset-x-0 top-[60%] flex flex-col items-center px-6 text-center">
            <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-light uppercase leading-none tracking-[0.04em] text-off-white">
              Crafting
            </h2>
            <p className="mt-3 text-[clamp(0.7rem,1.6vw,1rem)] font-semibold uppercase tracking-[0.38em] text-accent">
              The First Impression
            </p>

            <div className="mt-7 w-[min(90%,22rem)] rounded-xl border border-off-white/10 bg-black/60 px-8 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-off-white/70">
                Please Wait
              </p>
              <p className="mt-1.5 font-display text-sm italic text-swirl/50">
                Loading monument archive
              </p>
              <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={
                      "h-1.5 w-1.5 rounded-full transition-colors duration-200 " +
                      (i === activeDot ? "bg-accent" : "bg-off-white/20")
                    }
                  />
                ))}
              </div>
              <p className="mt-3 text-xs font-medium tabular-nums tracking-[0.2em] text-off-white/80">
                {pct}%
              </p>
            </div>
          </div>

          {/* Brand logo — top left */}
          <div className="absolute left-6 top-6 flex items-center gap-3 lg:left-8 lg:top-8">
            <span className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
              <BrandMark variant="red" />
            </span>
            <span className="font-brand text-xl font-semibold uppercase tracking-[0.24em] text-off-white sm:text-2xl">
              Fethron
            </span>
          </div>

          {/* Corner taglines */}
          <div className="absolute bottom-6 left-6 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-swirl/40 sm:block lg:bottom-8 lg:left-8">
            Sculpting Digital Legacies
          </div>
          <div className="absolute bottom-6 right-6 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-swirl/40 sm:block lg:bottom-8 lg:right-8">
            Built to Endure
          </div>
        </div>
      </div>
    </motion.div>
  );
}
