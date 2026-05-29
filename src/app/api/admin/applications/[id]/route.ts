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

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: application.userId,
        type: "application",
        title: `Application ${status}`,
        message: adminResponse || `Your staff application has been ${status}.`,
        link: "/dashboard",
      },
    });

    if (status === "approved") {
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: "admin" },
      });
    }

    logger.info({ applicationId: id, status }, `Application ${status}`);
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
