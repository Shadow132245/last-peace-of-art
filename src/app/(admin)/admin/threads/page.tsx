import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { AdminPublishToggle } from "@/components/ui/admin-publish-toggle";
import Link from "next/link";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

export default async function AdminThreadsPage() {
  const { t } = await getServerT();
  const threads = await prisma.thread.findMany({
    include: { user: { select: { name: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title={t("admin.threads")} />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.title")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.author")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.comments")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.pinned")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.created")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.actions")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {threads.map((thread, i) => (
            <AdminTableRow key={thread.id} index={i}>
              <AdminCell className="max-w-xs truncate font-medium">
                <Link href={`/forum/${thread.id}`} className="hover:underline">{thread.title}</Link>
              </AdminCell>
              <AdminCell className="text-zinc-500">{thread.user.name}</AdminCell>
              <AdminCell>
                {thread.published ? (
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">{t("admin.accepted")}</span>
                ) : (
                  <AdminPublishToggle entityType="threads" entityId={thread.id} published={thread.published} />
                )}
              </AdminCell>
              <AdminCell className="text-zinc-500">{thread._count.comments}</AdminCell>
              <AdminCell>{thread.pinned ? "📌" : "—"}</AdminCell>
              <AdminCell className="text-zinc-500">{thread.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <DeleteButton url={`/api/admin/threads/${thread.id}`} />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {threads.length === 0 && <AdminEmpty message={t("admin.noThreads")} />}
    </div>
  );
}
