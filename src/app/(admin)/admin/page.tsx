import { prisma } from "@/lib/db";
import { OverviewCards } from "./overview-cards";

export default async function AdminOverviewPage() {
  const [userCount, projectCount, postCount, threadCount, commentCount, reportCount] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.post.count(),
    prisma.thread.count(),
    prisma.comment.count(),
    prisma.report.count({ where: { resolved: false } }),
  ]);

  const stats = [
    { label: "Users", value: userCount, icon: "👥", color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Projects", value: projectCount, icon: "📁", color: "from-violet-500 to-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
    { label: "Posts", value: postCount, icon: "📝", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Threads", value: threadCount, icon: "💬", color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Comments", value: commentCount, icon: "🗣️", color: "from-rose-500 to-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
    { label: "Open Reports", value: reportCount, icon: "🚩", color: "from-red-500 to-red-600", bg: reportCount > 0 ? "bg-red-50 dark:bg-red-950/30" : "bg-zinc-50 dark:bg-zinc-900/50" },
  ];

  return <OverviewCards stats={stats} />;
}
