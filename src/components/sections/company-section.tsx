import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";
import { DiagonalArrow } from "@/components/ui/diagonal-arrow";

export function CompanySection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black py-24 sm:py-32 lg:py-40"
    >
      {/* Classical backdrop — marble columns on the left, black on the right */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/studio-section.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top-left"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/20 to-black/55" />
      </div>

      <Container>
        <div className="relative z-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
          <Reveal>
            <div>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 shrink-0 sm:h-12 sm:w-12">
                  <BrandMark variant="red" />
                </span>
                <span className="font-brand text-xl font-semibold uppercase tracking-[0.24em] text-off-white sm:text-2xl">
                  Fethron
                </span>
              </div>
              <h2 className="font-display mt-6 text-[clamp(3rem,7vw,6rem)] font-normal leading-[0.92] tracking-[-0.02em] text-off-white">
                Studio
              </h2>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="max-w-2xl">
              <p className="text-balance text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.25] text-off-white">
                We forge purposeful digital experiences through strategy, design,
                and engineering —{" "}
                <span className="text-accent">built to endure</span>, engineered to
                lead.
              </p>

              <p className="mt-8 text-base leading-[1.85] text-swirl/55">
                Fethron is a boutique digital studio crafting brands, products, and
                platforms for ambitious companies. We bring strategy, design, and
                engineering under one roof — web design and development, brand
                identity, motion, and e-commerce, through to the emerging edge of AI
                agents and Web 3.0. From first pixel to production scale, we treat
                every build as a monument: typed, performant, accessible, and made
                to outlast trends — turning fleeting attention into lasting digital
                legacies.
              </p>

              <div className="mt-10">
                <Button href="#process" variant="secondary" size="lg">
                  More About Us
                  <DiagonalArrow />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
