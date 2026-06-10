import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/layout/legal-shell";
import { SEO, studioPageMeta } from "@/config/seo";

export const metadata: Metadata = studioPageMeta(SEO.terms);

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      updated="10 June 2026"
      intro="These terms govern your use of the Fethron website, our AI agent, and any services you engage us for. By using the site or engaging Fethron, you agree to these terms. Please read them carefully."
    >
      <LegalSection n={1} title="About these terms">
        <p>
          “Fethron”, “we”, “us” means the Fethron digital studio. “You” means the visitor, user, or client. A
          separate written proposal or agreement for a specific project, where signed, takes precedence over these
          terms for that project.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Our services">
        <p>
          We provide design, web, mobile, AI, Web 3.0, brand, and digital-marketing services. The website,
          pricing, and AI agent are provided for information and to help you scope work. We may update, improve,
          or discontinue features at any time.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Pricing, quotes & payments">
        <LegalList
          items={[
            "Prices shown on the site (and any discount) are indicative starting points, not a fixed or binding quote. Final pricing is confirmed in a written proposal scoped to your project.",
            "Unless agreed otherwise, project work is billed 50% in advance to begin and 50% on delivery. Monthly services are billed per the agreed cycle.",
            "All prices are in INR and exclusive of applicable taxes (e.g. GST) unless stated.",
            "Advance payments reserve our time and are non-refundable once work has begun, except as required by law or expressly agreed in writing.",
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="Project scope, revisions & timelines">
        <p>
          Each engagement’s scope, deliverables, revision rounds, and timeline are defined in its proposal. Work
          beyond the agreed scope (“change requests”) may affect cost and timeline and will be quoted separately.
          Timelines depend on timely feedback, content, and approvals from you; delays on your side may shift
          delivery dates.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Intellectual property">
        <LegalList
          items={[
            "On full payment for a project, ownership of the final, delivered deliverables transfers to you, except for third-party assets and any pre-existing or open-source components, which remain under their own licences.",
            "Until full payment is received, all work product remains our property.",
            "We may reference and showcase completed work in our portfolio and marketing unless you ask us in writing not to.",
            "Website content, branding, code, and design are owned by Fethron or its licensors and may not be copied without permission.",
          ]}
        />
      </LegalSection>

      <LegalSection n={6} title="The AI agent — important disclaimer">
        <LegalList
          items={[
            "The AI agent (Vision to Launch, Smart Contract Audit, and support answers) is provided “as is” and for informational purposes only.",
            "Its output is automatically generated and may contain errors or omissions. It is NOT professional, legal, financial, security, or investment advice.",
            "A Smart Contract Audit by the agent is an automated review and is not a substitute for a full, independent manual security audit before deploying to mainnet or handling real funds. You remain responsible for your own contracts and deployments.",
            "You are responsible for the inputs you submit and for independently verifying any output before relying on or acting on it.",
            "Do not submit secrets, credentials, private keys, or unlawful, infringing, or harmful content.",
          ]}
        />
      </LegalSection>

      <LegalSection n={7} title="Acceptable use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Use the site or agent for any unlawful, infringing, abusive, or harmful purpose.",
            "Attempt to disrupt, overload, reverse-engineer, scrape at scale, or gain unauthorised access to our systems.",
            "Submit malware, exploit payloads, or content that violates others’ rights.",
            "Misrepresent your identity or use the service to deceive others.",
          ]}
        />
        <p>We may suspend or restrict access (including rate-limiting) to protect the service and other users.</p>
      </LegalSection>

      <LegalSection n={8} title="No guarantee of results">
        <p>
          We bring craft and best effort to every engagement, but we do not guarantee specific business outcomes
          such as rankings, traffic, sales, funding, token performance, or growth — these depend on many factors
          outside our control.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Third-party services">
        <p>
          Our work and the agent may rely on third-party platforms, APIs, and tools. We are not responsible for
          the availability, changes, or actions of third parties, and your use of them may be subject to their
          own terms.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Fethron is not liable for any indirect, incidental, special, or
          consequential damages, or for any loss of profits, data, goodwill, or funds, arising from your use of
          the website, the AI agent, or our services. Our total aggregate liability for any claim relating to a
          paid engagement will not exceed the fees you paid us for that specific engagement. The website and AI
          agent are provided “as is” and “as available”, without warranties of any kind.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Indemnity">
        <p>
          You agree to indemnify and hold Fethron harmless from claims, damages, and costs arising out of your
          misuse of the service, your content or inputs, or your breach of these terms.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Confidentiality">
        <p>
          Both parties will keep non-public information shared for a project confidential and use it only to
          deliver the work, except where disclosure is required by law.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Termination">
        <p>
          Either party may end an engagement as set out in its proposal. We may suspend or terminate access to
          the website or agent for any breach of these terms. Provisions that by their nature should survive
          (e.g. IP, payment owed, liability, indemnity) survive termination.
        </p>
      </LegalSection>

      <LegalSection n={14} title="Governing law">
        <p>
          These terms are governed by the laws of India, and any dispute will be subject to the courts of India.
          If any provision is found unenforceable, the rest remains in effect.
        </p>
      </LegalSection>

      <LegalSection n={15} title="Changes to these terms">
        <p>
          We may update these terms as our services evolve. The “last updated” date above reflects the current
          version; continued use after changes means you accept the updated terms.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
