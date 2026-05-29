"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            We&apos;ve sent a verification link to your email address.
            Click the link to activate your account.
          </p>
        </div>

        <Link
          href="/login"
          className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          Return to sign in
        </Link>
      </div>
    </motion.div>
  );
}
