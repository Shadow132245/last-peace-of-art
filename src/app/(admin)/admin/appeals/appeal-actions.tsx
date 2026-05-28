"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

export function AppealActions({ appealId }: { appealId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (status: "approved" | "rejected") => {
    setLoading(status);
    await fetch(`/api/admin/appeals/${appealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminResponse: status === "approved" ? "Appeal approved. Your account has been reinstated." : "Appeal rejected. The suspension stands." }),
    });
    router.refresh();
    setLoading(null);
  };

  return (
    <div className="flex gap-2">
      <motion.button
        onClick={() => handleAction("approved")}
        disabled={loading !== null}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-200 disabled:opacity-50 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
      >
        {loading === "approved" ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent dark:border-emerald-300" />
        ) : (
          "Approve"
        )}
      </motion.button>
      <motion.button
        onClick={() => handleAction("rejected")}
        disabled={loading !== null}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-200 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50"
      >
        {loading === "rejected" ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent dark:border-red-300" />
        ) : (
          "Reject"
        )}
      </motion.button>
    </div>
  );
}
