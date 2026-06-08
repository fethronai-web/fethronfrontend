import type { NavLink, Project, Service } from "@/types";

export const SITE = {
  name: "Fethron",
  tagline: "We craft digital experiences that feel inevitable.",
  description:
    "A boutique Studio partnering with ambitious brands on strategy, design, and engineering — from first pixel to production scale.",
  email: "hello@fethron.studio",
  url: "https://fethron.studio",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Insights", href: "#insights" },
];

export const SERVICES: Service[] = [
  {
    id: "strategy",
    title: "Brand Strategy",
    description:
      "Positioning, narrative architecture, and market clarity — the foundation every premium experience is built on.",
    icon: "strategy",
  },
  {
    id: "design",
    title: "Experience Design",
    description:
      "Visual systems, interaction design, and design languages that feel bespoke at every breakpoint.",
    icon: "design",
  },
  {
    id: "development",
    title: "Engineering",
    description:
      "Production-grade TypeScript builds. Performance budgets, structured observability, zero compromise.",
    icon: "development",
  },
  {
    id: "growth",
    title: "Growth",
    description:
      "SEO, analytics, and conversion optimization woven into the product — not bolted on after launch.",
    icon: "growth",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "omenly",
    title: "Omenly",
    category: "AI · Oracle Engine",
    description:
      "A decentralised oracle engine that validates market integrity and resolves prediction markets through multi-agent, Byzantine fault-tolerant consensus — with cross-chain data verification and immutable on-chain audit trails. We designed and built the brand, product, and interface end to end.",
    image: "/images/omenly.webp",
    url: "omenly.xyz",
    tagline: "The trustless oracle layer for prediction markets.",
    industry: "Prediction Markets",
    services: "AI, Web 3.0, Web Design",
    duration: "9 Weeks",
    role: "Strategy, Design, Build",
    quote: "Trust is not claimed — it is verified.",
    year: "2025",
  },
  {
    id: "telshi",
    title: "Telshi",
    category: "Web 3.0 · Prediction Market",
    description:
      "A decentralised prediction market on the Base blockchain — create and trade on the outcome of real-world events, from sports to politics, with transparent resolution verified on-chain by the Omenly oracle. A fast, wallet-native trading experience, live on testnet.",
    image: "/images/telshi.webp",
    url: "telshi.com",
    tagline: "Trade the outcome of anything.",
    industry: "Prediction Markets",
    services: "Web 3.0, Product, Web Design",
    duration: "14 Weeks",
    role: "Strategy, Design, Build",
    quote: "The crowd is the oracle.",
    year: "2025",
  },
  {
    id: "fethron",
    title: "Fethron",
    category: "Web Design & Development",
    description:
      "Our own digital home — a classical, monument-inspired experience built to endure. Cinematic motion, a bespoke preloader, custom-cut imagery, and meticulous performance across every device, from first pixel to production scale.",
    image: "/images/fethron.webp",
    url: "fethron.studio",
    tagline: "Digital Monuments.",
    industry: "Digital Studio",
    services: "Branding, Web Design, Development, Motion",
    duration: "Ongoing",
    role: "Strategy, Design, Development",
    quote: "We forged our own monument first.",
    year: "2025",
  },
  {
    id: "tripmates",
    title: "Tripmates",
    category: "E-Commerce · Travel",
    description:
      "A travel discovery and booking platform — plan trips with friends, explore destinations, and book the whole journey end to end. A vivid, immersive storefront engineered for wanderlust and conversion.",
    image: "/images/tripmates.webp",
    url: "tripmates.com",
    tagline: "Explore with mates.",
    industry: "Travel & Tourism",
    services: "E-Commerce, Web Design, Development",
    duration: "8 Weeks",
    role: "Strategy, Design, Build",
    quote: "Wander together.",
    year: "2025",
  },
  {
    id: "vanta",
    title: "Vanta",
    category: "Brand & Identity",
    description:
      "A complete identity system for a luxury label — a refined monogram, blacked-out stationery with crimson foil and a hand-pressed wax seal, a disciplined palette, and typography built to feel timeless at every touchpoint.",
    image: "/images/vanta.webp",
    url: "vanta.design",
    tagline: "Identity, built to endure.",
    industry: "Luxury Goods",
    services: "Brand Strategy, Identity, Art Direction",
    duration: "5 Weeks",
    role: "Strategy, Design",
    quote: "An identity is a promise kept at every touch.",
    year: "2025",
  },
  {
    id: "kleos",
    title: "Kleos",
    category: "Digital Marketing",
    description:
      "A performance-driven growth campaign — strategic ad creative, conversion-focused landing pages, and analytics woven into one engine that turned attention into measurable, compounding revenue.",
    image: "/images/kleos.webp",
    url: "kleos.studio",
    tagline: "Growth isn't luck. It's strategy.",
    industry: "Growth Marketing",
    services: "SEO, Paid Media, Analytics, Content",
    duration: "Ongoing",
    role: "Strategy, Campaign, Growth",
    quote: "Attention is earned, then compounded.",
    year: "2025",
  },
];

