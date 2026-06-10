/**
 * Single source of truth for Fethron's public channels — used by the footer,
 * the floating contact dock, and the links hub so a URL is never duplicated.
 */
export const SOCIAL = {
  whatsapp: "https://wa.me/919310955408",
  discord: "https://discord.gg/pdgBCuT58Y",
  instagram: "https://www.instagram.com/fethronai",
  x: "https://x.com/fethronn",
  linkedin: "https://www.linkedin.com/in/fethron-165a20413/",
  threads: "https://www.threads.com/@fethronai",
  facebook: "https://www.facebook.com/profile.php?id=61590636301168",
  email: "fethronai@gmail.com",
  phone: "+91 93109 55408", // primary — all contact/WhatsApp redirects here
  phone2: "+91 93897 29208",
} as const;

/** Icon file (in /public/icons) for each channel. */
export const SOCIAL_ICON = {
  whatsapp: "/icons/whatsapp.svg",
  discord: "/icons/discord.svg",
  instagram: "/icons/instagram.svg",
  x: "/icons/x.svg",
  linkedin: "/icons/linkedin.svg",
  threads: "/icons/threads.svg",
  facebook: "/icons/facebook.svg",
  email: "/icons/gmail.svg",
} as const;
