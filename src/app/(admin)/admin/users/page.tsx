import { prisma } from "@/lib/db";
import Link from "next/link";
import { BanButton } from "./ban-button";
import { SuspendButton } from "./suspend-button";
import { RoleButton } from "./role-button";
import { VerifyButton } from "./verify-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { t } = await getServerT();
  const session = await auth.api.getSession({ headers: await headers() });
  const currentUserRole = (session?.user as any)?.role ?? "user";
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title={t("admin.users")} />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.name")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.email")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.role")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.joined")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.actions")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {users.map((user, i) => (
            <AdminTableRow key={user.id} index={i}>
              <AdminCell className="font-medium">{user.name}</AdminCell>
              <AdminCell className="text-zinc-500">{user.email}</AdminCell>
              <AdminCell>
                <RoleButton userId={user.id} currentRoles={(user.roles as string[]) ?? [user.role]} />
              </AdminCell>
              <AdminCell>
                {user.banned ? (
                  <AdminBadge variant="red">{t("admin.banned")}</AdminBadge>
                ) : user.suspended ? (
                  <AdminBadge variant="amber">{t("admin.suspended")}</AdminBadge>
                ) : (
                  <AdminBadge variant="green">{t("admin.active")}</AdminBadge>
                )}
              </AdminCell>
              <AdminCell className="text-zinc-500">{user.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <div className="flex flex-wrap gap-2">
                  <BanButton userId={user.id} banned={user.banned} targetRole={user.role} currentUserRole={currentUserRole} />
                  <SuspendButton userId={user.id} suspended={user.suspended} suspensionReason={user.suspensionReason} suspendedUntil={user.suspendedUntil?.toISOString() ?? null} targetRole={user.role} currentUserRole={currentUserRole} />
                  <VerifyButton userId={user.id} emailVerified={user.emailVerified} />
                </div>
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {users.length === 0 && <AdminEmpty message={t("admin.noUsers")} />}
    </div>
  );
}
