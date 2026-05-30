"use client";

import { useState } from "react";
import { useI18n } from "@/providers/i18n-provider";

type EntityType = "posts" | "projects" | "forum";

export function TogglePublish({
  entityType,
  entityId,
  published,
}: {
  entityType: EntityType;
  entityId: string;
  published: boolean;
}) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${entityType}/${entityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      throw new Error("Failed to toggle");
    } catch {
      console.error("Toggle failed");
      setLoading(false);
    }
  };

  const label = published ? t("dashboard.unpublish") : t("dashboard.publish");

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
        published
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-800/50"
          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
      }`}
    >
      {loading ? (
        <span className="inline-block animate-pulse">...</span>
      ) : (
        label
      )}
    </button>
  );
}
