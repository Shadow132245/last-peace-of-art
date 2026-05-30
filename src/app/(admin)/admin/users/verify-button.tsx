"use client";

import { useState } from "react";

export function VerifyButton({ userId, emailVerified }: { userId: string; emailVerified: boolean }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(emailVerified);

  if (done) return <span className="text-xs text-green-600 dark:text-green-400">Verified</span>;

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [userId] }),
      });
      const data = await res.json();
      if (res.ok && data.updated > 0) setDone(true);
    } catch {}
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleVerify}
      disabled={loading}
      className="text-xs font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600 disabled:opacity-50 dark:text-zinc-100 dark:hover:text-zinc-400"
    >
      {loading ? "..." : "Verify"}
    </button>
  );
}
