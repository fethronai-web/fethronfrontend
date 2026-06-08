import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { FethronAiShell } from "@/components/fethron-ai/fethron-ai-shell";
import { AI_THEME_STORAGE_KEY, parseAiTheme } from "@/config/ai-theme-config";
import { FETHRON_AI } from "@/config/ai-tools";
import "./ai-theme.css";

export const metadata: Metadata = {
  title: FETHRON_AI.title,
  description:
    "Fethron AI — Sentinel Audit, Roadmap Oracle, and Venture Dossier. Studio-grade tools for builders.",
};

export const viewport: Viewport = {
  themeColor: "#1F160F",
};

export default async function FethronAiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const initialTheme = parseAiTheme(cookieStore.get(AI_THEME_STORAGE_KEY)?.value);

  return <FethronAiShell initialTheme={initialTheme}>{children}</FethronAiShell>;
}
