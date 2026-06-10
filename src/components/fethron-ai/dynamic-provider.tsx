"use client";

import type { ReactNode } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import type { AiTheme } from "@/config/ai-theme-config";

/**
 * Dynamic (dynamic.xyz) drives all auth for the Fethron Agent — a single widget
 * that covers email OTP, Google, X / other socials, AND external web3 wallets.
 * This is the hybrid model: a visitor can browse the agent logged-out, or log in
 * via any of those methods.
 *
 * No embedded wallets: we don't need a wallet for social/email users, so the
 * Dynamic dashboard has embedded (Turnkey) wallets turned OFF. Identity / future
 * uniqueness is therefore the email-or-social identity, or — for wallet logins —
 * the connected external wallet's address. EthereumWalletConnectors below is what
 * lets those external wallets (MetaMask, WalletConnect, …) connect.
 *
 * The username/profile sync to our own backend lands in a later phase — for now
 * we read the identity Dynamic gives us (see ai-auth-context).
 *
 * The environment id is a publishable value (safe in the client bundle).
 */
const ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? "";

/**
 * Base theme for the widget's first paint, seeded from the SSR theme (cookie) so
 * Dynamic's default skin already matches before our CSS runs. It's intentionally
 * STATIC — we never swap it on toggle (that could re-render the SDK / flash).
 * The actual day↔night colours are driven entirely by the static, theme-scoped
 * `.dynamic-shadow-dom` overrides in ai-theme.css, which win on specificity and
 * apply instantly — so toggling is pure CSS: no glitch, no race.
 */
export function FethronDynamicProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: AiTheme;
}) {
  return (
    <DynamicContextProvider
      theme={initialTheme}
      settings={{
        environmentId: ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
        // connect-AND-sign: an external wallet must sign on connect so Dynamic
        // issues an authenticated session JWT (SIWE-verified address inside it).
        // Without this, a wallet only "connects" — no JWT — so the backend can't
        // verify it and no tenant is ever created. (Email/social auth regardless.)
        initialAuthenticationMode: "connect-and-sign",
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
