import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { checkContent, notifyAdmins } from "@/lib/moderation";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    logger.error({ error }, "Failed to fetch post");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, content, excerpt, tags } = await request.json();

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { flagged, matches } = checkContent(title + " " + content);
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged edit blocked",
        `User "${session.user.name}" tried to update post with: ${matches.join(", ")}`,
        `/admin/posts`
      );
      return NextResponse.json({
        error: `Your edit was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt ?? null,
        tags: tags ?? [],
      },
    });

    await notifyAdmins(
      "edit",
      "✏️ Post edited",
      `User "${session.user.name}" edited post: "${title}"`,
      `/admin/posts`
    );

    logger.info({ postId: id }, "Post updated");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update post");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { published } = await request.json();

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { published },
    });

    logger.info({ postId: id, published }, "Post status toggled");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update post");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
