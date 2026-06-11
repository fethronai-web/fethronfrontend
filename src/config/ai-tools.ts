export type AiToolId = "sentinel-audit" | "vision-to-launch";

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
export const FETHRON_AGENT_ORIGIN = "https://aistudio.fethron.com";
export const FETHRON_AGENT_URL =
  process.env.NEXT_PUBLIC_FETHRON_AGENT_URL ??
  (process.env.NODE_ENV === "production" ? FETHRON_AGENT_ORIGIN : FETHRON_AGENT_ROUTE);

/** Keep clean `/c/...` URLs on the agent subdomain while preserving local dev routes. */
export function getFethronAgentPath(path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  if (typeof window !== "undefined" && window.location.hostname === "aistudio.fethron.com") {
    return suffix || "/";
  }
  return `${FETHRON_AGENT_ROUTE}${suffix}`;
}

export const FETHRON_AI = {
  title: "Fethron AI",
  tagline: "Studio-grade tools for builders.",
  agentTagline: "Fethron AI Agent at your service — your order, please.",
  route: FETHRON_AGENT_ROUTE,
  videoBg: "/images/Background%20fethron%20ai%20(online-video-cutter.com).mp4",
  videoBgDark: "/images/dark%20background%20fethron%20ai.mp4",
  docsUrl: `${FETHRON_AGENT_URL}/docs`,
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
      "Paste your Solidity source or upload your .sol file(s). Sentinel scans for common vulnerabilities, gas risks, and upgrade patterns — a clear report before you ship on-chain.",
    inputPlaceholder:
      "Paste your Solidity source code or upload a .sol file…",
    actionLabel: "Run Audit",
  },
  {
    id: "vision-to-launch",
    name: "Vision to Launch",
    chipLabel: "Vision to Launch",
    chipHint: "Idea → roadmap, brand & costing",
    tagline: "Your idea, mapped from vision to launch.",
    description:
      "Describe your idea in plain language. Vision to Launch returns a complete HTML blueprint — a sharp vision, a phased roadmap, brand-name directions with logo concepts, Fethron pricing, and a viability read. Everything you need to go from idea to launch.",
    inputPlaceholder:
      "Describe your idea — what you're building, who it's for, and what success looks like…",
    actionLabel: "Build Blueprint",
  },
];

export function getAiTool(id: AiToolId): AiTool | undefined {
  return AI_TOOLS.find((t) => t.id === id);
}

/** Backend tool ids the agent router uses. */
export type BackendToolKind = "smart-contract-audit" | "know-your-vision";

/**
 * The composer's tool dropdown. "auto" lets the agent pick the tool from the
 * prompt; the others force a specific tool (the backend nudges the user if their
 * prompt doesn't match the forced tool). These ids are sent straight to
 * `chat.send` as `mode`.
 */
export type ToolMode = "auto" | BackendToolKind;

export interface ToolModeOption {
  id: ToolMode;
  label: string;
  hint: string;
  placeholder: string;
}

export const TOOL_MODES: ToolModeOption[] = [
  {
    id: "auto",
    label: "Auto",
    hint: "I'll pick the right tool from your prompt",
    placeholder:
      "Describe your idea for a launch blueprint, paste a Solidity contract for a security audit, or just ask us anything about Fethron — I'll take it from here.",
  },
  {
    id: "know-your-vision",
    label: "Vision to Launch",
    hint: "Idea → roadmap, brand & costing",
    placeholder:
      "Describe your idea — what you're building, who it's for, and the goal. You'll get a vision, phased roadmap, brand directions & costing.",
  },
  {
    id: "smart-contract-audit",
    label: "Smart Contract Audit",
    hint: "Security scan before you ship",
    placeholder:
      "Paste your Solidity source code or upload a .sol file. You'll get a security report — each finding with its file, severity & fix.",
  },
];

export function getToolMode(id: ToolMode): ToolModeOption {
  return TOOL_MODES.find((m) => m.id === id) ?? TOOL_MODES[0]!;
}

/**
 * The tool library shown as buttons under the composer on the agent home. Two are
 * live today; the rest ship soon and render with a "Soon" badge (not clickable).
 * Clicking a LIVE tool button doesn't force a tool — it just nudges the user to the
 * composer's tool dropdown, which is where the actual selection happens.
 */
export type ToolShowcaseIcon = "rocket" | "shield" | "resume" | "architect" | "legal";

export interface ToolShowcaseItem {
  id: string;
  label: string;
  hint: string;
  icon: ToolShowcaseIcon;
  /** false → future tool: shown with a "Soon" badge, not clickable. */
  available: boolean;
}

export const TOOL_SHOWCASE: ToolShowcaseItem[] = [
  { id: "vision-to-launch", label: "Vision to Launch", hint: "Idea → roadmap, brand & costing", icon: "rocket", available: true },
  { id: "smart-contract-audit", label: "Smart Contract Audit", hint: "Security scan before you ship", icon: "shield", available: true },
  { id: "resume-ats", label: "Resume + ATS Score", hint: "Parse & score against ATS", icon: "resume", available: false },
  { id: "project-architect", label: "Project Architect", hint: "Structure, theme & palette", icon: "architect", available: false },
  { id: "legal-agent", label: "Legal Agent", hint: "Digital-build legal guidance", icon: "legal", available: false },
];
