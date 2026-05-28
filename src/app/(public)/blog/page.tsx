import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { parsePagination, buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read articles and posts from the community.",
};

export default async function BlogPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const params = parsePagination(new URLSearchParams(searchParams ?? {}));
  const { skip, take } = getSkipTake(params);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const meta = buildPaginationMeta(total, params);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No posts yet.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none">
              <h2 className="text-xl font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-300">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{post.excerpt}</p>}
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                <span>{post.user.name}</span>
                <span>{post.createdAt.toLocaleDateString()}</span>
                {post.tags.length > 0 && <span>{post.tags.join(", ")}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination basePath="/blog" {...meta} />
    </div>
  );
}
