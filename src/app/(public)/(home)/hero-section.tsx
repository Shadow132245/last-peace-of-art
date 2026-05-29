"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

export function HeroSection({ loggedIn }: { loggedIn: boolean }) {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:pb-32 sm:pt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-transparent dark:from-transparent dark:to-transparent" />
      <motion.div
        className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-100/30 blur-3xl dark:bg-transparent"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="mx-auto max-w-5xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Your space to{" "}
          <span className="bg-gradient-to-r from-amber-700 via-zinc-800 to-zinc-900 bg-clip-text text-transparent dark:from-zinc-300 dark:to-white">
            create, share, connect
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400"
        >
          Showcase your projects, write about your passions, share your profile, or start a discussion.
          The last peace of art is where your ideas find their home.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
            >
              {t("nav.dashboard")}
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
              >
                {t("landing.getStarted")}
              </Link>
              <Link
                href="/projects"
                className="rounded-lg border border-zinc-300 bg-white/50 px-8 py-3 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white active:scale-95 dark:border-zinc-600 dark:bg-transparent dark:text-zinc-300 dark:shadow-none dark:hover:bg-zinc-800/30"
              >
                {t("nav.projects")}
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
