import type { Metadata } from "next";
import { FadeInView } from "@/components/ui/fade-in-view";
import { getServerT } from "@/lib/server-i18n";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT();
  return { title: t("roles.title"), description: t("roles.metaDesc") };
}

const ROLES = [
  {
    id: "user",
    icon: "👤",
    color: "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900",
  },
  {
    id: "bug_hunter",
    icon: "🐛",
    color: "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950",
  },
  {
    id: "premium",
    icon: "💎",
    color: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950",
  },
  {
    id: "moderator",
    icon: "🛡️",
    color: "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950",
  },
  {
    id: "admin",
    icon: "⚡",
    color: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950",
  },
  {
    id: "founder",
    icon: "👑",
    color: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
  },
];

export default async function RolesPage() {
  const { t, locale } = await getServerT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <FadeInView>
        <h1 className="text-2xl font-bold sm:text-3xl">{t("roles.title")}</h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base dark:text-zinc-400">{t("roles.subtitle")}</p>
      </FadeInView>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2">
        {ROLES.map((role, i) => (
          <FadeInView key={role.id} delay={i * 0.05}>
            <div className={`rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${role.color}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">{role.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold sm:text-lg">{t(`roles.${role.id}.name`)}</h3>
                  <p className="mt-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">{t(`roles.${role.id}.desc`)}</p>
                  <div className="mt-3 space-y-1.5 text-xs sm:mt-4 sm:space-y-2 sm:text-sm">
                    <p>
                      <span className="font-semibold">{t("roles.requirements")}:</span>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">{t(`roles.${role.id}.req`)}</span>
                    </p>
                    <p>
                      <span className="font-semibold">{t("roles.perks")}:</span>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">{t(`roles.${role.id}.perk`)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>
        ))}
      </div>

      <FadeInView delay={0.6}>
        <div className="mt-10 rounded-xl border border-zinc-200 p-6 text-center transition-all hover:border-amber-200 hover:shadow-sm sm:mt-12 dark:border-zinc-800 dark:hover:border-zinc-600">
          <p className="text-sm text-zinc-500 sm:text-base dark:text-zinc-400">{t("roles.cta")}</p>
          <Link href="/badges" className="mt-3 inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            {t("roles.viewBadges")}
          </Link>
        </div>
      </FadeInView>
    </div>
  );
}
