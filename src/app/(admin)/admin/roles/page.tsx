import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { getServerT } from "@/lib/server-i18n";
import { AdminBadgeManager } from "./badge-manager";
import { RoleButton } from "../users/role-button";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  const { t, locale } = await getServerT();
  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as any)?.role;
  if (!session) redirect("/login");
  if (userRole !== "founder") notFound();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      badges: { include: { badge: true }, orderBy: { order: "asc" } },
    },
  });

  const allBadges = await prisma.badge.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <AdminPageHeader title={t("admin.roles")} description={t("admin.rolesDesc")} />

      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.name")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.email")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.role")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.badges")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {users.map((user, i) => (
            <AdminTableRow key={user.id} index={i}>
              <AdminCell className="font-medium">{user.name}</AdminCell>
              <AdminCell className="text-zinc-500">{user.email}</AdminCell>
              <AdminCell>
                <RoleButton userId={user.id} currentRoles={(user.roles as string[]) ?? [user.role]} currentUserRole={userRole} />
              </AdminCell>
              <AdminCell>
                <AdminBadgeManager
                  userId={user.id}
                  userBadges={user.badges.map((ub) => ub.badgeId)}
                  allBadges={allBadges.map((b) => ({ id: b.id, icon: b.icon, name: b.name }))}
                  isStaff={(user.roles as string[]).includes("moderator") || (user.roles as string[]).includes("admin")}
                />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {users.length === 0 && <AdminEmpty message={t("admin.noUsers")} />}
    </div>
  );
}
