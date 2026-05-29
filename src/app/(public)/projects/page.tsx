import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { parsePagination, buildPaginationMeta, getSkipTake } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";
import { AnimatedList, AnimatedItem } from "@/components/ui/animated-list";

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse community projects and portfolios.",
};

export default async function ProjectsPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const params = parsePagination(new URLSearchParams(searchParams ?? {}));
  const { skip, take } = getSkipTake(params);

  const [projects, total, trending] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma.project.count({ where: { published: true } }),
    prisma.project.findMany({
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
          <h1 className="mb-8 text-3xl font-bold">Projects</h1>

          {projects.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">No projects yet.</p>
          ) : (
            <AnimatedList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <AnimatedItem key={project.id}>
                  <Link href={`/projects/${project.id}`} className="group block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md dark:border-zinc-800 dark:bg-transparent dark:hover:border-zinc-600 dark:hover:shadow-none">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm text-zinc-500 line-clamp-3 dark:text-zinc-400">{project.description}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                      <Link href={`/user/${encodeURIComponent(project.user.name)}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">{project.user.name}</Link>
                      <span>{project.views} views</span>
                      <span>{project.likesCount} likes</span>
                    </div>
                    {project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">{tag}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                </AnimatedItem>
              ))}
            </AnimatedList>
          )}

          <Pagination basePath="/projects" {...meta} />
        </div>

        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">Trending Projects</h3>
            <div className="space-y-4">
              {trending.map((project, i) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="group block">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg font-bold text-zinc-300 dark:text-zinc-600">#{i + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400">{project.title}</p>
                      <p className="text-xs text-zinc-400">{project.likesCount} likes &middot; {project.views} views</p>
                    </div>
                  </div>
                </Link>
              ))}
              {trending.length === 0 && <p className="text-sm text-zinc-400">No projects yet.</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
