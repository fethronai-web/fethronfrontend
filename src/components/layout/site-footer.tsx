"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SITE } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const PHONE = "+1 (312) 888-1224"; // placeholder — swap for your real number

type LinkItem = { label: string; href: string };

const COLUMNS: { heading: string; links: LinkItem[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Brand Strategy", href: "#services" },
      { label: "Web Design", href: "#services" },
      { label: "Web Development", href: "#services" },
      { label: "E-Commerce", href: "#services" },
      { label: "Digital Experience", href: "#services" },
      { label: "Performance & SEO", href: "#services" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Featured Projects", href: "#work" },
      { label: "Case Studies", href: "#work" },
      { label: "Industries", href: "#work" },
      { label: "View All Work", href: "#work" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Fethron", href: "#about" },
      { label: "Our Approach", href: "#process" },
      { label: "Careers", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Contact", href: `mailto:${SITE.email}` },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "#" },
      { label: "Guides", href: "#" },
      { label: "FAQs", href: "#" },
      { label: "Tech Stack", href: "#" },
      { label: "Resource Library", href: "#" },
    ],
  },
];

const SOCIALS: LinkItem[] = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

function FooterColumn({ heading, links }: { heading: string; links: LinkItem[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{heading}</p>
      <span className="mt-2 block h-px w-7 bg-accent/40" aria-hidden="true" />
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-off-white/70 transition-colors hover:text-off-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Newsletter() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Stay Inspired</p>
      <span className="mt-2 block h-px w-7 bg-accent/40" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-off-white/65">
        Curated thoughts on design, technology, and building digital legacies.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-off-white/15 bg-black/40 px-3 py-2 focus-within:border-accent/50">
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent text-sm text-off-white placeholder:text-off-white/40 focus:outline-none"
        />
        <button type="button" aria-label="Subscribe" className="shrink-0 text-accent transition-transform hover:translate-x-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h13M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Cta() {
  return (
    <div className="text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        Premium digital. Built to endure.
      </p>
      <h2 className="font-display mt-3 text-[clamp(2.5rem,5vw,4.5rem)] font-normal uppercase leading-[1] tracking-[0.04em] text-off-white">
        Build with us
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-off-white/65 sm:text-base">
        Partner with {SITE.name} to craft digital experiences of timeless design and uncompromising performance.
      </p>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-6 inline-block px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.25em] text-off-white transition-colors hover:text-accent"
      >
        Start a Project
      </a>
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="max-w-[15rem] pt-16">
      <p className="font-brand text-2xl font-semibold uppercase tracking-[0.3em] text-off-white">{SITE.name}</p>
      <p className="mt-1.5 text-[10px] uppercase tracking-[0.35em] text-swirl/45">Digital Agency</p>
      <p className="mt-5 text-[11px] uppercase leading-[1.9] tracking-[0.15em] text-swirl/45">
        We design and engineer digital experiences that stand the test of time.
      </p>
    </div>
  );
}

function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-sm uppercase tracking-[0.14em] text-off-white/70 ${className}`}>
      {SOCIALS.map((s, i) => (
        <span key={s.label} className="flex items-center gap-3">
          {i > 0 && <span className="text-swirl/30" aria-hidden="true">/</span>}
          <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
            {s.label}
          </a>
        </span>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();
  const viewport = { once: false, amount: 0.2 } as const;

  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport,
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <footer className="relative bg-black">
      {/* ---------- desktop: framed temple footer ---------- */}
      <motion.div
        className="relative -mt-12 hidden w-full xl:block 2xl:-mt-24"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.05 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <Image
          src="/images/footer.png"
          alt=""
          width={1535}
          height={1024}
          sizes="100vw"
          className="block h-auto w-full select-none"
        />

        <div className="absolute inset-0 flex flex-col justify-between px-[7%] pb-[2.5%] pt-[9.5%]">
          <motion.div {...reveal(0.05)}>
            <Cta />
          </motion.div>

          <motion.div {...reveal(0.15)} className="flex items-start justify-between gap-8">
            <BrandBlock />
            {COLUMNS.map((c) => (
              <FooterColumn key={c.heading} heading={c.heading} links={c.links} />
            ))}
            <div className="w-60">
              <Newsletter />
            </div>
          </motion.div>

          <motion.div {...reveal(0.25)} className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-off-white/70">
                  Let&apos;s build something enduring.
                </p>
                <p className="mt-2 flex items-center gap-5 text-sm text-off-white/60">
                  <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">{SITE.email}</a>
                  <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-accent">{PHONE}</a>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-off-white/40">Follow us</p>
                <SocialRow className="mt-2 justify-end" />
              </div>
            </div>

            {/* legal — kept inside the frame */}
            <p className="flex items-center justify-center gap-4 border-t border-off-white/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-off-white/35">
              <span>© {year} {SITE.name}. All rights reserved.</span>
              <Link href="#" className="transition-colors hover:text-off-white/60">Privacy Policy</Link>
              <Link href="#" className="transition-colors hover:text-off-white/60">Terms &amp; Conditions</Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ---------- mobile / tablet: clean stacked footer ---------- */}
      <div className="relative overflow-hidden border-t border-off-white/10 xl:hidden">
        <Image src="/images/footer.png" alt="" fill sizes="100vw" className="object-cover object-top opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-black/70" aria-hidden="true" />

        <motion.div
          className="relative z-10 mx-auto w-full max-w-2xl px-5 py-16"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Cta />

          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <FooterColumn key={c.heading} heading={c.heading} links={c.links} />
            ))}
            <div className="col-span-2 sm:col-span-3">
              <Newsletter />
            </div>
          </div>

          <div className="mt-14 border-t border-off-white/10 pt-8">
            <p className="font-brand text-xl font-semibold uppercase tracking-[0.3em] text-off-white">{SITE.name}</p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.35em] text-swirl/45">Digital Agency</p>
            <p className="mt-5 flex flex-col gap-2 text-sm text-off-white/60">
              <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
              <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="hover:text-accent">{PHONE}</a>
            </p>
            <SocialRow className="mt-5 flex-wrap text-xs" />
            <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-off-white/35">
              © {year} {SITE.name}. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
