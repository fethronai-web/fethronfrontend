import { PROCESS } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function ProcessSection() {
  return (
    <section id="process" className="border-t border-border bg-black py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="How we work"
            description="A proven framework refined across 120+ engagements — transparent, collaborative, and built for momentum."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="relative mt-14 sm:mt-20">
          <div
            className="absolute left-[1.125rem] top-0 hidden h-full w-px bg-gradient-to-b from-accent via-swirl/20 to-transparent sm:left-1/2 sm:block sm:-translate-x-1/2"
            aria-hidden="true"
          />

          <ol className="grid list-none gap-8 sm:gap-12 lg:gap-16">
            {PROCESS.map((step, index) => (
              <Reveal
                key={step.id}
                as="li"
                delay={(index + 1) as 1 | 2 | 3 | 4}
                className={`relative grid items-start gap-6 sm:grid-cols-2 sm:gap-12 ${
                  index % 2 === 1 ? "sm:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "sm:text-right" : ""}>
                  <span className="font-display text-5xl text-accent sm:text-6xl">
                    {step.step}
                  </span>
                  <h3 className="font-display mt-2 text-2xl text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                </div>
                <div
                  className={`rounded-2xl border border-border bg-swirl/[0.04] p-6 sm:p-8 ${
                    index % 2 === 1 ? "sm:text-left" : ""
                  }`}
                >
                  <p className="text-sm leading-[1.8] text-muted sm:text-base">
                    {step.description}
                  </p>
                </div>

                <span
                  className="absolute left-[1.125rem] top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-black sm:left-1/2 sm:block"
                  aria-hidden="true"
                />
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
