import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "founder")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      include: { user: { select: { name: true, email: true, image: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
