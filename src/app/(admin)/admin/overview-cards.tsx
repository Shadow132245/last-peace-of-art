"use client";

import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function OverviewCards({ stats }: { stats: { label: string; value: number; icon: string; color: string; bg: string }[] }) {
  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 text-3xl font-bold"
      >
        Overview
      </motion.h1>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-2xl border border-zinc-200/80 p-6 transition-shadow duration-300 hover:shadow-xl dark:border-zinc-700/50 ${stat.bg}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-4xl font-bold tracking-tight">{stat.value.toLocaleString()}</p>
                <p className="mt-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
              </div>
              <span className="text-2xl opacity-80">{stat.icon}</span>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-500 group-hover:w-full`} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
