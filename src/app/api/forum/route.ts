import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { checkContent, notifyAdmins } from "@/lib/moderation";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    const isBugHunter = user?.role === "bug_hunter";

    const thread = await prisma.thread.create({
      data: {
        id: crypto.randomUUID(),
        title,
        content,
        tags: tags ?? [],
        published: isBugHunter,
        userId: session.user.id,
      },
    });

    if (isBugHunter) {
      const { flagged, matches } = checkContent(title + " " + content);
      if (flagged) {
        await notifyAdmins(
          "moderation",
          "⚠️ Flagged thread",
          `Bug Hunter "${session.user.name}" posted content with: ${matches.join(", ")}`,
          `/admin/threads`
        );
      }
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
