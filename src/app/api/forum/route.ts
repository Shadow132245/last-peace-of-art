import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { checkContent, notifyAdmins } from "@/lib/moderation";
import { extractMentions, notifyMentioned } from "@/lib/mentions";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags, poll: pollData } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true, name: true } });

    const { flagged, matches } = checkContent(title + " " + content);
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged content blocked",
        `User "${session.user.name}" tried to post thread with: ${matches.join(", ")}`,
        `/admin/threads`
      );
      return NextResponse.json({
        error: `Your thread was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const thread = await prisma.thread.create({
      data: {
        id: crypto.randomUUID(),
        title,
        content,
        tags: tags ?? [],
        published: true,
        userId: session.user.id,
      },
    });

    if (pollData?.question && pollData?.options?.length >= 2) {
      await prisma.poll.create({
        data: {
          id: crypto.randomUUID(),
          threadId: thread.id,
          question: pollData.question,
          multiple: pollData.multiple ?? false,
          expiresAt: pollData.expiresAt ? new Date(pollData.expiresAt) : null,
          options: {
            create: pollData.options.map((text: string) => ({ id: crypto.randomUUID(), text })),
          },
        },
      });
    }

    const mentions = extractMentions(content);
    if (mentions.length > 0) {
      await notifyMentioned(mentions, user?.name ?? session.user.name, `/forum/${thread.id}`, prisma);
    }

    logger.info({ threadId: thread.id }, "Thread created");
    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create thread");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const threads = await prisma.thread.findMany({
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(threads);
  } catch (error) {
    logger.error({ error }, "Failed to fetch threads");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
