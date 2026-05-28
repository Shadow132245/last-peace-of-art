import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Projects</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="max-w-xs truncate px-4 py-3 font-medium">{project.title}</td>
                <td className="px-4 py-3 text-zinc-500">{project.user.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${project.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {project.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{project.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <DeleteButton url={`/api/admin/projects/${project.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && <p className="mt-8 text-zinc-500 dark:text-zinc-400">No projects yet.</p>}
    </div>
  );
}
