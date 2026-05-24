const MARQUEE_ITEMS = [
  "Brand Strategy",
  "Visual Identity",
  "Web Design",
  "Experience Design",
  "Web Development",
  "AI Agents",
  "AI Automation",
  "Generative AI",
  "Conversational AI",
  "LLM Integration",
  "AI Strategy",
  "Web 3.0",
  "Motion Design",
  "E-Commerce",
  "SEO & Performance",
  "Creative Direction",
] as const;

/**
 * A scrolling accent strip that bridges the hero into the rest of the page — a
 * bold seam that both connects and separates the sections. Uses the shared
 * `.marquee` CSS animation (pauses on hover, disabled under reduced motion).
 * The item list is duplicated so the -50% loop is seamless.
 */
export function MarqueeStrip() {
  return (
    <section
      aria-hidden="true"
      className="relative z-10 overflow-hidden border-y border-off-white/10 bg-linear-to-r from-black via-red-soft to-black py-3.5 sm:py-4"
    >
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <ul key={group} className="flex shrink-0 items-center">
            {MARQUEE_ITEMS.map((item) => (
              <li key={`${group}-${item}`} className="flex items-center">
                <span className="whitespace-nowrap font-sans text-[13px] font-medium uppercase tracking-[0.28em] text-off-white sm:text-sm">
                  {item}
                </span>
                <span
                  className="mx-7 h-1.5 w-1.5 shrink-0 rotate-45 bg-off-white/45 sm:mx-9"
                  aria-hidden="true"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
