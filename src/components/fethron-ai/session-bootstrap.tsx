"use client";

import { useEffect, useRef } from "react";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";
import { useAiAuth } from "@/components/fethron-ai/ai-auth-context";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

/**
 * Registers the user server-side. Dynamic login is entirely client-side, so the
 * backend only learns about a user when we call it with the JWT. On login we hit
 * `session.me` once — the backend verifies the token and lazily creates the
 * tenant row. Renders nothing.
 */
export function SessionBootstrap() {
  const { isAuthenticated } = useAiAuth();
  const sentFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      sentFor.current = null;
      return;
    }
    const token = getAuthToken();
    if (!token || sentFor.current === token) return;
    sentFor.current = token;

    fetch(`${BACKEND_URL}/trpc/session.me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {
      // allow a retry on the next render if the ping failed
      sentFor.current = null;
    });
  }, [isAuthenticated]);

  return null;
}
