import Link from "next/link";
import { getServerT } from "@/lib/server-i18n";

export async function Footer() {
  const { t } = await getServerT();
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Last Peace of Art. {t("footer.copyright")}
        </p>
        <div className="flex items-center gap-6">
          <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t("nav.projects")}
          </Link>
          <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t("nav.posts")}
          </Link>
          <Link href="/forum" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t("nav.forum")}
          </Link>
          <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
            {t("footer.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
