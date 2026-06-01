import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin" && session.user.role !== "founder") {
    throw new Error("Forbidden");
  }

  return session;
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
