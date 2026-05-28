"use client";

import { useState } from "react";

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

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${
        published
          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      }`}
    >
      {loading ? (
        <span className="inline-block animate-pulse">...</span>
      ) : published ? (
        "Published"
      ) : (
        "Draft"
      )}
    </button>
  );
}
