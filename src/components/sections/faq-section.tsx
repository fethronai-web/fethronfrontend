"use client";

import { useState } from "react";
import { FaqJsonLd, type FaqItem } from "@/components/seo/structured-data";

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
    q: "How do I start a project with Fethron?",
    a: "Visit fethron.com/submit and send a letter about what you want to build. The team will respond with a scoped proposal. You can also try Fethron AI at aistudio.fethron.com to generate a free Vision-to-Launch blueprint first.",
  },
  {
    q: "What payment terms does Fethron use?",
    a: "Standard terms are 50% advance to begin and 50% on delivery. Monthly services are billed per the agreed cycle. Final pricing is confirmed in a written proposal.",
  },
];

function FaqItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-sans text-sm font-medium text-white/80 sm:text-base">
          <span className="mr-3 font-mono text-xs text-red-500/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item.q}
        </span>
        <span className="mt-0.5 shrink-0 text-white/30 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "none" }}>
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 pl-8 text-sm leading-relaxed text-white/50">
          {item.a}
        </p>
      )}
    </div>
  );
}

export function FaqSection({ faqs = HOME_FAQS }: { faqs?: FaqItem[] }) {
  return (
    <section className="bg-black px-6 py-20 sm:px-8 lg:px-16">
      <FaqJsonLd items={faqs} />
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
          Questions
        </h2>
        <div>
          {faqs.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
