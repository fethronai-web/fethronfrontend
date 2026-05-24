"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";
import { useReady } from "@/components/layout/ready-context";

const STATUE_IMAGE = "/images/herosec-man-cut.webp";

/**
 * The hero statue — responsive across breakpoints.
 *
 * Desktop (lg+): a full-height box locked to the image aspect ratio. The first
 * frame is the complete statue shifted ~20% right; it then glides to the middle
 * while zooming in ~50% (growth anchored to the top so the head stays in frame).
 *
 * Mobile / tablet: the statue is fitted to the card width and grounded at the
 * bottom so the whole figure stays visible behind the text, with a gentler zoom.
 *
 * Outer div owns the static centring so Framer's transform never fights
 * Tailwind's translate.
 */
export function HeroStatue() {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const finalScale = isDesktop ? 1.5 : 1.14;
  const { x: parallaxX, y: parallaxY } = usePointerParallax(26);
  const { ready } = useReady();

  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 h-[92%] w-[92%] -translate-x-1/2 sm:h-[96%] sm:w-[78%] lg:inset-y-0 lg:h-auto lg:w-auto lg:aspect-1086/1448">
      {/* Parallax layer — drifts with the cursor, composes over the zoom below */}
      <motion.div
        className="relative h-full w-full"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {/* Zoom/entrance layer */}
        <motion.div
          className="relative h-full w-full"
          initial={reduceMotion ? false : { opacity: 0, scale: 1, x: "20%" }}
          animate={
            ready
              ? { opacity: 1, scale: finalScale, x: 0 }
              : { opacity: 0, scale: 1, x: "20%" }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 1, ease: "easeOut" },
                  scale: { duration: 4, ease: [0.3, 0, 0.1, 1], delay: 0.4 },
                  x: { duration: 4, ease: [0.3, 0, 0.1, 1], delay: 0.4 },
                }
          }
          style={{
            willChange: "transform, opacity",
            transformOrigin: isDesktop ? "center top" : "center bottom",
          }}
        >
          <Image
            src={STATUE_IMAGE}
            alt=""
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-contain object-bottom"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
