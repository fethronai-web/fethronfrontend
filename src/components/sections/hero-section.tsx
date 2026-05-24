import Image from "next/image";
import Link from "next/link";
import { HeroClouds } from "@/components/sections/hero-clouds";
import { HeroStatue } from "@/components/sections/hero-statue";
import { HeroContent } from "@/components/sections/hero-content";

const PAGE_BACKGROUND = "/images/background.webp";

/** Vertical text rail + scroll cue sitting in the page margin, beside the card. */
function HeroRail() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden lg:block"
      aria-hidden="true"
    >
      <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-5 xl:left-9">
        <span className="h-12 w-px bg-accent" />
        <p className="text-[11px] font-semibold uppercase leading-[2.1] tracking-[0.26em] text-black/80">
          Building
          <br />
          Legacies
          <br />
          Online
        </p>
      </div>

      <div className="absolute bottom-10 left-6 flex items-center gap-3 xl:left-9">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/70">
          Scroll
        </span>
        <span className="relative block h-px w-16 bg-black/25">
          <span className="absolute inset-y-0 left-0 w-6 bg-accent" />
        </span>
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative flex min-h-[32rem] w-full flex-1 flex-col overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,0.65)] sm:rounded-[2rem] lg:rounded-[2.5rem]">
      {/* Card backdrop: parallax clouds + statue cutout */}
      <div className="absolute inset-0" aria-hidden="true">
        <HeroClouds />
        <HeroStatue />
        {/* Legibility washes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />
      </div>

      {/* Play button straddling the left edge */}
      <Link
        href="#work"
        aria-label="Play showreel"
        className="group absolute left-0 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black text-off-white ring-1 ring-off-white/15 transition-transform hover:scale-105 sm:h-16 sm:w-16"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="ml-0.5"
          aria-hidden="true"
        >
          <path d="M3 1.5v13l11-6.5L3 1.5Z" />
        </svg>
      </Link>

      <HeroContent />
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-dvh w-full overflow-hidden bg-[#cfc8c2]"
    >
      {/* Foggy ruins backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={PAGE_BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 110% at 50% 25%, transparent 45%, rgba(0,0,0,0.22) 100%)",
          }}
        />
      </div>

      <HeroRail />

      <div className="relative z-10 flex min-h-dvh flex-col px-4 pb-6 pt-[5.5rem] sm:px-6 sm:pb-7 sm:pt-24 lg:px-10 lg:pb-8 lg:pl-[8.5rem] lg:pt-[6.5rem] xl:px-14 xl:pl-40">
        <HeroCard />
      </div>
    </section>
  );
}
