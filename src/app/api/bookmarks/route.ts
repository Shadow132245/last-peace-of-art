import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const grouped: Record<string, { entityType: string; items: any[] }> = {};
  for (const b of bookmarks) {
    if (!grouped[b.entityType]) grouped[b.entityType] = { entityType: b.entityType, items: [] };
    grouped[b.entityType].items.push(b);
  }

  const result: any[] = [];
  for (const [entityType, group] of Object.entries(grouped)) {
    const ids = group.items.map((i: any) => i.entityId);
    let entities: any[] = [];
    if (entityType === "post") entities = await prisma.post.findMany({ where: { id: { in: ids } }, select: { id: true, title: true, slug: true } });
    else if (entityType === "project") entities = await prisma.project.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    else if (entityType === "thread") entities = await prisma.thread.findMany({ where: { id: { in: ids } }, select: { id: true, title: true } });
    else if (entityType === "comment") entities = await prisma.comment.findMany({ where: { id: { in: ids } }, select: { id: true, content: true } });

    const entityMap = new Map(entities.map((e: any) => [e.id, e]));
    result.push({
      entityType,
      items: group.items.map((b: any) => ({ ...b, entity: entityMap.get(b.entityId) ?? null })),
    });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entityType, entityId } = await request.json();
  if (!entityType || !entityId) {
    return NextResponse.json({ error: "entityType and entityId required" }, { status: 400 });
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_entityType_entityId: { userId: session.user.id, entityType, entityId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed" });
  }

  const bookmark = await prisma.bookmark.create({
    data: { id: crypto.randomUUID(), userId: session.user.id, entityType, entityId },
  });
  return NextResponse.json(bookmark, { status: 201 });
}
