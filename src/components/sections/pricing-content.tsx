"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";

const EASE = [0.16, 1, 0.3, 1] as const;
// "Let's build something enduring" opens the letter (Write to Us) page.
const LETTER_HREF = "/submit";
// "Don't know? Try our tool" opens the Fethron AI agent.
const TOOL_HREF = FETHRON_AGENT_URL;

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

// ── Currency: prices are authored in INR, then converted to the visitor's currency ──
type Currency = { code: string; rate: number; locale: string };

// rate = 1 INR in the target currency (approximate; rounded for clean display)
const CURRENCIES: Record<string, Currency> = {
  INR: { code: "INR", rate: 1, locale: "en-IN" },
  USD: { code: "USD", rate: 0.012, locale: "en-US" },
  EUR: { code: "EUR", rate: 0.011, locale: "de-DE" },
  GBP: { code: "GBP", rate: 0.0095, locale: "en-GB" },
  AED: { code: "AED", rate: 0.044, locale: "en-AE" },
  AUD: { code: "AUD", rate: 0.018, locale: "en-AU" },
  CAD: { code: "CAD", rate: 0.016, locale: "en-CA" },
  SGD: { code: "SGD", rate: 0.016, locale: "en-SG" },
};

const REGION_CURRENCY: Record<string, string> = {
  IN: "INR", US: "USD", GB: "GBP", AE: "AED", AU: "AUD", CA: "CAD", SG: "SGD",
  DE: "EUR", FR: "EUR", IE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR",
  PT: "EUR", AT: "EUR", BE: "EUR", FI: "EUR", GR: "EUR",
};

// The IANA timezone reflects the visitor's *physical* location far better than
// navigator.language (which is "en-US" for tons of people who aren't in the US).
function currencyFromTimeZone(tz: string): string | null {
  if (!tz) return null;
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "INR";
  if (tz === "Asia/Dubai") return "AED";
  if (tz === "Asia/Singapore") return "SGD";
  if (tz === "Europe/London") return "GBP";
  if (tz.startsWith("Europe/")) return "EUR";
  if (tz.startsWith("Australia/")) return "AUD";
  if (
    tz === "America/Toronto" || tz === "America/Vancouver" ||
    tz === "America/Edmonton" || tz === "America/Winnipeg" ||
    tz === "America/Halifax" || tz === "America/St_Johns"
  )
    return "CAD";
  if (tz.startsWith("America/")) return "USD";
  return null;
}

// Detect currency from timezone first, then locale region; default USD abroad.
function detectCurrencyCode(): string {
  if (typeof Intl !== "undefined") {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const byTz = currencyFromTimeZone(tz);
      if (byTz && CURRENCIES[byTz]) return byTz;
    } catch {
      /* ignore */
    }
  }
  if (typeof navigator !== "undefined") {
    try {
      const lang = navigator.language || "";
      const region =
        ("Locale" in Intl ? new Intl.Locale(lang).region : undefined) ||
        lang.split("-")[1];
      const byRegion = region && REGION_CURRENCY[region.toUpperCase()];
      if (byRegion) return byRegion;
    } catch {
      /* ignore */
    }
  }
  return "USD";
}

