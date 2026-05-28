"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TogglePublish({ postId, published }: { postId: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${published ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`}
    >
      {loading ? "..." : published ? "Published" : "Draft"}
    </button>
  );
}
