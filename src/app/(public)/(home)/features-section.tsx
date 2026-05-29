"use client";

import { motion } from "motion/react";
import { FadeInView } from "@/components/ui/fade-in-view";

const features = [
  { icon: "🚀", title: "Projects", desc: "Upload and showcase your work with rich media, tags, and links." },
  { icon: "✍️", title: "Posts", desc: "Write about any topic and share your knowledge with the world." },
  { icon: "📄", title: "Profile", desc: "Create a stunning public profile to present your skills and experience." },
  { icon: "💬", title: "Forum", desc: "Start discussions, ask questions, and connect with the community." },
];

export function FeaturesSection() {
  return (
    <FadeInView>
      <section className="border-t border-zinc-200 bg-white px-4 py-20 dark:border-zinc-800 dark:bg-transparent">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center text-2xl font-bold sm:text-3xl"
          >
            What you can do
          </motion.h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none"
              >
                <motion.div
                  className="mb-4 text-3xl"
                  whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </FadeInView>
  );
}
