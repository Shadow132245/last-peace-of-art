"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
        className="text-6xl font-bold"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="mt-4 text-lg text-zinc-500 dark:text-zinc-400"
      >
        {t("notFound.description")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          {t("notFound.goHome")}
        </Link>
      </motion.div>
    </motion.div>
  );
}
