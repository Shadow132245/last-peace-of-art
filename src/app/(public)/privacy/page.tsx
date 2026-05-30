"use client";

import { useI18n } from "@/providers/i18n-provider";
import { FadeInView } from "@/components/ui/fade-in-view";

export default function PrivacyPage() {
  const { t } = useI18n();

  const sections = [
    { title: t("legal.privacy.s1Title"), content: t("legal.privacy.s1Content"), list: t("legal.privacy.s1List") },
    { title: t("legal.privacy.s2Title"), content: t("legal.privacy.s2Content"), list: t("legal.privacy.s2List") },
    { title: t("legal.privacy.s3Title"), content: t("legal.privacy.s3Content"), list: t("legal.privacy.s3List") },
    { title: t("legal.privacy.s4Title"), content: t("legal.privacy.s4Content") },
    { title: t("legal.privacy.s5Title"), content: t("legal.privacy.s5Content") },
    { title: t("legal.privacy.s6Title"), content: t("legal.privacy.s6Content"), list: t("legal.privacy.s6List"), footer: t("legal.privacy.s6Footer") },
    { title: t("legal.privacy.s7Title"), content: t("legal.privacy.s7Content") },
    { title: t("legal.privacy.s8Title"), content: t("legal.privacy.s8Content"), list: t("legal.privacy.s8List"), footer: t("legal.privacy.s8Footer") },
    { title: t("legal.privacy.s9Title"), content: t("legal.privacy.s9Content") },
    { title: t("legal.privacy.s10Title"), content: t("legal.privacy.s10Content") },
    { title: t("legal.privacy.s11Title"), content: t("legal.privacy.s11Content") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FadeInView>
        <h1 className="text-4xl font-bold">{t("legal.privacyTitle")}</h1>
      </FadeInView>
      <FadeInView delay={0.1}>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t("legal.lastUpdated").replace("{date}", t("legal.privacyDate"))}</p>
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
                {s.footer && !s.footer.startsWith("legal.") && <p className="mt-2">{s.footer}</p>}
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
