import type { MetadataRoute } from "next";

/**
 * Crawl rules: index everything public, but keep API routes and the private agent
 * chat sessions (/c/... on the agent host, /fethron-agent/c/... on the studio host)
 * out of the index. Points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/c/", "/fethron-agent/c/"],
      },
      // Explicitly allow AI search indexers so Fethron can be cited in
      // ChatGPT Search, Perplexity, Google AI Mode, and Claude answers.
      // Note: GPTBot = OpenAI training; OAI-SearchBot = ChatGPT Search citations.
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
    ],
    sitemap: "https://fethron.com/sitemap.xml",
    host: "https://fethron.com",
  };
}
