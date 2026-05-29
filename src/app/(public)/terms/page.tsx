import type { Metadata } from "next";
import { FadeInView } from "@/components/ui/fade-in-view";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Last Peace of Art.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FadeInView>
        <h1 className="text-4xl font-bold">Terms of Service</h1>
      </FadeInView>
      <FadeInView delay={0.1}>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 28, 2026</p>
      </FadeInView>

      <FadeInView delay={0.15}>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Acceptance of Terms</h2>
            <p>By accessing or using Last Peace of Art ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Eligibility</h2>
            <p>You must be at least 13 years old to use the Platform. By creating an account, you represent that you meet this requirement and that all information you provide is accurate.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. Account Responsibilities</h2>
            <p>You are solely responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">4. User Content</h2>
            <p>You retain ownership of all content you post. By posting, you grant the Platform a non-exclusive, royalty-free license to display and distribute your content on the Platform. You represent that your content does not violate any third-party rights.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>Post illegal, harassing, threatening, or abusive content</li>
              <li>Impersonate any person or entity</li>
              <li>Upload viruses, malware, or harmful code</li>
              <li>Attempt to access another user&apos;s account without permission</li>
              <li>Use the Platform for spam, phishing, or unsolicited advertising</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with the proper functioning of the Platform</li>
              <li>Scrape, crawl, or harvest data without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">6. Content Moderation</h2>
            <p>We reserve the right to remove or moderate any content that violates these terms. We may suspend or terminate accounts that repeatedly infringe upon these rules.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">7. Intellectual Property</h2>
            <p>The Platform&apos;s name, logo, design, and code are the property of Last Peace of Art. You may not copy, modify, or distribute them without written permission.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">8. Third-Party Links</h2>
            <p>The Platform may contain links to third-party websites. We are not responsible for their content, privacy practices, or terms.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">9. Disclaimer of Warranties</h2>
            <p>The Platform is provided "as is" without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">10. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">11. Termination</h2>
            <p>We may suspend or terminate your account at any time, with or without cause, with or without notice. Upon termination, your right to use the Platform ceases immediately.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">12. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms. We will notify you of material changes via email or platform notice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">13. Governing Law</h2>
            <p>These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be resolved in the courts of Egypt.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">14. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:fghfghffdgfhfgh@gmail.com" className="text-amber-600 hover:underline dark:text-amber-400">fghfghffdgfhfgh@gmail.com</a>.</p>
          </section>
        </div>
      </FadeInView>
    </div>
  );
}
