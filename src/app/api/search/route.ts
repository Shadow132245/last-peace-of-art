import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 1) {
      return NextResponse.json({ results: [] });
    }

    const filter = { contains: q, mode: "insensitive" as const };

    const [posts, projects, threads, users] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, OR: [{ title: filter }, { content: filter }, { excerpt: filter }] },
        include: { user: { select: { name: true, id: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.project.findMany({
        where: { published: true, OR: [{ title: filter }, { content: filter }, { description: filter }] },
        include: { user: { select: { name: true, id: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.thread.findMany({
        where: { published: true, OR: [{ title: filter }, { content: filter }] },
        include: { user: { select: { name: true, id: true, image: true } }, _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.user.findMany({
        where: { OR: [{ name: filter }, { email: filter }] },
        select: { id: true, name: true, image: true, role: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const results = [
      ...posts.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.excerpt ?? "",
        type: "post" as const,
        url: `/blog/${p.slug}`,
        userName: p.user.name,
        userId: p.user.id,
        userImage: p.user.image,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        views: p.views,
        commentCount: 0,
      })),
      ...projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description ?? "",
        type: "project" as const,
        url: `/projects/${p.id}`,
        userName: p.user.name,
        userId: p.user.id,
        userImage: p.user.image,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        views: p.views,
        commentCount: 0,
      })),
      ...threads.map((t) => ({
        id: t.id,
        title: t.title,
        description: "",
        type: "thread" as const,
        url: `/forum/${t.id}`,
        userName: t.user.name,
        userId: t.user.id,
        userImage: t.user.image,
        likesCount: t.likesCount,
        dislikesCount: t.dislikesCount,
        views: t.views,
        commentCount: t._count.comments,
      })),
      ...users.map((u) => ({
        id: u.id,
        title: u.name,
        description: u.role,
        type: "user" as const,
        url: `/user/${encodeURIComponent(u.name)}`,
        userName: u.name,
        userId: u.id,
        userImage: u.image,
        likesCount: 0,
        dislikesCount: 0,
        views: 0,
        commentCount: 0,
      })),
    ];

    return NextResponse.json({ results, query: q });
  } catch (error) {
    logger.error({ error }, "Search failed");
    return NextResponse.json({ results: [] });
  }
}
