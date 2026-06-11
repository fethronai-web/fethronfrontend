import type { MetadataRoute } from "next";

/**
 * Crawl rules: index everything public, but keep API routes and the private agent
 * chat sessions (/c/... on the agent host, /fethron-agent/c/... on the studio host)
 * out of the index. Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/c/", "/fethron-agent/c/"],
    },
    sitemap: "https://fethron.com/sitemap.xml",
    host: "https://fethron.com",
  };
}
