import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const friend = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: userId },
        { senderId: userId, receiverId: session.user.id },
      ],
    },
  });

  if (!friend) return NextResponse.json({ status: "none" });
  if (friend.status === "accepted") return NextResponse.json({ status: "friends", requestId: friend.id });
  if (friend.senderId === session.user.id) return NextResponse.json({ status: "sent", requestId: friend.id });
  return NextResponse.json({ status: "received", requestId: friend.id });
}
