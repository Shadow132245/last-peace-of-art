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
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    logger.error({ error }, "Failed to fetch project");
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
    const { title, description, content, tags, media } = await request.json();

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { flagged, matches } = await checkContent(title + " " + description + " " + (content ?? ""));
    if (flagged) {
      await notifyAdmins(
        "moderation",
        "🚩 Flagged edit blocked",
        `User "${session.user.name}" tried to update project with: ${matches.join(", ")}`,
        `/admin/projects`
      );
      return NextResponse.json({
        error: `Your edit was blocked because it contains prohibited words: ${matches.join(", ")}. Please remove them and try again.`,
        flagged: true,
        matches,
      }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        content: content ?? null,
        tags: tags ?? [],
        media: media ?? [],
      },
    });

    await notifyAdmins(
      "edit",
      "✏️ Project edited",
      `User "${session.user.name}" edited project: "${title}"`,
      `/admin/projects`
    );

    logger.info({ projectId: id }, "Project updated");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update project");
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

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { published },
    });

    logger.info({ projectId: id, published }, "Project status toggled");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error({ error }, "Failed to update project");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
