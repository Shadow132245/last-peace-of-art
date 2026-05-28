import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No projects yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{project.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${project.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  {project.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
