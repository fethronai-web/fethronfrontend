import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to home</Button>
        </div>
        <p className="mt-6 text-sm text-muted">
          Need help?{" "}
          <Link href="/#contact" className="text-accent hover:underline">
            Contact us
          </Link>
        </p>
      </Container>
    </main>
  );
}
