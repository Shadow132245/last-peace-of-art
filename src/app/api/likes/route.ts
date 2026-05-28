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

    const { entityType, entityId, type } = await request.json();
    if (!entityType || !entityId || !type || !["like", "dislike"].includes(type)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (!["post", "project", "thread"].includes(entityType)) {
      return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
    }

    const existing = await prisma.like.findUnique({
      where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.like.delete({ where: { id: existing.id } });
        await updateCounts(entityType, entityId);
        logger.info({ entityType, entityId }, "Like removed");
        return NextResponse.json({ action: "removed" });
      }
      await prisma.like.update({ where: { id: existing.id }, data: { type } });
      await updateCounts(entityType, entityId);
      logger.info({ entityType, entityId, type }, "Like toggled");
      return NextResponse.json({ action: "switched" });
    }

    await prisma.like.create({
      data: { id: crypto.randomUUID(), userId: session.user.id, entityType, entityId, type },
    });
    await updateCounts(entityType, entityId);
    logger.info({ entityType, entityId, type }, "Like added");
    return NextResponse.json({ action: "added" });
  } catch (error) {
    logger.error({ error }, "Failed to process like");
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

    const session = await getSession();

    const [likes, userLike] = await Promise.all([
      prisma.like.findMany({ where: { entityType, entityId } }),
      session
        ? prisma.like.findUnique({
            where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
          })
        : null,
    ]);

    const likeCount = likes.filter((l) => l.type === "like").length;
    const dislikeCount = likes.filter((l) => l.type === "dislike").length;

    return NextResponse.json({
      likeCount,
      dislikeCount,
      userType: userLike?.type ?? null,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch likes");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function updateCounts(entityType: string, entityId: string) {
  const likes = await prisma.like.findMany({ where: { entityType, entityId } });
  const likeCount = likes.filter((l) => l.type === "like").length;
  const dislikeCount = likes.filter((l) => l.type === "dislike").length;

  const data = { likesCount: likeCount, dislikesCount: dislikeCount };
  if (entityType === "post") await prisma.post.update({ where: { id: entityId }, data });
  else if (entityType === "project") await prisma.project.update({ where: { id: entityId }, data });
  else if (entityType === "thread") await prisma.thread.update({ where: { id: entityId }, data });
}
