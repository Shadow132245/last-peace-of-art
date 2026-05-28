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

export async function GET() {
  try {
    await requireAdmin();
    const appeals = await prisma.appeal.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(appeals);
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
