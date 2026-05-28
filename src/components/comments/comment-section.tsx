"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; image: string | null };
};

export function CommentSection({ entityType, entityId }: { entityType: string; entityId: string }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/comments?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((data) => setComments(data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [entityType, entityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !session) return;

    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, entityType, entityId }),
    });

    if (res.ok) {
      setContent("");
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
    }
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-semibold">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h2>

      {fetching ? (
        <p className="text-sm text-zinc-400">Loading comments...</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{comment.user.name}</span>
                  <span>&middot;</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                {session?.user.name === comment.user.name && (
                  <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                )}
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        {session ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              className="min-h-[100px] rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <div className="flex justify-end">
              <Button type="submit" loading={loading} size="sm">Post Comment</Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/login" className="text-amber-600 hover:underline dark:text-amber-400">Sign in</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}
