import type { Service } from "@/types";
import { SERVICES } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "text-accent",
    "aria-hidden": true,
  };

  switch (icon) {
    case "strategy":
      return (
        <svg {...common}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
        </svg>
      );
    case "design":
      return (
        <svg {...common}>
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        </svg>
      );
    case "development":
      return (
        <svg {...common}>
          <path d="M16 18l6-6-6-6" />
          <path d="M8 6l-6 6 6 6" />
        </svg>
      );
    case "growth":
      return (
        <svg {...common}>
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}

export function ServicesSection() {
  return (
    <section id="services" className="border-t border-border bg-black py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="Full-spectrum digital excellence"
            description="Every engagement is end-to-end — no handoffs, no gaps, no excuses when it ships."
          />
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:gap-5">
          {SERVICES.map((service, index) => (
            <Reveal key={service.id} delay={(index + 1) as 1 | 2 | 3 | 4}>
              <li
                className={cn(
                  "card-shine gradient-border group h-full p-6 transition-transform duration-500 sm:p-8",
                  "hover:-translate-y-1",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/80">
                    <ServiceIcon icon={service.icon} />
                  </div>
                  <span className="font-display text-4xl text-foreground/10 transition-colors group-hover:text-accent/20">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-foreground sm:text-[1.65rem]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-muted sm:text-base">
                  {service.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
