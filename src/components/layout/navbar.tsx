"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "motion/react";

export function Navbar() {
  const [open, setOpen] = useState(false);
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
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80 dark:shadow-none">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Last Peace
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/projects" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Projects
          </Link>
          <Link href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Posts
          </Link>
          <Link href="/forum" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Forum
          </Link>
          <Link href="/search" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Search
          </Link>

          <button onClick={toggleDark} className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" aria-label="Toggle dark mode">
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
              {(session.user as any).role === "admin" && (
                <Link href="/admin" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          className="flex items-center gap-2 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
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
              <Link href="/projects" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>Projects</Link>
              <Link href="/blog" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>Posts</Link>
              <Link href="/forum" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>Forum</Link>
              <Link href="/search" className="text-sm text-zinc-600 dark:text-zinc-400" onClick={() => setOpen(false)}>Search</Link>
              {session ? (
                <Link href="/dashboard" className="text-sm font-medium text-zinc-900 dark:text-zinc-100" onClick={() => setOpen(false)}>Dashboard</Link>
              ) : (
                <Link href="/login" className="text-sm font-medium text-zinc-900 dark:text-zinc-100" onClick={() => setOpen(false)}>Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
