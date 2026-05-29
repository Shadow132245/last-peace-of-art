import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: session.user.id, status: "pending" },
      include: { sender: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverId } = await request.json();
    if (!receiverId) return NextResponse.json({ error: "receiverId required" }, { status: 400 });
    if (receiverId === session.user.id) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId },
          { senderId: receiverId, receiverId: session.user.id },
        ],
      },
    });
    if (existing) return NextResponse.json({ error: "Request already exists" }, { status: 400 });

    const request_rec = await prisma.friendRequest.create({
      data: {
        id: crypto.randomUUID(),
        senderId: session.user.id,
        receiverId,
      },
    });

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: receiverId,
        type: "message",
        title: `Friend request from ${session.user.name}`,
        message: `${session.user.name} wants to be friends!`,
        link: "/dashboard/friends",
      },
    });

    logger.info({ requestId: request_rec.id }, "Friend request sent");
    return NextResponse.json(request_rec, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to send friend request");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
