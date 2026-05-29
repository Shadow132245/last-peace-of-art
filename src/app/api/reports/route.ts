import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entityType, entityId, reason, description } = await request.json();
    if (!entityType || !entityId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!["post", "project", "thread", "comment"].includes(entityType)) {
      return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        entityType,
        entityId,
        reason,
        description: description ?? null,
      },
    });

    const admins = await prisma.user.findMany({
      where: { OR: [{ role: "admin" }, { role: "founder" }] },
      select: { id: true },
    });

    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        id: crypto.randomUUID(),
        userId: admin.id,
        type: "update",
        title: "New report submitted",
        message: `${session.user.name} reported a ${entityType} for: ${reason}`,
        link: "/admin/reports",
      })),
    });

    logger.info({ reportId: report.id, entityType, entityId }, "Report submitted");
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to submit report");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
