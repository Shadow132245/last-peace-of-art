"use client";

import { motion } from "motion/react";

export function FadeInView({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
