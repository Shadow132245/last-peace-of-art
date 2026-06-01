import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkAndAwardBadges } from "@/lib/auto-award";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;
  if (!session || (role !== "admin" && role !== "founder")) throw new Error("Forbidden");
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status, adminResponse } = await request.json();

    if (!["open", "resolved", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        status,
        adminResponse: adminResponse ?? null,
        resolvedAt: status === "resolved" ? new Date() : null,
      },
    });

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: ticket.userId,
        type: "ticket",
        title: `Ticket ${status}`,
        message: adminResponse ? `Response: ${adminResponse}` : `Your ticket has been ${status}`,
        link: "/dashboard",
      },
    });

    if (status === "resolved") {
      checkAndAwardBadges(ticket.userId).catch((e) => logger.error({ error: e }, "checkAndAwardBadges failed"));
    }

    logger.info({ ticketId: id, status }, `Ticket ${status}`);
    return NextResponse.json(ticket);
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
