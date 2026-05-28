"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const reasons = [
  "Spam",
  "Harassment",
  "Inappropriate content",
  "Copyright violation",
  "Misinformation",
  "Other",
];

export function ReportButton({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!session) {
    return (
      <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
        Report
      </Link>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, reason, description }),
    });
    if (res.ok) setDone(true);
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-zinc-400 hover:text-red-500 transition-colors">
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { if (!done) setOpen(false) }}>
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            {done ? (
              <div className="text-center">
                <p className="font-semibold text-green-600 dark:text-green-400">Report submitted</p>
                <p className="mt-1 text-sm text-zinc-500">Thank you. We&apos;ll review this content.</p>
                <Button className="mt-4" size="sm" onClick={() => { setOpen(false); setDone(false); }}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-semibold">Report this content</h3>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {reasons.map((r) => <option key={r}>{r}</option>)}
                </select>
                <textarea
                  className="min-h-[80px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details (optional)"
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button type="submit" loading={loading} size="sm">Submit Report</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
