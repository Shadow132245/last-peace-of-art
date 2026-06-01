"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SuspendButton({
  userId,
  suspended,
  suspensionReason,
  suspendedUntil,
  targetRole,
  currentUserRole,
}: {
  userId: string;
  suspended: boolean;
  suspensionReason: string | null;
  suspendedUntil: string | null;
  targetRole: string;
  currentUserRole: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7");

  const isProtected = targetRole === "founder" || (targetRole === "admin" && currentUserRole !== "founder");

  const handleUnsuspend = async () => {
    if (isProtected) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: false }),
    });
    router.refresh();
    setLoading(false);
  };

  const handleSuspend = async () => {
    if (isProtected || !reason.trim()) return;
    setLoading(true);
    let suspendedUntil: string | null = null;
    if (duration !== "permanent") {
      const days = parseInt(duration, 10);
      const date = new Date();
      date.setDate(date.getDate() + days);
      suspendedUntil = date.toISOString();
    }
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: true, suspensionReason: reason, suspendedUntil }),
    });
    router.refresh();
    setLoading(false);
    setOpen(false);
    setReason("");
    setDuration("7");
  };

  if (suspended) {
    return (
      <div className="flex items-center gap-2">
        <span className="max-w-[120px] truncate text-xs text-zinc-400" title={suspensionReason ?? ""}>
          {suspensionReason ?? "Suspended"}
        </span>
        <motion.button
          onClick={handleUnsuspend}
          disabled={loading || isProtected}
          whileHover={isProtected ? {} : { scale: 1.05 }}
          whileTap={isProtected ? {} : { scale: 0.95 }}
          title={isProtected ? (targetRole === "founder" ? "Cannot unsuspend the founder" : "Only the founder can unsuspend an admin") : undefined}
          className="cursor-pointer rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
        >
          {loading ? (
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent dark:border-emerald-300" />
          ) : (
            "Unsuspend"
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => !isProtected && setOpen(true)}
        whileHover={isProtected ? {} : { scale: 1.05 }}
        whileTap={isProtected ? {} : { scale: 0.95 }}
        title={isProtected ? (targetRole === "founder" ? "Cannot suspend the founder" : "Only the founder can suspend an admin") : undefined}
        className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
          isProtected
            ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-800/50"
        }`}
      >
        Suspend
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            >
              <h2 className="mb-1 text-lg font-bold">Suspend User</h2>
              <p className="mb-5 text-sm text-zinc-500">Set a reason and duration for the suspension.</p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Reason</label>
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Violation of community guidelines"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-white/10"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-white/10"
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <motion.button
                  onClick={() => setOpen(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSuspend}
                  disabled={loading || !reason.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="mx-auto block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Confirm Suspension"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
