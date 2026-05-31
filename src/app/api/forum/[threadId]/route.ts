import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { checkContent, notifyAdmins } from "@/lib/moderation";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId: id } = await params;
    const thread = await prisma.thread.findUnique({ where: { id } });

    if (!thread || thread.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(thread);
  } catch (error) {
    logger.error({ error }, "Failed to fetch thread");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId: id } = await params;
    const { title, content, tags } = await request.json();

    const thread = await prisma.thread.findUnique({ where: { id } });
    if (!thread || thread.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { flagged, matches } = await checkContent(title + " " + content);
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged edit blocked",
        `User "${session.user.name}" tried to update thread with: ${matches.join(", ")}`,
        `/admin/threads`
      );
      return NextResponse.json({
        error: `Your edit was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const updated = await prisma.thread.update({
      where: { id },
      data: {
        title,
        content,
        tags: tags ?? [],
      },
    });

    await notifyAdmins(
      "edit",
      "✏️ Thread edited",
      `User "${session.user.name}" edited thread: "${title}"`,
      `/admin/threads`
    );

    logger.info({ threadId: id }, "Thread updated");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update thread");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ threadId: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { threadId: id } = await params;
    const { published } = await request.json();

    const thread = await prisma.thread.findUnique({ where: { id } });
    if (!thread || thread.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.thread.update({
      where: { id },
      data: { published },
    });

    logger.info({ threadId: id, published }, "Thread status toggled");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update thread");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
