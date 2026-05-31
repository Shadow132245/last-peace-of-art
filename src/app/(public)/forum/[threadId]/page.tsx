import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { LikeButton } from "@/components/likes/like-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { ReportButton } from "@/components/reports/report-button";
import { CommentSection } from "@/components/comments/comment-section";
import { PollDisplay } from "@/components/forum/poll-display";
import { ViewTracker } from "@/components/views/view-tracker";
import { FadeInView } from "@/components/ui/fade-in-view";
import { AnimateCard } from "@/components/ui/animate-card";
import { DisclaimerBanner } from "@/components/ui/disclaimer-banner";
import { getServerT } from "@/lib/server-i18n";

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
    include: { user: { select: { name: true, image: true, role: true, points: true, rank: true } } },
  });

  if (!thread) notFound();
  const { t } = await getServerT();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <DisclaimerBanner />
      <ViewTracker entityType="thread" entityId={thread.id} />

      <FadeInView>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{thread.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
            <Link href={`/user/${encodeURIComponent(thread.user.name)}`} className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100">
              {thread.user.image ? (
                <img src={thread.user.image} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                  {thread.user.name[0]}
                </span>
              )}
              <span className="font-medium">{thread.user.name}</span>
              <span className="text-[10px] text-zinc-400">({thread.user.points} pts - {thread.user.rank})</span>
            {thread.user.role === "founder" && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">{t("roles.founder")}</span>}
            {thread.user.role === "admin" && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">{t("roles.admin")}</span>}
            {thread.user.role === "bug_hunter" && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">{t("roles.bugHunter")}</span>}
            </Link>
            <span>&middot;</span>
            <span>{thread.createdAt.toLocaleDateString()}</span>
            <span>&middot;</span>
            <span>{thread.views} {t("forum.views")}</span>
          </div>
          {thread.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {thread.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </FadeInView>

      <FadeInView delay={0.1}>
        <div className="flex items-center gap-4 mb-6">
          <LikeButton entityType="thread" entityId={thread.id} />
          <BookmarkButton entityType="thread" entityId={thread.id} />
          <ReportButton entityType="thread" entityId={thread.id} />
        </div>
      </FadeInView>

      <FadeInView delay={0.15}>
        <div className="leading-relaxed">
          <Markdown content={thread.content} />
        </div>
      </FadeInView>

      <FadeInView delay={0.175}>
        <PollDisplay threadId={thread.id} />
      </FadeInView>

      <FadeInView delay={0.2}>
        <CommentSection entityType="thread" entityId={thread.id} />
      </FadeInView>
    </div>
  );
}
