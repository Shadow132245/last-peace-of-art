import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
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
