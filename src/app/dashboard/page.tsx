import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FadeInView } from "@/components/ui/fade-in-view";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <FadeInView>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {t("dashboard.welcomeBack").replace("{name}", session.user.name)}
          </p>
        </div>
      </FadeInView>

      <StaggerList className="grid gap-6 sm:grid-cols-3">
        <StaggerItem><DashboardCard title={t("dashboard.projects")} count={projectCount} href="/dashboard/projects" /></StaggerItem>
        <StaggerItem><DashboardCard title={t("dashboard.posts")} count={postCount} href="/dashboard/posts" /></StaggerItem>
        <StaggerItem><DashboardCard title={t("dashboard.discussions")} count={threadCount} href="/dashboard/forum" /></StaggerItem>
        <StaggerItem><DashboardCard title={t("dashboard.messages")} count={messageCount} href="/dashboard/messages" /></StaggerItem>
        <StaggerItem><DashboardCard title={t("dashboard.friends")} count={friendCount} href="/dashboard/friends" /></StaggerItem>
      </StaggerList>

      <FadeInView delay={0.2}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/projects/new"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.newProject")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.newProjectDesc")}</p>
          </Link>
          <Link
            href="/dashboard/posts/new"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.newPost")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.newPostDesc")}</p>
          </Link>
          <Link
            href="/dashboard/profile"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.editProfile")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.editProfileDesc")}</p>
          </Link>
          <Link
            href="/dashboard/settings"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.settings")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.settingsDesc")}</p>
          </Link>
          <Link
            href="/dashboard/messages"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.messages")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.messagesDesc")}</p>
          </Link>
          <Link
            href="/dashboard/friends"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.friends")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.friendsDesc")}</p>
          </Link>
          <Link
            href="/tickets"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.supportTickets")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.supportTicketsDesc")}</p>
          </Link>
          <Link
            href="/apply"
            className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <h3 className="font-semibold">{t("dashboard.applyForStaff")}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t("dashboard.applyForStaffDesc")}</p>
          </Link>
        </div>
      </FadeInView>
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
