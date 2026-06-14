"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { FaqJsonLd, type FaqItem } from "@/components/seo/structured-data";
import { SOCIAL } from "@/config/social";

export type { FaqItem };

export interface FaqItemRich extends FaqItem {
  links?: Array<{ label: string; href: string; external?: boolean }>;
}

export const HOME_FAQS: FaqItemRich[] = [
  {
    q: "What does Fethron design and build?",
    a: "Web apps, mobile apps, AI agents and automation, e-commerce stores, Web3 dApps and smart contracts, brand identities, and digital marketing — everything from raw idea to live product, under one studio.",
    links: [
      { label: "View services", href: "/#services" },
      { label: "See pricing", href: "/pricing" },
    ],
  },
  {
    q: "How long does a typical project take?",
    a: "Most projects ship in 2–6 weeks. A landing page can go live in 7 days; a full web app, AI system, or mobile product typically takes 4–12 weeks depending on scope and complexity.",
    links: [{ label: "Our process", href: "/#process" }],
  },
  {
    q: "How much does it cost to build with Fethron?",
    a: "Projects start from ₹20,000 for a web page and go up to ₹10,00,000 for token ecosystems or enterprise AI systems. Every engagement starts with a scoped written proposal — no surprises.",
    links: [{ label: "Full pricing breakdown", href: "/pricing" }],
  },
  {
    q: "Is Fethron AI free to use?",
    a: "Yes. Vision to Launch and Smart Contract Audit are completely free — no account or card required. Describe your idea or paste your Solidity code and get a studio-grade output instantly.",
    links: [
      { label: "Try Vision to Launch", href: "https://aistudio.fethron.com", external: true },
      { label: "Smart Contract Audit", href: "https://aistudio.fethron.com", external: true },
    ],
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. Fethron works with founders and companies globally. All communication, proposals, and deliverables are in English. Payments are accepted internationally.",
    links: [{ label: "Write to us", href: "/submit" }],
  },
  {
    q: "How do I start a project with Fethron?",
    a: "Send us a project brief and we'll respond with a scoped proposal. You can also reach the team instantly on WhatsApp or Discord for a quick conversation before committing to anything.",
    links: [
      { label: "Submit a brief", href: "/submit" },
      { label: "WhatsApp", href: SOCIAL.whatsapp, external: true },
      { label: "Discord", href: SOCIAL.discord, external: true },
    ],
  },
  {
    q: "What are your payment terms?",
    a: "50% advance to begin, 50% on delivery. Monthly services follow an agreed billing cycle. All prices are in INR, exclusive of GST. Final pricing is always confirmed in writing before work starts.",
    links: [{ label: "Pricing & terms", href: "/pricing" }],
  },
];

function ArrowRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M1.5 5h7M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkBadge({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-full border border-off-white/15 bg-off-white/[0.04] px-3 py-1 font-sans text-[11px] font-medium tracking-wide text-off-white/60 transition-all duration-200 hover:border-off-white/35 hover:bg-off-white/10 hover:text-off-white";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
        <ArrowRight />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
      <ArrowRight />
    </Link>
  );
}

function FaqRow({ item, index }: { item: FaqItemRich; index: number }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="border-b border-off-white/10">
      <button
        className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8 sm:py-7"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="mt-0.5 w-7 shrink-0 font-mono text-[10px] font-semibold tracking-widest text-red-600/80 sm:w-8 sm:text-[11px]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-sans text-[15px] font-medium leading-snug text-off-white transition-opacity duration-200 group-hover:text-off-white/75 sm:text-base lg:text-[17px]">
          {item.q}
        </span>
        <span
          className="mt-0.5 shrink-0 text-xl leading-none text-off-white/20 transition-all duration-300 group-hover:text-off-white/45"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "block" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-7 pl-12 pr-6 sm:pl-16">
              <p className="font-sans text-sm leading-7 text-off-white/55 sm:text-[15px]">
                {item.a}
              </p>
              {item.links && item.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.links.map((l) => (
                    <LinkBadge key={l.href + l.label} href={l.href} label={l.label} external={l.external} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StillHaveQuestions() {
  return (
    <Reveal>
      <div className="mt-16 flex flex-col items-start gap-6 border-t border-off-white/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-off-white/25">
            Still have questions?
          </p>
          <p className="mt-2 font-display text-2xl font-normal text-off-white sm:text-3xl">
            Reach the team directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* WhatsApp */}
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-off-white/20 bg-off-white/5 px-5 py-2.5 font-sans text-sm font-medium text-off-white/80 transition-all duration-200 hover:border-off-white/45 hover:bg-off-white/10 hover:text-off-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          {/* Discord */}
          <a
            href={SOCIAL.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-off-white/20 bg-off-white/5 px-5 py-2.5 font-sans text-sm font-medium text-off-white/80 transition-all duration-200 hover:border-off-white/45 hover:bg-off-white/10 hover:text-off-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
          {/* Fethron Agent */}
          <a
            href="https://aistudio.fethron.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-off-white/20 bg-off-white/5 px-5 py-2.5 font-sans text-sm font-medium text-off-white/80 transition-all duration-200 hover:border-off-white/45 hover:bg-off-white/10 hover:text-off-white"
          >
            <Image
              src="/brand/fethron-mark.png"
              alt=""
              width={14}
              height={14}
              className="opacity-70"
              aria-hidden="true"
            />
            Fethron AI
          </a>
          {/* Submit brief — accent */}
          <Link
            href="/submit"
            className="inline-flex items-center gap-2.5 rounded-full border border-red-600/40 bg-red-600/10 px-5 py-2.5 font-sans text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-600/70 hover:bg-red-600/20 hover:text-red-300"
          >
            Submit a brief
            <ArrowRight />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function FaqSection({ faqs = HOME_FAQS }: { faqs?: FaqItemRich[] }) {
  return (
    <section
      className="relative overflow-hidden border-t border-off-white/10 py-24 sm:py-32 lg:py-40"
      style={{
        background:
          "linear-gradient(160deg, #0c0404 0%, #060101 30%, #000000 60%, #04030a 100%)",
      }}
    >
      <FaqJsonLd items={faqs} />

      {/* SVG fractal noise texture — very subtle grain over the gradient */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="faq-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65 0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#faq-noise)" />
      </svg>

      {/* red radial glow — top center */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-120 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, #EF0606 0%, transparent 70%)",
          opacity: 0.07,
        }}
        aria-hidden="true"
      />
      {/* softer warm glow — bottom right for depth */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-75 w-100 translate-x-1/4 translate-y-1/4 rounded-full"
        style={{
          background: "radial-gradient(ellipse, #3a0a0a 0%, transparent 70%)",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      <Container>
        {/* header */}
        <div className="mb-14 sm:mb-20">
          <Reveal>
            <p className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] text-off-white/30">
              Common questions
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[0.9] tracking-[-0.02em] text-off-white">
                Q&nbsp;&amp;&nbsp;A
              </h2>
              <p className="max-w-xs font-sans text-sm leading-relaxed text-off-white/38 sm:text-right">
                Everything you need to know before we start building together.
              </p>
            </div>
          </Reveal>
        </div>

        {/* accordion */}
        <div className="border-t border-off-white/10">
          {faqs.map((item, i) => (
            <FaqRow key={i} item={item} index={i} />
          ))}
        </div>

        {/* contact footer */}
        <StillHaveQuestions />
      </Container>
    </section>
  );
}
