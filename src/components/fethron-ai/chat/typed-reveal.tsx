"use client";

import { useEffect, useRef, useState } from "react";

// Matches full http(s) URLs, bare fethron.com links (incl. subdomains like
// aistudio.fethron.com), and email addresses.
const LINK_RE =
  /(https?:\/\/[^\s]+|(?:[\w-]+\.)*fethron\.com[^\s]*|[\w.+-]+@[\w-]+\.[\w.-]+\w)/g;

/** Turn URLs / emails inside plain text into minimal, new-tab "badge" links. */
function linkify(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    const match = m[0];
    if (m.index > last) out.push(text.slice(last, m.index));
    // keep trailing sentence punctuation OUT of the link
    const trail = match.match(/[.,;:!?)]+$/)?.[0] ?? "";
    const core = trail ? match.slice(0, -trail.length) : match;
    const isEmail = /^[\w.+-]+@/.test(core);
    const href = isEmail ? `mailto:${core}` : core.startsWith("http") ? core : `https://${core}`;
    out.push(
      <a
        key={key++}
        href={href}
        {...(isEmail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        className="mx-px inline-flex items-baseline gap-0.5 rounded-md bg-[color-mix(in_srgb,var(--ai-primary)_12%,transparent)] px-1.5 py-px align-baseline text-[0.92em] font-medium text-[var(--ai-primary)] no-underline transition-colors hover:bg-[color-mix(in_srgb,var(--ai-primary)_22%,transparent)]"
      >
        {core}
        {!isEmail && <span aria-hidden="true" className="text-[0.78em]">↗</span>}
      </a>,
    );
    if (trail) out.push(trail);
    last = m.index + match.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Smoothly reveals a finished string character-by-character (Claude-like). The
 * text is already fully present — this is a pure presentation effect, no tokens.
 * Once fully revealed, any URLs / emails become minimal new-tab badge links.
 * Honours `prefers-reduced-motion` (shows instantly, already linkified).
 */
export function TypedReveal({
  text,
  animate = true,
  onTick,
}: {
  text: string;
  animate?: boolean;
  /** Fired as more text appears — lets the parent keep the view scrolled. */
  onTick?: () => void;
}) {
  const [shown, setShown] = useState(animate ? "" : text);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!animate) {
      setShown(text);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      return;
    }

    setShown("");
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 140));
    const id = window.setInterval(() => {
      i = Math.min(text.length, i + step);
      setShown(text.slice(0, i));
      tickRef.current?.();
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [text, animate]);

  const typing = shown.length < text.length;
  return (
    <span>
      {/* While typing show plain text; once complete, swap in the linkified version
          so URLs/emails become clickable badges (no flicker mid-type). */}
      {typing ? shown : linkify(text)}
      {typing && (
        <span
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--ai-primary)]"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
