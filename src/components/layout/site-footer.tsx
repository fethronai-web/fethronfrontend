import Link from "next/link";
import { NAV_LINKS, SITE } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-black">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-[1.75] text-muted sm:text-[15px]">
              {SITE.description}
            </p>
            <div className="mt-6">
              <Button href="#contact" variant="outline" size="sm">
                Work with us
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                Navigate
              </h3>
              <ul className="mt-4 space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                Connect
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "Dribbble", href: "https://dribbble.com" },
                  { label: "Instagram", href: "https://instagram.com" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                Studio
              </h3>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-4 block text-sm text-accent transition-opacity hover:opacity-80"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="line-glow mt-14 sm:mt-16" aria-hidden="true" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {year} {SITE.name}. Crafted with precision.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
