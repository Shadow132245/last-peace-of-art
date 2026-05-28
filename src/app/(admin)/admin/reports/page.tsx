import { prisma } from "@/lib/db";
import { ResolveButton } from "./resolve-button";

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
      <h1 className="mb-8 text-3xl font-bold">Reports</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Content</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Reported by</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {enriched.map((report) => (
              <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="px-4 py-3">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">{report.entityType}</span>
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                  {report.entity?.title ?? report.entity?.content ?? "—"}
                  <span className="ml-1 text-xs text-zinc-400">by {report.entity?.authorName ?? "?"}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{report.entity?.authorName ?? "?"}</td>
                <td className="px-4 py-3 text-zinc-500">{report.user.name}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">{report.reason}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${report.resolved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"}`}>
                    {report.resolved ? "Resolved" : "Open"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{report.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {!report.resolved && <ResolveButton reportId={report.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enriched.length === 0 && <p className="mt-8 text-zinc-500 dark:text-zinc-400">No reports yet.</p>}
    </div>
  );
}
