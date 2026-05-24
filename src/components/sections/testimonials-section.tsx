import { TESTIMONIALS } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function TestimonialsSection() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section id="insights" className="border-t border-border bg-black py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Words from our partners"
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={1}>
          <figure className="relative mx-auto mt-14 max-w-4xl sm:mt-16">
            <div className="absolute -left-2 -top-4 font-display text-[6rem] leading-none text-accent/15 sm:-left-6 sm:text-[8rem]">
              &ldquo;
            </div>
            <blockquote className="relative text-center font-display text-2xl leading-[1.45] tracking-[-0.01em] text-foreground sm:text-3xl lg:text-4xl">
              {featured.quote}
            </blockquote>
            <figcaption className="mt-8 text-center">
              <p className="text-sm font-medium text-foreground">{featured.author}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">
                {featured.role} · {featured.company}
              </p>
            </figcaption>
          </figure>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
          {rest.map((item, index) => (
            <Reveal key={item.id} delay={(index + 2) as 2 | 3 | 4}>
              <li className="rounded-2xl border border-border bg-surface-raised/50 p-6 backdrop-blur-sm sm:p-8">
                <blockquote className="text-sm leading-[1.75] text-muted sm:text-[15px]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="mt-5 border-t border-border pt-5">
                  <p className="text-sm font-medium text-foreground">{item.author}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {item.role}, {item.company}
                  </p>
                </footer>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
