import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const query = q
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .join(" & ");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const [posts, projects, users] = await Promise.all([
      prisma.$queryRaw<Array<{ id: string; title: string; excerpt: string | null; type: string; slug: string; created_at: Date; rank: number }>>`
        SELECT id, title, excerpt, 'post'::text AS type, slug,
               created_at AS created_at,
               ts_rank(to_tsvector('english', title || ' ' || COALESCE(excerpt, '')), plainto_tsquery('english', ${q})) AS rank
        FROM post
        WHERE published = true
          AND to_tsvector('english', title || ' ' || COALESCE(excerpt, '')) @@ plainto_tsquery('english', ${q})
        ORDER BY rank DESC
        LIMIT 10
      `,
      prisma.$queryRaw<Array<{ id: string; title: string; description: string; type: string; created_at: Date; rank: number }>>`
        SELECT id, title, description, 'project'::text AS type,
               ''::text AS slug,
               created_at AS created_at,
               ts_rank(to_tsvector('english', title || ' ' || description), plainto_tsquery('english', ${q})) AS rank
        FROM project
        WHERE published = true
          AND to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', ${q})
        ORDER BY rank DESC
        LIMIT 10
      `,
      prisma.$queryRaw<Array<{ id: string; name: string; type: string; created_at: Date; rank: number }>>`
        SELECT id, name, 'user'::text AS type,
               created_at AS created_at,
               ts_rank(to_tsvector('english', name), plainto_tsquery('english', ${q})) AS rank
        FROM "user"
        WHERE to_tsvector('english', name) @@ plainto_tsquery('english', ${q})
        ORDER BY rank DESC
        LIMIT 5
      `,
    ]);

    const results = [
      ...posts.map((p) => ({ id: p.id, title: p.title, description: p.excerpt ?? "", type: "post", url: `/blog/${p.slug}`, date: p.created_at })),
      ...projects.map((p) => ({ id: p.id, title: p.title, description: p.description, type: "project", url: `/projects`, date: p.created_at })),
      ...users.map((u) => ({ id: u.id, title: u.name, description: "User", type: "user", url: `/user/${u.name}`, date: u.created_at })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ results, query: q });
  } catch (error) {
    logger.error({ error }, "Search failed");
    return NextResponse.json({ results: [] });
  }
}
