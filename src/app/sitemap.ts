import type { MetadataRoute } from "next";

/**
 * Sitemap for the whole Fethron property. A Search Console *Domain* property on
 * fethron.com covers both the studio host and the agent subdomain, so we list the
 * indexable URLs of both here. Private chat sessions (/c/...) are intentionally
 * left out and disallowed in robots.ts.
 */
const STUDIO = "https://fethron.com";
const AGENT = "https://aistudio.fethron.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: STUDIO, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${STUDIO}/pricing`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${STUDIO}/submit`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${STUDIO}/welcome`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${STUDIO}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${STUDIO}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: AGENT, lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
