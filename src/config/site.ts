import type { NavLink, ProcessStep, Project, Service, Stat, Testimonial } from "@/types";

export const SITE = {
  name: "Fethron",
  tagline: "We craft digital experiences that feel inevitable.",
  description:
    "A boutique digital agency partnering with ambitious brands on strategy, design, and engineering — from first pixel to production scale.",
  email: "hello@fethron.studio",
  url: "https://fethron.studio",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Insights", href: "#insights" },
];

export const CLIENTS = [
  "Nova Finance",
  "Arc Studios",
  "Helix Health",
  "Orbit Commerce",
  "Vertex Labs",
  "Pulse Media",
  "Meridian",
  "Catalyst",
] as const;

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
    industry: "Digital Agency",
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

export const PROCESS: ProcessStep[] = [
  {
    id: "discover",
    step: "01",
    title: "Discover",
    description: "Deep immersion into your brand, audience, and competitive landscape.",
  },
  {
    id: "define",
    step: "02",
    title: "Define",
    description: "Strategy, information architecture, and a creative direction worth signing off on.",
  },
  {
    id: "design",
    step: "03",
    title: "Design",
    description: "High-fidelity systems tested across mobile, tablet, and desktop before a line of code.",
  },
  {
    id: "deliver",
    step: "04",
    title: "Deliver",
    description: "Engineering, QA on real devices, launch, and ongoing optimization.",
  },
];

export const STATS: Stat[] = [
  { id: "projects", value: "120+", label: "Projects delivered" },
  { id: "clients", value: "48", label: "Global clients" },
  { id: "retention", value: "94%", label: "Retention rate" },
  { id: "awards", value: "18", label: "Design awards" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Fethron operates at a different level. The site they built for us doesn't just look expensive — it performs like it. Our conversion rate speaks for itself.",
    author: "Sarah Chen",
    role: "Chief Marketing Officer",
    company: "Nova Finance",
  },
  {
    id: "t2",
    quote:
      "I've worked with a dozen agencies. Fethron is the only one that treated our codebase like a long-term asset — typed, logged, documented, and beautiful.",
    author: "Marcus Webb",
    role: "VP of Engineering",
    company: "Helix Health",
  },
  {
    id: "t3",
    quote:
      "They understood our brand before we did. Every detail — typography, motion, spacing — feels intentional. Our clients notice immediately.",
    author: "Elena Rossi",
    role: "Founder & Creative Director",
    company: "Arc Studios",
  },
];
