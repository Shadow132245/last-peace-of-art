import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { entityType, entityId } = await request.json();
    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (entityType === "post") await prisma.post.update({ where: { id: entityId }, data: { views: { increment: 1 } } });
    else if (entityType === "project") await prisma.project.update({ where: { id: entityId }, data: { views: { increment: 1 } } });
    else if (entityType === "thread") await prisma.thread.update({ where: { id: entityId }, data: { views: { increment: 1 } } });
    else return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
