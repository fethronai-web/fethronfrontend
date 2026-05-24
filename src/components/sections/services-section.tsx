"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

type Service = {
  no: string;
  title: string;
  tags: string[];
  description: string;
  image?: string;
};

const SERVICES: Service[] = [
  {
    no: "01",
    title: "AI",
    image: "/images/ai.webp",
    tags: ["AI Agents", "Automation", "Generative AI", "LLM Integration", "Conversational AI"],
    description:
      "We build intelligent products end to end — from autonomous agents and workflow automation to generative AI and conversational interfaces. Our teams design, train, and ship models that plug directly into your stack, turning manual, repetitive work into self-running systems that learn, adapt, and scale with your business while keeping you firmly in control of every decision.",
  },
  {
    no: "02",
    title: "E-Commerce",
    image: "/images/ecommerce.webp",
    tags: ["Headless", "Shopify", "Checkout", "Payments", "Conversion"],
    description:
      "We craft high-converting storefronts engineered for scale — headless commerce architecture, frictionless checkout flows, and conversion-driven UX backed by real data. From catalogue and payments to fulfilment and analytics, we connect every moving part into one fast, reliable shopping experience that turns first-time browsers into loyal, repeat customers and grows revenue without slowing your team down.",
  },
  {
    no: "03",
    title: "Web Development",
    image: "/images/webdev.webp",
    tags: ["Next.js", "React", "TypeScript", "APIs", "Performance"],
    description:
      "We engineer production-grade websites and web applications that are fast, typed, accessible, and built to last. Using modern frameworks, clean architecture, and rigorous testing, we ship interfaces that feel instant and code your team can confidently maintain for years. Every build is performance-budgeted, SEO-ready, and responsive by default — stunning on any screen and seamless under real load.",
  },
  {
    no: "04",
    title: "Web 3.0",
    image: "/images/web3.webp",
    tags: ["Smart Contracts", "dApps", "Solidity", "NFTs", "Wallets"],
    description:
      "We bring brands on-chain with secure, audited Web 3.0 experiences — decentralised apps, smart contracts, token systems, and NFT platforms. From wallet integration and gas optimisation to contract security and intuitive front-ends, we make blockchain feel effortless for everyday users while giving you ownership, transparency, and powerful new ways to engage and reward your community.",
  },
  {
    no: "05",
    title: "Brand & Identity",
    image: "/images/brand.webp",
    tags: ["Strategy", "Logo", "Design Systems", "Guidelines", "Art Direction"],
    description:
      "We shape brands that feel inevitable — sharp positioning, distinctive visual identity, and design systems that stay consistent at every touchpoint. From logo and typography to colour, motion, and tone of voice, we craft a cohesive language that earns trust, signals quality, and makes ambitious companies impossible to ignore across every screen and surface they appear on.",
  },
  {
    no: "06",
    title: "Digital Marketing",
    image: "/images/marketing.webp",
    tags: ["SEO", "Analytics", "Growth", "Content", "Paid Ads"],
    description:
      "We grow brands with marketing that is measured, not guessed — technical SEO, performance analytics, content, and paid campaigns woven directly into the product. We track what matters, double down on what converts, and cut what does not, building compounding, data-driven growth engines that turn fleeting attention into qualified traffic, leads, and lasting revenue for your business.",
  },
];

const BACKGROUND = "/images/ourservice.webp";

/* Full-bleed wide content shell — fills near the viewport edges (no narrow column) */
function Wide({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1760px] px-5 sm:px-8 lg:px-14 xl:px-20 ${className}`}
    >
      {children}
    </div>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/15 bg-white/[0.02] px-3.5 py-1.5 text-xs font-medium text-off-white/80 sm:px-4 sm:py-2 sm:text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function CardFace({
  service,
  frontAmount,
  bodyAmount,
  peekAmount,
}: {
  service: Service;
  frontAmount: MotionValue<number>;
  bodyAmount: MotionValue<number>;
  peekAmount: MotionValue<number>;
}) {
  return (
    <article className="relative h-[clamp(23rem,54vh,29rem)] overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-[#08080b]/96 via-[#0a0a0d]/92 to-[#0a0a0d]/70 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.95)]">
      {/* base sheen */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/[0.04] to-transparent"
        aria-hidden="true"
      />
      {/* minimal classical image panel — right side, fades into the card */}
      {service.image && (
        <motion.div
          style={{
            opacity: bodyAmount,
            maskImage: "linear-gradient(to right, transparent, #000 38%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 38%)",
          }}
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] sm:block lg:w-[44%]"
          aria-hidden="true"
        >
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 45vw, 32vw"
            className="object-cover object-center"
          />
        </motion.div>
      )}

      {/* red glow border — only the active card */}
      <motion.div
        style={{ opacity: frontAmount }}
        className="pointer-events-none absolute inset-0 rounded-3xl border border-accent/60 shadow-[0_0_70px_-15px_rgba(239,6,6,0.45),inset_0_0_40px_-25px_rgba(239,6,6,0.6)]"
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex h-full flex-col pt-6 pb-7 pl-7 sm:pt-7 sm:pb-9 sm:pl-10 lg:pl-14 ${
          service.image
            ? "pr-7 sm:pr-[42%] lg:pr-[40%]"
            : "pr-7 sm:pr-10 lg:pr-14"
        }`}
      >
        {/* title row — visible even when the card is only peeking */}
        <div className="flex items-center gap-4">
          <h3 className="font-display text-3xl leading-none text-off-white sm:text-4xl lg:text-[2.5rem]">
            {service.title}
          </h3>
          <motion.span
            style={{ opacity: peekAmount }}
            className="hidden h-px flex-1 bg-off-white/15 sm:block"
            aria-hidden="true"
          />
          <motion.span
            style={{ opacity: peekAmount }}
            className="ml-auto text-off-white/40 sm:ml-0"
            aria-hidden="true"
          >
            <ArrowRight className="h-5 w-5" />
          </motion.span>
        </div>

        {/* rich body — only the active card; vertically centered below the title */}
        <motion.div
          style={{ opacity: bodyAmount }}
          className="flex flex-1 flex-col justify-center"
        >
          <TagRow tags={service.tags} />
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-swirl/70 sm:mt-6 sm:text-base sm:leading-[1.75]">
            {service.description}
          </p>
        </motion.div>
      </div>
    </article>
  );
}

