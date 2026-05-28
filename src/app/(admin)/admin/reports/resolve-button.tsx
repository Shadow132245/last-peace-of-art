"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

export function ResolveButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "PATCH" });
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.button
      onClick={handleResolve}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-200 disabled:opacity-50 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
    >
      {loading ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent dark:border-emerald-300" />
      ) : (
        "Resolve"
      )}
    </motion.button>
  );
}
