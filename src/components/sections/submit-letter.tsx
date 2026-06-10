"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { FETHRON_AGENT_URL } from "@/config/ai-tools";
import { SOCIAL } from "@/config/social";
import { BrandMark } from "@/components/ui/brand-mark";

const COOLDOWN_MS = 10 * 60 * 1000; // 10 min before another letter can be sent
const LS_KEY = "fethron-letter-sent-at";

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

function SparkGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c.5 4.4 1.6 5.5 6 6-4.4.5-5.5 1.6-6 6-.5-4.4-1.6-5.5-6-6 4.4-.5 5.5-1.6 6-6Z" />
    </svg>
  );
}

/** Same postage-stamp look, but it's a live link to the AI agent — gently
 * pulses + tilts to invite a tap. */
function TryMeStamp() {
  const reduce = useReducedMotion();
  return (
    <Link
      href={FETHRON_AGENT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Try the Fethron AI Agent"
      className="block shrink-0"
    >
      <motion.div
        className="scalloped scalloped-sm"
        style={{ background: INK, padding: "3px" }}
        animate={reduce ? undefined : { scale: [1, 1.07, 1], rotate: [-3, 1.5, -3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.12, rotate: 0 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="flex h-[68px] w-[58px] flex-col items-center justify-center gap-1"
          style={{ background: PAPER, border: `1px solid ${INK_SOFT}` }}
        >
          <span style={{ color: INK }}>
            <SparkGlyph />
          </span>
          <span className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: INK }}>
            Try Me
          </span>
        </div>
      </motion.div>
    </Link>
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

/** Live countdown "mm:ss". */
function fmtRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** The confirmation shown after a letter is sealed & sent — a wax-seal flourish, a
 *  reassurance, and a cooldown before another letter can be written. */
function SentCard({
  cooldownUntil,
  onReset,
  reduce,
}: {
  cooldownUntil: number;
  onReset: () => void;
  reduce: boolean | null;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (now >= cooldownUntil) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [cooldownUntil, now]);
  const remaining = cooldownUntil - now;
  const canWriteAgain = remaining <= 0;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scalloped relative z-10 w-full max-w-lg text-center"
      style={{ background: PAPER, filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.55))" }}
    >
      <div className="px-8 py-12 sm:px-12 sm:py-14">
        {/* wax seal */}
        <motion.div
          initial={reduce ? false : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: INK, boxShadow: "0 10px 24px -8px rgba(150,42,36,0.7)" }}
        >
          <span className="h-9 w-9" style={{ filter: "brightness(0) invert(1)" }}>
            <BrandMark variant="red" />
          </span>
        </motion.div>

        <h1
          className="font-display mt-7 text-[clamp(2rem,5vw,2.8rem)] font-medium uppercase leading-none tracking-[0.04em]"
          style={{ color: INK }}
        >
          Sealed &amp; Sent
        </h1>
        <div className="mx-auto mt-4 h-px w-20" style={{ background: INK_SOFT }} />
        <p className="font-display mx-auto mt-5 max-w-sm text-lg italic" style={{ color: INK_LABEL }}>
          Your letter is on its way. We read every word — expect a reply within one
          business day at the email you gave us.
        </p>

        <div className="mt-8">
          {canWriteAgain ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full px-7 py-3 text-[12px] font-bold uppercase tracking-[0.22em] transition-transform hover:scale-[1.03]"
              style={{ background: INK, color: PAPER }}
            >
              Write another letter
            </button>
          ) : (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: INK_LABEL }}>
              You can write another in {fmtRemaining(remaining)}
            </p>
          )}
        </div>

        {/* faster channels while they wait for the email reply */}
        <p className="font-display mx-auto mt-6 max-w-xs text-[15px] italic" style={{ color: INK_LABEL }}>
          Need a quicker reply? Reach us on{" "}
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold not-italic underline underline-offset-2 hover:opacity-80"
            style={{ color: INK }}
          >
            WhatsApp
          </a>{" "}
          or{" "}
          <a
            href={SOCIAL.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold not-italic underline underline-offset-2 hover:opacity-80"
            style={{ color: INK }}
          >
            Discord
          </a>
          .
        </p>

        <Link
          href={FETHRON_AGENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.3em] underline-offset-4 hover:underline"
          style={{ color: INK_LABEL }}
        >
          Meanwhile — try our AI agent →
        </Link>
      </div>
    </motion.div>
  );
}

