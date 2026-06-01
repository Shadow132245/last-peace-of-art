"use client";

import { useState, useEffect } from "react";
import { i18nBadge } from "@/lib/badge-i18n";
import { useI18n } from "@/providers/i18n-provider";

type BadgeData = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  howToGet: string;
  perk: string;
};

const COLORS: Record<string, string> = {
  blue: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950",
  amber: "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950",
  yellow: "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950",
  emerald: "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950",
  purple: "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-950",
  sky: "border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950",
  rose: "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950",
  indigo: "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950",
  stone: "border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-950",
  zinc: "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950",
};

export function BadgeSelector({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const { t, locale } = useI18n();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const lang = (locale === "ar" ? "ar" : "en") as "ar" | "en";

  useEffect(() => {
    fetch("/api/badges").then((r) => r.json()).then(setBadges).catch(() => {});
  }, []);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < 6) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500">{t("badges.selectUpTo6")}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {badges.map((badge) => {
          const active = selected.includes(badge.id);
          const c = COLORS[badge.color] ?? COLORS.zinc;
          return (
            <button
              key={badge.id}
              onClick={() => toggle(badge.id)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all ${
                active ? `${c} ring-2 ring-zinc-500 dark:ring-zinc-400` : "border-zinc-200 opacity-60 hover:opacity-100 dark:border-zinc-700"
              }`}
            >
              <span className="text-base">{badge.icon}</span>
              <span className="font-medium">{i18nBadge(badge.name, lang)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
