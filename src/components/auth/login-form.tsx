"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/providers/i18n-provider";

export function LoginForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: err } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });
    if (err) {
      setError(err.message ?? err.statusText);
    } else if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      setTwoFactorRequired(true);
      await authClient.twoFactor.sendOtp();
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOtpLoading(true);

    const { error: err } = await authClient.twoFactor.verifyOtp({ code: otpCode });
    if (err) setError(err.message ?? err.statusText);
    else router.push("/dashboard");
    setOtpLoading(false);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  if (twoFactorRequired) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("auth.twoFactorTitle")}</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("auth.twoFactorDesc")}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <Input
            label={t("auth.verificationCode")}
            type="text"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" loading={otpLoading} className="w-full">
            {t("auth.verify")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("auth.resendCode")}{" "}
          <button
            type="button"
            onClick={() => authClient.twoFactor.sendOtp()}
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            {t("auth.verificationCode")}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{t("auth.welcomeBack")}</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t("auth.signInToAccount")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t("auth.continueWithGoogle")}
        </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-300 dark:border-zinc-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
            {t("auth.orWith")}
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <Input
          label={t("auth.email")}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={t("auth.password")}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:text-zinc-100 dark:focus:ring-zinc-100"
          />
          {t("auth.rememberMe")}
        </label>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {t("auth.signIn")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {t("auth.dontHaveAccount")}{" "}
        <a href="/register" className="font-medium text-zinc-900 underline dark:text-zinc-100">
          {t("auth.signUp")}
        </a>
      </p>
    </div>
  );
}
