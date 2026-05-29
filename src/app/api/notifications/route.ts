import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unread = notifications.filter((n) => !n.read).length;

  return NextResponse.json({ notifications, unread });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, type, title, message, link } = await request.json();
  if (!userId || !type || !title) {
    return NextResponse.json({ error: "userId, type, and title are required" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      type,
      title,
      message: message ?? null,
      link: link ?? null,
    },
  });

  return NextResponse.json(notification, { status: 201 });
}
