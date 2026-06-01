import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { calculateRank } from "@/lib/ranks";
import { checkAndAwardBadges } from "@/lib/auto-award";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function awardPoints(entityType: string, entityId: string, likedByUserId: string) {
  let ownerId: string | null = null;

  if (entityType === "post") {
    const post = await prisma.post.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = post?.userId ?? null;
  } else if (entityType === "project") {
    const project = await prisma.project.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = project?.userId ?? null;
  } else if (entityType === "thread") {
    const thread = await prisma.thread.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = thread?.userId ?? null;
  } else if (entityType === "comment") {
    const comment = await prisma.comment.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = comment?.userId ?? null;
  }

  if (!ownerId || ownerId === likedByUserId) return;

  const pointsMap: Record<string, number> = { post: 5, project: 5, thread: 3, comment: 10 };
  const points = pointsMap[entityType] ?? 0;
  if (points === 0) return;

  const user = await prisma.user.findUnique({ where: { id: ownerId }, select: { points: true, rank: true } });
  if (!user) return;

  const newPoints = user.points + points;
  const newRank = calculateRank(newPoints);

  await prisma.user.update({
    where: { id: ownerId },
    data: { points: newPoints, rank: newRank },
  });

  if (newRank !== user.rank) {
    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: ownerId,
        type: "rank_up",
        title: `Rank Up! You are now ${newRank}`,
        message: `Congratulations! You reached ${newRank} rank with ${newPoints} points.`,
        link: "/dashboard",
      },
    });
  }

  checkAndAwardBadges(ownerId).catch((e) => logger.error({ error: e }, "checkAndAwardBadges failed"));
}

async function deductPoints(entityType: string, entityId: string, unlikedByUserId: string) {
  let ownerId: string | null = null;

  if (entityType === "post") {
    const post = await prisma.post.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = post?.userId ?? null;
  } else if (entityType === "project") {
    const project = await prisma.project.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = project?.userId ?? null;
  } else if (entityType === "thread") {
    const thread = await prisma.thread.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = thread?.userId ?? null;
  } else if (entityType === "comment") {
    const comment = await prisma.comment.findUnique({ where: { id: entityId }, select: { userId: true } });
    ownerId = comment?.userId ?? null;
  }

  if (!ownerId || ownerId === unlikedByUserId) return;

  const pointsMap: Record<string, number> = { post: 5, project: 5, thread: 3, comment: 10 };
  const points = pointsMap[entityType] ?? 0;
  if (points === 0) return;

  const user = await prisma.user.findUnique({ where: { id: ownerId }, select: { points: true } });
  if (!user) return;

  const newPoints = Math.max(0, user.points - points);
  const newRank = calculateRank(newPoints);

  await prisma.user.update({
    where: { id: ownerId },
    data: { points: newPoints, rank: newRank },
  });
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
    if (!["post", "project", "thread", "comment"].includes(entityType)) {
      return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });
    }

    const existing = await prisma.like.findUnique({
      where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.like.delete({ where: { id: existing.id } });
        await updateCounts(entityType, entityId);
        await deductPoints(entityType, entityId, session.user.id);
        logger.info({ entityType, entityId }, "Like removed");
        return NextResponse.json({ action: "removed" });
      }
      const oldType = existing.type;
      await prisma.like.update({ where: { id: existing.id }, data: { type } });
      await updateCounts(entityType, entityId);
      if (oldType === "like" && type === "dislike") {
        await deductPoints(entityType, entityId, session.user.id);
      } else if (oldType === "dislike" && type === "like") {
        await awardPoints(entityType, entityId, session.user.id);
      }
      logger.info({ entityType, entityId, type }, "Like toggled");
      return NextResponse.json({ action: "switched" });
    }

    await prisma.like.create({
      data: { id: crypto.randomUUID(), userId: session.user.id, entityType, entityId, type },
    });
    await updateCounts(entityType, entityId);
    if (type === "like") {
      await awardPoints(entityType, entityId, session.user.id);
    }
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
