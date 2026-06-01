"use client";

import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function AdminPageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-3xl font-bold"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-zinc-700/50"
    >
      <table className="w-full text-left text-sm">
        {children}
      </table>
    </motion.div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-700 dark:bg-zinc-900/50">
      {children}
    </thead>
  );
}

export function AdminTableRow({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.tr
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      className="border-b border-zinc-100 transition-colors last:border-0 dark:border-zinc-800 dark:hover:bg-zinc-900/30"
    >
      {children}
    </motion.tr>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return (
    <motion.tbody
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="divide-y divide-zinc-100 dark:divide-zinc-800"
    >
      {children}
    </motion.tbody>
  );
}

export function AdminBadge({ variant, children }: { variant: "green" | "red" | "amber" | "purple" | "zinc"; children: React.ReactNode }) {
  const colors = {
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    zinc: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ${colors[variant]}`}>
      {children}
    </span>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
    >
      {message}
    </motion.p>
  );
}

export function AdminCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 ${className ?? ""}`}>
      {children}
    </td>
  );
}
