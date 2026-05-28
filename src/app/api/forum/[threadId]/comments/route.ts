import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        id: crypto.randomUUID(),
        content,
        threadId,
        userId: session.user.id,
      },
      include: { user: { select: { name: true, image: true } } },
    });

    logger.info({ commentId: comment.id, threadId }, "Comment created");
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create comment");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const { threadId } = await params;

    const comments = await prisma.comment.findMany({
      where: { threadId },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    logger.error({ error }, "Failed to fetch comments");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
