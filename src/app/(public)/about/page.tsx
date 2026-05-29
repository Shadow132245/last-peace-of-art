import type { Metadata } from "next";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT();
  return {
    title: `${t("about.title")} — Last Peace of Art`,
    description: t("about.subtitle"),
  };
}

export default async function AboutPage() {
  const { t } = await getServerT();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("about.title")}</h1>
        <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">{t("about.subtitle")}</p>
      </div>

      <section className="mt-16">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">{t("about.owner")}</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-xl font-bold text-white dark:bg-white dark:text-zinc-900">
              S
            </div>
            <div>
              <p className="font-medium">{t("about.ownerName")}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("about.ownerDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">{t("about.whatIs")}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">{t("about.whatIsDesc")}</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">{t("about.features")}</h2>
          <ul className="mt-4 space-y-3">
            {["featureProjects", "featurePosts", "featureForum", "featureProfile", "featureMessages"].map((key) => (
              <li key={key} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-300">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-900 dark:bg-white" />
                <span>{t(`about.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">{t("about.howTo")}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">{t("about.howToDesc")}</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">{t("about.mission")}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">{t("about.missionDesc")}</p>
        </div>
      </section>

      <p className="mt-12 text-center text-sm text-zinc-400">{t("about.footer")}</p>
    </main>
  );
}
