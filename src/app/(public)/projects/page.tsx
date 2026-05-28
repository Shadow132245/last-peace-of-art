import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { parsePagination, buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse community projects and portfolios.",
};

export default async function ProjectsPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const params = parsePagination(new URLSearchParams(searchParams ?? {}));
  const { skip, take } = getSkipTake(params);

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.project.count({ where: { published: true } }),
  ]);

  const meta = buildPaginationMeta(total, params);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No projects yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 line-clamp-3 dark:text-zinc-400">{project.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                <span>{project.user.name}</span>
              </div>
              {project.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Pagination basePath="/projects" {...meta} />
    </div>
  );
}
