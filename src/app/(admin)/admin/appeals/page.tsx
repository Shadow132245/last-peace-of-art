import { prisma } from "@/lib/db";
import { AppealActions } from "./appeal-actions";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";

export const dynamic = "force-dynamic";

export default async function AdminAppealsPage() {
  const appeals = await prisma.appeal.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <AdminPageHeader title="Appeals" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {appeals.map((appeal, i) => (
            <AdminTableRow key={appeal.id} index={i}>
              <AdminCell className="font-medium">{appeal.user.name}</AdminCell>
              <AdminCell className="text-zinc-500">{appeal.user.email}</AdminCell>
              <AdminCell className="max-w-[200px]">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium dark:bg-zinc-800">{appeal.reason}</span>
              </AdminCell>
              <AdminCell className="max-w-[250px] truncate text-zinc-500">
                {appeal.description || "—"}
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={appeal.status === "approved" ? "green" : appeal.status === "rejected" ? "red" : "amber"}>
                  {appeal.status}
                </AdminBadge>
              </AdminCell>
              <AdminCell className="text-zinc-500">{new Date(appeal.createdAt).toLocaleDateString()}</AdminCell>
              <AdminCell>
                {appeal.status === "pending" && <AppealActions appealId={appeal.id} />}
                {appeal.status !== "pending" && (
                  <span className="text-xs text-zinc-400">
                    {appeal.adminResponse ? `Response: ${appeal.adminResponse}` : "No response"}
                  </span>
                )}
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {appeals.length === 0 && <AdminEmpty message="No appeals yet." />}
    </div>
  );
}
