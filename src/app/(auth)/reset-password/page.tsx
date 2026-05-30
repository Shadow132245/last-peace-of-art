"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/providers/i18n-provider";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(t("auth.invalidOrExpiredToken"));
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, token }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message ?? data.statusText ?? "Failed");
      else setSuccess(true);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6 }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("auth.resetPassword")}</h1>
          <p className="mt-2 text-sm text-red-500">{t("auth.invalidOrExpiredToken")}</p>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>
      </motion.div>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6 }}
        className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
      >
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">{t("auth.passwordResetSuccess")}</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {t("auth.signInToAccount")}
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6 }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("auth.resetPasswordTitle")}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("auth.resetPasswordDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t("auth.newPassword")}
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <Input
            label={t("auth.confirmPassword")}
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            {t("auth.resetPassword")}
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
