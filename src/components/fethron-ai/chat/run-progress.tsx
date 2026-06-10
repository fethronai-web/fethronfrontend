"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AI_LOADING_LINES } from "@/config/ai-jokes";
import type { RunEvent } from "./use-run-stream";

function Spinner() {
  return (
    <motion.span
      className="relative block h-7 w-7 shrink-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <circle cx="12" cy="12" r="9" stroke="var(--ai-border)" strokeWidth="2.5" />
        <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--ai-primary)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </motion.span>
  );
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * The working state for a tool run: spinner + current stage + an elapsed timer, a
 * rotating chill dev joke, and a LIVE TERMINAL of the agent's real streamed steps
 * (which lens is scanning, what's being verified…), plus a keep-open notice for
 * the long ones (audits). Queue waits (under load) are handled invisibly on the
 * backend — the user just sees a normal "Working…", never a queue position.
 */
export function RunProgress({
  stageMessage,
  events,
  tool,
}: {
  stageMessage?: string;
  events: RunEvent[];
  tool?: string;
}) {
  const [joke, setJoke] = useState(0);
  const [sec, setSec] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setInterval(() => setSec((v) => v + 1), 1000);
    const j = reduce ? null : window.setInterval(() => setJoke((v) => (v + 1) % AI_LOADING_LINES.length), 3800);
    return () => {
      window.clearInterval(t);
      if (j) window.clearInterval(j);
    };
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [events.length]);

  const tail = events.slice(-50);
  const isAudit = tool === "smart-contract-audit";

  return (
    <div>
      <div className="flex items-start gap-3">
        <Spinner />
        <div className="min-w-0 pt-0.5">
          <p className="flex flex-wrap items-center gap-2 text-[13.5px] font-semibold leading-snug text-[var(--ai-text)]">
            <span>{stageMessage || "Working on it…"}</span>
            <span className="rounded-md bg-[color-mix(in_srgb,var(--ai-primary)_14%,transparent)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--ai-primary)]">
              {fmt(sec)}
            </span>
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={joke}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 text-[12.5px] italic leading-snug text-[var(--ai-text-muted)]"
            >
              {AI_LOADING_LINES[joke]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {tail.length > 0 && (
        <div
          ref={termRef}
          className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-[var(--ai-border)] bg-[color-mix(in_srgb,var(--ai-text)_6%,transparent)] p-3 font-mono text-[11.5px] leading-relaxed text-[var(--ai-text-muted)]"
        >
          {tail.map((e, i) => (
            <div
              key={e.seq ?? i}
              className={e.kind === "warn" || e.kind === "error" ? "text-[var(--ai-primary)]" : undefined}
            >
              <span className="opacity-50">›</span> {e.message}
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-[12px] italic leading-snug text-[var(--ai-text-muted)]">
        {isAudit
          ? "Deep audit in progress — this can take a few minutes. Keep this tab open; don't refresh or close."
          : "This can take a couple of minutes. Keep this tab open — it'll finish on its own."}
      </p>
    </div>
  );
}
