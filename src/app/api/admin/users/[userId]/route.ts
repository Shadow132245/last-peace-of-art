import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdmin();
    const { userId } = await params;
    const { banned } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { banned, banReason: banned ? "Banned by admin" : null, banExpires: banned ? new Date("2099-12-31") : null },
    });

    logger.info({ userId, banned }, `User ${banned ? "banned" : "unbanned"}`);
    return NextResponse.json({ user });
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    const status = msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
