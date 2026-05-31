import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { messagesFromFriendsOnly: true },
  });

  return NextResponse.json({ messagesFromFriendsOnly: user?.messagesFromFriendsOnly ?? false });
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messagesFromFriendsOnly } = await request.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { messagesFromFriendsOnly: !!messagesFromFriendsOnly },
  });

  return NextResponse.json({ success: true });
}
