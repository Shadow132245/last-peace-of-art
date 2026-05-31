import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: Promise<{ pollId: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pollId } = await params;
  const { optionIds } = await _request.json();
  if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
    return NextResponse.json({ error: "optionIds array required" }, { status: 400 });
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { select: { id: true } } },
  });
  if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });

  const validIds = new Set(poll.options.map((o) => o.id));
  if (optionIds.some((id: string) => !validIds.has(id))) {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  }

  if (!poll.multiple && optionIds.length > 1) {
    return NextResponse.json({ error: "Single vote only" }, { status: 400 });
  }

  if (poll.expiresAt && new Date() > poll.expiresAt) {
    return NextResponse.json({ error: "Poll has expired" }, { status: 400 });
  }

  await prisma.pollVote.deleteMany({
    where: { option: { pollId }, userId: session.user.id },
  });

  for (const optionId of optionIds) {
    await prisma.pollVote.create({
      data: { id: crypto.randomUUID(), optionId, userId: session.user.id },
    });
  }

  return NextResponse.json({ success: true });
}
