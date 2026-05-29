import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { parsePagination, buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";
import { AnimatedList, AnimatedItem } from "@/components/ui/animated-list";
import { getServerT } from "@/lib/server-i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerT();
  return {
    title: t("blog.title"),
    description: "Read community posts and articles.",
  };
}

export default async function BlogPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const { t } = await getServerT();
  const searchParams = await props.searchParams;
  const params = parsePagination(new URLSearchParams(searchParams ?? {}));
  const { skip, take } = getSkipTake(params);

  const [posts, total, trending] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.post.count({ where: { published: true } }),
    prisma.post.findMany({
      where: { published: true },
      include: { user: { select: { name: true } } },
      orderBy: { likesCount: "desc" },
      take: 5,
    }),
  ]);

  const meta = buildPaginationMeta(total, params);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          <h1 className="mb-8 text-3xl font-bold">{t("blog.title")}</h1>

          {posts.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">{t("blog.empty")}</p>
          ) : (
            <AnimatedList className="grid gap-6">
              {posts.map((post) => (
                <AnimatedItem key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none">
                    <h3 className="text-lg font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400">{post.title}</h3>
                    {post.excerpt && <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{post.excerpt}</p>}
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                      <Link href={`/user/${encodeURIComponent(post.user.name)}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">{post.user.name}</Link>
                      <span>{post.createdAt.toLocaleDateString()}</span>
                      <span>{post.views} views</span>
                      <span>{post.likesCount} likes</span>
                    </div>
                  </Link>
                </AnimatedItem>
              ))}
            </AnimatedList>
          )}

          <Pagination basePath="/blog" previousLabel={t("pagination.previous")} nextLabel={t("pagination.next")} {...meta} />
        </div>

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">{t("blog.sidebarTitle")}</h3>
            <div className="space-y-4">
              {trending.map((post, i) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg font-bold text-zinc-300 dark:text-zinc-600">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400">{post.title}</p>
                      <p className="text-xs text-zinc-400">{post.likesCount} likes &middot; {post.views} views</p>
                    </div>
                  </div>
                </Link>
              ))}
              {trending.length === 0 && <p className="text-sm text-zinc-400">{t("blog.empty")}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
