import { CLIENTS } from "@/config/site";
import { cn } from "@/lib/cn";

export function ClientsMarquee() {
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section
      className="relative bg-accent py-10 sm:py-12"
      aria-label="Clients we work with"
    >
      <div className="mb-6 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-black/60">
          Trusted by industry leaders
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-accent to-transparent sm:w-24"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-accent to-transparent sm:w-24"
          aria-hidden="true"
        />

        <div className="marquee-track">
          {items.map((client, index) => (
            <span
              key={`${client}-${index}`}
              className={cn(
                "mx-6 flex shrink-0 items-center whitespace-nowrap font-display text-xl text-black/35 sm:mx-10 sm:text-2xl lg:text-3xl",
                "transition-colors hover:text-black/70",
              )}
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
