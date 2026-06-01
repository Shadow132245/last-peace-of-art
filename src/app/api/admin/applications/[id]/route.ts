import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "founder")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status, adminResponse } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        adminResponse: adminResponse ?? null,
        reviewedAt: new Date(),
      },
    });

    if (status === "approved") {
      const user = await prisma.user.findUnique({
        where: { id: application.userId },
        select: { roles: true },
      });
      const currRoles: string[] = (user?.roles ?? []) as string[];
      const newRoles = currRoles.includes("moderator") ? currRoles : [...currRoles, "moderator"];

      await prisma.user.update({
        where: { id: application.userId },
        data: { role: "moderator", roles: newRoles },
      });

      const staffBadge = await prisma.badge.findUnique({ where: { id: "staff" } });
      if (staffBadge) {
        const existing = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId: application.userId, badgeId: "staff" } },
        });
        if (!existing) {
          const count = await prisma.userBadge.count({ where: { userId: application.userId } });
          await prisma.userBadge.create({
            data: {
              id: crypto.randomUUID(),
              userId: application.userId,
              badgeId: "staff",
              order: count,
            },
          });
        }
      }

      await prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          userId: application.userId,
          type: "role",
          title: "You are now a Moderator!",
          message: "Your staff application was approved. You now have the Moderator role and the Staff badge.",
          link: "/dashboard",
        },
      });
    } else {
      await prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          userId: application.userId,
          type: "application",
          title: "Application Rejected",
          message: adminResponse || "Your staff application has been rejected.",
          link: "/dashboard",
        },
      });
    }

    logger.info({ applicationId: id, status }, `Application ${status}`);
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
