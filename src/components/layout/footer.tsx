"use client";

import Link from "next/link";
import { useI18n } from "@/providers/i18n-provider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-start">
            <Link href="/" className="text-lg font-bold tracking-tight">Last Peace</Link>
            <p className="mt-2 max-w-xs text-xs text-zinc-500 dark:text-zinc-400">{t("footer.description")}</p>
            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} Last Peace of Art. {t("footer.copyright")}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-center sm:justify-end sm:text-start">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">{t("footer.quickLinks")}</p>
              <div className="flex flex-col gap-2">
                <Link href="/projects" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.projects")}</Link>
                <Link href="/blog" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.posts")}</Link>
                <Link href="/forum" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.forum")}</Link>
                <Link href="/about" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.aboutUs")}</Link>
                <Link href="/badges" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.badges")}</Link>
                <Link href="/roles" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("nav.roles")}</Link>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">{t("footer.legal")}</p>
              <div className="flex flex-col gap-2">
                <Link href="/terms" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("footer.terms")}</Link>
                <Link href="/privacy" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">{t("footer.privacy")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}