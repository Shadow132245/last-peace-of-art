"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function LikeButton({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data: session } = authClient.useSession();
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?entityType=${entityType}&entityId=${entityId}`)
      .then((r) => r.json())
      .then((data) => {
        setLikeCount(data.likeCount ?? 0);
        setDislikeCount(data.dislikeCount ?? 0);
        setUserType(data.userType);
      })
      .catch(() => {});
  }, [entityType, entityId]);

  const handleVote = async (type: "like" | "dislike") => {
    if (!session || loading) return;
    setLoading(true);

    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType, entityId, type }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.action === "removed") {
        setUserType(null);
        if (type === "like") setLikeCount((p) => Math.max(0, p - 1));
        else setDislikeCount((p) => Math.max(0, p - 1));
      } else if (data.action === "switched") {
        if (type === "like") {
          setLikeCount((p) => p + 1);
          setDislikeCount((p) => Math.max(0, p - 1));
        } else {
          setDislikeCount((p) => p + 1);
          setLikeCount((p) => Math.max(0, p - 1));
        }
        setUserType(type);
      } else {
        setUserType(type);
        if (type === "like") setLikeCount((p) => p + 1);
        else setDislikeCount((p) => p + 1);
      }
    }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="flex items-center gap-4 text-sm text-zinc-500">
        <Link href="/login" className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300">
          <LikeIcon filled={false} /> {likeCount}
        </Link>
        <Link href="/login" className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300">
          <DislikeIcon filled={false} /> {dislikeCount}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <button
        onClick={() => handleVote("like")}
        disabled={loading}
        className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 ${userType === "like" ? "text-green-600 dark:text-green-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
      >
        <LikeIcon filled={userType === "like"} /> {likeCount}
      </button>
      <button
        onClick={() => handleVote("dislike")}
        disabled={loading}
        className={`flex items-center gap-1.5 transition-colors disabled:opacity-50 ${userType === "dislike" ? "text-red-600 dark:text-red-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
      >
        <DislikeIcon filled={userType === "dislike"} /> {dislikeCount}
      </button>
    </div>
  );
}

function LikeIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
    </svg>
  );
}

function DislikeIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" />
    </svg>
  );
}
