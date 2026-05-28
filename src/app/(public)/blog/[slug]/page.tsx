import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { LikeButton } from "@/components/likes/like-button";
import { ReportButton } from "@/components/reports/report-button";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewTracker } from "@/components/views/view-tracker";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt ?? undefined, openGraph: { title: post.title, description: post.excerpt ?? undefined } };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { user: { select: { name: true } } },
  });

  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ViewTracker entityType="post" entityId={post.id} />

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{post.user.name}</span>
        <span>{post.createdAt.toLocaleDateString()}</span>
        <span>{post.views} views</span>
      </div>
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <LikeButton entityType="post" entityId={post.id} />
        <ReportButton entityType="post" entityId={post.id} />
      </div>

      <div className="mt-8">
        <Markdown content={post.content} />
      </div>

      <CommentSection entityType="post" entityId={post.id} />
    </article>
  );
}
