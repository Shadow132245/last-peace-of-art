import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FadeInView } from "@/components/ui/fade-in-view";
import { getServerT } from "@/lib/server-i18n";
import { i18nBadge } from "@/lib/badge-i18n";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT();
  return { title: t("badges.title"), description: t("badges.metaDesc") };
}

const COLORS: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950",
  amber: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
  yellow: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
  emerald: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950",
  purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950",
  sky: "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950",
  rose: "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950",
  indigo: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950",
  stone: "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
  zinc: "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950",
};

export default async function BadgesPage() {
  const { t, locale } = await getServerT();
  const lang = (locale === "ar" ? "ar" : "en") as "ar" | "en";
  const badges = await prisma.badge.findMany({ orderBy: { id: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <FadeInView>
        <h1 className="text-2xl font-bold sm:text-3xl">{t("badges.title")}</h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">{t("badges.subtitle")}</p>
      </FadeInView>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2">
        {badges.map((badge, i) => {
          const c = COLORS[badge.color] ?? COLORS.zinc;
          return (
            <FadeInView key={badge.id} delay={i * 0.05}>
              <div className={`rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${c}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-2xl sm:text-3xl">{badge.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold sm:text-lg">{i18nBadge(badge.name, lang)}</h3>
                    <p className="mt-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">{i18nBadge(badge.description, lang)}</p>
                    <div className="mt-3 space-y-1.5 text-xs sm:mt-4 sm:space-y-2 sm:text-sm">
                      <p>
                        <span className="font-semibold">{t("badges.howToGet")}:</span>{" "}
                        <span className="text-zinc-600 dark:text-zinc-400">{i18nBadge(badge.howToGet, lang)}</span>
                      </p>
                      <p>
                        <span className="font-semibold">{t("badges.perk")}:</span>{" "}
                        <span className="text-zinc-600 dark:text-zinc-400">{i18nBadge(badge.perk, lang)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInView>
          );
        })}
      </div>

      <FadeInView delay={0.6}>
        <div className="mt-10 rounded-xl border border-zinc-200 p-6 text-center transition-all hover:border-amber-200 hover:shadow-sm sm:mt-12 dark:border-zinc-800 dark:hover:border-zinc-600">
          <p className="text-sm text-zinc-500 sm:text-base dark:text-zinc-400">{t("badges.showOnProfile")}</p>
          <Link href="/dashboard/profile" className="mt-3 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            {t("badges.goToProfile")}
          </Link>
        </div>
      </FadeInView>
    </div>
  );
}
