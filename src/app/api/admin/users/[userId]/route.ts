import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;
  if (!session || (role !== "admin" && role !== "founder")) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const session = await requireAdmin();
    const { userId } = await params;
    const body = await request.json();

    if ("role" in body) {
      const { role } = body;
      if (!["user", "bug_hunter", "premium", "moderator", "admin"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!currentUser || currentUser.email !== "fghfghffdgfhfgh@gmail.com") {
        return NextResponse.json({ error: "Only the founder can change roles" }, { status: 403 });
      }
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
      logger.info({ userId, role }, `User role changed to ${role}`);
      return NextResponse.json({ user });
    }

    if ("banned" in body) {
      const { banned } = body;
      const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
      const currentRole = (session.user as any).role;
      if (targetUser.role === "founder") {
        return NextResponse.json({ error: "Cannot ban the founder" }, { status: 403 });
      }
      if (targetUser.role === "admin" && currentRole !== "founder") {
        return NextResponse.json({ error: "Only the founder can ban an admin" }, { status: 403 });
      }
      const user = await prisma.user.update({
        where: { id: userId },
        data: { banned, banReason: banned ? "Banned by admin" : null, banExpires: banned ? new Date("2099-12-31") : null },
      });
      logger.info({ userId, banned }, `User ${banned ? "banned" : "unbanned"}`);
      return NextResponse.json({ user });
    }

    if ("suspended" in body) {
      const { suspended, suspensionReason, suspendedUntil } = body;
      const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
      const currentRole = (session.user as any).role;
      if (targetUser.role === "founder") {
        return NextResponse.json({ error: "Cannot suspend the founder" }, { status: 403 });
      }
      if (targetUser.role === "admin" && currentRole !== "founder") {
        return NextResponse.json({ error: "Only the founder can suspend an admin" }, { status: 403 });
      }
      const data: any = { suspended };
      if (suspended) {
        data.suspendedAt = new Date();
        data.suspensionReason = suspensionReason || "No reason provided";
        data.suspendedUntil = suspendedUntil ? new Date(suspendedUntil) : null;
      } else {
        data.suspendedAt = null;
        data.suspensionReason = null;
        data.suspendedUntil = null;
      }
      const user = await prisma.user.update({ where: { id: userId }, data });
      logger.info({ userId, suspended, reason: suspensionReason }, `User ${suspended ? "suspended" : "unsuspended"}`);
      return NextResponse.json({ user });
    }

    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error && error.message === "Forbidden" ? "Forbidden" : "Internal server error";
    const status = msg === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
