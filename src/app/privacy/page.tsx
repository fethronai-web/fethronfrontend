import type { Metadata } from "next";
import { LegalShell, LegalSection, LegalList } from "@/components/layout/legal-shell";
import { SEO, studioPageMeta } from "@/config/seo";

export const metadata: Metadata = studioPageMeta(SEO.privacy);

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="10 June 2026"
      intro="This policy explains what information Fethron (“Fethron”, “we”, “us”) collects when you use our website, contact us, or use our AI agent — and how we use, share, and protect it. We keep data collection to the minimum needed to run our studio and serve you well."
    >
      <LegalSection n={1} title="Who we are">
        <p>
          Fethron is a digital studio based in India offering design, web, mobile,
          AI, Web 3.0, brand, and digital-marketing services. You can reach us any
          time at fethronai@gmail.com. For privacy matters, the same address is our
          point of contact.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Information we collect">
        <p>We only collect what you choose to give us or what is needed to operate the site:</p>
        <LegalList
          items={[
            <>
              <strong className="text-off-white">Contact details</strong> — your name, email, phone (if you
              provide it), and the contents of any message, letter, or newsletter sign-up you submit.
            </>,
            <>
              <strong className="text-off-white">AI agent inputs</strong> — the prompts, ideas, and any code or
              images you submit to our agent so it can generate your report. You should not submit secrets,
              passwords, private keys, or confidential personal data.
            </>,
            <>
              <strong className="text-off-white">Technical &amp; usage data</strong> — basic, non-identifying
              information such as approximate region, device/browser type, and pages visited, used to keep the
              service secure and improve it.
            </>,
            <>
              <strong className="text-off-white">Cookies / local storage</strong> — small items stored in your
              browser to remember preferences (e.g. theme) and to operate features; we do not use them to build
              advertising profiles.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="How we use your information">
        <LegalList
          items={[
            "To respond to your enquiries and deliver the services or reports you request.",
            "To operate, secure, maintain, and improve our website and AI agent.",
            "To send you information you asked for (e.g. a reply to your letter). We do not send marketing email without your consent.",
            "To prevent abuse, fraud, and to enforce our terms.",
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="Our AI agent">
        <p>
          When you use the agent, your prompt (and any code or image you attach) is processed by trusted
          third-party AI model providers solely to generate your result. We do not sell this content, and we do
          not use it to train public models. Generated reports are stored so you can re-open them, and are
          associated with your session or account. Treat AI output as guidance, not professional, legal, or
          financial advice — verify anything critical before relying on it.
        </p>
      </LegalSection>

      <LegalSection n={5} title="How we share information">
        <p>
          We do not sell your personal information. We share it only with service providers who help us run
          Fethron, and only as needed:
        </p>
        <LegalList
          items={[
            "Hosting, storage, and content-delivery providers that run our infrastructure.",
            "AI model and search providers that power the agent.",
            "Messaging delivery (email, Discord, WhatsApp) used to route the letters and enquiries you send us.",
            "Where required by law, or to protect our rights, users, or the public.",
          ]}
        />
      </LegalSection>

      <LegalSection n={6} title="Data retention">
        <p>
          We keep your information only as long as needed for the purpose it was collected, to provide ongoing
          services, or to meet legal obligations — after which it is deleted or anonymised. You may ask us to
          delete your data at any time (see “Your rights”).
        </p>
      </LegalSection>

      <LegalSection n={7} title="Security">
        <p>
          We use reasonable technical and organisational measures to protect your information, including access
          controls, encryption in transit, input validation, and abuse safeguards. No method of transmission or
          storage is 100% secure, but we work to protect your data and to respond quickly to any issue.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Your rights & choices">
        <LegalList
          items={[
            "Access — ask what personal information we hold about you.",
            "Correction — ask us to fix inaccurate details.",
            "Deletion — ask us to delete your information, subject to legal limits.",
            "Withdraw consent — opt out of optional communications at any time.",
          ]}
        />
        <p>To exercise any of these, email fethronai@gmail.com and we will respond within a reasonable time.</p>
      </LegalSection>

      <LegalSection n={9} title="Children">
        <p>
          Our services are intended for adults and businesses. We do not knowingly collect personal information
          from children under 16. If you believe a child has provided us data, contact us and we will remove it.
        </p>
      </LegalSection>

      <LegalSection n={10} title="International users & transfers">
        <p>
          We operate from India and may process data on servers located in other countries via our providers.
          Where data is transferred internationally, we take steps to ensure it remains protected consistent with
          this policy.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Changes to this policy">
        <p>
          We may update this policy as our services evolve. The “last updated” date above always reflects the
          current version; material changes will be made clear on this page.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
