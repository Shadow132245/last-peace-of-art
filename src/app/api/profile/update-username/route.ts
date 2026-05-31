import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { notifyAdmins } from "@/lib/moderation";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    if (name.trim().length > 30) {
      return NextResponse.json({ error: "Name must be at most 30 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { name: name.trim() } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "This name is already taken" }, { status: 409 });
    }

    const oldName = session.user.name;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    await notifyAdmins(
      "edit",
      "✏️ Username changed",
      `${oldName} changed their username to "${name.trim()}"`,
      `/admin/users`
    );

    logger.info({ userId: session.user.id, oldName, newName: name.trim() }, "Username updated");
    return NextResponse.json({ success: true, name: name.trim() });
  } catch (error) {
    logger.error({ error }, "Failed to update username");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
