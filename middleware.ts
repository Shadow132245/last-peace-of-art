import { NextRequest, NextResponse } from "next/server";

const rateMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 60;
const RATE_WINDOW = 60_000;

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? request.headers.get("x-real-ip")
      ?? "unknown";
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    } else if (entry.count >= RATE_LIMIT) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) },
      });
    } else {
      entry.count++;
    }

    if (rateMap.size > 10_000) {
      const cutoff = now - RATE_WINDOW * 2;
      for (const [key, val] of rateMap) {
        if (val.resetAt < cutoff) rateMap.delete(key);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
