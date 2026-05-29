"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FadeInView } from "@/components/ui/fade-in-view";

export function CtaSection() {
  return (
    <FadeInView>
      <section className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50 px-4 py-20 text-center dark:border-zinc-800 dark:bg-transparent dark:from-transparent dark:to-transparent">
        <div className="mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold sm:text-3xl"
          >
            Ready to share your work?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-zinc-500 dark:text-zinc-400"
          >
            Join our community of creators, writers, and thinkers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link
              href="/register"
              className="mt-8 inline-block rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-100"
            >
              Create Your Account
            </Link>
          </motion.div>
        </div>
      </section>
    </FadeInView>
  );
}
