"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useI18n } from "@/providers/i18n-provider";

export default function VerifyEmailPage() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("auth.checkEmail")}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("auth.checkEmailDesc")}
          </p>
        </div>

        <Link
          href="/login"
          className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          {t("auth.returnToSignIn")}
        </Link>
      </div>
    </motion.div>
  );
}
