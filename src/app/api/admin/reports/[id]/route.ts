import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !["admin", "founder"].includes(session.user.role as string)) throw new Error("Forbidden");
  return session;
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.report.update({ where: { id }, data: { resolved: true } });
    logger.info({ reportId: id }, "Report resolved");
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
