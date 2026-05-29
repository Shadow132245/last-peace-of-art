import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sent = await prisma.friendRequest.findMany({
      where: { senderId: session.user.id, status: "accepted" },
      include: { receiver: { select: { id: true, name: true, image: true } } },
    });
    const received = await prisma.friendRequest.findMany({
      where: { receiverId: session.user.id, status: "accepted" },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    const friends = [
      ...sent.map((r) => ({ id: r.receiver.id, name: r.receiver.name, image: r.receiver.image, since: r.createdAt })),
      ...received.map((r) => ({ id: r.sender.id, name: r.sender.name, image: r.sender.image, since: r.createdAt })),
    ];

    return NextResponse.json(friends);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { friendId } = await request.json();
    if (!friendId) return NextResponse.json({ error: "friendId required" }, { status: 400 });

    await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: friendId, status: "accepted" },
          { senderId: friendId, receiverId: session.user.id, status: "accepted" },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
