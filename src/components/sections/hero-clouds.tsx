"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

const CARD_BACKGROUND = "/images/herobackground.webp";

/** Stormy-cloud card backdrop with a gentle pointer parallax (slowest layer). */
export function HeroClouds() {
  const { x, y } = usePointerParallax(12);

  return (
    <motion.div className="absolute inset-0 scale-110" style={{ x, y }}>
      <Image
        src={CARD_BACKGROUND}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 75vw"
        className="object-cover object-center"
      />
    </motion.div>
  );
}
