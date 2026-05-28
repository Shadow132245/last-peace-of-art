import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { AdminPublishToggle } from "@/components/ui/admin-publish-toggle";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Projects" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {projects.map((project, i) => (
            <AdminTableRow key={project.id} index={i}>
              <AdminCell className="max-w-xs truncate font-medium">{project.title}</AdminCell>
              <AdminCell className="text-zinc-500">{project.user.name}</AdminCell>
              <AdminCell>
                <AdminPublishToggle entityType="projects" entityId={project.id} published={project.published} />
              </AdminCell>
              <AdminCell className="text-zinc-500">{project.views}</AdminCell>
              <AdminCell className="text-zinc-500">{project.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <DeleteButton url={`/api/admin/projects/${project.id}`} />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {projects.length === 0 && <AdminEmpty message="No projects yet." />}
    </div>
  );
}
