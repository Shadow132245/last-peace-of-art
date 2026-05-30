"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { useI18n } from "@/providers/i18n-provider";

export default function NewProjectPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        media,
        published,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("dashboard.createProject.error"));
    } else {
      router.push("/dashboard/projects");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        {t("dashboard.createProject.title")}
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <Input label={t("dashboard.createProject.titleLabel")} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("dashboard.createProject.descriptionLabel")}</label>
          <textarea
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("dashboard.createProject.contentLabel")}</label>
            <ImageUpload mode="url" onInsert={(url) => setContent((c) => c + "\n![](" + url + ")")} />
          </div>
          <textarea
            className="min-h-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("dashboard.createProject.contentPlaceholder")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("dashboard.createProject.mediaGalleryLabel")}</label>
            <ImageUpload mode="url" onInsert={(url) => setMedia((m) => [...m, url])} label={t("dashboard.createProject.addImage")} />
          </div>
          {media.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {media.map((url, i) => (
                <div key={i} className="group relative">
                  <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => setMedia((m) => m.filter((_, j) => j !== i))}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Input label={t("dashboard.createProject.tagsLabel")} value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("dashboard.createProject.tagsPlaceholder")} />

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
          {t("dashboard.publishCheckLabel")}
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>{t("dashboard.createProject.submit")}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>{t("dashboard.createProject.cancel")}</Button>
        </div>
      </motion.form>
    </div>
  );
}
