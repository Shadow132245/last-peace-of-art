import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdmin();
    const { userId } = await params;
    const body = await request.json();

    if ("banned" in body) {
      const { banned } = body;
      const user = await prisma.user.update({
        where: { id: userId },
        data: { banned, banReason: banned ? "Banned by admin" : null, banExpires: banned ? new Date("2099-12-31") : null },
      });
      logger.info({ userId, banned }, `User ${banned ? "banned" : "unbanned"}`);
      return NextResponse.json({ user });
    }

    if ("suspended" in body) {
      const { suspended, suspensionReason, suspendedUntil } = body;
      const data: any = { suspended };
      if (suspended) {
        data.suspendedAt = new Date();
        data.suspensionReason = suspensionReason || "No reason provided";
        data.suspendedUntil = suspendedUntil ? new Date(suspendedUntil) : null;
      } else {
        data.suspendedAt = null;
        data.suspensionReason = null;
        data.suspendedUntil = null;
      }
      const user = await prisma.user.update({ where: { id: userId }, data });
      logger.info({ userId, suspended, reason: suspensionReason }, `User ${suspended ? "suspended" : "unsuspended"}`);
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    const status = msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
