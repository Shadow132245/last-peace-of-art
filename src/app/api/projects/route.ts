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

    const { title, description, content, tags, media } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const { flagged, matches } = await checkContent(title + " " + description + " " + (content ?? ""), (session.user as any).role);
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged content blocked",
        `User "${session.user.name}" tried to post project with: ${matches.join(", ")}`,
        `/admin/projects`
      );
      return NextResponse.json({
        error: `Your project was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const project = await prisma.project.create({
      data: {
        id: crypto.randomUUID(),
        title,
        description,
        content: content ?? null,
        tags: tags ?? [],
        media: media ?? [],
        published: true,
        userId: session.user.id,
      },
    });

    logger.info({ projectId: project.id }, "Project created");
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create project");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    logger.error({ error }, "Failed to fetch projects");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
