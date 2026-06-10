import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@/types/backend/app-router";

/**
 * Typed tRPC client for the Fethron agent backend. The Dynamic JWT (when signed
 * in) is attached per-request via `headers()`, so the SAME client serves anon and
 * authenticated calls — anon just sends no Authorization header and the backend
 * treats it as a public request. superjson MUST match the backend transformer.
 *
 * The `AppRouter` type comes from `src/types/backend/app-router.d.ts`, copied from
 * the backend's `npm run export:types` output. Re-copy after changing the router.
 */
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      transformer: superjson,
      headers() {
        const token = getAuthToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
