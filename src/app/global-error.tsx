"use client";

import { useEffect } from "react";
import { PALETTE } from "@/config/colors";
import { logger } from "@/lib/logger";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logger.error(
      "Global error boundary caught an error",
      { digest: error.digest },
      error,
    );
  }, [error]);

  return (
    <html lang="en">
      <body
        className="flex min-h-dvh items-center justify-center px-4 antialiased"
        style={{
          background: PALETTE.black,
          color: PALETTE.offWhite,
        }}
      >
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">Critical error</h1>
          <p className="mt-3 text-sm" style={{ color: PALETTE.swirl }}>
            The application failed to render. The error has been logged.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors hover:brightness-110"
              style={{
                background: PALETTE.red,
                color: PALETTE.black,
              }}
            >
              Reload application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
