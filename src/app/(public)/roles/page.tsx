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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FadeInView>
        <h1 className="text-3xl font-bold">{t("roles.title")}</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t("roles.subtitle")}</p>
      </FadeInView>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {ROLES.map((role, i) => (
          <FadeInView key={role.id} delay={i * 0.05}>
            <div className={`rounded-xl border p-5 ${role.color}`}>
              <div className="flex items-start gap-4">
                <span className="text-3xl">{role.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">{t(`roles.${role.id}.name`)}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t(`roles.${role.id}.desc`)}</p>
                  <div className="mt-4 space-y-2 text-sm">
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
        <div className="mt-12 rounded-xl border border-zinc-200 p-6 text-center dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">{t("roles.cta")}</p>
          <Link href="/badges" className="mt-3 inline-block rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
            {t("roles.viewBadges")}
          </Link>
        </div>
      </FadeInView>
    </div>
  );
}
