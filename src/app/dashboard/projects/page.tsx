import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { TogglePublish } from "@/components/ui/toggle-publish";
import { FadeInView } from "@/components/ui/fade-in-view";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <FadeInView>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            New Project
          </Link>
        </div>
      </FadeInView>

      {projects.length === 0 ? (
        <FadeInView><p className="text-zinc-500 dark:text-zinc-400">No projects yet. Create your first one!</p></FadeInView>
      ) : (
        <StaggerList className="grid gap-4">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-semibold">{project.title}</h3>
                      <TogglePublish entityType="projects" entityId={project.id} published={project.published} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{project.description}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
