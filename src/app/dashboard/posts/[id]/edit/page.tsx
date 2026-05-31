"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/ui/markdown";
import { ImageUpload } from "@/components/ui/image-upload";
import { useI18n } from "@/providers/i18n-provider";

export default function EditPostPage() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setExcerpt(data.excerpt ?? "");
        setTags((data.tags ?? []).join(", "));
      })
      .catch(() => setError("Failed to load post"))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        excerpt,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("dashboard.createPost.error"));
    } else {
      router.push("/dashboard/posts");
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
        Edit Post
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <Input label={t("dashboard.createPost.titleLabel")} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input label={t("dashboard.createPost.excerptLabel")} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("dashboard.createPost.contentLabel")}</label>
            <div className="flex items-center gap-2">
              <ImageUpload mode="markdown" onInsert={(url) => setContent((c) => c + "\n" + url)} />
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {preview ? t("dashboard.createPost.edit") : t("dashboard.createPost.preview")}
              </button>
            </div>
          </div>
          {preview ? (
            <div className="min-h-[300px] rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
              {content ? <Markdown content={content} /> : <p className="text-zinc-400">{t("dashboard.createPost.nothingToPreview")}</p>}
            </div>
          ) : (
            <textarea
              className="min-h-[300px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          )}
        </div>

        <Input label={t("dashboard.createPost.tagsLabel")} value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("dashboard.createPost.tagsPlaceholder")} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Save Changes</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>{t("dashboard.createPost.cancel")}</Button>
        </div>
      </motion.form>
    </div>
  );
}
