import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const threadId = url.searchParams.get("threadId");
  if (!threadId) return NextResponse.json({ error: "threadId required" }, { status: 400 });

  const poll = await prisma.poll.findUnique({
    where: { threadId },
    include: {
      options: {
        include: { votes: { select: { userId: true } } },
      },
    },
  });
  if (!poll) return NextResponse.json(null);

  const session = await auth.api.getSession({ headers: await headers() });
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
  const userVotes = session
    ? poll.options.flatMap((o) => o.votes.filter((v) => v.userId === session.user.id).map(() => o.id))
    : [];

  return NextResponse.json({
    id: poll.id,
    question: poll.question,
    multiple: poll.multiple,
    expiresAt: poll.expiresAt,
    createdAt: poll.createdAt,
    totalVotes,
    userVotes,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.text,
      count: o.votes.length,
      percentage: totalVotes > 0 ? Math.round((o.votes.length / totalVotes) * 100) : 0,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId, question, options: optionTexts, multiple, expiresAt } = await request.json();
  if (!threadId || !question || !optionTexts || optionTexts.length < 2) {
    return NextResponse.json({ error: "Question and at least 2 options required" }, { status: 400 });
  }

  const thread = await prisma.thread.findUnique({ where: { id: threadId }, select: { userId: true } });
  if (!thread || thread.userId !== session.user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const poll = await prisma.poll.create({
    data: {
      id: crypto.randomUUID(),
      threadId,
      question,
      multiple: multiple ?? false,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      options: {
        create: optionTexts.map((text: string) => ({ id: crypto.randomUUID(), text })),
      },
    },
    include: { options: true },
  });

  return NextResponse.json(poll, { status: 201 });
}
