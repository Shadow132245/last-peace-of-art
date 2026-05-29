"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/providers/i18n-provider";

export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session, refetch: refetchSession } = authClient.useSession();

  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const twoFactorEnabled = (session?.user as any)?.twoFactorEnabled ?? false;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleEnable2FA = async () => {
    setTwoFactorLoading(true);
    setTwoFactorError("");
    const { data, error } = await authClient.twoFactor.enable({ password: twoFactorPassword || undefined });
    if (error) {
      setTwoFactorError(error.message ?? error.statusText);
    } else {
      const codes = (data?.backupCodes ?? []) as string[];
      setBackupCodes(codes);
      setTwoFactorPassword("");
      refetchSession();
    }
    setTwoFactorLoading(false);
  };

  const handleDisable2FA = async () => {
    setTwoFactorLoading(true);
    setTwoFactorError("");
    const { error } = await authClient.twoFactor.disable({ password: twoFactorPassword || undefined });
    if (error) {
      setTwoFactorError(error.message ?? error.statusText);
    } else {
      setTwoFactorPassword("");
      setBackupCodes(null);
      refetchSession();
    }
    setTwoFactorLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-2xl px-4 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        {t("nav.settings")}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <h3 className="font-semibold">{t("auth.email")}</h3>
        <div className="mt-4 space-y-3 text-sm">
          <p><span className="text-zinc-500">{t("auth.name")}:</span> {session?.user.name}</p>
          <p><span className="text-zinc-500">{t("auth.email")}:</span> {session?.user.email}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <h3 className="font-semibold">{t("twoFactor.enable")}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {twoFactorEnabled ? t("twoFactor.enabled") : t("twoFactor.disabled")}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <Input
            label={t("twoFactor.confirmPassword")}
            type="password"
            placeholder={t("twoFactor.password")}
            value={twoFactorPassword}
            onChange={(e) => { setTwoFactorPassword(e.target.value); setTwoFactorError(""); }}
          />
          <p className="-mt-2 text-xs text-zinc-400">{t("twoFactor.passwordOptional")}</p>

          {twoFactorError && <p className="text-sm text-red-500">{twoFactorError}</p>}

          {twoFactorEnabled ? (
            <Button
              variant="danger"
              onClick={handleDisable2FA}
              loading={twoFactorLoading}
              className="w-full sm:w-auto"
            >
              {t("twoFactor.disable")}
            </Button>
          ) : (
            <Button
              onClick={handleEnable2FA}
              loading={twoFactorLoading}
              className="w-full sm:w-auto"
            >
              {t("twoFactor.enable")}
            </Button>
          )}
        </div>

        {backupCodes && backupCodes.length > 0 && (
          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h4 className="mb-2 text-sm font-semibold">{t("twoFactor.backupCodes")}</h4>
            <p className="mb-3 text-xs text-zinc-500">{t("twoFactor.saveCodes")}</p>
            <div className="grid grid-cols-2 gap-1 font-mono text-sm">
              {backupCodes.map((code, i) => (
                <code key={i} className="rounded bg-zinc-200/50 px-2 py-1 dark:bg-zinc-800">
                  {code}
                </code>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="mt-6"
      >
        <Button variant="danger" onClick={handleLogout}>{t("nav.signOut")}</Button>
      </motion.div>
    </motion.div>
  );
}
