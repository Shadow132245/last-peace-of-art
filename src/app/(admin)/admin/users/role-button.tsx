"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

const roles = ["user", "bug_hunter", "admin", "founder"];

export function RoleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.select
      value={currentRole}
      onChange={handleChange}
      disabled={loading}
      whileFocus={{ scale: 1.02 }}
      className={`cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-all disabled:opacity-50 ${
        currentRole === "founder"
          ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          : currentRole === "admin"
            ? "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
            : currentRole === "bug_hunter"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {roles.map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </motion.select>
  );
}
