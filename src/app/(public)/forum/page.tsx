import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parsePagination, buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Forum",
  description: "Join discussions, ask questions, and connect with the community.",
};

export default async function ForumPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const params = parsePagination(new URLSearchParams(searchParams ?? {}));
  const { skip, take } = getSkipTake(params);

  const session = await auth.api.getSession({ headers: await headers() });

  const [threads, total] = await Promise.all([
    prisma.thread.findMany({
      include: {
        user: { select: { name: true, image: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    }),
    prisma.thread.count(),
  ]);

  const meta = buildPaginationMeta(total, params);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Forum</h1>
        {session && (
          <Link
            href="/dashboard/forum/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            New Thread
          </Link>
        )}
      </div>

      {threads.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No discussions yet. Start one!</p>
      ) : (
        <div className="grid gap-4">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/forum/${thread.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{thread.pinned && "📌 "}{thread.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{thread.content}</p>
                </div>
                <span className="shrink-0 text-sm text-zinc-400">{thread._count.comments}</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                <span>{thread.user.name}</span>
                <span>{thread.createdAt.toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination basePath="/forum" {...meta} />
    </div>
  );
}
