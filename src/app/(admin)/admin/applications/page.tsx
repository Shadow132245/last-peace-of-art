import { prisma } from "@/lib/db";
import { ApplicationActions } from "./application-actions";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const { t } = await getServerT();
  const applications = await prisma.application.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <AdminPageHeader title={t("admin.applications")} />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.user")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.email")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.answers")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.date")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.actions")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {applications.map((app, i) => (
            <AdminTableRow key={app.id} index={i}>
              <AdminCell className="font-medium">{app.user.name}</AdminCell>
              <AdminCell className="text-zinc-500">{app.user.email}</AdminCell>
              <AdminCell className="max-w-[300px]">
                <details className="cursor-pointer">
                  <summary className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">{t("admin.viewAnswers")}</summary>
                  <div className="mt-2 space-y-2">
                    {(app.answers as Array<{ question: string; answer: string }>).map((a, j) => (
                      <div key={j}>
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{a.question}</p>
                        <p className="text-xs text-zinc-500">{a.answer}</p>
                      </div>
                    ))}
                  </div>
                </details>
                {app.adminResponse && (
                  <div className="mt-2 rounded bg-zinc-50 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800/50">
                    {t("admin.responsePrefix")} {app.adminResponse}
                  </div>
                )}
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={app.status === "approved" ? "green" : app.status === "rejected" ? "red" : "amber"}>
                  {app.status}
                </AdminBadge>
              </AdminCell>
              <AdminCell className="text-zinc-500">{new Date(app.createdAt).toLocaleDateString()}</AdminCell>
              <AdminCell>
                {app.status === "pending" && <ApplicationActions applicationId={app.id} />}
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {applications.length === 0 && <AdminEmpty message={t("admin.noApplications")} />}
    </div>
  );
}
