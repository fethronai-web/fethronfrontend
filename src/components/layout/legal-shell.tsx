import Image from "next/image";
import Link from "next/link";

/** Section heading inside a legal document. */
export function LegalSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium text-off-white">
        <span className="mr-3 text-accent">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-off-white/70">{children}</div>
    </section>
  );
}

/** A bulleted list with on-brand markers. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Shared chrome for the legal pages — a darkened classical backdrop, a centred
 * reading column, a clear title + "last updated" stamp, and a footer note. Styled
 * in the studio dark theme and tuned for comfortable reading on any device.
 */
export function LegalShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-28 pt-32 sm:pt-36">
      <Image
        src="/images/background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-35"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/68" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(239,6,6,0.12), transparent 70%)" }}
        aria-hidden="true"
      />

      <article className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-off-white/10 bg-black/55 px-6 py-10 backdrop-blur-md sm:px-12 sm:py-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">Legal</p>
        <h1 className="font-display mt-3 text-[clamp(2.4rem,6vw,3.6rem)] font-medium leading-none tracking-[0.02em] text-off-white">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-off-white/75">{intro}</p>
        <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-off-white/40">Last updated · {updated}</p>
        <div className="mt-8 h-px w-full bg-off-white/10" />

        <div className="mt-10">{children}</div>

        <div className="mt-14 border-t border-off-white/10 pt-8 text-sm text-off-white/60">
          Questions about this document? Write to us at{" "}
          <a href="mailto:fethronai@gmail.com" className="text-accent hover:underline">
            fethronai@gmail.com
          </a>{" "}
          or{" "}
          <Link href="/submit" className="text-accent hover:underline">
            send us a letter
          </Link>
          .
        </div>
      </article>
    </main>
  );
}
