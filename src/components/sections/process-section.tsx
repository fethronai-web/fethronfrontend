"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

// process.png is 1672×941 — overlay coords share this viewBox so the SVG
// (orbit, connectors) and the %-positioned HTML stay perfectly aligned.
const VB = { w: 1672, h: 941 };
const SUN = { x: 836, y: 781 }; // approx centre of the celestial graphic
const ORBIT_R = 400;

const vx = (pct: number) => (pct * VB.w) / 100;
const vy = (pct: number) => (pct * VB.h) / 100;

type StepIcon = (props: { className?: string }) => ReactNode;

function IconBase({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const DiscoverIcon: StepIcon = (p) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </IconBase>
);
const DefineIcon: StepIcon = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </IconBase>
);
const DesignIcon: StepIcon = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m16 8-2.6 5.4L8 16l2.6-5.4z" />
  </IconBase>
);
const DevelopIcon: StepIcon = (p) => (
  <IconBase {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m14 6-4 12" />
  </IconBase>
);
const LaunchIcon: StepIcon = (p) => (
  <IconBase {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 8-10c2 0 4 2 4 4a22 22 0 0 1-10 8z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
  </IconBase>
);

type Step = {
  no: string;
  title: string;
  desc: string;
  Icon: StepIcon;
  node: { x: number; y: number }; // number circle, %
  card: { x: number; y: number }; // card centre, %
};

const STEPS: Step[] = [
  {
    no: "01",
    title: "Discover",
    desc: "We begin by understanding your goals, audience, and market landscape.",
    Icon: DiscoverIcon,
    node: { x: 50, y: 39 },
    card: { x: 61.5, y: 36 },
  },
  {
    no: "02",
    title: "Define",
    desc: "We clarify the opportunity and shape a strategic roadmap for impact.",
    Icon: DefineIcon,
    node: { x: 68.5, y: 54 },
    card: { x: 83, y: 54 },
  },
  {
    no: "03",
    title: "Design",
    desc: "We craft intuitive, timeless designs that communicate with clarity and purpose.",
    Icon: DesignIcon,
    node: { x: 73, y: 80 },
    card: { x: 86.5, y: 80 },
  },
  {
    no: "04",
    title: "Develop",
    desc: "We build with precision, performance, and scalability at the core.",
    Icon: DevelopIcon,
    node: { x: 27, y: 80 },
    card: { x: 13.5, y: 80 },
  },
  {
    no: "05",
    title: "Launch",
    desc: "We launch, monitor, and optimize to ensure lasting results and growth.",
    Icon: LaunchIcon,
    node: { x: 31.5, y: 54 },
    card: { x: 17, y: 54 },
  },
];

function Heading({ centered = false }: { centered?: boolean }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <p
        className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-accent ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-1 w-1 rotate-45 bg-accent/70" aria-hidden="true" />
        Process
        <span className="h-1 w-1 rotate-45 bg-accent/70" aria-hidden="true" />
      </p>
      <h2 className="font-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-off-white">
        How we work
      </h2>
      <p
        className={`mt-4 max-w-md text-sm leading-relaxed text-swirl/55 sm:text-base ${
          centered ? "mx-auto" : ""
        }`}
      >
        A refined, collaborative process that transforms strategy into enduring
        digital experiences.
      </p>
    </div>
  );
}

export function ProcessSection() {
  const reduce = useReducedMotion();
  // Re-trigger on every enter AND leave (not once) so the section animates both
  // when you scroll in and out, as requested.
  const viewport = { once: false, amount: 0.35 } as const;

  // Scroll-linked parallax so the celestial canvas drifts as you pass it —
  // gives the static engraving a sense of depth instead of sitting dead still.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const canvasY = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.02, 1.06]);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden border-t border-off-white/10 bg-black"
    >
      {/* ---------- desktop: framed celestial canvas ---------- */}
      <motion.div
        className="relative hidden w-full xl:block"
        style={reduce ? undefined : { y: canvasY, scale: canvasScale }}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <Image
          src="/images/process.webp"
          alt=""
          width={VB.w}
          height={VB.h}
          sizes="100vw"
          className="block h-auto w-full select-none"
        />

        {/* SVG overlay — orbit, connectors, travelling dot */}
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* connector lines node → card — draw outward from each node */}
          {STEPS.map((s, i) => (
            <motion.line
              key={s.no}
              x1={vx(s.node.x)}
              y1={vy(s.node.y)}
              x2={vx(s.card.x)}
              y2={vy(s.card.y)}
              stroke="rgba(239,238,232,0.18)"
              strokeWidth={1}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={viewport}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 + i * 0.1 }}
            />
          ))}

          {/* dashed orbit */}
          <circle
            cx={SUN.x}
            cy={SUN.y}
            r={ORBIT_R}
            fill="none"
            stroke="rgba(239,6,6,0.35)"
            strokeWidth={1.5}
            strokeDasharray="2 13"
          />

          {/* travelling dot */}
          <motion.g
            style={{ transformBox: "view-box", transformOrigin: `${SUN.x}px ${SUN.y}px` }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          >
            <circle cx={SUN.x} cy={SUN.y - ORBIT_R} r={13} fill="rgba(239,6,6,0.25)" />
            <circle cx={SUN.x} cy={SUN.y - ORBIT_R} r={5} fill="#EF0606" />
          </motion.g>
        </svg>

        {/* title block — top centre (outer div centres, inner motion animates so
            the transforms don't fight) */}
        <div className="absolute left-1/2 top-[6%] z-20 w-full max-w-2xl -translate-x-1/2 px-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Heading centered />
          </motion.div>
        </div>

        {/* number circles — outer div handles centering, inner motion the reveal */}
        {STEPS.map((s, i) => (
          <div
            key={`node-${s.no}`}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.node.x}%`, top: `${s.node.y}%` }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-off-white/15 bg-black/70 backdrop-blur-sm"
              initial={reduce ? false : { opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.25 + i * 0.1 }}
            >
              <span className="font-display text-2xl text-accent">{s.no}</span>
            </motion.div>
          </div>
        ))}

        {/* cards — each glides out from its node along the connector */}
        {STEPS.map((s, i) => (
          <div
            key={`card-${s.no}`}
            className="absolute z-20 w-56 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.card.x}%`, top: `${s.card.y}%` }}
          >
            <motion.div
              className="rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-sm"
              initial={
                reduce
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.9,
                      x: Math.sign(s.node.x - s.card.x) * 34,
                      y: Math.sign(s.node.y - s.card.y) * 34,
                    }
              }
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={viewport}
              transition={{ type: "spring", stiffness: 130, damping: 19, delay: 0.34 + i * 0.1 }}
            >
              <div className="flex items-center gap-2.5">
                <s.Icon className="h-5 w-5 shrink-0 text-accent" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-off-white">
                  {s.title}
                </h3>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-swirl/55">{s.desc}</p>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* ---------- mobile / tablet: clean vertical timeline ---------- */}
      <div className="relative xl:hidden">
        <Image
          src="/images/process.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-55"
        />
        {/* legibility gradient — solid behind the heading, opens up toward the
            bottom so the engraved sun glows through */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-black via-black/80 to-black/25"
          aria-hidden="true"
        />
        {/* subtle brand glow */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/4 h-72 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(239,6,6,0.12),transparent)]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-2xl px-5 py-20 sm:py-24">
          <Heading />

          <ol className="mt-12 space-y-8 sm:mt-14">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.no}
                className="flex gap-5"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
              >
                <div className="flex flex-col items-center">
                  <span className="font-display text-3xl leading-none text-accent">
                    {s.no}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-off-white/12" aria-hidden="true" />
                  )}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2.5">
                    <s.Icon className="h-5 w-5 shrink-0 text-accent" />
                    <h3 className="text-base font-semibold uppercase tracking-[0.16em] text-off-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-swirl/60">{s.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
