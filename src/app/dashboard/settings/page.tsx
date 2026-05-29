"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
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
        Account Settings
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
      >
        <h3 className="font-semibold">Account Info</h3>
        <div className="mt-4 space-y-3 text-sm">
          <p><span className="text-zinc-500">Name:</span> {session?.user.name}</p>
          <p><span className="text-zinc-500">Email:</span> {session?.user.email}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="mt-6"
      >
        <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
      </motion.div>
    </motion.div>
  );
}
