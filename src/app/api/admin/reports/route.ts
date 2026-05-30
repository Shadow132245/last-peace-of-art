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

export async function GET() {
  try {
    await requireAdmin();

    const reports = await prisma.report.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
    });

    const enriched = await Promise.all(
      reports.map(async (report) => {
        let entity: { title?: string; content?: string; user?: { name: string } } | null = null;
        if (report.entityType === "post") {
          entity = await prisma.post.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        } else if (report.entityType === "project") {
          entity = await prisma.project.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        } else if (report.entityType === "thread") {
          entity = await prisma.thread.findUnique({ where: { id: report.entityId }, select: { title: true, user: { select: { name: true } } } });
        } else if (report.entityType === "comment") {
          entity = await prisma.comment.findUnique({ where: { id: report.entityId }, select: { content: true, user: { select: { name: true } } } });
        }
        return { ...report, entity };
      })
    );

    return NextResponse.json({ reports: enriched });
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
