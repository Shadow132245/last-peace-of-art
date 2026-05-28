"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

export function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    await fetch(url, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.button
      onClick={handleDelete}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-200 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50"
    >
      {loading ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-700 border-t-transparent dark:border-red-300" />
      ) : (
        label
      )}
    </motion.button>
  );
}
