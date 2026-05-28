import { prisma } from "@/lib/db";
import { BanButton } from "./ban-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Users" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {users.map((user, i) => (
            <AdminTableRow key={user.id} index={i}>
              <AdminCell className="font-medium">{user.name}</AdminCell>
              <AdminCell className="text-zinc-500">{user.email}</AdminCell>
              <AdminCell>
                <AdminBadge variant={user.role === "admin" ? "purple" : "zinc"}>{user.role}</AdminBadge>
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={user.banned ? "red" : "green"}>{user.banned ? "Banned" : "Active"}</AdminBadge>
              </AdminCell>
              <AdminCell className="text-zinc-500">{user.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <BanButton userId={user.id} banned={user.banned} />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {users.length === 0 && <AdminEmpty message="No users yet." />}
    </div>
  );
}
