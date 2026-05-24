import { PROJECTS } from "@/config/site";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

function ProjectCard({
  project,
  className,
}: {
  project: (typeof PROJECTS)[number];
  className?: string;
}) {
  return (
    <article
      className={cn(
        "card-shine group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised sm:min-h-[320px] sm:rounded-3xl",
        "transition-all duration-500 hover:border-border-strong hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex-1 overflow-hidden bg-gradient-to-br",
          project.gradient,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_50%_50%,rgba(239,6,6,0.1),transparent_70%)]" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                {project.category}
              </p>
              <h3 className="font-display mt-1 text-2xl text-foreground sm:text-3xl">
                {project.title}
              </h3>
            </div>
            <span className="rounded-full border border-border-strong bg-background/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
              {project.metrics}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
          {project.description}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wider text-muted/70">
          {project.year}
        </p>
      </div>
    </article>
  );
}

export function WorkSection() {
  const hero = PROJECTS.find((p) => p.layout === "hero")!;
  const wide = PROJECTS.find((p) => p.layout === "wide")!;
  const rest = PROJECTS.filter((p) => p.layout === "default");

  return (
    <section id="work" className="border-t border-border bg-black py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Proof, not promises"
            description="A curated selection of engagements where strategy, design, and engineering converged into measurable outcomes."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <Reveal className="lg:col-span-7" delay={1}>
            <ProjectCard project={hero} className="min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]" />
          </Reveal>

          <Reveal className="lg:col-span-5" delay={2}>
            <ProjectCard project={wide} />
          </Reveal>

          {rest.map((project, i) => (
            <Reveal key={project.id} className="lg:col-span-6" delay={(i + 3) as 3 | 4}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
