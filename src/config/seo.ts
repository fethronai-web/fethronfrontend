import type { Metadata } from "next";

/**
 * Central SEO source of truth — researched, GLOBAL-intent keywords (no geo-tagging)
 * plus per-page titles/descriptions. "Fethron" is a unique coined brand with no
 * competing entity, so branded terms are ours by default; the real targets are the
 * non-branded, high-intent service keywords below (web/app/AI/web3/brand/growth and
 * the two free agent tools). Titles & descriptions are what actually move rankings
 * and click-through; the `keywords` arrays are a minor secondary signal we still
 * fill out fully. Studio pages canonicalise to fethron.com; the agent owns its own
 * subdomain canonical in its layout.
 */

const STUDIO_ORIGIN = "https://fethron.com";

/** Brand terms — included everywhere so we fully own "Fethron" search, incl. the
 *  "agency" variants people type when they remember the name but not the service. */
export const BRAND_KEYWORDS = [
  "Fethron",
  "Fethron Studio",
  "Fethron AI",
  "Fethron digital studio",
  "Fethron agency",
  "Fethron digital agency",
  "Fethron web development",
  "Fethron AI agency",
];

/**
 * Full-service studio keywords — GLOBAL, non-branded, high-intent, grouped by the
 * seven service lines (web, mobile, e-commerce, AI, Web3, brand, growth) plus the
 * umbrella/discovery terms. Researched against what the leading agencies actually
 * target so we compete on the same phrases people search.
 */
export const STUDIO_KEYWORDS = [
  // Umbrella / discovery
  "digital product studio",
  "software development studio",
  "product design studio",
  "digital agency",
  "UI UX design agency",
  "MVP development for startups",
  "end to end product development",
  "hire developers",
  // Web development
  "web development agency",
  "web design agency",
  "custom web development",
  "web app development company",
  "Next.js development",
  "React development company",
  "SaaS development",
  "landing page design",
  "website redesign services",
  // Mobile development
  "mobile app development company",
  "iOS app development",
  "Android app development",
  "cross-platform app development",
  "React Native development",
  "Flutter app development",
  // E-commerce
  "ecommerce development agency",
  "Shopify development company",
  "Shopify Plus agency",
  "headless commerce development",
  "custom ecommerce development",
  "online store development",
  // AI
  "AI development agency",
  "AI automation agency",
  "AI chatbot development",
  "AI agent development company",
  "custom AI solutions",
  "generative AI development",
  "LLM integration",
  "workflow automation",
  // Web3
  "web3 development company",
  "blockchain development company",
  "smart contract development",
  "dApp development services",
  "NFT marketplace development",
  "DeFi development",
  "Solidity development",
  // Brand & growth
  "branding agency",
  "brand identity design",
  "logo design agency",
  "brand strategy",
  "rebranding services",
  "digital marketing agency",
  "SEO agency",
  "lead generation SEO",
  "conversion rate optimization",
  "content marketing services",
];

/** Agent / tool keywords — a product, not an agency (different audience + intent). */
export const AGENT_KEYWORDS = [
  "free smart contract audit tool",
  "smart contract audit online",
  "solidity security scanner",
  "smart contract vulnerability checker",
  "audit solidity code online",
  "automated smart contract audit",
  "smart contract security check",
  "AI launch plan generator",
  "vision to launch",
  "idea to product plan",
  "AI product planner",
  "startup blueprint generator",
  "free AI business plan generator",
  "AI startup roadmap",
  "Fethron AI agent",
  // Tools shipping this month (June 2026) — prepared for SEO/GEO ahead of launch.
  "resume parser tool",
  "ATS resume checker",
  "ATS score checker",
  "free ATS resume scanner",
  "resume optimization tool",
  "AI project structure generator",
  "codebase folder structure generator",
  "project scaffolding tool",
  "design system recommendation tool",
  "color palette generator for projects",
  "AI legal agent for software development",
  "legal advisor for digital products",
  "tech contract and terms assistant",
];

interface PageSeoInput {
  title: string;
  description: string;
  keywords: readonly string[];
  /** Studio path for canonical + OG url, e.g. "/pricing". Omit for the home page. */
  path?: string;
}

/**
 * Build a page's Metadata: title (templated by the layout unless absolute),
 * description, merged brand+page keywords, canonical, and OpenGraph. Studio-only —
 * the agent layout sets its own subdomain canonical.
 */
export function studioPageMeta({ title, description, keywords, path = "" }: PageSeoInput): Metadata {
  const url = `${STUDIO_ORIGIN}${path}`;
  return {
    title,
    description,
    keywords: [...keywords, ...BRAND_KEYWORDS],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

/** Per-page copy — titles ≤ ~60 chars, descriptions ~150-160 chars. */
export const SEO = {
  home: {
    title: { absolute: "Fethron — Digital Product Studio | Web, App, AI & Web3" },
    description:
      "Fethron is a digital product studio that designs and builds web apps, mobile apps, AI agents, e-commerce, Web3 dApps, branding and growth — from idea to launch.",
    keywords: STUDIO_KEYWORDS,
  },
  pricing: {
    title: "Pricing — Web, App, AI, Web3 & Branding Packages",
    description:
      "Transparent project-based pricing for web & app development, AI agents, e-commerce, Web3, branding and marketing. Clear tiers — currently 50% off one-time projects.",
    keywords: [
      "web development pricing",
      "app development cost",
      "AI agent development cost",
      "smart contract audit cost",
      "website design pricing",
      "ecommerce development cost",
      "branding package pricing",
      "digital marketing packages",
      "software development rates",
      ...STUDIO_KEYWORDS,
    ],
    path: "/pricing",
  },
  submit: {
    title: "Write to Us — Start Your Project",
    description:
      "Tell Fethron about your project. Send a letter and start your build — web, app, AI, Web3, branding or growth. Strategy, design and engineering, built to endure.",
    keywords: [
      "hire Fethron",
      "start a project",
      "web development quote",
      "project inquiry",
      "work with a digital studio",
      "contact web development agency",
    ],
    path: "/submit",
  },
  welcome: {
    title: "Links — Every Way to Reach Fethron",
    description:
      "Every Fethron link in one place: the studio, the AI agent, pricing, our work, and all social channels. Connect with the team.",
    keywords: ["Fethron links", "Fethron social", "contact Fethron"],
    path: "/welcome",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Fethron collects, uses and protects your data across our website, contact forms and AI agent. We do not sell personal data.",
    keywords: ["Fethron privacy policy", "data protection"],
    path: "/privacy",
  },
  terms: {
    title: "Terms & Conditions",
    description:
      "The terms governing Fethron's services, payments, intellectual property, the AI agent, and liability. Please read before working with us.",
    keywords: ["Fethron terms", "terms and conditions", "service agreement"],
    path: "/terms",
  },
  /** Agent landing — used in the agent layout (its own subdomain canonical). */
  agent: {
    title: "Fethron AI — Free Vision-to-Launch Planner & Smart Contract Audit",
    description:
      "Free studio-grade AI tools: turn any idea into a complete launch blueprint, and audit your Solidity smart contracts for vulnerabilities — instant, no signup.",
    keywords: AGENT_KEYWORDS,
  },
} as const;
