"use client";

import { useState } from "react";
import { motion } from "motion/react";

type EntityType = "posts" | "projects" | "threads";

export function AdminPublishToggle({ entityType, entityId, published }: { entityType: EntityType; entityId: string; published: boolean }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);

  if (published) return null;

  const handleAccept = async () => {
    setActive(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  if (error) {
    return (
      <span className="inline-block rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
        Failed
      </span>
    );
  }

  if (active) {
    return (
      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
        Accepted
      </span>
    );
  }

  return (
    <motion.button
      onClick={handleAccept}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 transition-all duration-200 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
    >
      Accept
    </motion.button>
  );
}
