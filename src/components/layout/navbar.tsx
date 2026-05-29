"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "motion/react";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { useI18n } from "@/providers/i18n-provider";

function AvatarDropdown({ session }: { session: any }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = session.user;
  const name: string = user.name ?? "";
  const image: string | null = user.image ?? null;
  const initial = name[0]?.toUpperCase() ?? "?";
  const role: string = (user as any).role ?? "user";
  const profileUrl = `/user/${encodeURIComponent(name)}`;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = [
    { href: profileUrl, label: t("nav.viewProfile") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/dashboard/posts", label: t("nav.myPosts") },
    { href: "/dashboard/forum", label: t("nav.myThreads") },
    { href: "/dashboard/projects", label: t("nav.myProjects") },
    { href: "/dashboard/messages", label: t("nav.messages") },
    { href: "/dashboard/friends", label: t("nav.friends") },
    { href: "/dashboard/settings", label: t("nav.settings") },
    ...(role === "admin" || role === "founder" ? [{ href: "/admin", label: t("nav.admin") }] : []),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
      >
        {image ? (
          <img src={image} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            {initial}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-zinc-400">{user.email}</p>
            </div>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => authClient.signOut()}
                className="flex w-full px-3 py-1.5 text-left text-sm text-red-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {t("nav.signOut")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const { data: session } = authClient.useSession();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dark]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <motion.nav
      className={`sticky top-0 z-50 border-b backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90"
          : "border-transparent bg-white/80 dark:bg-zinc-950/60"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Last Peace
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/projects" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            {t("nav.projects")}
          </Link>
          <Link href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            {t("nav.posts")}
          </Link>
          <Link href="/forum" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            {t("nav.forum")}
          </Link>
          <Link href="/search" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            {t("nav.search")}
          </Link>

          <LocaleSwitcher />
          <button onClick={toggleDark} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" aria-label={t("nav.toggleDark")}>
            {dark ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <AvatarDropdown session={session} />
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {t("nav.signIn")}
            </Link>
          )}
        </div>

        <button
          className="flex items-center gap-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={t("nav.toggleMenu")}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <Link href="/projects" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.projects")}</Link>
              <Link href="/blog" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.posts")}</Link>
              <Link href="/forum" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.forum")}</Link>
              <Link href="/search" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.search")}</Link>
              {session ? (
                <>
                  <Link href={`/user/${encodeURIComponent(session.user.name)}`} className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.viewProfile")}</Link>
                  <Link href="/dashboard" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.dashboard")}</Link>
                  <Link href="/dashboard/posts" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.myPosts")}</Link>
                  <Link href="/dashboard/forum" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.myThreads")}</Link>
                  <Link href="/dashboard/projects" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.myProjects")}</Link>
                  <Link href="/dashboard/messages" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.messages")}</Link>
                  <Link href="/dashboard/friends" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.friends")}</Link>
                  <Link href="/dashboard/settings" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.settings")}</Link>
                  {["admin", "founder"].includes((session.user as any).role) && (
                    <Link href="/admin" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>{t("nav.admin")}</Link>
                  )}
                  <button onClick={() => authClient.signOut()} className="text-left text-sm text-red-500">{t("nav.signOut")}</button>
                </>
              ) : (
                <Link href="/login" className="text-sm font-medium text-zinc-900 dark:text-zinc-100" onClick={() => setOpen(false)}>{t("nav.signIn")}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
