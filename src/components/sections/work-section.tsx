"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { PROJECTS } from "@/config/site";

type Project = (typeof PROJECTS)[number];

/* -------------------------------- icons ---------------------------------- */

function Svg({ children, viewBox, className }: { children: ReactNode; viewBox: string; className?: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 24 24" className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Svg>
  );
}

function ColumnLogo({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 60" className={className}>
      <path d="M10 16c0-6 6-10 14-10s14 4 14 10" />
      <circle cx="14" cy="14" r="3.4" />
      <circle cx="34" cy="14" r="3.4" />
      <path d="M9 18h30" />
      <path d="M15 21V48M24 21V48M33 21V48" />
      <path d="M11 48h26M7 54h34" />
    </Svg>
  );
}

function TempleIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 28 26" className={className}>
      <path d="M3 9 14 3l11 6Z" />
      <path d="M3 11h22" />
      <path d="M6 13v8M11 13v8M17 13v8M22 13v8" />
      <path d="M4 21h20" />
    </Svg>
  );
}

function LaurelIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 28 28" className={className}>
      <path d="M14 25C6 22 4 12 9 5" />
      <path d="M14 25c8-3 10-13 5-20" />
      <path d="M8.5 11l-3-1M10.5 8l-3-2M10.5 16l-3 0M19.5 11l3-1M17.5 8l3-2M17.5 16l3 0" />
    </Svg>
  );
}

function ColumnIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 24 28" className={className}>
      <path d="M6 7h12M7 7q5-4 10 0" />
      <path d="M8 9v13M12 9v13M16 9v13" />
      <path d="M6 22h12M4 25h16" />
    </Svg>
  );
}

function HelmetIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 28 28" className={className}>
      <path d="M7 24V14c0-6 3-9 7-9s7 3 7 9v10" />
      <path d="M7 16h8" />
      <path d="M14 5c2-4 8-3 8 2 0 2-2 4-4 5" />
    </Svg>
  );
}

/* ------------------------------- left list ------------------------------- */

