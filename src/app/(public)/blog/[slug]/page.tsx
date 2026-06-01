import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { LikeButton } from "@/components/likes/like-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { ReportButton } from "@/components/reports/report-button";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewTracker } from "@/components/views/view-tracker";
import { FadeInView } from "@/components/ui/fade-in-view";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { getServerT } from "@/lib/server-i18n";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt ?? undefined, openGraph: { title: post.title, description: post.excerpt ?? undefined } };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { user: { select: { name: true, image: true, role: true, roles: true, points: true, rank: true } } },
  });

  if (!post || !post.published) notFound();
  const { t } = await getServerT();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <DisclaimerBanner />
      <ViewTracker entityType="post" entityId={post.id} />

      <FadeInView>
        <h1 className="text-4xl font-bold">{post.title}</h1>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
          <Link href={`/user/${encodeURIComponent(post.user.name)}`} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100">
            {post.user.image ? (
              <img src={post.user.image} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                {post.user.name[0]}
              </span>
            )}
            <span className="font-medium">{post.user.name}</span>
            <span className="text-[10px] text-zinc-400">({post.user.points} pts - {post.user.rank})</span>
            {((post.user.roles as string[]) ?? [post.user.role]).map((r) => {
              const style: Record<string, string> = {
                founder: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                moderator: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
                premium: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
                bug_hunter: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
              };
              return r in style ? (
                <span key={r} className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${style[r]}`}>{r.toUpperCase()}</span>
              ) : null;
            })}
          </Link>
          <span>&middot;</span>
          <span>{post.createdAt.toLocaleDateString()}</span>
          <span>&middot;</span>
          <span>{post.views} {t("blog.views")}</span>
        </div>
      </FadeInView>

      <FadeInView delay={0.15}>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
            ))}
          </div>
        )}
      </FadeInView>

      <FadeInView delay={0.2}>
        <div className="mt-6 flex items-center gap-4">
          <LikeButton entityType="post" entityId={post.id} />
          <BookmarkButton entityType="post" entityId={post.id} />
          <ReportButton entityType="post" entityId={post.id} />
        </div>
      </FadeInView>

      <FadeInView delay={0.25}>
        <div className="mt-8">
          <Markdown content={post.content} />
        </div>
      </FadeInView>

      <FadeInView delay={0.3}>
        <CommentSection entityType="post" entityId={post.id} />
      </FadeInView>
    </article>
  );
}
