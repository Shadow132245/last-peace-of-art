"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/providers/i18n-provider";
import { authClient } from "@/lib/auth-client";

export default function BannedPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authClient.getSession().then((res) => {
      const user = res.data?.user as any;
      if (!user || !user.banned) router.push("/dashboard");
      else setChecking(false);
    });
  }, [router]);

  if (checking) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="mb-6 text-7xl"
      >
        🚫
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mb-3 text-4xl font-bold"
      >
        {t("banned.title")}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="mb-8 w-full rounded-2xl border border-red-200/80 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/30"
      >
        <p className="text-zinc-700 dark:text-zinc-300">
          {t("banned.description")}
        </p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-6 text-sm text-zinc-500"
      >
        {t("banned.contactText")}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <Link
          href="mailto:fghfghffdgfhfgh@gmail.com"
          className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("banned.contactButton")}
        </Link>
      </motion.div>
    </motion.div>
  );
}
