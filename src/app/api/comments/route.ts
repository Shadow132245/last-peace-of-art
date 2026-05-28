import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, entityType, entityId } = await request.json();
    if (!content || !entityType || !entityId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data: Record<string, unknown> = {
      id: crypto.randomUUID(),
      content,
      userId: session.user.id,
    };
    if (entityType === "thread") data.threadId = entityId;
    else if (entityType === "post") data.postId = entityId;
    else if (entityType === "project") data.projectId = entityId;
    else return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });

    const comment = await prisma.comment.create({
      data: data as any,
      include: { user: { select: { name: true, image: true } } },
    });

    logger.info({ commentId: comment.id, entityType, entityId }, "Comment created");
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create comment");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const entityType = url.searchParams.get("entityType");
    const entityId = url.searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Missing entityType or entityId" }, { status: 400 });
    }

    const where: Record<string, string> = {};
    if (entityType === "thread") where.threadId = entityId;
    else if (entityType === "post") where.postId = entityId;
    else if (entityType === "project") where.projectId = entityId;
    else return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: where as any,
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    logger.error({ error }, "Failed to fetch comments");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
