import { prisma } from "@/lib/db";
import { ResolveButton } from "./resolve-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
  });

  const enriched = await Promise.all(
    reports.map(async (report) => {
      let entity: { title?: string; content?: string; authorName?: string } | null = null;
      if (report.entityType === "post") {
        const p = await prisma.post.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        if (p) entity = { title: p.title, authorName: p.user.name };
      } else if (report.entityType === "project") {
        const p = await prisma.project.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        if (p) entity = { title: p.title, authorName: p.user.name };
      } else if (report.entityType === "thread") {
        const t = await prisma.thread.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        if (t) entity = { title: t.title, authorName: t.user.name };
      } else if (report.entityType === "comment") {
        const c = await prisma.comment.findUnique({ where: { id: report.entityId }, select: { content: true, user: { select: { name: true } } } });
        if (c) entity = { content: c.content, authorName: c.user.name };
      }
      return { ...report, entity };
    })
  );

  return (
    <div>
      <AdminPageHeader title="Reports" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Content</th>
            <th className="px-4 py-3 font-medium">Reported by</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {enriched.map((report, i) => (
            <AdminTableRow key={report.id} index={i}>
              <AdminCell>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">{report.entityType}</span>
              </AdminCell>
              <AdminCell className="max-w-[200px] truncate font-medium">
                {report.entity?.title ?? report.entity?.content ?? "—"}
                <span className="ml-1 text-xs text-zinc-400">by {report.entity?.authorName ?? "?"}</span>
              </AdminCell>
              <AdminCell className="text-zinc-500">{report.user.name}</AdminCell>
              <AdminCell>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">{report.reason}</span>
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={report.resolved ? "green" : "amber"}>{report.resolved ? "Resolved" : "Open"}</AdminBadge>
              </AdminCell>
              <AdminCell className="text-zinc-500">{report.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                {!report.resolved && <ResolveButton reportId={report.id} />}
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {enriched.length === 0 && <AdminEmpty message="No reports yet." />}
    </div>
  );
}
