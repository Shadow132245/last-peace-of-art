import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const req = await prisma.friendRequest.findUnique({ where: { id } });
    if (!req || req.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.friendRequest.update({
      where: { id },
      data: { status },
    });

    if (status === "accepted") {
      await prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          userId: req.senderId,
          type: "message",
          title: "Friend request accepted",
          message: `${session.user.name} accepted your friend request!`,
          link: "/dashboard/friends",
        },
      });
    }

    logger.info({ requestId: id, status }, `Friend request ${status}`);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
