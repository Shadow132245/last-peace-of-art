import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [userCount, projectCount, postCount, threadCount, commentCount] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.post.count(),
    prisma.thread.count(),
    prisma.comment.count(),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Admin Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Users" value={userCount} />
        <StatCard label="Projects" value={projectCount} />
        <StatCard label="Posts" value={postCount} />
        <StatCard label="Threads" value={threadCount} />
        <StatCard label="Comments" value={commentCount} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
