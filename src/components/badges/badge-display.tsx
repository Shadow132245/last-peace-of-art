"use client";

import { i18nBadge } from "@/lib/badge-i18n";
import { useI18n } from "@/providers/i18n-provider";

const COLORS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  stone: "bg-stone-100 text-stone-700 dark:bg-stone-900/50 dark:text-stone-300",
  zinc: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

type BadgeData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  howToGet: string;
  perk: string;
};

export function BadgeDisplay({ badge, lang = "en" }: { badge: BadgeData; lang?: string }) {
  const { t } = useI18n();
  const l = (lang === "ar" ? "ar" : "en") as "ar" | "en";
  const c = COLORS[badge.color] ?? COLORS.zinc;

  return (
    <span
      title={i18nBadge(badge.description, l)}
      className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}
    >
      <span>{badge.icon}</span>
      <span>{i18nBadge(badge.name, l)}</span>
    </span>
  );
}