function priceToNumber(price: string): number | null {
  const n = parseInt(price.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Convert an INR amount and format it in the target currency (no decimals).
function formatMoney(inr: number, c: Currency): string {
  const value = c.code === "INR" ? inr : Math.round((inr * c.rate) / 10) * 10;
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    maximumFractionDigits: 0,
  }).format(value);
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
      { name: "Premium", price: "₹4,50,000", unit: "one-time", features: ["Full multi-agent AI system, end to end", "RAG over your entire knowledge base", "Automates back-office & internal workflows", "Voice + multilingual ready", "Model fine-tuning where it adds value", "Live dashboards, logging & monitoring", "Role-based access & safety guardrails", "60-day priority support & optimisation"] },
      CONTACT,
    ],
  },
  {
    key: "ecommerce",
    name: "E-Commerce",
    blurb: "High-converting storefronts engineered to scale.",
    tiers: [
      { name: "Essential", price: "₹75,000", unit: "one-time", features: ["Launch-ready store, up to 25 products", "Cards, wallets & UPI checkout", "Mobile-first design, lightning fast", "Product, order & inventory basics", "Discount codes & tax-ready invoices", "Google & Meta pixel tracking setup", "Trained to manage it yourself", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹1,75,000", unit: "one-time", popular: true, features: ["Shopify or custom headless build", "Unlimited products with easy CMS", "Conversion-optimised checkout flow", "Courier & logistics integrations", "Coupons, reviews & abandoned-cart emails", "WhatsApp order updates & notifications", "Full SEO + analytics dashboard", "30 days of support"] },
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
    key: "mobile-dev",
    name: "Mobile Development",
    blurb: "Native-quality Android & iOS apps, designed and shipped to the stores.",
    tiers: [
      { name: "Essential", price: "₹60,000", unit: "one-time", features: ["Cross-platform app — Android & iOS", "Up to 5 core screens, hand-crafted", "Clean, native-feeling UI & navigation", "Connects to one API or backend", "Push notifications setup", "Play Store / App Store submission help", "Built on modern React Native / Flutter", "2 weeks of post-launch support"] },
      { name: "Standard", price: "₹1,50,000", unit: "one-time", popular: true, features: ["Full Android + iOS app, both stores", "User auth, profiles & onboarding", "Offline support & local storage", "Payments / subscriptions integration", "Push notifications & deep links", "Analytics & crash reporting", "Backend / API integration", "30 days of support"] },
      { name: "Premium", price: "₹4,00,000", unit: "one-time", features: ["Complex, fully custom native app", "Real-time features (chat, live data)", "Maps, media, camera & device APIs", "Admin panel + scalable backend", "In-app purchases & monetisation", "Automated testing & CI/CD pipelines", "Store optimisation & launch support", "60-day priority support"] },
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

// Feature-by-feature comparison matrix per plan.
// Cell order = [Essential, Standard, Premium, Custom]. true → ✓, false → –, string → value.
type CompareCellValue = boolean | string;
type CompareRow = {
  label: string;
  cells: [CompareCellValue, CompareCellValue, CompareCellValue, CompareCellValue];
};

const COMPARE: Record<string, CompareRow[]> = {
  ai: [
    { label: "AI agents / automations", cells: ["1 chatbot", "Up to 3", "Unlimited (multi-agent)", "Bespoke"] },
    { label: "Website / WhatsApp channels", cells: [true, true, true, true] },
    { label: "24/7 FAQ answering", cells: [true, true, true, true] },
    { label: "Lead capture & qualification", cells: [true, true, true, true] },
    { label: "Trained on your data", cells: ["Business info & FAQs", "Docs, site & data", "Full knowledge base (RAG)", "Bespoke"] },
    { label: "CRM / Sheets / API integration", cells: [false, true, true, true] },
    { label: "Multi-step workflows", cells: [false, true, true, true] },
    { label: "Smart hand-off to a human", cells: [false, true, true, true] },
    { label: "Analytics & logs", cells: ["Simple dashboard", "Logs & analytics", "Live dashboards & monitoring", true] },
    { label: "Voice + multilingual support", cells: [false, false, true, true] },
    { label: "Model fine-tuning", cells: [false, false, true, true] },
    { label: "Role-based access & guardrails", cells: [false, false, true, true] },
    { label: "Back-office automation", cells: [false, false, true, true] },
    { label: "Support", cells: ["2 weeks", "30 days", "60 days priority", "Priority SLAs"] },
  ],
  ecommerce: [
    { label: "Products", cells: ["Up to 25", "Unlimited", "Unlimited", "Bespoke"] },
    { label: "Platform", cells: ["Launch-ready store", "Shopify / headless", "Fully custom app", "Bespoke"] },
    { label: "Payments (cards, wallets & UPI)", cells: [true, true, true, true] },
    { label: "Mobile-first & fast", cells: [true, true, true, true] },
    { label: "Tax-ready invoices", cells: [true, true, true, true] },
    { label: "Tracking & analytics", cells: ["Google / Meta pixel", "Full SEO + analytics", "Advanced + A/B testing", true] },
    { label: "Shipping & logistics integrations", cells: [false, true, true, true] },
    { label: "Coupons, reviews & abandoned-cart", cells: [false, true, true, true] },
    { label: "WhatsApp order updates", cells: [false, true, true, true] },
    { label: "Subscriptions / B2B / multi-vendor", cells: [false, false, true, true] },
    { label: "ERP / inventory / accounting", cells: [false, false, true, true] },
    { label: "Loyalty, referrals & personalisation", cells: [false, false, true, true] },
    { label: "Tuned for high traffic", cells: [false, false, true, true] },
    { label: "Support", cells: ["2 weeks", "30 days", "90 days priority", "Priority SLAs"] },
  ],
  "web-dev": [
    { label: "Scope", cells: ["Up to 5 pages", "Multi-page site / app", "Complex web app", "Bespoke"] },
    { label: "Built on Next.js / React", cells: [true, true, true, true] },
    { label: "Mobile-first & responsive", cells: [true, true, true, true] },
    { label: "On-page SEO", cells: ["Foundation", "Full SEO + analytics", true, true] },
    { label: "CMS (edit it yourself)", cells: [false, true, true, true] },
    { label: "Scroll & hover animations", cells: [false, true, true, true] },
    { label: "Core Web Vitals optimised", cells: ["Fast & Google-friendly", true, true, true] },
    { label: "Lead forms & integrations", cells: ["Contact + WhatsApp", true, true, true] },
    { label: "Auth, dashboards & admin", cells: [false, false, true, true] },
    { label: "Payment / third-party APIs", cells: [false, false, true, true] },
    { label: "Automated testing & monitoring", cells: [false, false, true, true] },
    { label: "CI/CD & scalable architecture", cells: [false, false, true, true] },
    { label: "Support", cells: ["2 weeks", "30 days", "60 days priority", "Priority SLAs"] },
  ],
  "mobile-dev": [
    { label: "Scope", cells: ["Up to 5 screens", "Full app", "Complex native app", "Bespoke"] },
    { label: "Android & iOS", cells: [true, true, true, true] },
    { label: "React Native / Flutter", cells: [true, true, true, true] },
    { label: "Push notifications", cells: [true, true, true, true] },
    { label: "Store submission", cells: ["Submission help", "Both stores", "Store optimisation", true] },
    { label: "Auth, profiles & onboarding", cells: [false, true, true, true] },
    { label: "Offline & local storage", cells: [false, true, true, true] },
    { label: "Payments / subscriptions", cells: [false, true, true, true] },
    { label: "Analytics & crash reporting", cells: [false, true, true, true] },
    { label: "Backend / API integration", cells: ["1 API / backend", true, "Scalable backend", true] },
    { label: "Real-time (chat / live data)", cells: [false, false, true, true] },
    { label: "Maps, media, camera & device APIs", cells: [false, false, true, true] },
    { label: "Automated testing & CI/CD", cells: [false, false, true, true] },
    { label: "Support", cells: ["2 weeks", "30 days", "60 days priority", "Priority SLAs"] },
  ],
  web3: [
    { label: "Smart contracts", cells: ["1 contract", "Full suite", "Token / NFT ecosystem", "Bespoke"] },
    { label: "Security", cells: ["Internal audit", "Internal security checks", "Independent 3rd-party audit", true] },
    { label: "dApp front-end + wallet login", cells: [true, true, true, true] },
    { label: "Gas-optimised code", cells: [true, true, true, true] },
    { label: "Deployment", cells: ["Testnet", "Mainnet + verified", "Mainnet, multi-chain ready", true] },
    { label: "Etherscan verification", cells: [true, true, true, true] },
    { label: "Subgraph / indexing", cells: [false, true, true, true] },
    { label: "Admin controls & upgrade safety", cells: [false, true, true, true] },
    { label: "Staking / vesting / DeFi logic", cells: [false, false, true, true] },
    { label: "On-chain analytics dashboard", cells: [false, false, true, true] },
    { label: "Whitepaper / tokenomics support", cells: [false, false, true, true] },
    { label: "Launch & liquidity guidance", cells: [false, false, true, true] },
    { label: "Support", cells: ["2 weeks", "30 days", "60 days priority", "Priority SLAs"] },
  ],
  brand: [
    { label: "Logo & wordmark", cells: [true, true, "Logo system + motion", "Bespoke"] },
    { label: "Colour & typography system", cells: [true, true, true, true] },
    { label: "Brand guidelines", cells: ["Mini guide (PDF)", "Full guidelines book", "Complete + strategy", true] },
    { label: "All editable source files", cells: [true, true, true, true] },
    { label: "Stationery & social kit", cells: ["Profile kit + cards", true, "Marketing & pitch templates", true] },
    { label: "Brand positioning & strategy", cells: [false, true, true, true] },
    { label: "Icon set & graphic elements", cells: [false, true, true, true] },
    { label: "Art direction & moodboards", cells: [false, true, true, true] },
    { label: "Messaging, tagline & tone", cells: [false, false, true, true] },
    { label: "Motion & packaging", cells: [false, false, true, true] },
    { label: "Photography / art-direction guide", cells: [false, false, true, true] },
    { label: "Dedicated senior designer", cells: [false, false, true, true] },
    { label: "Revision rounds", cells: ["2", "3", "Unlimited (in scope)", "Bespoke"] },
  ],
  marketing: [
    { label: "SEO + GEO", cells: ["Foundation & audit", "Full growth program", true, "Bespoke"] },
    { label: "Content / posts", cells: ["8 posts/reels per month", "Blogs + social engine", "Content + video & creative", true] },
    { label: "Keyword & competitor research", cells: [true, true, true, true] },
    { label: "Paid ads management", cells: [false, "1 channel (Google/Meta)", "Multi-channel, fully managed", true] },
    { label: "Landing pages & CRO", cells: [false, "Conversion landing pages", "CRO + A/B experiments", true] },
    { label: "Email / WhatsApp campaigns", cells: [false, true, "Automation funnels", true] },
    { label: "Influencer / collab coordination", cells: [false, false, true, true] },
    { label: "Reporting", cells: ["Monthly report", "Bi-weekly", "Advanced dashboard", true] },
    { label: "Strategy calls", cells: ["Dedicated POC", "Monthly call", "Weekly calls", "Bespoke"] },
    { label: "Team on your account", cells: ["Point of contact", "Account manager", "Senior growth team", "Bespoke"] },
    { label: "Lock-in", cells: ["No lock-in", "Flexible", "Flexible", "Flexible"] },
  ],
};

// Perks every Fethron engagement layers on — appended to the foot of each comparison.
const COMMON_ROWS: CompareRow[] = [
  { label: "Free basic hosting & servers", cells: [false, true, true, true] },
  { label: "Free LLM usage (basic quota)", cells: ["Basic", "Standard", "Generous", "Bespoke"] },
  { label: "Premium support after launch", cells: [false, true, true, true] },
  { label: "Dedicated project manager", cells: [false, false, true, true] },
  { label: "Full source-code ownership", cells: [true, true, true, true] },
];

// Each tier (column) carries its own accent — Essential → Premium → Custom.
const TIER_THEME: Record<string, { hex: string; rgb: string }> = {
  Essential: { hex: "#3B82F6", rgb: "59,130,246" }, // blue
  Standard: { hex: "#F59E0B", rgb: "245,158,11" }, // amber (popular)
  Premium: { hex: "#8B5CF6", rgb: "139,92,246" }, // violet
  Custom: { hex: "#10B981", rgb: "16,185,129" }, // emerald
};
const tierTheme = (name: string) => TIER_THEME[name] ?? TIER_THEME.Essential;

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

function TierCard({ tier, currency }: { tier: Tier; currency: Currency }) {
  const base = priceToNumber(tier.price);
  const showSale = base != null && !tier.contact && !tier.noDiscount;
  const bigPrice = base == null ? tier.price : formatMoney(showSale ? base / 2 : base, currency);
  const origPrice = showSale && base != null ? formatMoney(base, currency) : null;
  const { hex, rgb } = tierTheme(tier.name);
  return (
    <div
      className="group relative flex flex-col rounded-3xl border border-white/10 p-6 transition-all duration-300 ease-out will-change-transform hover:-translate-y-3 hover:scale-[1.025] hover:shadow-[0_40px_95px_-34px_rgba(0,0,0,0.98)]"
      style={{
        borderColor: tier.popular ? `rgba(${rgb},0.45)` : undefined,
        boxShadow: tier.popular ? `0 0 80px -34px rgba(${rgb},0.55)` : undefined,
        background: tier.popular
          ? "linear-gradient(180deg, #161018 0%, #0b0a0c 60%)"
          : "linear-gradient(180deg, #141119 0%, #0a0a0d 60%)",
      }}
    >
      {/* tier-coloured outline that lights up on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1.5px rgba(${rgb},0.8), 0 30px 90px -32px rgba(${rgb},0.6)` }}
        aria-hidden="true"
      />

      {/* texture + tier glow, clipped to the card shape */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-28"
          style={{ background: `radial-gradient(75% 100% at 50% 0%, rgba(${rgb},0.16), transparent 70%)` }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: NOISE, opacity: 0.55 }} />
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle, rgba(${rgb},0.42), transparent 70%)` }}
        />
      </div>

      {tier.popular && (
        <span
          className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
          style={{ background: hex, boxShadow: `0 4px 14px -5px rgba(${rgb},0.7)` }}
        >
          Most Popular
        </span>
      )}

      <div className="relative flex flex-col">
        <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: hex }}>
          {tier.name}
        </p>

        <div className="mt-3 border-b border-white/10 pb-5">
          {origPrice && (
            <div className="mb-2 flex items-center gap-2.5">
              <span className="relative inline-block text-[15px] text-off-white/55">
                {origPrice}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 w-full"
                  style={{
                    height: "1.5px",
                    background: `rgba(${rgb},0.9)`,
                    transform: "translateY(-50%) rotate(-4deg)",
                  }}
                />
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: hex, boxShadow: `0 2px 10px -3px rgba(${rgb},0.7)` }}
              >
                50% OFF
              </span>
            </div>
          )}
          <div className="flex items-end gap-2">
            <span className={"font-display text-off-white " + (tier.contact ? "text-2xl" : "text-3xl")}>
              {bigPrice}
            </span>
            {tier.unit && (
              <span className="pb-1 text-[11px] uppercase tracking-[0.14em] text-off-white/70">
                {tier.unit}
              </span>
            )}
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13px] font-medium leading-snug text-off-white">
              <span className="mt-0.5 shrink-0" style={{ color: hex }}>
                <Check />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/submit"
          className={
            "mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-[12px] font-bold uppercase tracking-[0.18em] transition hover:brightness-110 " +
            (tier.popular ? "text-white" : "border text-off-white")
          }
          style={tier.popular ? { background: hex } : { borderColor: `rgba(${rgb},0.45)` }}
        >
          {tier.contact ? "Contact us" : "Get started"}
        </Link>
      </div>
    </div>
  );
}

function CompareIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 8h13M7 8 4 5M7 8l-3 3M17 16H4M17 16l3-3M17 16l3 3" />
    </svg>
  );
}

function CompareCell({ value, color }: { value: CompareCellValue; color: string }) {
  if (value === true)
    return (
      <span style={{ color }}>
        <Check />
      </span>
    );
  if (value === false)
    return (
      <span className="text-off-white/25" aria-hidden="true">
        –
      </span>
    );
  return <span className="text-[12px] leading-snug text-off-white/85">{value}</span>;
}

function CompareModal({
  plans,
  active,
  setActive,
  onClose,
  reduce,
  currency,
}: {
  plans: Plan[];
  active: number;
  setActive: (i: number) => void;
  onClose: () => void;
  reduce: boolean | null;
  currency: Currency;
}) {
  const plan = plans[active];

  // close on Esc + lock background scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comparison"
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Compare ${plan.name} plans`}
        className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/12 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        style={{ background: "linear-gradient(180deg, #141019 0%, #0a0a0d 70%)" }}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {/* header — compact: name + close only */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-2.5 sm:px-7">
          <p className="flex items-baseline gap-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
              Compare
            </span>
            <span className="font-display text-lg text-off-white">{plan.name}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-off-white/70 transition-colors hover:text-off-white"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* project switcher — compact */}
        <div className="flex flex-wrap gap-1.5 border-b border-white/10 px-5 py-2 sm:px-7">
          {plans.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors " +
                  (isActive
                    ? "border-accent/60 bg-accent/15 text-accent"
                    : "border-white/12 text-off-white/75 hover:border-white/30 hover:text-off-white")
                }
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* body: feature-by-feature comparison matrix */}
        <div className="min-h-0 flex-1 overflow-auto px-3 py-4 sm:px-5">
          <div
            className="grid min-w-170 text-left"
            style={{ gridTemplateColumns: "minmax(150px,1.25fr) repeat(4, minmax(116px,1fr))" }}
          >
            {/* ── sticky header row: tier name + price only ── */}
            <div className="sticky left-0 top-0 z-30 border-b border-white/10 bg-[#120d17] px-3 py-2.5" />
            {plan.tiers.map((tier) => {
              const base = priceToNumber(tier.price);
              const showSale = base != null && !tier.contact && !tier.noDiscount;
              const big = base == null ? tier.price : formatMoney(showSale ? base / 2 : base, currency);
              const tt = tierTheme(tier.name);
              return (
                <div
                  key={tier.name}
                  className="sticky top-0 z-10 border-b border-white/10 px-2 py-2.5 text-center"
                  style={{ background: `linear-gradient(rgba(${tt.rgb},0.14), rgba(${tt.rgb},0.14)), #120d17` }}
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: tt.hex }}>
                    {tier.name}
                  </p>
                  <p className="mt-0.5 font-display text-base text-off-white sm:text-lg">{big}</p>
                </div>
              );
            })}

            {/* ── feature rows (+ the perks every engagement layers on) ── */}
            {[...(COMPARE[plan.key] ?? []), ...COMMON_ROWS].map((row) => (
              <Fragment key={row.label}>
                <div className="sticky left-0 z-20 flex items-center border-b border-white/6 bg-[#120d17] px-3 py-2 text-[12px] font-medium leading-snug text-off-white">
                  {row.label}
                </div>
                {row.cells.map((c, ci) => {
                  const tt = tierTheme(plan.tiers[ci].name);
                  return (
                    <div
                      key={ci}
                      className="flex items-center justify-center border-b border-white/6 px-2 py-2 text-center"
                      style={{ background: `rgba(${tt.rgb},0.05)` }}
                    >
                      <CompareCell value={c} color={tt.hex} />
                    </div>
                  );
                })}
              </Fragment>
            ))}

            {/* ── CTA row ── */}
            <div className="sticky left-0 z-20 bg-[#120d17] px-3 py-3.5" />
            {plan.tiers.map((tier) => {
              const tt = tierTheme(tier.name);
              return (
                <div key={tier.name} className="px-2 py-3.5" style={{ background: `rgba(${tt.rgb},0.05)` }}>
                  <Link
                    href="/submit"
                    onClick={onClose}
                    className="flex w-full items-center justify-center rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition hover:brightness-110"
                    style={{ background: tt.hex }}
                  >
                    {tier.contact ? "Contact us" : "Get started"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function PricingContent() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const [currCode, setCurrCode] = useState("INR");
  const plan = PLANS[active];

  // Detect the visitor's currency from their locale after mount (avoids hydration
  // mismatch — server always renders INR, the client upgrades it on the next frame).
  useEffect(() => {
    const id = requestAnimationFrame(() => setCurrCode(detectCurrencyCode()));
    return () => cancelAnimationFrame(id);
  }, []);
  const currency = CURRENCIES[currCode] ?? CURRENCIES.INR;

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
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Not sure which to pick? Try our tool"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-foreground shadow-[0_8px_26px_-10px_rgba(239,6,6,0.85)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: "linear-gradient(120deg, #ef0606 0%, #b00808 55%, #7a0606 100%)" }}
            >
              {/* light shimmer sweep across the pill */}
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-1/2"
                  style={{ background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)" }}
                  initial={{ x: "-160%" }}
                  animate={{ x: "260%" }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                />
              )}
              <motion.span
                aria-hidden="true"
                className="relative"
                animate={reduce ? undefined : { rotate: [0, -14, 12, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
              >
                <WandIcon />
              </motion.span>
              <span className="relative">Don&apos;t know? Try our tool</span>
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

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_34px_-10px_rgba(245,158,11,0.65)] transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(120deg, #f59e0b 0%, #ef0606 60%, #b00808 100%)" }}
                >
                  <CompareIcon className="transition-transform duration-300 group-hover:rotate-12" />
                  Compare plans in detail
                </button>
              </div>

              <div className="mt-7 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {plan.tiers.map((tier) => (
                  <TierCard key={tier.name} tier={tier} currency={currency} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-off-white/45">
            <span>Prices in</span>
            <select
              value={currCode}
              onChange={(e) => setCurrCode(e.target.value)}
              aria-label="Display currency"
              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-off-white/80 outline-none focus:border-accent/50"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-[#0a0a0d] text-off-white">
                  {c}
                </option>
              ))}
            </select>
            <span>· auto-detected</span>
          </div>
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
            href={LETTER_HREF}
            className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-accent transition-opacity hover:opacity-80"
          >
            Let&apos;s build something enduring
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {compareOpen && (
          <CompareModal
            plans={PLANS}
            active={active}
            setActive={setActive}
            onClose={() => setCompareOpen(false)}
            reduce={reduce}
            currency={currency}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
