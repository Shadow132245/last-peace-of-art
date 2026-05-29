"use client";

import { motion } from "motion/react";

export function AnimateCard({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
  const Component = href ? motion.a : motion.div;
  const props: Record<string, unknown> = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-30px" },
    whileHover: { y: -4, scale: 1.01 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.3, ease: "easeOut" },
    className,
  };
  if (href) (props as any).href = href;
  return <Component {...props}>{children}</Component>;
}
