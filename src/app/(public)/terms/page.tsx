"use client";

import { useI18n } from "@/providers/i18n-provider";
import { FadeInView } from "@/components/ui/fade-in-view";

export default function TermsPage() {
  const { t } = useI18n();

  const sections = [
    { title: t("legal.terms.s1Title"), content: t("legal.terms.s1Content") },
    { title: t("legal.terms.s2Title"), content: t("legal.terms.s2Content") },
    { title: t("legal.terms.s3Title"), content: t("legal.terms.s3Content") },
    { title: t("legal.terms.s4Title"), content: t("legal.terms.s4Content") },
    { title: t("legal.terms.s5Title"), list: t("legal.terms.s5List") },
    { title: t("legal.terms.s6Title"), content: t("legal.terms.s6Content") },
    { title: t("legal.terms.s7Title"), content: t("legal.terms.s7Content") },
    { title: t("legal.terms.s8Title"), content: t("legal.terms.s8Content") },
    { title: t("legal.terms.s9Title"), content: t("legal.terms.s9Content") },
    { title: t("legal.terms.s10Title"), content: t("legal.terms.s10Content") },
    { title: t("legal.terms.s11Title"), content: t("legal.terms.s11Content") },
    { title: t("legal.terms.s12Title"), content: t("legal.terms.s12Content") },
    { title: t("legal.terms.s13Title"), content: t("legal.terms.s13Content") },
    { title: t("legal.terms.s14Title"), content: t("legal.terms.s14Content") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FadeInView>
        <h1 className="text-4xl font-bold">{t("legal.termsTitle")}</h1>
      </FadeInView>
      <FadeInView delay={0.1}>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("legal.lastUpdated").replace("{date}", "May 28, 2026")}</p>
      </FadeInView>

      <FadeInView delay={0.15}>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {sections.map((s, i) => {
            if (!s.title || s.title.startsWith("legal.")) return null;
            return (
              <section key={i}>
                <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</h2>
                {s.content && !s.content.startsWith("legal.") && <p>{s.content}</p>}
                {s.list && !s.list.startsWith("legal.") && (
                  <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
                    {s.list.split(" | ").map((item, j) => (
                      <li key={j}>{item.trim()}</li>
                    ))}
                  </ul>
                )}
                {i === sections.length - 1 && (
                  <p className="mt-2">
                    <a href="mailto:fghfghffdgfhfgh@gmail.com" className="text-amber-600 hover:underline dark:text-amber-400">fghfghffdgfhfgh@gmail.com</a>
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </FadeInView>
    </div>
  );
}
