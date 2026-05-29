import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers } = await request.json();
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    const existing = await prisma.application.findFirst({
      where: { userId: session.user.id, status: "pending" },
    });
    if (existing) {
      return NextResponse.json({ error: "You already have a pending application" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        answers,
      },
    });

    const admins = await prisma.user.findMany({
      where: { OR: [{ role: "admin" }, { role: "founder" }] },
      select: { id: true },
    });
    await prisma.notification.createMany({
      data: admins.map((admin) => ({
        id: crypto.randomUUID(),
        userId: admin.id,
        type: "application",
        title: "New staff application",
        message: `${session.user.name} has submitted a staff application.`,
        link: "/admin/applications",
      })),
    });

    logger.info({ applicationId: application.id }, "Application submitted");
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to submit application");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
