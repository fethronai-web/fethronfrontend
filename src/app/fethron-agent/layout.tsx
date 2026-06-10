import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { FethronAiShell } from "@/components/fethron-ai/fethron-ai-shell";
import { AI_THEME_STORAGE_KEY, parseAiTheme } from "@/config/ai-theme-config";
import { SEO, BRAND_KEYWORDS } from "@/config/seo";
import { AgentJsonLd } from "@/components/seo/structured-data";
import "./ai-theme.css";

export const metadata: Metadata = {
  title: { absolute: SEO.agent.title },
  description: SEO.agent.description,
  keywords: [...SEO.agent.keywords, ...BRAND_KEYWORDS],
  alternates: { canonical: "https://aistudio.fethron.com" },
  robots: { index: true, follow: true },
  openGraph: {
    title: SEO.agent.title,
    description: SEO.agent.description,
    url: "https://aistudio.fethron.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.agent.title,
    description: SEO.agent.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1F160F",
};

export default async function FethronAiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const initialTheme = parseAiTheme(cookieStore.get(AI_THEME_STORAGE_KEY)?.value);

  return (
    <>
      <AgentJsonLd />
      <FethronAiShell initialTheme={initialTheme}>{children}</FethronAiShell>
    </>
  );
}
