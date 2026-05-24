"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

/**
 * Pointer-driven parallax. Returns spring-smoothed x/y px offsets that drift
 * toward the cursor. `range` is the max shift (px) at the screen edge — pass a
 * larger value to foreground layers for depth.
 *
 * No-ops on touch / coarse pointers and when the user prefers reduced motion,
 * so the returned values simply stay at 0 (mobile and a11y safe).
 */
export function usePointerParallax(range = 16) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // stiffness lowered for a slower, lazier drift toward the cursor (70 -> 49 -> 39)
  const springX = useSpring(x, { stiffness: 39, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 39, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      x.set(nx * range);
      y.set(ny * range);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [range, x, y]);

  return { x: springX, y: springY };
}
