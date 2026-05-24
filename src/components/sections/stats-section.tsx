import { STATS } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function StatsSection() {
  return (
    <section id="impact" className="relative border-t border-border bg-black py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end lg:gap-20">
          <Reveal>
            <div>
              <p className="ui-label text-accent">By the Numbers</p>
              <h2 className="font-display mt-4 text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.1] tracking-[-0.02em] text-foreground">
                A boutique agency with enterprise discipline
              </h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <p className="max-w-lg text-base leading-[1.8] text-muted sm:text-lg">
              We&apos;re a team of strategists, designers, and engineers obsessed
              with the details that separate good from unforgettable. Every project
              ships responsive, accessible, and built to maintain.
            </p>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-12 sm:mt-20 sm:grid-cols-4 sm:gap-6 sm:pt-16">
          {STATS.map((stat, index) => (
            <Reveal key={stat.id} delay={(index + 1) as 1 | 2 | 3 | 4}>
              <div className="text-center sm:text-left">
                <dt className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-[-0.03em] text-foreground">
                  {stat.value}
                </dt>
                <dd className="ui-label mt-2 text-muted">{stat.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
