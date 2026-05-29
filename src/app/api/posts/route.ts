import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

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
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    const autoPublish = user?.role === "bug_hunter";

    const post = await prisma.post.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        tags: tags ?? [],
        published: autoPublish,
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
