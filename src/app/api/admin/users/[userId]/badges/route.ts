import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PUT(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const role = (session?.user as any)?.role;
    if (!session || role !== "founder") {
      return NextResponse.json({ error: "Only the founder can assign badges" }, { status: 403 });
    }

    const { userId } = await params;
    const { badgeIds } = await request.json();
    if (!Array.isArray(badgeIds)) {
      return NextResponse.json({ error: "badgeIds must be an array" }, { status: 400 });
    }

    await prisma.userBadge.deleteMany({ where: { userId } });
    if (badgeIds.length > 0) {
      await prisma.userBadge.createMany({
        data: badgeIds.map((badgeId: string, i: number) => ({
          id: crypto.randomUUID(),
          userId,
          badgeId,
          order: i,
        })),
      });
    }

    logger.info({ userId, badgeIds }, "Admin updated user badges");
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Failed to update user badges");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
