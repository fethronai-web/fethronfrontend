import { SOCIAL } from "@/config/social";

/**
 * JSON-LD structured data — the machine-readable identity that lets Google build a
 * brand Knowledge Panel, sitelinks, and the logo/social cluster, and lets AI engines
 * (ChatGPT/Perplexity/AI Overviews) understand and cite Fethron. Two entities:
 *   • Organization + WebSite — the brand + main site (fethron.com), rendered on every
 *     page so the entity signal is consistent everywhere.
 *   • SoftwareApplication — the free AI agent (aistudio.fethron.com), a product.
 * Note: the Knowledge Panel's map/reviews/address come from a Google Business
 * Profile, NOT from this markup — this provides the logo, description, and `sameAs`
 * social links that populate the rest of the panel.
 */

const ORIGIN = "https://fethron.com";
const ORG_ID = `${ORIGIN}/#organization`;

const SAME_AS = [
  SOCIAL.instagram,
  SOCIAL.x,
  SOCIAL.linkedin,
  SOCIAL.threads,
  SOCIAL.facebook,
  SOCIAL.discord,
];

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // schema is fully static / trusted — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + WebSite — render once on every page (brand-wide). */
export function BrandJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Fethron",
    alternateName: ["Fethron Studio", "Fethron AI"],
    url: ORIGIN,
    logo: `${ORIGIN}/brand/fethron-mark.png`,
    image: `${ORIGIN}/brand/fethron-logo-wordmark-dark.png`,
    description:
      "Fethron is a digital product studio that designs and builds web apps, mobile apps, AI agents, e-commerce, Web3 dApps, branding and growth — from idea to launch.",
    email: SOCIAL.email,
    sameAs: SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SOCIAL.email,
      telephone: SOCIAL.phone.replace(/\s+/g, ""),
      availableLanguage: ["English", "Hindi"],
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${ORIGIN}/#website`,
    name: "Fethron",
    url: ORIGIN,
    publisher: { "@id": ORG_ID },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}

/** SoftwareApplication — the free AI agent product (its own subdomain). */
export function AgentJsonLd() {
  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fethron AI",
    url: "https://aistudio.fethron.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Free studio-grade AI tools: turn any idea into a complete launch blueprint, and audit Solidity smart contracts for vulnerabilities — instant, in your browser.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  };
  return <JsonLd data={app} />;
}
