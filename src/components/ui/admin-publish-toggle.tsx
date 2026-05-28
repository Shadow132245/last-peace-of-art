"use client";

import { useState } from "react";
import { motion } from "motion/react";

type EntityType = "posts" | "projects" | "threads";

export function AdminPublishToggle({ entityType, entityId, published }: { entityType: EntityType; entityId: string; published: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      throw new Error("Failed");
    } catch {
      console.error("Toggle failed");
      setLoading(false);
    }
  };

  if (published) return null;

  return (
    <motion.button
      onClick={handleToggle}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-200 disabled:opacity-50 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
    >
      {loading ? (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        "Accept"
      )}
    </motion.button>
  );
}
