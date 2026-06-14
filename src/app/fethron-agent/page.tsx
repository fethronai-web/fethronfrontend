import { AiToolsHub } from "@/components/fethron-ai/ai-tools-hub";
import { FaqJsonLd } from "@/components/seo/structured-data";

const AGENT_FAQS = [
  {
    q: "What can Fethron AI do?",
    a: "Fethron AI offers two free studio-grade tools: Vision to Launch turns any product idea into a complete launch blueprint with roadmap, features, tech stack, brand direction, and Fethron costing — delivered as a polished HTML report. Smart Contract Audit analyses pasted Solidity source code or uploaded .sol files for security vulnerabilities before you ship on-chain.",
  },
  {
    q: "Is Fethron AI free?",
    a: "Yes. Both Vision to Launch and Smart Contract Audit are completely free. No signup or account required to use them.",
  },
  {
    q: "What is Vision to Launch?",
    a: "Vision to Launch is a free AI tool by Fethron that converts a raw product idea into a full launch plan: vision, phased roadmap, feature list, tech stack, brand name directions with logo concepts, real Fethron pricing, and a viability read. Output is a polished, downloadable HTML report.",
  },
  {
    q: "What is Smart Contract Audit?",
    a: "Smart Contract Audit is a free AI tool that analyses Solidity smart contract source code for common security vulnerabilities. Paste your code or upload .sol files — the tool returns findings with severity ratings, affected lines, and remediation steps. It is a pre-audit check, not a substitute for a full independent manual audit before mainnet deployment.",
  },
  {
    q: "Is my data safe on Fethron AI?",
    a: "Inputs are processed by trusted AI model providers solely to generate your result. They are not used to train public models. Do not submit private keys, passwords, or confidential credentials. Full details are in Fethron's privacy policy at fethron.com/privacy.",
  },
  {
    q: "Can Fethron build what the AI plans?",
    a: "Yes. Fethron is a full-service digital product studio. If you like the Vision to Launch blueprint, the same studio can design and build it. Start a project at fethron.com/submit.",
  },
];

export default function FethronAiPage() {
  return (
    <>
      {/* JSON-LD for AI engine citations — FAQPage feeds Google AI Mode,
          Perplexity, and ChatGPT Search with structured answers about the tool */}
      <FaqJsonLd items={AGENT_FAQS} />
      {/* Visually hidden but fully crawlable static content block.
          AI search engines (Perplexity, ChatGPT) read page text, not just
          JSON-LD, so this ensures the tool description is indexable even
          though the rest of the page is JS-rendered. */}
      <section className="sr-only" aria-label="About Fethron AI">
        <h1>Fethron AI — Free Vision-to-Launch Planner and Smart Contract Audit</h1>
        <p>
          Fethron AI is a free set of studio-grade tools built by Fethron, a digital product studio.
          It offers two tools: Vision to Launch and Smart Contract Audit. No signup is required.
        </p>
        <h2>Vision to Launch</h2>
        <p>
          Describe any product, app, or business idea and receive a complete launch blueprint:
          vision statement, phased roadmap, feature list, recommended tech stack, brand name
          directions with logo concepts, real Fethron project costing, and a viability assessment.
          Delivered as a polished HTML report you can download and share.
        </p>
        <h2>Smart Contract Audit</h2>
        <p>
          Paste Solidity source code or upload .sol files to receive a security analysis before
          shipping on-chain. The audit identifies common vulnerabilities, rates severity, shows
          affected lines and code snippets, and provides remediation steps. Source-only — does
          not audit from a contract address. Not a substitute for a full independent manual audit
          before mainnet deployment with real funds.
        </p>
        <h2>Frequently Asked Questions</h2>
        {AGENT_FAQS.map(({ q, a }) => (
          <div key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </section>
      <AiToolsHub />
    </>
  );
}
