export type AiToolId = "sentinel-audit" | "roadmap-oracle" | "venture-dossier";

export interface AiTool {
  id: AiToolId;
  name: string;
  /** Label on the quick-pick chips below the prompt */
  chipLabel: string;
  chipHint: string;
  tagline: string;
  description: string;
  inputPlaceholder: string;
  actionLabel: string;
}

export type AiModelId = "fethron-m3" | "fethron-m3-plus";

export interface AiModel {
  id: AiModelId;
  name: string;
  description: string;
}

export const FETHRON_AGENT_ROUTE = "/fethron-agent";

export const FETHRON_AI = {
  title: "Fethron AI",
  tagline: "Studio-grade tools for builders.",
  agentTagline: "Fethron AI Agent at your service — your order, please.",
  route: FETHRON_AGENT_ROUTE,
  videoBg: "/images/Background%20fethron%20ai%20(online-video-cutter.com).mp4",
  videoBgDark: "/images/dark%20background%20fethron%20ai.mp4",
  docsUrl: `${FETHRON_AGENT_ROUTE}/docs`,
} as const;

export const AI_MODELS: AiModel[] = [
  {
    id: "fethron-m3",
    name: "Fethron M3",
    description: "Efficient for everyday builds and quick iterations.",
  },
  {
    id: "fethron-m3-plus",
    name: "Fethron M3+",
    description: "Most capable — complex roadmaps, audits, and dossiers.",
  },
];

export const AI_TOOLS: AiTool[] = [
  {
    id: "sentinel-audit",
    name: "Sentinel Audit",
    chipLabel: "Smart Contract Audit",
    chipHint: "Security scan before you ship",
    tagline: "Smart contract security, decoded.",
    description:
      "Paste your Solidity or deployment address. Sentinel scans for common vulnerabilities, gas risks, and upgrade patterns — a clear report before you ship on-chain.",
    inputPlaceholder:
      "Paste contract source code or paste your contract address…",
    actionLabel: "Run Audit",
  },
  {
    id: "roadmap-oracle",
    name: "Roadmap Oracle",
    chipLabel: "Know Your Vision",
    chipHint: "Turn your idea into a roadmap",
    tagline: "Your idea, mapped to milestones.",
    description:
      "Describe what you're building in plain language. The Oracle returns a phased roadmap — MVP scope, dependencies, and what to tackle first.",
    inputPlaceholder:
      "Tell us your idea — product, audience, and what success looks like…",
    actionLabel: "Generate Roadmap",
  },
  {
    id: "venture-dossier",
    name: "Venture Dossier",
    chipLabel: "Launch Brief",
    chipHint: "Costing, brand names & viability",
    tagline: "One brief. Costing, brand, viability.",
    description:
      "Share your concept once. Venture Dossier assembles a downloadable HTML brief — cost estimates, timeline, feasibility score, and brand name directions.",
    inputPlaceholder:
      "Describe your venture — problem, solution, market, and budget range…",
    actionLabel: "Build Dossier",
  },
];

export function getAiTool(id: AiToolId): AiTool | undefined {
  return AI_TOOLS.find((t) => t.id === id);
}
