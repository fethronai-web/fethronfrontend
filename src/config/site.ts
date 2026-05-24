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
    id: "nova",
    title: "Nova Finance",
    category: "Fintech · Platform",
    description:
      "A complete digital transformation — brand, product, and engineering for a Series B fintech redefining wealth management.",
    metrics: "+41% conversion",
    gradient: "from-accent/30 via-black to-black",
    layout: "hero",
    year: "2025",
  },
  {
    id: "arc",
    title: "Arc Studios",
    category: "Creative · Portfolio",
    description: "Immersive showcase with cinematic scroll and sub-second loads.",
    metrics: "98 Lighthouse",
    gradient: "from-black via-accent/20 to-black",
    layout: "wide",
    year: "2024",
  },
  {
    id: "helix",
    title: "Helix Health",
    category: "Healthcare · Portal",
    description: "Patient platform serving 2.1M users with WCAG 2.2 AA compliance.",
    metrics: "2.1M users",
    gradient: "from-swirl/25 via-black to-black",
    layout: "default",
    year: "2024",
  },
  {
    id: "orbit",
    title: "Orbit Commerce",
    category: "E-commerce · Headless",
    description: "Headless storefront that doubled mobile checkout completion.",
    metrics: "+112% revenue",
    gradient: "from-accent/15 via-black to-swirl/10",
    layout: "default",
    year: "2023",
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
