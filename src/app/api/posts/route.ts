import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { checkContent, notifyAdmins } from "@/lib/moderation";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = slugify(title);

    const { flagged, matches } = checkContent(title + " " + content);
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged content blocked",
        `User "${session.user.name}" tried to post content with: ${matches.join(", ")}`,
        `/admin/posts`
      );
      return NextResponse.json({
        error: `Your content was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const post = await prisma.post.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        tags: tags ?? [],
        published: true,
        userId: session.user.id,
      },
    });

    logger.info({ postId: post.id, slug }, "Post created");
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create post");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    logger.error({ error }, "Failed to fetch posts");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
