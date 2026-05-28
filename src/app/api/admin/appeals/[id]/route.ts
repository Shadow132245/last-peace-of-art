import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "admin") throw new Error("Forbidden");
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status, adminResponse } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const appeal = await prisma.appeal.update({
      where: { id },
      data: { status, adminResponse, reviewedAt: new Date() },
    });

    if (status === "approved") {
      await prisma.user.update({
        where: { id: appeal.userId },
        data: {
          suspended: false,
          suspendedAt: null,
          suspendedUntil: null,
          suspensionReason: null,
        },
      });
      logger.info({ appealId: id, userId: appeal.userId }, "Appeal approved, user unsuspended");
    } else {
      logger.info({ appealId: id, userId: appeal.userId }, "Appeal rejected");
    }

    return NextResponse.json(appeal);
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
