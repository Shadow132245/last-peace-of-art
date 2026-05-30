"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/providers/i18n-provider";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    const { error: err } = await authClient.forgetPassword({
      email,
      redirectTo: "/reset-password",
    });
    if (err) setError(err.message ?? err.statusText);
    else setSent(true);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("auth.forgotPasswordTitle")}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("auth.forgotPasswordDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label={t("auth.email")}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSent(false); }}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {sent && <p className="text-sm text-green-500">{t("auth.resetLinkSent")}</p>}

          <Button type="submit" loading={loading} className="w-full">
            {t("auth.sendResetLink")}
          </Button>
        </form>

        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          {t("auth.returnToSignIn")}
        </Link>
      </div>
    </motion.div>
  );
}
