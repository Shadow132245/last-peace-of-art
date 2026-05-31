"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { useI18n } from "@/providers/i18n-provider";

export default function EditProjectPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setContent(data.content ?? "");
        setTags((data.tags ?? []).join(", "));
        setMedia(data.media ?? []);
      })
      .catch(() => setError("Failed to load project"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        content,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        media,
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

  if (fetching) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        Edit Project
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

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>{t("dashboard.createProject.cancel")}</Button>
        </div>
      </motion.form>
    </div>
  );
}
