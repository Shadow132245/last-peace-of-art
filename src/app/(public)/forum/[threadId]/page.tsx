import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { CommentForm } from "@/components/forum/comment-form";

export async function generateMetadata({ params }: { params: Promise<{ threadId: string }> }): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });

  if (!thread) return { title: "Not Found" };

  return {
    title: thread.title,
    description: thread.content.slice(0, 160),
  };
}

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!thread) notFound();

  const comments = await prisma.comment.findMany({
    where: { threadId },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{thread.title}</h1>
        <div className="mt-2 text-sm text-zinc-500">
          <span>{thread.user.name}</span>
          <span className="mx-2">&middot;</span>
          <span>{thread.createdAt.toLocaleDateString()}</span>
        </div>
        {thread.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="leading-relaxed">
        <Markdown content={thread.content} />
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h2>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 text-sm text-zinc-500">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{comment.user.name}</span>
                <span className="mx-2">&middot;</span>
                <span>{comment.createdAt.toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <CommentForm threadId={threadId} />
        </div>
      </div>
    </div>
  );
}
