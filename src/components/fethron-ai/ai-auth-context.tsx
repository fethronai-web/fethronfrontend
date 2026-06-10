"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import {
  useDynamicContext,
  useIsLoggedIn,
  type UserProfile,
} from "@dynamic-labs/sdk-react-core";

export type AiUser = {
  /** Stable identity — Dynamic user id, falling back to wallet/email. */
  id: string;
  /** Display label shown in the header (username → social → email → wallet). */
  name: string;
  email: string | null;
  walletAddress: string | null;
};

type AiAuthContextValue = {
  user: AiUser | null;
  isAuthenticated: boolean;
  /** True once the Dynamic SDK has hydrated — gates the header until then. */
  isReady: boolean;
  /** Opens Dynamic's auth widget (email / social / wallet). */
  openLogin: () => void;
  logout: () => void;
};

const AiAuthContext = createContext<AiAuthContextValue | null>(null);

function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * Friendly display name, mirroring how Kameti's WalletWidget falls back: an
 * explicit username → a connected social handle → the email local-part → a
 * shortened wallet address → "Builder". (The unique, app-owned username comes
 * with the backend phase; for now we just surface what Dynamic knows.)
 */
function deriveName(user: UserProfile | undefined, walletAddress: string | null): string {
  if (user?.username) return user.username;
  if (user?.alias) return user.alias;

  const oauth = user?.verifiedCredentials?.find(
    (c) => c.format === "oauth" && (c.oauthUsername || c.oauthDisplayName),
  );
  if (oauth) return (oauth.oauthUsername || oauth.oauthDisplayName) as string;

  if (user?.firstName) return user.firstName;

  const email =
    user?.email ?? user?.verifiedCredentials?.find((c) => c.format === "email" && c.email)?.email;
  if (email) return capitalize(email.split("@")[0] ?? email);

  if (walletAddress) return shortAddress(walletAddress);
  return "Builder";
}

export function AiAuthProvider({ children }: { children: ReactNode }) {
  const { sdkHasLoaded, primaryWallet, user: dynUser, setShowAuthFlow, handleLogOut } =
    useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const walletAddress = primaryWallet?.address ?? null;

  const user = useMemo<AiUser | null>(() => {
    if (!isLoggedIn) return null;
    const email =
      dynUser?.email ??
      dynUser?.verifiedCredentials?.find((c) => c.format === "email" && c.email)?.email ??
      null;
    return {
      id: dynUser?.userId ?? walletAddress ?? email ?? "user",
      name: deriveName(dynUser, walletAddress),
      email,
      walletAddress,
    };
  }, [isLoggedIn, dynUser, walletAddress]);

  const openLogin = useCallback(() => setShowAuthFlow(true), [setShowAuthFlow]);
  const logout = useCallback(() => {
    void handleLogOut();
  }, [handleLogOut]);

  const value = useMemo<AiAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady: sdkHasLoaded,
      openLogin,
      logout,
    }),
    [user, sdkHasLoaded, openLogin, logout],
  );

  return <AiAuthContext.Provider value={value}>{children}</AiAuthContext.Provider>;
}

export function useAiAuth() {
  const ctx = useContext(AiAuthContext);
  if (!ctx) throw new Error("useAiAuth must be used within AiAuthProvider");
  return ctx;
}
