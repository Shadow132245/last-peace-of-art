import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { LikeButton } from "@/components/likes/like-button";
import { ReportButton } from "@/components/reports/report-button";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewTracker } from "@/components/views/view-tracker";

export async function generateMetadata({ params }: { params: Promise<{ threadId: string }> }): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) return { title: "Not Found" };
  return { title: thread.title, description: thread.content.slice(0, 160) };
}

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!thread) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ViewTracker entityType="thread" entityId={thread.id} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{thread.title}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
          <span>{thread.user.name}</span>
          <span>&middot;</span>
          <span>{thread.createdAt.toLocaleDateString()}</span>
          <span>{thread.views} views</span>
        </div>
        {thread.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <LikeButton entityType="thread" entityId={thread.id} />
        <ReportButton entityType="thread" entityId={thread.id} />
      </div>

      <div className="leading-relaxed">
        <Markdown content={thread.content} />
      </div>

      <CommentSection entityType="thread" entityId={thread.id} />
    </div>
  );
}
