import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Last Peace of Art.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: May 28, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Information We Collect</h2>
          <p>We collect the following information when you use the Platform:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li><strong>Account Information:</strong> name, email address, and profile photo when you register via email or Google OAuth.</li>
            <li><strong>Profile Information:</strong> bio, skills, avatar, banner, and any other content you add to your profile.</li>
            <li><strong>Content:</strong> projects, blog posts, forum threads, comments, and any other content you create.</li>
            <li><strong>Usage Data:</strong> pages visited, time spent, and interactions with the Platform.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li>Provide, maintain, and improve the Platform</li>
            <li>Authenticate your identity and secure your account</li>
            <li>Display your profile and content to other users</li>
            <li>Send you important account-related notifications</li>
            <li>Respond to your support requests</li>
            <li>Detect and prevent fraudulent or abusive activity</li>
            <li>Analyze usage patterns to improve user experience</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. Data Sharing</h2>
          <p>We do not sell your personal information. We may share your data only in the following cases:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li>With your explicit consent</li>
            <li>With service providers who help operate the Platform (e.g., hosting, analytics)</li>
            <li>To comply with legal obligations or respond to lawful requests</li>
            <li>To protect the rights, property, or safety of our users or the public</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">4. Data Storage and Security</h2>
          <p>Your data is stored securely on servers provided by Neon (PostgreSQL) and Vercel. We implement industry-standard security measures including encryption in transit (TLS) and at rest. However, no method of electronic storage is 100% secure.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">5. Data Retention</h2>
          <p>We retain your data for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where retention is required by law.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at the email below.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">7. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We may also use analytics cookies to understand how the Platform is used. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">8. Third-Party Services</h2>
          <p>The Platform uses the following third-party services:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
            <li><strong>Google OAuth:</strong> for authentication via Google accounts</li>
            <li><strong>Neon:</strong> for PostgreSQL database hosting</li>
            <li><strong>Vercel:</strong> for application hosting and deployment</li>
          </ul>
          <p className="mt-2">Each service has its own privacy policy governing data handling.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">9. Children&apos;s Privacy</h2>
          <p>The Platform is not directed at children under 13. We do not knowingly collect personal information from children. If we learn that a child under 13 has provided us with personal data, we will delete it.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or a notice on the Platform.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">11. Contact</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:fghfghffdgfhfgh@gmail.com" className="text-amber-600 hover:underline dark:text-amber-400">fghfghffdgfhfgh@gmail.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
