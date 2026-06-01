import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const badges = await prisma.userBadge.findMany({
    where: { userId: session.user.id },
    include: { badge: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(badges);
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { badgeIds } = await request.json();
  if (!Array.isArray(badgeIds)) {
    return NextResponse.json({ error: "badgeIds must be an array" }, { status: 400 });
  }

  await prisma.userBadge.deleteMany({ where: { userId: session.user.id } });

  if (badgeIds.length > 0) {
    await prisma.userBadge.createMany({
      data: badgeIds.map((badgeId: string, i: number) => ({
        id: crypto.randomUUID(),
        userId: session.user.id,
        badgeId,
        order: i,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
