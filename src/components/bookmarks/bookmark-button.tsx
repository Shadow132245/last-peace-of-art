"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function BookmarkButton({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data: session } = authClient.useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/bookmarks`)
      .then((r) => r.json())
      .then((data) => {
        for (const group of data) {
          if (group.entityType === entityType && group.items.some((i: any) => i.entityId === entityId)) {
            setSaved(true);
            break;
          }
        }
      })
      .catch(() => {});
  }, [entityType, entityId]);

  const toggle = async () => {
    if (!session || loading) return;
    setLoading(true);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.action === "added" || data.id !== undefined);
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <Link href="/login" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <BookmarkIcon filled={false} />
      </Link>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${saved ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}
