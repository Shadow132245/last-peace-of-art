import { prisma } from "@/lib/db";
import { TicketActions } from "./ticket-actions";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminBadge, AdminEmpty } from "@/components/ui/admin-page";
import { getServerT } from "@/lib/server-i18n";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, "green" | "red" | "amber" | "purple" | "zinc"> = {
  bug: "red",
  security: "purple",
  feature: "amber",
  other: "zinc",
};

const statusColors: Record<string, "green" | "red" | "amber" | "purple" | "zinc"> = {
  open: "amber",
  resolved: "green",
  closed: "red",
};

export default async function AdminTicketsPage() {
  const { t } = await getServerT();
  const tickets = await prisma.ticket.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <AdminPageHeader title={t("admin.tickets")} />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">{t("admin.user")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.title")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.category")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.status")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.date")}</th>
            <th className="px-4 py-3 font-medium">{t("admin.actions")}</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {tickets.map((ticket, i) => (
            <AdminTableRow key={ticket.id} index={i}>
              <AdminCell className="font-medium">{ticket.user.name}</AdminCell>
              <AdminCell className="max-w-[200px]">
                <div className="font-medium">{ticket.title}</div>
                <div className="mt-0.5 truncate text-xs text-zinc-400">{ticket.description}</div>
                {ticket.adminResponse && (
                  <div className="mt-1 rounded bg-zinc-50 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800/50">
                    {t("admin.responsePrefix")} {ticket.adminResponse}
                  </div>
                )}
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={categoryColors[ticket.category] ?? "zinc"}>{ticket.category}</AdminBadge>
              </AdminCell>
              <AdminCell>
                <AdminBadge variant={statusColors[ticket.status] ?? "zinc"}>{ticket.status}</AdminBadge>
              </AdminCell>
              <AdminCell className="text-zinc-500">{ticket.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <TicketActions ticketId={ticket.id} currentStatus={ticket.status} />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {tickets.length === 0 && <AdminEmpty message={t("admin.noTickets")} />}
    </div>
  );
}
