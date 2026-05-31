import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as any)?.role;
  if (!session || (role !== "admin" && role !== "founder")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const userIds: string[] | undefined = body.userIds;

  const result = await prisma.user.updateMany({
    where: userIds?.length
      ? { id: { in: userIds }, emailVerified: false }
      : { emailVerified: false },
    data: { emailVerified: true },
  });

  return NextResponse.json({ updated: result.count });
}
