"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<string[]>([]);
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
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to create project");
    } else {
      router.push("/dashboard/projects");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">New Project</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
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
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Content (Markdown, optional)</label>
            <ImageUpload mode="url" onInsert={(url) => setContent((c) => c + "\n![](" + url + ")")} />
          </div>
          <textarea
            className="min-h-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Optional markdown content..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Media Gallery</label>
            <ImageUpload mode="url" onInsert={(url) => setMedia((m) => [...m, url])} label="Add Image" />
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

        <Input label="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, typescript, design" />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-4">
          <Button type="submit" loading={loading}>Create Project</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