function CaseList({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex flex-col">
      {/* brand */}
      <div className="flex flex-col items-start">
        <ColumnLogo className="h-12 w-10 text-gold/75" />
        <span className="font-brand mt-4 text-xl font-semibold uppercase tracking-[0.3em] text-off-white">
          Fethron
        </span>
        <span className="mt-1.5 text-[10px] uppercase tracking-[0.35em] text-swirl/45">
          Digital Agency
        </span>
      </div>

      <p className="ui-label mt-10 text-off-white/40">Case Study Archive</p>

      <ul className="relative mt-5">
        {/* connector line */}
        <span
          className="absolute left-[3px] top-4 bottom-4 w-px bg-white/10"
          aria-hidden="true"
        />
        {PROJECTS.map((project, i) => {
          const isActive = i === active;
          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`group relative flex w-full items-center gap-4 border-b py-4 pl-7 text-left transition-colors ${
                  isActive ? "border-accent/60" : "border-white/8 hover:border-white/20"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-colors ${
                    isActive ? "bg-accent" : "bg-white/25"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`font-display text-sm tabular-nums transition-colors ${
                    isActive ? "text-accent" : "text-off-white/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-col">
                  <span
                    className={`font-display text-lg leading-tight tracking-wide transition-colors sm:text-xl ${
                      isActive ? "text-accent" : "text-off-white group-hover:text-off-white"
                    }`}
                  >
                    {project.title}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-swirl/45">
                    {project.category}
                  </span>
                </span>
                <ArrowRight
                  className={`ml-auto h-4 w-4 transition-all ${
                    isActive
                      ? "text-accent"
                      : "text-off-white/25 group-hover:translate-x-0.5 group-hover:text-off-white/50"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <Link
        href="#contact"
        className="ui-label group mt-9 inline-flex items-center gap-3 text-off-white/55 transition-colors hover:text-accent"
      >
        View All Projects
        <span className="h-px w-8 bg-current transition-all group-hover:w-12" />
      </Link>
    </div>
  );
}

/* ------------------------------ meta + detail ---------------------------- */

function MetaItem({
  icon,
  label,
  value,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 p-5 ${className}`}>
      <span className="text-gold/65">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-off-white/40">
          {label}
        </p>
        <p className="mt-1 text-sm leading-snug text-off-white/85">{value}</p>
      </div>
    </div>
  );
}

function Detail({ project }: { project: Project }) {
  return (
    <div className="flex flex-col">
      <p className="ui-label text-accent">Featured Case Study</p>

      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="font-display mt-4 text-[clamp(2.75rem,5.5vw,5rem)] font-normal leading-[0.95] tracking-[-0.01em] text-off-white">
          {project.title}
        </h2>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-off-white/60 sm:text-base">
          {project.category}
        </p>
        <div className="mt-4 h-px w-12 bg-accent" aria-hidden="true" />

        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-swirl/70">
          {project.description}
        </p>

        {/* meta grid */}
        <div className="mt-9 grid max-w-lg grid-cols-2 border-t border-white/10">
          <MetaItem
            icon={<TempleIcon className="h-6 w-6" />}
            label="Industry"
            value={project.industry}
            className="border-b border-r border-white/10"
          />
          <MetaItem
            icon={<LaurelIcon className="h-6 w-6" />}
            label="Services"
            value={project.services}
            className="border-b border-white/10"
          />
          <MetaItem
            icon={<ColumnIcon className="h-6 w-6" />}
            label="Duration"
            value={project.duration}
            className="border-r border-white/10"
          />
          <MetaItem
            icon={<HelmetIcon className="h-6 w-6" />}
            label="Role"
            value={project.role}
          />
        </div>

        {/* quote */}
        <div className="mt-9 flex gap-4">
          <span className="font-display text-5xl leading-[0.7] text-accent" aria-hidden="true">
            &ldquo;
          </span>
          <div>
            <p className="font-display text-lg italic leading-snug text-off-white/85 sm:text-xl">
              {project.quote}
            </p>
            <p className="ui-label mt-2 text-accent">{project.title}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------- mockup --------------------------------- */

function Mockup({ project, tilt }: { project: Project; tilt: boolean }) {
  return (
    <div className="relative" style={{ perspective: "2000px" }}>
      <div
        style={
          tilt
            ? { transform: "rotateY(-12deg) rotateX(3deg)", transformStyle: "preserve-3d" }
            : undefined
        }
      >
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-hidden rounded-xl border border-white/12 bg-[#0b0b0e] shadow-[0_45px_120px_-35px_rgba(0,0,0,0.95)]"
        >
          {/* browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="ml-3 rounded bg-white/5 px-3 py-1 text-[10px] tracking-wide text-off-white/40">
              {project.url ?? `${project.id}.io`}
            </span>
          </div>
          {/* live screenshot — 16:9 to match the captures exactly (no crop) */}
          <div className="relative aspect-video">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------- content --------------------------------- */

function WorkContent({
  active,
  project,
  isDesktop,
  onSelect,
}: {
  active: number;
  project: Project;
  isDesktop: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid gap-10 xl:grid-cols-[18rem_1fr] xl:gap-10">
      <CaseList active={active} onSelect={onSelect} />
      <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center xl:gap-8">
        <Detail project={project} />
        <Mockup project={project} tilt={isDesktop} />
      </div>
    </div>
  );
}

/* ------------------------------- section --------------------------------- */

export function WorkSection() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const project = PROJECTS[active];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="work" className="relative overflow-hidden bg-black">
      {/* mobile / mid-width: simple cover backdrop */}
      <Image
        src="/images/ourwork.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center xl:hidden"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black/45 xl:hidden"
        aria-hidden="true"
      />

      {/* desktop: full framed canvas — the entire backdrop (border, columns,
          frieze) stays visible; content is overlaid inside the frame. Gated at
          xl (1280px) so the fixed-ratio frame has room; below that the content
          flows normally and never overflows the frame. */}
      <div className="relative hidden w-full xl:block">
        <Image
          src="/images/ourwork.webp"
          alt=""
          width={1672}
          height={941}
          sizes="100vw"
          className="block h-auto w-full select-none"
        />
        {/* light wash for legibility — subtle so the frame + columns stay visible */}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/45 via-transparent to-transparent"
          aria-hidden="true"
        />
        {/* vertical right text */}
        <span
          className="pointer-events-none absolute right-[2.5%] top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.32em] text-off-white/40 [writing-mode:vertical-rl]"
          aria-hidden="true"
        >
          We Craft Digital Legacies
        </span>
        {/* content overlaid inside the frame */}
        <div className="absolute inset-0 flex items-center px-[4.5%] py-[5%]">
          <div className="w-full">
            <WorkContent
              active={active}
              project={project}
              isDesktop={isDesktop}
              onSelect={setActive}
            />
          </div>
        </div>
      </div>

      {/* mobile / mid-width: content in normal flow */}
      <div className="relative z-10 mx-auto w-full max-w-[680px] px-5 py-16 xl:hidden">
        <WorkContent
          active={active}
          project={project}
          isDesktop={false}
          onSelect={setActive}
        />
      </div>
    </section>
  );
}
