import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerT } from "@/lib/server-i18n";

export default async function DashboardPage() {
  const { t } = await getServerT();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [projectCount, postCount, threadCount, messageCount, friendCount] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id } }),
    prisma.post.count({ where: { userId: session.user.id } }),
    prisma.thread.count({ where: { userId: session.user.id } }),
    prisma.message.count({ where: { receiverId: session.user.id, read: false } }),
    prisma.friendRequest.count({
      where: {
        OR: [
          { senderId: session.user.id, status: "accepted" },
          { receiverId: session.user.id, status: "accepted" },
        ],
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
          {t("dashboard.welcomeBack").replace("{name}", session.user.name)}
        </p>
      </div>

      <div className="mb-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <DashboardCard title={t("dashboard.projects")} count={projectCount} href="/dashboard/projects" />
        <DashboardCard title={t("dashboard.posts")} count={postCount} href="/dashboard/posts" />
        <DashboardCard title={t("dashboard.discussions")} count={threadCount} href="/dashboard/forum" />
        <DashboardCard title={t("dashboard.messages")} count={messageCount} href="/dashboard/messages" />
        <DashboardCard title={t("dashboard.friends")} count={friendCount} href="/dashboard/friends" />
      </div>

      <h2 className="mb-5 text-xl font-semibold">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ActionCard title={t("dashboard.newProject")} desc={t("dashboard.newProjectDesc")} href="/dashboard/projects/new" />
        <ActionCard title={t("dashboard.newPost")} desc={t("dashboard.newPostDesc")} href="/dashboard/posts/new" />
        <ActionCard title={t("dashboard.editProfileLabel")} desc={t("dashboard.editProfileDesc")} href="/dashboard/profile" />
        <ActionCard title={t("dashboard.settings")} desc={t("dashboard.settingsDesc")} href="/dashboard/settings" />
        <ActionCard title={t("dashboard.supportTickets")} desc={t("dashboard.supportTicketsDesc")} href="/tickets" />
        <ActionCard title={t("dashboard.applyForStaff")} desc={t("dashboard.applyForStaffDesc")} href="/apply" />
      </div>
    </div>
  );
}

function DashboardCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <p className="text-4xl font-bold tracking-tight">{count}</p>
      <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
    </Link>
  );
}

function ActionCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <h3 className="font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{desc}</p>
    </Link>
  );
}
