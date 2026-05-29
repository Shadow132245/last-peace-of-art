"use client";

import { useI18n } from "@/providers/i18n-provider";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = { en: "EN", ar: "AR" };

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggle = () => {
    const idx = locales.indexOf(locale);
    const next = locales[(idx + 1) % locales.length];
    setLocale(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-xs font-semibold tracking-wider text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      aria-label="Switch language"
    >
      {labels[locale]}
    </button>
  );
}
