import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversations = await prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const usersMap = new Map<string, { id: string; name: string; image: string | null; lastMessage: string; lastMessageAt: Date }>();
    for (const msg of conversations) {
      const other = msg.senderId === session.user.id ? msg.receiver : msg.sender;
      if (!usersMap.has(other.id)) {
        usersMap.set(other.id, {
          id: other.id,
          name: other.name,
          image: other.image,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
        });
      }
    }

    return NextResponse.json(Array.from(usersMap.values()).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime()));
  } catch (error) {
    logger.error({ error }, "Failed to fetch conversations");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverId, content } = await request.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: "Receiver and content are required" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        id: crypto.randomUUID(),
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: receiverId,
        type: "message",
        title: `New message from ${session.user.name}`,
        message: content.slice(0, 100),
        link: "/dashboard/messages",
      },
    });

    logger.info({ messageId: message.id }, "Message sent");
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to send message");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
