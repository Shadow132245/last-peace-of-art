"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  type: "post" | "project" | "thread" | "user";
  url: string;
  userName: string;
  userId: string;
  userImage: string | null;
  likesCount: number;
  dislikesCount: number;
  views: number;
  commentCount: number;
};

const typeMeta: Record<string, { label: string; badge: string }> = {
  post: { label: "Post", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  project: { label: "Project", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  thread: { label: "Thread", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  user: { label: "User", badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
};

function ResultCard({ r }: { r: SearchResult }) {
  const meta = typeMeta[r.type] ?? typeMeta.post;

  return (
    <Link
      href={r.url}
      className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{r.title}</h3>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
          {r.description && (
            <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{r.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <Link
              href={`/user/${encodeURIComponent(r.userName)}`}
              className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              {r.userImage ? (
                <img src={r.userImage} alt="" className="h-4 w-4 rounded-full object-cover" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-[8px] font-medium dark:bg-zinc-700">
                  {r.userName[0]}
                </span>
              )}
              {r.userName}
            </Link>

            {r.type !== "user" && (
              <>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {r.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  {r.dislikesCount}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {r.views}
                </span>
                {r.type === "thread" && r.commentCount > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {r.commentCount}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (!q.trim() || q.trim().length < 1) {
      setResults([]);
      setSearched(false);
      return;
    }

    timer.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const typeOrder = ["post", "project", "thread", "user"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Search</h1>

      <div className="relative mb-8">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts, projects, threads, users..."
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pl-12 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          autoFocus
        />
        <svg
          className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 ${loading ? "animate-spin" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {loading ? (
            <>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          )}
        </svg>
      </div>

      {searched && !loading && results.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">No results for &ldquo;{q}&rdquo;</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-zinc-500">{results.length} result{results.length !== 1 ? "s" : ""}</p>

          {typeOrder.map((type) => {
            const items = grouped[type];
            if (!items || items.length === 0) return null;
            const meta = typeMeta[type] ?? typeMeta.post;
            return (
              <section key={type}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                  {meta.label}s ({items.length})
                </h2>
                <div className="space-y-2">
                  {items.map((r) => (
                    <ResultCard key={`${r.type}-${r.id}`} r={r} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
