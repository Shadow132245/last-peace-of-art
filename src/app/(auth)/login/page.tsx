"use client";

import { LoginForm } from "@/components/auth/login-form";
import { motion } from "motion/react";

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.6 }}
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
    >
      <LoginForm />
    </motion.div>
  );
}
