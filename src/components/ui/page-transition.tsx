"use client";

import { motion } from "motion/react";
import { pageTransition } from "@/lib/animations";

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={pageTransition} initial="hidden" animate="visible" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}
