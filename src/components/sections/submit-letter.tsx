"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SITE } from "@/config/site";
import { BrandMark } from "@/components/ui/brand-mark";

const PAPER = "#f3eee3";
const INK = "#c5302a";
const INK_LABEL = "#a8392f"; // solid muted red for labels (no transparency)
const INK_SOFT = "rgba(150,42,36,0.5)"; // lines only (underlines, rules, divider)

/* ---- decorative bits ---------------------------------------------------- */

function Stamp({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="scalloped scalloped-sm rotate-[2deg]" style={{ background: INK, padding: "3px" }}>
      <div
        className="flex h-[68px] w-[58px] flex-col items-center justify-center gap-1"
        style={{ background: PAPER, border: `1px solid ${INK_SOFT}` }}
      >
        <div style={{ color: INK }}>{children}</div>
        <span className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: INK }}>
          {label}
        </span>
      </div>
    </div>
  );
}

function TempleGlyph() {
  return (
    <svg width="26" height="22" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9 14 3l11 6Z" />
      <path d="M3 11h22" />
      <path d="M6 13v7M11 13v7M17 13v7M22 13v7" />
      <path d="M4 20h20" />
    </svg>
  );
}

function Postmark() {
  return (
    <svg width="92" height="92" viewBox="0 0 120 120" style={{ color: INK, opacity: 0.5, transform: "rotate(-9deg)" }} aria-hidden="true">
      <defs>
        <path id="pm-top" d="M60 60 m-43 0 a43 43 0 1 1 86 0" fill="none" />
        <path id="pm-bot" d="M60 60 m43 0 a43 43 0 1 1 -86 0" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="currentColor" strokeWidth="1" />
      <text fontSize="8.5" fontWeight="700" letterSpacing="2.5" fill="currentColor">
        <textPath href="#pm-top" startOffset="6%">FETHRON · STUDIO</textPath>
      </text>
      <text fontSize="8" fontWeight="600" letterSpacing="2" fill="currentColor">
        <textPath href="#pm-bot" startOffset="10%">BUILT TO ENDURE</textPath>
      </text>
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M44 60h32M48 53h24M48 67h24" />
      </g>
    </svg>
  );
}

/* ---- field -------------------------------------------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="flex items-baseline gap-3">
      <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: INK_LABEL }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={label !== "Re"}
        className="font-display min-w-0 flex-1 bg-transparent pb-1 text-lg font-semibold italic outline-none placeholder:opacity-40"
        style={{ color: INK, borderBottom: `1.5px solid ${INK_SOFT}`, outline: "none" }}
      />
    </label>
  );
}

/* ---- letter ------------------------------------------------------------- */

export function SubmitLetter() {
  const reduce = useReducedMotion();
  const emailParam = useSearchParams().get("email") ?? "";
  const [form, setForm] = useState({ name: "", email: emailParam, subject: "", message: "" });
  const [seenEmail, setSeenEmail] = useState(emailParam);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill the email from a "Enter your email" field. Adjusting state during
  // render (not in an effect) keeps it in sync even when the /submit page is
  // reused from the router cache with a different ?email — no glitch, no flash.
  if (emailParam && emailParam !== seenEmail) {
    setSeenEmail(emailParam);
    setForm((f) => ({ ...f, email: emailParam }));
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = form.subject.trim() || "A letter to Fethron";
    const body = `From: ${form.name} <${form.email}>\n\n${form.message}\n\n— ${form.name}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 pb-44 pt-32 sm:pt-36">
      {/* foggy ruins backdrop */}
      <Image
        src="/images/background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 55% at 50% 0%, rgba(239,6,6,0.14), transparent 70%)" }}
        aria-hidden="true"
      />

      <motion.form
        onSubmit={onSubmit}
        initial={reduce ? false : { opacity: 0, y: 40, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="scalloped relative z-10 w-full max-w-2xl"
        style={{ background: PAPER, filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.55))" }}
      >
        <div className="px-8 py-10 sm:px-12 sm:py-12">
          {/* heading */}
          <h1
            className="font-display text-center text-[clamp(2.2rem,6vw,3.4rem)] font-medium uppercase leading-none tracking-[0.04em]"
            style={{ color: INK }}
          >
            A Letter to Fethron
          </h1>
          <div className="mx-auto mt-4 h-px w-24" style={{ background: INK_SOFT }} />

          {/* to/from + stamps */}
          <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: INK_LABEL }}>
                  To
                </span>
                <span className="font-display text-lg font-semibold italic" style={{ color: INK }}>
                  Fethron — Digital Studio
                </span>
              </div>
              <Field label="From" value={form.name} onChange={set("name")} placeholder="your name" />
              <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" />
              <Field label="Re" value={form.subject} onChange={set("subject")} placeholder="what you're building" />
            </div>

            <div className="flex shrink-0 gap-3 self-start">
              <Stamp label="Postage">
                <span className="block h-7 w-7">
                  <BrandMark variant="red" />
                </span>
              </Stamp>
              <Stamp label="Postage">
                <TempleGlyph />
              </Stamp>
            </div>
          </div>

          {/* message */}
          <p className="font-script mt-9 text-3xl" style={{ color: INK }}>
            Dear Fethron,
          </p>
          <textarea
            value={form.message}
            onChange={(e) => set("message")(e.target.value)}
            required
            rows={6}
            placeholder="Tell us about your project — what you're building, your timeline, and what success looks like…"
            className="font-display mt-3 w-full resize-none bg-transparent text-xl font-semibold italic outline-none placeholder:opacity-40"
            style={{
              color: INK,
              lineHeight: "34px",
              outline: "none",
              backgroundImage: `repeating-linear-gradient(transparent, transparent 33px, ${INK_SOFT} 33px, ${INK_SOFT} 34px)`,
            }}
          />

          {/* footer */}
          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="font-display text-sm italic leading-tight" style={{ color: INK_LABEL }}>
              Est.
              <br />
              MMXXV
            </div>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="rounded-full px-7 py-3 text-[12px] font-bold uppercase tracking-[0.22em] transition-transform hover:scale-[1.03]"
                style={{ background: INK, color: PAPER }}
              >
                Seal &amp; Send
              </button>
              <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_LABEL }}>
                Built to Endure
              </span>
            </div>

            <Postmark />
          </div>
        </div>
      </motion.form>
    </section>
  );
}
