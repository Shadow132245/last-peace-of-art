import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(session.user as any).suspended) {
      return NextResponse.json({ error: "Your account is not suspended" }, { status: 400 });
    }

    const { reason, description } = await request.json();
    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    const existing = await prisma.appeal.findFirst({
      where: { userId: session.user.id, status: "pending" },
    });
    if (existing) {
      return NextResponse.json({ error: "You already have a pending appeal" }, { status: 400 });
    }

    const appeal = await prisma.appeal.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        reason,
        description,
      },
    });

    logger.info({ appealId: appeal.id, userId: session.user.id }, "Appeal submitted");
    return NextResponse.json(appeal, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to submit appeal");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