export function SubmitLetter() {
  const reduce = useReducedMotion();
  const emailParam = useSearchParams().get("email") ?? "";
  const [form, setForm] = useState({ name: "", email: emailParam, subject: "", message: "" });
  const [seenEmail, setSeenEmail] = useState(emailParam);
  const [hp, setHp] = useState(""); // honeypot — real users never fill this
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Prefill the email from a "Enter your email" field. Adjusting state during
  // render (not in an effect) keeps it in sync even when the /submit page is
  // reused from the router cache with a different ?email — no glitch, no flash.
  if (emailParam && emailParam !== seenEmail) {
    setSeenEmail(emailParam);
    setForm((f) => ({ ...f, email: emailParam }));
  }

  // Resume the cooldown across reloads — if a letter was sent recently, keep the
  // confirmation up instead of re-showing the form. Done on mount (localStorage is
  // client-only, so this can't run during render without an SSR mismatch); the
  // state update is deferred a tick so it's not a synchronous effect-body setState.
  useEffect(() => {
    const at = Number(localStorage.getItem(LS_KEY) || 0);
    if (!at || Date.now() - at >= COOLDOWN_MS) return;
    const t = setTimeout(() => {
      setCooldownUntil(at + COOLDOWN_MS);
      setStatus("sent");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, company: hp }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data?.error || "We couldn't send your letter. Please try again.");
      const at = Date.now();
      localStorage.setItem(LS_KEY, String(at));
      setCooldownUntil(at + COOLDOWN_MS);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setError("");
    setForm({ name: "", email: "", subject: "", message: "" });
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

      {status === "sent" ? (
        <SentCard cooldownUntil={cooldownUntil} onReset={reset} reduce={reduce} />
      ) : (
        <motion.form
          onSubmit={onSubmit}
          initial={reduce ? false : { opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="scalloped relative z-10 w-full max-w-2xl"
          style={{ background: PAPER, filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.55))" }}
        >
          {/* honeypot — visually hidden, off-screen, not announced */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
          />
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

            <div className="flex shrink-0 flex-col items-center gap-3 self-start">
              <div className="flex gap-3">
                <Stamp label="Postage">
                  <span className="block h-7 w-7">
                    <BrandMark variant="red" />
                  </span>
                </Stamp>
                <Stamp label="Postage">
                  <TempleGlyph />
                </Stamp>
              </div>
              <TryMeStamp />
            </div>
          </div>

          {/* message */}
          <p className="font-script mt-9 text-3xl" style={{ color: INK }}>
            Hello Fethron Team,
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

          {/* error notice */}
          {status === "error" && error && (
            <p
              role="alert"
              className="mt-6 rounded-lg px-4 py-2.5 text-center text-[12px] font-semibold"
              style={{ background: "rgba(150,42,36,0.1)", border: `1px solid ${INK_SOFT}`, color: INK }}
            >
              {error}
            </p>
          )}

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
                disabled={status === "sending"}
                className="rounded-full px-7 py-3 text-[12px] font-bold uppercase tracking-[0.22em] transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                style={{ background: INK, color: PAPER }}
              >
                {status === "sending" ? "Sealing…" : "Seal & Send"}
              </button>
              <span className="mt-2.5 text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: INK_LABEL }}>
                Built to Endure
              </span>
            </div>

            <Postmark />
          </div>
        </div>
        </motion.form>
      )}
    </section>
  );
}
