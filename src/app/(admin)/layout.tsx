import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl gap-8 px-4 py-8">
      <aside className="hidden w-48 shrink-0 md:block">
        <nav className="flex flex-col gap-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">Admin</p>
          <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Overview</Link>
          <Link href="/admin/users" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">Users</Link>
          <Link href="/dashboard" className="mt-4 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">&larr; Back to Dashboard</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
