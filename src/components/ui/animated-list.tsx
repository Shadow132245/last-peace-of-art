"use client";

import { motion } from "motion/react";

export function AnimatedList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
