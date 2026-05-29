"use client";

import { useEffect } from "react";

export function ViewTracker({ entityType, entityId }: { entityType: string; entityId: string }) {
  useEffect(() => {
    const key = `viewed_${entityType}_${entityId}`;
    if (typeof window !== "undefined" && localStorage.getItem(key)) return;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId }),
    }).then(() => {
      if (typeof window !== "undefined") localStorage.setItem(key, "1");
    }).catch(() => {});
  }, [entityType, entityId]);

  return null;
}