function StackCard({
  service,
  index,
  total,
  peek,
  active,
}: {
  service: Service;
  index: number;
  total: number;
  peek: number;
  active: MotionValue<number>;
}) {
  const maxDepth = total - 1;
  // queue: >0 upcoming (peeking above), ~0 front, <0 already passed.
  // `active` is already spring-smoothed, so every value tracks one unified
  // timeline — position, scale, opacity and cross-fades move together.
  const queue = useTransform(active, (a) => index - a);

  const y = useTransform(queue, (q) =>
    q < 0 ? -q * 64 : -Math.min(q, maxDepth) * peek,
  );
  const scale = useTransform(queue, (q) =>
    q < 0 ? 0.96 : 1 - Math.min(q, maxDepth) * 0.04,
  );
  const opacity = useTransform(queue, (q) => {
    if (q < 0) return Math.max(0, 1 + q * 2.2);
    if (q > maxDepth + 0.4) return 0;
    return 1 - Math.min(q, maxDepth) * 0.08;
  });
  const zIndex = useTransform(queue, (q) => Math.round(100 - Math.abs(q) * 10));

  const frontAmount = useTransform(queue, (q) => Math.max(0, 1 - Math.abs(q)));
  const bodyAmount = useTransform(queue, (q) =>
    Math.max(0, 1 - Math.abs(q) * 1.6),
  );
  const peekAmount = useTransform(queue, (q) => Math.min(Math.max(q, 0), 1));

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex, transformOrigin: "top center" }}
      className="absolute inset-x-0 bottom-0 will-change-transform"
    >
      <CardFace
        service={service}
        frontAmount={frontAmount}
        bodyAmount={bodyAmount}
        peekAmount={peekAmount}
      />
    </motion.div>
  );
}

function Intro() {
  return (
    <div className="flex flex-col justify-center">
      <p className="ui-label inline-flex items-center gap-2 text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        What We Do
      </p>
      <h2 className="font-display mt-5 text-[clamp(2.75rem,6vw,5.5rem)] font-normal leading-[0.92] tracking-[-0.02em] text-off-white">
        Our Services
      </h2>
      <p className="mt-6 max-w-sm text-base leading-relaxed text-swirl/60">
        A focused suite of capabilities crafted to elevate digital experiences.
        Modular by design. Measurable by impact. Built to endure.
      </p>
      <Link
        href="#contact"
        className="ui-label group mt-10 inline-flex items-center gap-2 text-off-white/70 transition-colors hover:text-accent lg:mt-14"
      >
        Explore All Services
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function ServicesSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // One smoothed master timeline; everything in the deck derives from it.
  const activeRaw = useTransform(scrollYProgress, [0, 1], [0, SERVICES.length - 1]);
  const active = useSpring(activeRaw, {
    stiffness: 120,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const [peek, setPeek] = useState(64);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPeek(mq.matches ? 64 : 52);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduce) {
    return (
      <section
        id="services"
        className="relative isolate overflow-hidden border-t border-white/10 bg-black py-24 sm:py-32"
      >
        <Image
          src={BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center opacity-90"
        />
        <Wide>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Intro />
            <div className="flex flex-col gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.no}
                  className="rounded-2xl border border-white/10 bg-[#0a0a0d]/85 p-6 sm:p-8"
                >
                  <h3 className="font-display text-2xl text-off-white sm:text-3xl">
                    {service.title}
                  </h3>
                  <div className="mt-4">
                    <TagRow tags={service.tags} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-swirl/65">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Wide>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative border-t border-white/10 bg-black"
      style={{ height: `${SERVICES.length * 70}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* full-bleed classical backdrop — fills the full width */}
        <Image
          src={BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* gentle left wash so the heading stays legible over the art */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/55 via-black/10 to-transparent"
          aria-hidden="true"
        />

        <Wide className="relative z-10 flex h-full flex-col gap-8 py-20 sm:py-24 lg:grid lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14 lg:py-0">
          <Intro />

          <div
            key={peek}
            className="relative h-full max-h-[42rem] min-h-[22rem] lg:max-h-[46rem]"
          >
            {SERVICES.map((service, i) => (
              <StackCard
                key={service.no}
                service={service}
                index={i}
                total={SERVICES.length}
                peek={peek}
                active={active}
              />
            ))}
          </div>
        </Wide>
      </div>
    </section>
  );
}
