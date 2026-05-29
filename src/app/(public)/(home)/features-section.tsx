"use client";

import { motion } from "motion/react";
import { FadeInView } from "@/components/ui/fade-in-view";
import { useI18n } from "@/providers/i18n-provider";

const icons = ["🚀", "✍️", "📄", "💬"];

export function FeaturesSection() {
  const { t } = useI18n();

  const features = [
    { icon: icons[0], title: t("nav.projects"), desc: t("landing.projectsFeature") },
    { icon: icons[1], title: t("nav.posts"), desc: t("landing.postsFeature") },
    { icon: icons[2], title: t("landing.profileFeature"), desc: t("landing.profileDesc") },
    { icon: icons[3], title: t("nav.forum"), desc: t("landing.forumFeature") },
  ];

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
            {t("landing.featuresTitle")}
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
