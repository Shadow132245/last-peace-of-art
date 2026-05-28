import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/suspended") || request.nextUrl.pathname.startsWith("/appeal")) {
    return NextResponse.next();
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { suspended: true },
  });

  if (user?.suspended) {
    return NextResponse.redirect(new URL("/suspended", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
