"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

const statuses = ["open", "resolved", "closed"] as const;

export function TicketActions({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [adminResponse, setAdminResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (status === currentStatus && !adminResponse.trim()) return;
    setLoading(true);
    await fetch(`/api/admin/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminResponse: adminResponse.trim() || null }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <textarea
        value={adminResponse}
        onChange={(e) => setAdminResponse(e.target.value)}
        placeholder="Response (optional)"
        rows={2}
        className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      />
      <motion.button
        onClick={handleSubmit}
        disabled={loading || (status === currentStatus && !adminResponse.trim())}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-zinc-900" />
        ) : (
          "Update"
        )}
      </motion.button>
    </div>
  );
}
