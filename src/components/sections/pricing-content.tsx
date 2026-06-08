"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SITE } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const MAILTO = `mailto:${SITE.email}`;
// TODO: point this at the real estimator/tool when it's built.
const TOOL_HREF = "#estimate";

// Subtle film-grain texture for the cards.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

type Tier = {
  name: string;
  price: string;
  unit?: string;
  popular?: boolean;
  contact?: boolean;
  noDiscount?: boolean; // suppress the 50%-off strike-through display
  features: string[];
};

// "₹60,000" → "₹30,000" (the discounted price = half of the listed price).
function halfPrice(price: string): string | null {
  const n = parseInt(price.replace(/[^\d]/g, ""), 10);
  if (!n) return null;
  return "₹" + Math.round(n / 2).toLocaleString("en-IN");
}

type Plan = {
  key: string;
  name: string;
  blurb: string;
  tiers: [Tier, Tier, Tier, Tier];
};

const CONTACT: Tier = {
  name: "Custom",
  price: "Contact us",
  contact: true,
  features: [
    "Bespoke, end-to-end scope built for you",
    "Dedicated cross-functional team",
    "Tailored timeline & clear milestones",
    "Priority SLAs & rapid support",
    "Ongoing partnership / retainer option",
    "Flexible, milestone-based payments",
    "Scales to enterprise requirements",
    "Priced exactly to your project",
  ],
};

