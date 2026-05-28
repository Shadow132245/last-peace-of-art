"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Result = {
  id: string;
  title: string;
  description: string;
  type: "post" | "project" | "user";
  url: string;
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => setResults(data.results ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  if (!q) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">No results for &ldquo;{q}&rdquo;</p>
      </div>
    );
  }

  const icons: Record<string, string> = { post: "📄", project: "🚀", user: "👤" };

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;</p>
      {results.map((r) => (
        <Link
          key={`${r.type}-${r.id}`}
          href={r.url}
          className="flex items-start gap-4 rounded-xl border border-zinc-200 p-4 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <span className="text-xl">{icons[r.type] ?? "📄"}</span>
          <div>
            <h3 className="font-semibold">{r.title}</h3>
            {r.description && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{r.description}</p>}
            <span className="mt-1 inline-block text-xs capitalize text-zinc-400">{r.type}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
