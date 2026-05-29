import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BannedPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-7xl">🚫</div>
      <h1 className="mb-3 text-4xl font-bold">Account Banned</h1>
      <div className="mb-8 w-full rounded-2xl border border-red-200/80 bg-red-50/50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-zinc-700 dark:text-zinc-300">
          Your account has been permanently banned from Last Peace of Art. You are no longer allowed to access this platform.
        </p>
      </div>
      <p className="mb-6 text-sm text-zinc-500">
        If you believe this was a mistake, please contact the administrator.
      </p>
      <Link
        href="mailto:support@lastpeace.art"
        className="rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Contact Support
      </Link>
    </div>
  );
}
