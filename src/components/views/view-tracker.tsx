"use client";

import { useEffect } from "react";

export function ViewTracker({ entityType, entityId }: { entityType: string; entityId: string }) {
  useEffect(() => {
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId }),
    }).catch(() => {});
  }, [entityType, entityId]);

  return null;
}
