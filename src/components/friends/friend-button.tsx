"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function AddFriendButton({ userId }: { userId: string }) {
  const { data: session } = authClient.useSession();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!session || session.user.id === userId) return null;

  const handleAdd = async () => {
    setLoading(true);
    const res = await fetch("/api/friends/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userId }),
    });
    if (res.ok) setSent(true);
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || sent}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        sent
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
          : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }`}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      ) : sent ? (
        "Request Sent"
      ) : (
        "Add Friend"
      )}
    </button>
  );
}
