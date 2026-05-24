import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import { SITE } from "@/config/site";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Preloader } from "@/components/layout/preloader";
import { ReadyProvider } from "@/components/layout/ready-context";
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
    default: `${SITE.name} — Digital Agency`,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${brand.variable} ${script.variable} h-full`}>
      <body className="relative flex min-h-dvh flex-col bg-black antialiased">
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-accent-foreground focus:[clip:auto] focus:[position:fixed] focus:[width:auto] focus:[height:auto] focus:[margin:0] focus:[overflow:visible] focus:[white-space:normal]"
        >
          Skip to content
        </a>
        <ReadyProvider>
          <div className="relative z-10 flex min-h-dvh flex-col">
            <SiteHeader />
            {children}
            <SiteFooter />
            <Preloader />
          </div>
        </ReadyProvider>
      </body>
    </html>
  );
}
