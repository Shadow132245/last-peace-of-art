import { prisma } from "@/lib/db";
import Link from "next/link";
import { DeleteButton } from "../delete-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { AdminPublishToggle } from "@/components/ui/admin-publish-toggle";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { t } = await getServerT();
  const projects = await prisma.project.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title={t("admin.projects")} />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.title")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.author")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.views")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.created")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.actions")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {projects.map((project, i) => (
            <AdminTableRow key={project.id} index={i}>
              <AdminCell className="max-w-xs truncate font-medium">
                <Link href={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
              </AdminCell>
              <AdminCell className="text-zinc-500">{project.user.name}</AdminCell>
              <AdminCell>
                {project.published ? (
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">{t("admin.accepted")}</span>
                ) : (
                  <AdminPublishToggle entityType="projects" entityId={project.id} published={project.published} />
                )}
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
      {projects.length === 0 && <AdminEmpty message={t("admin.noProjects")} />}
    </div>
  );
}
