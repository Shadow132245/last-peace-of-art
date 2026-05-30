"use client";

import { motion } from "motion/react";

export function AnimateCard({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
  const Component = href ? motion.a : motion.div;
  const props: Record<string, unknown> = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-30px" },
    whileHover: { y: -6, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 180, damping: 22, mass: 0.7 },
    className,
  };
  if (href) (props as any).href = href;
  return <Component {...props}>{children}</Component>;
}
