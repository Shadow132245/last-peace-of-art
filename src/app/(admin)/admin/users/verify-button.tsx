"use client";

import { useState } from "react";

export function VerifyButton({ userId, emailVerified }: { userId: string; emailVerified: boolean }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(emailVerified);

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Verified
      </span>
    );
  }

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
      className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
    >
      {loading ? (
        <>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          Verifying...
        </>
      ) : (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Verify
        </>
      )}
    </button>
  );
}
