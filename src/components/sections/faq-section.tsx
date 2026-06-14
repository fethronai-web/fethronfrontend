"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { FaqJsonLd, type FaqItem } from "@/components/seo/structured-data";

export type { FaqItem };

export const HOME_FAQS: FaqItem[] = [
  {
    q: "What does Fethron build?",
    a: "Fethron designs and builds web apps, mobile apps, AI agents and automation systems, e-commerce stores, Web3 dApps and smart contracts, brand identities, and digital marketing — end to end, from idea to launch.",
  },
  {
    q: "How long does a project take?",
    a: "Timelines range from 7 days for a simple landing page to 3 months for a complex web app or AI system. Most projects ship in 2–6 weeks.",
  },
  {
    q: "How much does Fethron charge?",
    a: "Projects start from ₹20,000 for web pages and go up to ₹10,00,000 for full token or NFT ecosystems. See the pricing page for full tier breakdowns. All prices are in INR, exclusive of taxes.",
  },
  {
    q: "Is Fethron AI free?",
    a: "Yes. Vision to Launch and Smart Contract Audit are free tools available at aistudio.fethron.com — no signup required.",
  },
  {
    q: "Does Fethron work with international clients?",
    a: "Yes. Fethron works with founders and businesses globally. All communication and deliverables are in English.",
  },
  {
    q: "How do I start a project?",
    a: "Visit fethron.com/submit and send a letter about what you want to build. The team responds with a scoped proposal. You can also run Fethron AI first to get a free Vision-to-Launch blueprint.",
  },
  {
    q: "What payment terms does Fethron use?",
    a: "Standard terms are 50% advance to begin and 50% on delivery. Monthly services are billed per the agreed cycle. Final pricing is confirmed in a written proposal.",
  },
];

function FaqRow({ item, index, isLast }: { item: FaqItem; index: number; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className={isLast ? "" : "border-b border-white/8"}>
      <button
        className="group flex w-full items-start gap-6 py-7 text-left sm:gap-10 sm:py-8"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {/* index */}
        <span className="mt-0.5 shrink-0 font-mono text-[11px] font-medium tracking-widest text-red-600/70 sm:text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* question */}
        <span className="flex-1 font-sans text-base font-medium leading-snug text-off-white/80 transition-colors duration-200 group-hover:text-off-white sm:text-lg">
          {item.q}
        </span>

        {/* toggle */}
        <span
          className="mt-0.5 shrink-0 text-xl font-light text-off-white/30 transition-all duration-300 group-hover:text-off-white/60"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-8 pl-11 pr-8 font-sans text-sm leading-relaxed text-off-white/45 sm:pl-16 sm:text-base sm:leading-7">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ faqs = HOME_FAQS }: { faqs?: FaqItem[] }) {
  return (
    <section className="bg-black py-24 sm:py-32 lg:py-40">
      <FaqJsonLd items={faqs} />
      <Container>
        <div className="mb-16 flex items-end justify-between gap-6 border-b border-white/8 pb-10 sm:mb-20">
          <Reveal>
            <div>
              <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-white/25">
                Common questions
              </p>
              <h2 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-normal leading-[0.9] tracking-[-0.02em] text-off-white">
                Q&nbsp;&amp;&nbsp;A
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="hidden max-w-xs text-right font-sans text-sm leading-relaxed text-off-white/35 sm:block">
              Everything you need to know before we start building together.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-white/8">
          {faqs.map((item, i) => (
            <FaqRow key={i} item={item} index={i} isLast={i === faqs.length - 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
