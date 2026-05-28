import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";
import { LikeButton } from "@/components/likes/like-button";
import { ReportButton } from "@/components/reports/report-button";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewTracker } from "@/components/views/view-tracker";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return { title: "Not Found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });

  if (!project || !project.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <ViewTracker entityType="project" entityId={project.id} />

      <h1 className="text-4xl font-bold">{project.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{project.user.name}</span>
        <span>{project.createdAt.toLocaleDateString()}</span>
        <span>{project.views} views</span>
      </div>

      {project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <LikeButton entityType="project" entityId={project.id} />
        <ReportButton entityType="project" entityId={project.id} />
      </div>

      <div className="mt-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{project.description}</p>
        {project.content && (
          <div className="mt-6">
            <Markdown content={project.content} />
          </div>
        )}
      </div>

      {project.media.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {project.media.map((url, i) => (
            <img key={i} src={url} alt="" className="rounded-lg object-cover" />
          ))}
        </div>
      )}

      <CommentSection entityType="project" entityId={project.id} />
    </article>
  );
}
