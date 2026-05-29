import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, description, category } = await request.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        title,
        description,
        category: category || "bug",
      },
    });

    await prisma.notification.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        type: "ticket",
        title: "Ticket submitted",
        message: `"${title}" — awaiting review`,
        link: "/dashboard",
      },
    });

    logger.info({ ticketId: ticket.id }, "Ticket created");
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    logger.error({ error }, "Failed to create ticket");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    logger.error({ error }, "Failed to fetch tickets");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
