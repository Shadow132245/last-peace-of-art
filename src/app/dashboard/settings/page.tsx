"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TotpQr } from "@/components/ui/totp-qr";
import { useI18n } from "@/providers/i18n-provider";

export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: session, refetch: refetchSession } = authClient.useSession();

  const [twoFactorPassword, setTwoFactorPassword] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [verifying, setVerifying] = useState(false);

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
      const uri = (data as any)?.totpURI ?? null;
      setBackupCodes(codes);
      setTotpUri(uri);
      setTwoFactorPassword("");
    }
    setTwoFactorLoading(false);
  };

  const handleVerifyTotp = async () => {
    if (!totpCode || totpCode.length < 6) return;
    setVerifying(true);
    setTwoFactorError("");
    const { error } = await (authClient.twoFactor as any).verifyTotp({ code: totpCode });
    if (error) {
      setTwoFactorError(error.message ?? t("twoFactor.invalidCode"));
    } else {
      setTotpUri(null);
      setTotpCode("");
      refetchSession();
    }
    setVerifying(false);
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
      setTotpUri(null);
      refetchSession();
    }
    setTwoFactorLoading(false);
  };

  const secretFromUri = (uri: string) => {
    const m = uri.match(/secret=([^&]+)/);
    return m ? m[1] : "";
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

        {totpUri ? (
          <div className="mt-6 space-y-5">
            <div>
              <h4 className="mb-2 text-sm font-semibold">{t("twoFactor.setupTitle")}</h4>
              <p className="mb-4 text-xs text-zinc-500">{t("twoFactor.scanQR")}</p>
              <div className="flex justify-center">
                <TotpQr uri={totpUri} />
              </div>
              <p className="mt-4 text-xs text-zinc-400">{t("twoFactor.manualSetup")}</p>
              <code className="mt-1 block break-all rounded-lg bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-800">
                {secretFromUri(totpUri)}
              </code>
            </div>

            {backupCodes && backupCodes.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h4 className="mb-2 text-sm font-semibold">{t("twoFactor.backupCodes")}</h4>
                <p className="mb-3 text-xs text-zinc-500">{t("twoFactor.saveCodes")}</p>
                <div className="grid grid-cols-2 gap-1 font-mono text-sm">
                  {backupCodes.map((code, i) => (
                    <code key={i} className="rounded bg-zinc-200/50 px-2 py-1 dark:bg-zinc-800">{code}</code>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  value={totpCode}
                  onChange={(e) => { setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setTwoFactorError(""); }}
                  placeholder={t("twoFactor.enterCode")}
                  maxLength={6}
                  className="w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-lg font-mono tracking-widest transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <Button onClick={handleVerifyTotp} loading={verifying} disabled={totpCode.length < 6}>
                  {t("twoFactor.verify")}
                </Button>
              </div>
              {twoFactorError && <p className="text-sm text-red-500">{twoFactorError}</p>}
            </div>
          </div>
        ) : twoFactorEnabled ? (
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
            <Button variant="danger" onClick={handleDisable2FA} loading={twoFactorLoading} className="w-full sm:w-auto">
              {t("twoFactor.disable")}
            </Button>
          </div>
        ) : (
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
            <Button onClick={handleEnable2FA} loading={twoFactorLoading} className="w-full sm:w-auto">
              {t("twoFactor.enable")}
            </Button>
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
