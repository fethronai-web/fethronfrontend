import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Cinzel, Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import { SITE } from "@/config/site";
import { env } from "@/config/env";
import { AI_THEME_INIT_SCRIPT, AI_THEME_STORAGE_KEY } from "@/config/ai-theme-config";
import { logger } from "@/lib/logger";
import { SiteChrome } from "@/components/layout/site-chrome";
import { VideoPreloader } from "@/components/fethron-ai/video-preloader";
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
    default: `${SITE.name} — Digital Studio`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
    url: SITE.url,
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
        <Script id="fethron-ai-theme-init" strategy="beforeInteractive">
          {AI_THEME_INIT_SCRIPT}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-accent-foreground focus:[clip:auto] focus:[position:fixed] focus:[width:auto] focus:[height:auto] focus:[margin:0] focus:[overflow:visible] focus:[white-space:normal]"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <VideoPreloader />
      </body>
    </html>
  );
}
