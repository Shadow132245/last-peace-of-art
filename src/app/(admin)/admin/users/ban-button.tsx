"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

export function BanButton({ userId, banned, targetRole, currentUserRole }: { userId: string; banned: boolean; targetRole: string; currentUserRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isProtected = targetRole === "founder" || (targetRole === "admin" && currentUserRole !== "founder");

  const handleToggle = async () => {
    if (isProtected) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !banned }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading || isProtected}
      whileHover={isProtected ? {} : { scale: 1.05 }}
      whileTap={isProtected ? {} : { scale: 0.95 }}
      title={isProtected ? (targetRole === "founder" ? "Cannot ban the founder" : "Only the founder can ban an admin") : undefined}
      className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        banned
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
          : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50"
      }`}
    >
      {loading ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : banned ? (
        "Unban"
      ) : (
        "Ban"
      )}
    </motion.button>
  );
}
