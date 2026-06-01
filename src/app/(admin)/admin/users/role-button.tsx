"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const allRoles = ["user", "bug_hunter", "premium", "moderator", "admin"] as const;
const allRolesReversed = [...allRoles].reverse();

const roleColors: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  founder: {
    border: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  admin: {
    border: "border-purple-300 dark:border-purple-700",
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500",
  },
  moderator: {
    border: "border-sky-300 dark:border-sky-700",
    bg: "bg-sky-50 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  premium: {
    border: "border-indigo-300 dark:border-indigo-700",
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    text: "text-indigo-700 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  bug_hunter: {
    border: "border-emerald-300 dark:border-emerald-700",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  user: {
    border: "border-zinc-300 dark:border-zinc-600",
    bg: "bg-zinc-50 dark:bg-zinc-800",
    text: "text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

const roleLabels: Record<string, string> = {
  founder: "Founder",
  admin: "Admin",
  moderator: "Moderator",
  premium: "Premium",
  bug_hunter: "Bug Hunter",
  user: "User",
};

const roleOrder = ["user", "bug_hunter", "premium", "moderator", "admin", "founder"];

function highestRole(roles: string[]): string {
  return roleOrder.filter((r) => roles.includes(r)).pop() ?? "user";
}

export function RoleButton({ userId, currentRoles, currentUserRole }: { userId: string; currentRoles: string[]; currentUserRole?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(currentRoles);
  const ref = useRef<HTMLDivElement>(null);

  const isFounder = currentRoles.includes("founder");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = async (role: string) => {
    if (isFounder) return;
    const next = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    const actual = next.length === 0 ? ["user"] : next;

    setSelectedRoles(actual);
    setLoading(true);

    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roles: actual }),
    });

    router.refresh();
    setLoading(false);
  };

  const top = highestRole(selectedRoles);
  const colors = roleColors[top] ?? roleColors.user;

  const availableRoles = allRolesReversed;

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        onClick={() => !isFounder && setOpen(!open)}
        disabled={loading || isFounder}
        whileTap={isFounder ? {} : { scale: 0.97 }}
        className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${colors.border} ${colors.bg} ${colors.text} disabled:cursor-not-allowed disabled:opacity-50`}
        title={isFounder ? "Founder role cannot be changed" : undefined}
      >
        {loading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            <div className="flex flex-wrap gap-0.5">
              {selectedRoles.map((r) => {
                const c = roleColors[r] ?? roleColors.user;
                return (
                  <span key={r} className={`rounded px-1 py-0.5 ${c.bg}`}>
                    {roleLabels[r] ?? r}
                  </span>
                );
              })}
            </div>
            {!isFounder && (
              <svg className="h-3 w-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </>
        )}
      </motion.button>
      <AnimatePresence>
        {open && !isFounder && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            {availableRoles.map((r) => {
              const c = roleColors[r] ?? roleColors.user;
              const l = roleLabels[r] ?? r;
              const checked = selectedRoles.includes(r);
              const isOnlyUser = selectedRoles.length === 1 && selectedRoles[0] === "user";
              const isAdminLocked = r === "admin" && currentUserRole !== "founder";
              const disabled = (r === "user" && isOnlyUser) || isAdminLocked;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => !disabled && handleToggle(r)}
                  disabled={disabled}
                  title={isAdminLocked ? "Only the founder can assign Admin" : undefined}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 ${c.text}`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked
                        ? `${c.border} ${c.bg} border-2`
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                  >
                    {checked && (
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
                  {l}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
