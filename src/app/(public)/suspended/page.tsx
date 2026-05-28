import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SuspendedPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-6xl">🔒</div>
        <h1 className="mb-3 text-3xl font-bold">Account Suspended</h1>
        <p className="mb-6 text-zinc-500">Please log in to see your account status.</p>
        <Link href="/login" className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          Go to Login
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { suspended: true, suspensionReason: true, suspendedUntil: true },
  });

  if (!user?.suspended) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-6xl">✅</div>
        <h1 className="mb-3 text-3xl font-bold">Account Active</h1>
        <p className="mb-6 text-zinc-500">Your account is not suspended. You can continue using the site normally.</p>
        <Link href="/" className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          Go to Home
        </Link>
      </div>
    );
  }

  const isPermanent = !user.suspendedUntil;
  const untilDate = user.suspendedUntil ? new Date(user.suspendedUntil).toLocaleDateString() : null;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">🔒</div>
      <h1 className="mb-3 text-3xl font-bold">Account Suspended</h1>
      <div className="mb-8 w-full rounded-2xl border border-red-200/80 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
        <p className="mb-3 text-sm font-medium text-red-700 dark:text-red-300">Reason for suspension:</p>
        <p className="mb-4 text-zinc-700 dark:text-zinc-300">{user.suspensionReason || "No reason provided"}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isPermanent ? "This suspension is permanent." : `Suspended until: ${untilDate}`}
        </p>
      </div>
      <p className="mb-6 text-zinc-500">
        You can submit an appeal if you believe this was a mistake or would like to request reinstatement.
      </p>
      <Link
        href="/appeal"
        className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Submit an Appeal
      </Link>
    </div>
  );
}
