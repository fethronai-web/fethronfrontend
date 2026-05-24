"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error(
      "Route error boundary caught an error",
      { digest: error.digest },
      error,
    );
  }, [error]);

  return (
    <main className="flex flex-1 items-center py-24">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Something went wrong
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
          We hit an unexpected error
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The issue has been logged. You can try again or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Go home
          </Button>
        </div>
      </Container>
    </main>
  );
}
