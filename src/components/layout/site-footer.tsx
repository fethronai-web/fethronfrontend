"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { SITE } from "@/config/site";
import { BrandMark } from "@/components/ui/brand-mark";
import { selectService } from "@/lib/select-case";

const EASE = [0.16, 1, 0.3, 1] as const;
const PHONE = "+91 93897 29208";
const EMAIL = "fethronai@gmail.com";

// `service` carries the index of the matching card in the Services deck so the
// link can jump straight to it (see selectService).
type LinkItem = { label: string; href: string; service?: number };

const COLUMNS: { heading: string; links: LinkItem[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "AI", href: "#services", service: 0 },
      { label: "E-Commerce", href: "#services", service: 1 },
      { label: "Web Development", href: "#services", service: 2 },
      { label: "Web 3.0", href: "#services", service: 3 },
      { label: "Brand & Identity", href: "#services", service: 4 },
      { label: "Digital Marketing", href: "#services", service: 5 },
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

type Social = { label: string; href: string; icon: string };

const SOCIALS: Social[] = [
  { label: "Instagram", href: "https://www.instagram.com/fethron/", icon: "/icons/instagram.svg" },
  { label: "X", href: "https://x.com/fethronn", icon: "/icons/x.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/fethron-165a20413/", icon: "/icons/linkedin.svg" },
  { label: "Threads", href: "https://www.threads.com/@fethron", icon: "/icons/threads.svg" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590636301168", icon: "/icons/facebook.svg" },
  { label: "Email", href: "mailto:fethronai@gmail.com", icon: "/icons/gmail.svg" },
];

function FooterColumn({ heading, links, rule = true }: { heading: string; links: LinkItem[]; rule?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">{heading}</p>
      {rule && <span className="mt-2 block h-px w-7 bg-accent/40" aria-hidden="true" />}
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.service !== undefined ? (
              <button
                type="button"
                onClick={() => selectService(l.service!)}
                className="cursor-pointer text-left text-sm text-off-white/70 transition-colors hover:text-off-white"
              >
                {l.label}
              </button>
            ) : (
              <Link href={l.href} className="text-sm text-off-white/70 transition-colors hover:text-off-white">
                {l.label}
              </Link>
            )}
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
    <div className="w-full">
      <p className="font-brand text-[clamp(1.1rem,1.35vw,1.9rem)] font-semibold uppercase tracking-[0.3em] text-off-white">{SITE.name}</p>
      <p className="mt-1.5 text-[10px] uppercase tracking-[0.35em] text-swirl/45">Digital Studio</p>
      <p className="mt-5 text-[11px] uppercase leading-[1.9] tracking-[0.15em] text-swirl/45">
        We design and engineer digital experiences that stand the test of time.
      </p>
    </div>
  );
}

function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`} style={{ gap: "18px" }}>
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target={s.href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="cursor-pointer opacity-85 transition-all duration-200 hover:scale-110 hover:opacity-100"
          style={{ display: "inline-flex" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.icon} alt={s.label} style={{ width: "22px", height: "22px" }} className="object-contain" />
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();
  const viewport = { once: false, amount: 0.2 } as const;

  // Smooth "develop" reveal — a soft blur-in + glide rather than a flat fade, so
  // the framed footer materialises instead of blinking on.
  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30, filter: "blur(9px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport,
          transition: { duration: 1, ease: EASE, delay },
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

        {/*
          The content is absolutely positioned in percentages of the frame image
          so every element registers with the temple's baked slots (nameplate box,
          column underlines, laurel, newsletter plate) at ANY viewport width — the
          frame is full-bleed and scales with the page, so a fixed/flex layout would
          drift. Percentages map 1:1 onto the 1535×1024 artwork.
        */}
        <div className="absolute inset-0">
          {/* Headline — centered in the upper temple, above the nameplate box */}
          <motion.div
            {...reveal(0.05)}
            className="absolute inset-x-0 flex flex-col items-center px-[18%] text-center"
            style={{ top: "21%" }}
          >
            <p className="text-[clamp(0.58rem,0.62vw,0.85rem)] font-semibold uppercase tracking-[0.3em] text-accent">
              Premium digital. Built to endure.
            </p>
            <h2 className="font-display mt-[1%] text-[clamp(2.25rem,4.4vw,5.25rem)] font-normal uppercase leading-[1] tracking-[0.04em] text-off-white">
              Build with us
            </h2>
            <p className="mt-[1.1%] max-w-[32%] text-[clamp(0.72rem,0.82vw,1.05rem)] leading-relaxed text-off-white/65">
              Partner with {SITE.name} to craft digital experiences of timeless
              design and uncompromising performance.
            </p>
          </motion.div>

          {/* Start a Project — seated inside the baked nameplate box */}
          <motion.div
            {...reveal(0.14)}
            className="absolute inset-x-0 top-[35.8%] flex h-[4.4%] items-center justify-center"
          >
            <a
              href={`mailto:${SITE.email}`}
              className="text-[clamp(0.66rem,0.76vw,1rem)] font-semibold uppercase tracking-[0.25em] text-off-white transition-colors hover:text-accent"
            >
              Start a Project
            </a>
          </motion.div>

          {/* Brand mark — the "F" seated in the open laurel wreath (centre ≈ 13.2%, 57.3%) */}
          <motion.div
            {...reveal(0.16)}
            className="absolute aspect-square"
            style={{ left: "11.9%", top: "53.2%", width: "3.4%" }}
          >
            <BrandMark variant="red" />
          </motion.div>

          {/* Brand — crest beneath the laurel wreath (centred on the wreath, x≈13%) */}
          <motion.div
            {...reveal(0.18)}
            className="absolute text-center"
            style={{ left: "3%", top: "64.5%", width: "20%" }}
          >
            <BrandBlock />
          </motion.div>

          {/* Link columns — left edges locked to the baked underlines
              (25.6% / 38.5% / 51.5% / 64.3%, pitch ≈ 12.9%) */}
          <motion.div
            {...reveal(0.2)}
            className="absolute grid grid-cols-4"
            style={{ left: "25.6%", top: "51.99%", width: "52%", columnGap: "0.6%" }}
          >
            {COLUMNS.map((c) => (
              <FooterColumn key={c.heading} heading={c.heading} links={c.links} rule={false} />
            ))}
          </motion.div>

          {/* Newsletter heading — sits just above the input plate */}
          <motion.div
            {...reveal(0.22)}
            className="absolute"
            style={{ left: "78%", top: "52%", width: "14.2%" }}
          >
            <p className="text-[clamp(0.58rem,0.6vw,0.8rem)] font-semibold uppercase tracking-[0.22em] text-accent">Stay Inspired</p>
            <p className="mt-3 text-[clamp(0.72rem,0.78vw,0.95rem)] leading-relaxed text-off-white/65">
              Curated thoughts on design, technology, and building digital legacies.
            </p>
          </motion.div>

          {/* Newsletter input — seated in the baked plate (artwork supplies the frame + arrow) */}
          <motion.div
            {...reveal(0.24)}
            className="absolute"
            style={{ left: "78%", top: "61.1%", height: "4.3%", width: "14.8%" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="absolute inset-0 bg-transparent text-[clamp(0.7rem,0.74vw,0.92rem)] text-off-white placeholder:text-off-white/45 focus:outline-none"
              style={{ paddingLeft: "7%", paddingRight: "18%" }}
            />
            <button type="submit" aria-label="Subscribe" className="absolute inset-y-0 right-0" style={{ width: "16%" }} />
          </motion.div>

          {/* Contact + legal — seated in the open strip above the greek-key band */}
          <motion.div
            {...reveal(0.26)}
            className="absolute inset-x-[4%] space-y-[1.2%]"
            style={{ top: "82%" }}
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[clamp(0.58rem,0.62vw,0.8rem)] font-semibold uppercase tracking-[0.24em] text-off-white/70">
                  Let&apos;s build something enduring.
                </p>
                <p className="mt-2.5 flex items-center gap-6 text-[clamp(0.72rem,0.78vw,0.95rem)] text-off-white/60">
                  <a href={`mailto:${EMAIL}`} className="group inline-flex items-center gap-2 transition-colors hover:text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent/80 transition-colors group-hover:text-accent" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2.5" />
                      <path d="m3.5 7 8.5 6 8.5-6" />
                    </svg>
                    {EMAIL}
                  </a>
                  <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="group inline-flex items-center gap-2 transition-colors hover:text-accent">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent/80 transition-colors group-hover:text-accent" aria-hidden="true">
                      <path d="M5 4h3l1.5 4.5L7.5 10a11 11 0 0 0 5 5l1.5-2 4.5 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                    </svg>
                    {PHONE}
                  </a>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[clamp(0.55rem,0.58vw,0.78rem)] font-semibold uppercase tracking-[0.3em] text-off-white/40">Follow us</p>
                <SocialRow className="mt-2 justify-end" />
              </div>
            </div>

            {/* legal — kept inside the frame */}
            <p className="flex items-center justify-center gap-4 border-t border-off-white/10 pt-[0.9%] text-[clamp(0.58rem,0.6vw,0.78rem)] uppercase tracking-[0.18em] text-off-white/35">
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
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.35em] text-swirl/45">Digital Studio</p>
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