const PLANS: Plan[] = [
  {
    key: "ai",
    name: "AI",
    blurb: "Autonomous agents, automation, and generative AI wired into your stack.",
    tiers: [
      { name: "Essential", price: "₹60,000", unit: "one-time", features: ["AI chatbot for your website or WhatsApp", "Answers customer FAQs 24/7, instantly", "Captures & qualifies leads automatically", "Trained on your business info & FAQs", "One tool or channel integration", "Simple dashboard to manage replies", "Live in roughly 2 weeks", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹1,75,000", unit: "one-time", popular: true, features: ["Up to 3 custom AI agents or automations", "Trained on your own data, docs & site", "Connects to CRM, Sheets & your APIs", "Smart hand-off to a human when needed", "Multi-step workflows, not just Q&A", "Conversation logs & performance analytics", "Deployed into your stack & monitored", "30 days of support, tuning & tweaks"] },
      { name: "Premium", price: "₹4,50,000", unit: "one-time", features: ["Full multi-agent AI system, end to end", "RAG over your entire knowledge base", "Automates back-office & internal workflows", "Voice + multilingual (Hindi & more) ready", "Model fine-tuning where it adds value", "Live dashboards, logging & monitoring", "Role-based access & safety guardrails", "60-day priority support & optimisation"] },
      CONTACT,
    ],
  },
  {
    key: "ecommerce",
    name: "E-Commerce",
    blurb: "High-converting storefronts engineered to scale.",
    tiers: [
      { name: "Essential", price: "₹75,000", unit: "one-time", features: ["Launch-ready store, up to 25 products", "UPI, cards & wallets via Razorpay", "Mobile-first design, lightning fast", "Product, order & inventory basics", "Discount codes & GST-ready invoices", "Google & Meta pixel tracking setup", "Trained to manage it yourself", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹1,75,000", unit: "one-time", popular: true, features: ["Shopify or custom headless build", "Unlimited products with easy CMS", "Conversion-optimised checkout flow", "Shiprocket / courier & logistics", "Coupons, reviews & abandoned-cart emails", "WhatsApp order updates & notifications", "Full SEO + analytics dashboard", "30 days of support"] },
      { name: "Premium", price: "₹4,50,000", unit: "one-time", features: ["Fully custom storefront or web app", "Subscriptions, B2B or multi-vendor", "A/B testing & advanced analytics", "ERP / inventory / accounting integrations", "Loyalty, referrals & personalisation", "Performance-tuned for high traffic", "Priority bug-fixes & feature support", "90-day priority support"] },
      CONTACT,
    ],
  },
  {
    key: "web-dev",
    name: "Web Development",
    blurb: "Production-grade websites and web apps, fast and built to last.",
    tiers: [
      { name: "Essential", price: "₹40,000", unit: "one-time", features: ["Up to 5 pages, hand-crafted (no templates)", "Built on modern Next.js / React", "Mobile-first & fully responsive", "On-page SEO foundation built in", "Contact form + WhatsApp button", "Fast loading & Google-friendly", "Connected to your domain & hosting", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹90,000", unit: "one-time", popular: true, features: ["Multi-page website or web app", "Easy-to-edit CMS — update it yourself", "Cinematic scroll & hover animations", "Speed & Core Web Vitals optimised", "Blog / portfolio / careers modules", "Analytics + full SEO setup", "Lead forms & third-party integrations", "30 days of support"] },
      { name: "Premium", price: "₹2,50,000", unit: "one-time", features: ["Complex, fully custom web application", "User auth, dashboards & admin panels", "Third-party & payment API integrations", "Automated testing & error monitoring", "Scalable, maintainable architecture", "Role-based access & security", "CI/CD & smooth deployment", "60-day priority support"] },
      CONTACT,
    ],
  },
  {
    key: "web3",
    name: "Web 3.0",
    blurb: "Audited dApps, smart contracts, and token systems on-chain.",
    tiers: [
      { name: "Essential", price: "₹1,50,000", unit: "one-time", features: ["1 audited, production-ready contract", "On-chain + off-chain logic, in sync", "Clean, responsive dApp front-end", "MetaMask / WalletConnect login", "Deployed & tested on testnet", "Gas-aware, efficient code", "Basic token / mint functionality", "Etherscan verification", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹4,50,000", unit: "one-time", popular: true, noDiscount: true, features: ["Full smart-contract suite", "Complete dApp with wallet flows", "Gas optimisation & best practices", "Mainnet launch & verification", "Subgraph / indexing for fast reads", "Admin controls & upgrade safety", "Internal security checks", "30 days of support"] },
      { name: "Premium", price: "₹10,00,000", unit: "one-time", noDiscount: true, features: ["Token or NFT ecosystem, end to end", "Independent third-party security audit", "Staking, vesting or DeFi logic", "Admin & on-chain analytics dashboard", "Scalable & multi-chain ready", "Whitepaper / tokenomics support", "Launch & liquidity guidance", "60-day priority support"] },
      CONTACT,
    ],
  },
  {
    key: "brand",
    name: "Brand & Identity",
    blurb: "Positioning, identity, and design systems that feel inevitable.",
    tiers: [
      { name: "Essential", price: "₹18,000", unit: "one-time", features: ["Custom logo & wordmark (no clipart)", "Colour palette & typography system", "Mini brand guide (PDF)", "Social media profile kit", "Business card & letterhead design", "All editable source files (AI/SVG/PNG)", "2 revision rounds", "5–7 day turnaround"] },
      { name: "Standard", price: "₹50,000", unit: "one-time", popular: true, features: ["Full visual identity system", "Brand positioning & strategy", "Complete brand guidelines book", "Stationery & social templates", "Icon set & graphic elements", "Art direction & moodboards", "3 revision rounds", "All source & export files"] },
      { name: "Premium", price: "₹1,25,000", unit: "one-time", features: ["End-to-end brand world & strategy", "Logo system, motion & packaging", "Messaging, tagline & tone of voice", "Marketing, pitch & social templates", "Photography / art direction guide", "Complete launch toolkit", "Dedicated senior brand designer", "Unlimited revisions within scope"] },
      CONTACT,
    ],
  },
  {
    key: "marketing",
    name: "Digital Marketing",
    blurb: "GEO, SEO, content, and paid — compounding, data-driven growth.",
    tiers: [
      { name: "Essential", price: "₹25,000", unit: "/ month", features: ["SEO + GEO foundation & audit", "Instagram + Google Business presence", "8 posts / reels per month", "Keyword & competitor research", "On-page SEO & basic backlinks", "Monthly performance report", "Dedicated point of contact", "No long lock-in"] },
      { name: "Standard", price: "₹50,000", unit: "/ month", popular: true, features: ["Full SEO + GEO growth program", "Content engine — blogs + social", "1 paid channel managed (Google/Meta)", "Conversion-focused landing pages", "Email / WhatsApp campaigns", "Bi-weekly reporting & insights", "Monthly strategy call", "Dedicated account manager"] },
      { name: "Premium", price: "₹1,00,000", unit: "/ month", features: ["Multi-channel paid ads, fully managed", "Content + creative & video production", "CRO & continuous A/B experiments", "Email / WhatsApp automation funnels", "Influencer & collab coordination", "Advanced analytics dashboard", "Weekly strategy & review calls", "Senior growth team on your account"] },
      CONTACT,
    ],
  },
];

const INCLUDED = [
  "Strategy",
  "Pixel-perfect design",
  "Production code",
  "Performance budget",
  "Post-launch support",
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function WandIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 4V2M15 10V8M12 7h2M18 7h2M5 19l9-9M9 5 7 7M19 15l-2 2" />
    </svg>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const sale = !tier.contact && !tier.noDiscount ? halfPrice(tier.price) : null;
  const bigPrice = sale ?? tier.price;
  return (
    <div
      className={
        "group relative flex flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1.5 " +
        (tier.popular
          ? "border-accent/50 shadow-[0_0_80px_-30px_rgba(239,6,6,0.6)] hover:shadow-[0_0_95px_-22px_rgba(239,6,6,0.7)]"
          : "border-white/10 hover:border-accent/40 hover:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]")
      }
      style={{
        background: tier.popular
          ? "linear-gradient(180deg, #1d1016 0%, #0b0a0c 60%)"
          : "linear-gradient(180deg, #15121b 0%, #0a0a0d 60%)",
      }}
    >
      {/* subtle texture + accent glow, clipped to the card shape */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-28"
          style={{ background: "radial-gradient(75% 100% at 50% 0%, rgba(239,6,6,0.13), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: NOISE, opacity: 0.55 }}
        />
        <div
          className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(circle, rgba(239,6,6,0.22), transparent 70%)" }}
        />
      </div>

      {tier.popular && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_4px_14px_-5px_rgba(239,6,6,0.7)]">
          Most Popular
        </span>
      )}

      <div className="relative flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-off-white/80">
          {tier.name}
        </p>

        <div className="mt-3 border-b border-white/10 pb-5">
          {sale && (
            <div className="mb-2 flex items-center gap-2.5">
              <span className="relative inline-block text-[15px] text-off-white/45">
                {tier.price}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 w-full"
                  style={{
                    height: "1.5px",
                    background: "rgba(239,6,6,0.85)",
                    transform: "translateY(-50%) rotate(-4deg)",
                  }}
                />
              </span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-[0_2px_10px_-3px_rgba(239,6,6,0.7)]">
                50% OFF
              </span>
            </div>
          )}
          <div className="flex items-end gap-2">
            <span className={"font-display text-off-white " + (tier.contact ? "text-2xl" : "text-3xl")}>
              {bigPrice}
            </span>
            {tier.unit && (
              <span className="pb-1 text-[11px] uppercase tracking-[0.14em] text-off-white/65">
                {tier.unit}
              </span>
            )}
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13px] leading-snug text-off-white/90">
              <Check className="mt-0.5 shrink-0 text-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href={MAILTO}
          className={
            "mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors " +
            (tier.popular
              ? "bg-accent text-accent-foreground hover:brightness-110"
              : "border border-off-white/20 text-off-white hover:border-accent/60 hover:text-accent")
          }
        >
          {tier.contact ? "Contact us" : "Get started"}
        </Link>
      </div>
    </div>
  );
}

export function PricingContent() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const plan = PLANS[active];

  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: "blur(8px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section className="relative">
      {/* fixed backdrop for the pricing route — shown as-is, no overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/pricing-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-36 sm:px-8 sm:pb-36 sm:pt-44">
        {/* heading */}
        <motion.div {...reveal(0)} className="text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-accent">
            <span className="h-1 w-1 rotate-45 bg-accent/70" aria-hidden="true" />
            Pricing
            <span className="h-1 w-1 rotate-45 bg-accent/70" aria-hidden="true" />
          </p>
        
          <p
            className="mx-auto mt-6 max-w-3xl leading-relaxed text-off-white/80"
            style={{ fontSize: "2rem" }}
          >
            Pick what you&apos;re building and choose the tier that fits. Every
            engagement is fixed-scope, fixed-price, and crafted to endure.
          </p>
        </motion.div>

        {/* selector */}
        <motion.div {...reveal(0.1)} className="mt-14">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-off-white/70">
            Select your project
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {PLANS.map((p, i) => {
              const isActive = i === active;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={
                    "rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors " +
                    (isActive
                      ? "border-accent/60 bg-accent/15 text-accent"
                      : "border-white/12 text-off-white/85 hover:border-white/30 hover:text-off-white")
                  }
                >
                  {p.name}
                </button>
              );
            })}

            <Link
              href={TOOL_HREF}
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent/45 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent/90 transition-colors hover:border-accent hover:text-accent"
            >
              <WandIcon />
              Don&apos;t know? Try our tool
            </Link>
          </div>
        </motion.div>

        {/* dynamic 4-tier grid for the selected project */}
        <motion.div {...reveal(0.16)} className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.key}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <p className="text-center text-[15px] leading-relaxed text-off-white/80">
                {plan.blurb}
              </p>
              <div className="mt-8 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {plan.tiers.map((tier) => (
                  <TierCard key={tier.name} tier={tier} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] text-off-white/55">
            All prices in ₹ · exclusive of GST · 50% to start, 50% on delivery
          </p>
        </motion.div>

        {/* included strip */}
        <motion.div
          {...reveal(0.22)}
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-6 sm:px-8"
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-off-white/70">
            Every engagement includes
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {INCLUDED.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-off-white/90">
                <Check className="text-accent" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* closing CTA (also the "tool" fallback target) */}
        <motion.div {...reveal(0.26)} id="estimate" className="mt-16 scroll-mt-28 text-center">
          <p className="font-display text-2xl text-off-white sm:text-3xl">
            Still not sure what you need?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-off-white/75">
            Tell us about your project and we&apos;ll shape the scope and price
            around it — no pressure, no jargon.
          </p>
          <Link
            href={MAILTO}
            className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-accent transition-opacity hover:opacity-80"
          >
            Let&apos;s build something enduring
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
