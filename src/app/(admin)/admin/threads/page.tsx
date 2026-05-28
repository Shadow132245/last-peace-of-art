import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { AdminPublishToggle } from "@/components/ui/admin-publish-toggle";
import Link from "next/link";

export default async function AdminThreadsPage() {
  const threads = await prisma.thread.findMany({
    include: { user: { select: { name: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Threads" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Comments</th>
            <th className="px-4 py-3 font-medium">Pinned</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
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
                <AdminPublishToggle entityType="threads" entityId={thread.id} published={thread.published} />
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
      {threads.length === 0 && <AdminEmpty message="No threads yet." />}
    </div>
  );
}
