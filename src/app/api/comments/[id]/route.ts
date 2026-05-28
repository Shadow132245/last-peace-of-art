import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.comment.delete({ where: { id } });
    logger.info({ commentId: id }, "Comment deleted");
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Failed to delete comment");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
