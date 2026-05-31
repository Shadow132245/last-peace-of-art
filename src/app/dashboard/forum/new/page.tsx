"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { useI18n } from "@/providers/i18n-provider";

export default function NewThreadPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([""]);
  const [pollMultiple, setPollMultiple] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body: Record<string, unknown> = {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (pollQuestion && pollOptions.filter(Boolean).length >= 2) {
      body.poll = {
        question: pollQuestion,
        options: pollOptions.filter(Boolean),
        multiple: pollMultiple,
      };
    }

    const res = await fetch("/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("dashboard.createThread.error"));
    } else {
      router.push("/forum");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        {t("dashboard.createThread.title")}
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <Input label={t("dashboard.createThread.titleLabel")} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("dashboard.createThread.contentLabel")}</label>
            <ImageUpload mode="markdown" onInsert={(url) => setContent((c) => c + "\n" + url)} />
          </div>
          <textarea
            className="min-h-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <Input label={t("dashboard.createThread.tagsLabel")} value={tags} onChange={(e) => setTags(e.target.value)} placeholder={t("dashboard.createThread.tagsPlaceholder")} />

        <details className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <summary className="cursor-pointer text-sm font-medium text-zinc-600 dark:text-zinc-400">Add Poll</summary>
          <div className="mt-4 space-y-3">
            <Input label="Poll Question" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="What do you think?" />
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  label={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                    className="mt-6 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPollOptions([...pollOptions, ""])}
              className="text-sm text-amber-600 hover:underline dark:text-amber-400"
            >
              + Add option
            </button>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={pollMultiple} onChange={(e) => setPollMultiple(e.target.checked)} />
              Allow multiple choices
            </label>
          </div>
        </details>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>{t("dashboard.createThread.submit")}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>{t("dashboard.createThread.cancel")}</Button>
        </div>
      </motion.form>
    </div>
  );
}
