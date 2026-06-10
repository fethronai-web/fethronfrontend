import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Cinzel, Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import { SITE } from "@/config/site";
import { BRAND_KEYWORDS, STUDIO_KEYWORDS } from "@/config/seo";
import { env } from "@/config/env";
import { AI_THEME_INIT_SCRIPT, AI_THEME_STORAGE_KEY } from "@/config/ai-theme-config";
import { logger } from "@/lib/logger";
import { SiteChrome } from "@/components/layout/site-chrome";
import { VideoPreloader } from "@/components/fethron-ai/video-preloader";
import { BrandJsonLd } from "@/components/seo/structured-data";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const brand = Cinzel({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Digital Product Studio`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  keywords: [...STUDIO_KEYWORDS, ...BRAND_KEYWORDS],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE.name,
    title: `${SITE.name} — Digital Product Studio`,
    description: SITE.description,
    type: "website",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Digital Product Studio`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

logger.info("Root layout initialized", { env: env.nodeEnv });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = (forwardedHost ?? headerStore.get("host") ?? "").split(":")[0].toLowerCase();
  const isAgentHost = host === "aistudio.fethron.com";
  const aiThemeCookie = cookieStore.get(AI_THEME_STORAGE_KEY)?.value;
  const htmlAiTheme =
    aiThemeCookie === "dark" || aiThemeCookie === "light" ? aiThemeCookie : undefined;

  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${brand.variable} ${script.variable} h-full`}
      data-fethron-ai-theme={htmlAiTheme}
      suppressHydrationWarning
    >
      <body className="relative flex min-h-dvh flex-col bg-black antialiased">
        {/* Inline anti-FOUC theme init — runs during HTML parse, before paint &
            hydration. A plain script (not next/script) avoids React 19's
            "script tag while rendering" warning. */}
        <script
          id="fethron-ai-theme-init"
          dangerouslySetInnerHTML={{ __html: AI_THEME_INIT_SCRIPT }}
        />
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-accent-foreground focus:[clip:auto] focus:[position:fixed] focus:[width:auto] focus:[height:auto] focus:[margin:0] focus:[overflow:visible] focus:[white-space:normal]"
        >
          Skip to content
        </a>
        <BrandJsonLd />
        <SiteChrome isAgentHost={isAgentHost}>{children}</SiteChrome>
        <VideoPreloader isAgentHost={isAgentHost} />
      </body>
    </html>
  );
}
