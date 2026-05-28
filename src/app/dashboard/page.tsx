import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [projectCount, postCount, threadCount] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id } }),
    prisma.post.count({ where: { userId: session.user.id } }),
    prisma.thread.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <DashboardCard title="Projects" count={projectCount} href="/dashboard/projects" />
        <DashboardCard title="Posts" count={postCount} href="/dashboard/posts" />
        <DashboardCard title="Discussions" count={threadCount} href="/dashboard/forum" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/projects/new"
          className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h3 className="font-semibold">New Project</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Upload and showcase your work</p>
        </Link>
        <Link
          href="/dashboard/posts/new"
          className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h3 className="font-semibold">New Post</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Write about any topic</p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h3 className="font-semibold">Edit Profile</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Photo, banner, bio &amp; skills</p>
        </Link>
        <Link
          href="/dashboard/settings"
          className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          <h3 className="font-semibold">Settings</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your account</p>
        </Link>
      </div>
    </div>
  );
}

function DashboardCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <p className="text-3xl font-bold">{count}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
    </Link>
  );
}
