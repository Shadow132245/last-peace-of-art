import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { TogglePublish } from "@/components/ui/toggle-publish";
import { FadeInView } from "@/components/ui/fade-in-view";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
import { getServerT } from "@/lib/server-i18n";

export default async function ForumDashboardPage() {
  const { t } = await getServerT();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const threads = await prisma.thread.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FadeInView>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("dashboard.myDiscussions")}</h1>
          <Link
            href="/dashboard/forum/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {t("dashboard.newThreadBtn")}
          </Link>
        </div>
      </FadeInView>

      {threads.length === 0 ? (
        <FadeInView><p className="text-zinc-500 dark:text-zinc-400">{t("dashboard.noDiscussions")}</p></FadeInView>
      ) : (
        <StaggerList className="grid gap-4">
          {threads.map((thread) => (
            <StaggerItem key={thread.id}>
              <div className="rounded-xl border border-zinc-200 p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
                <div className="flex items-center gap-3">
                  <Link href={`/forum/${thread.id}`} className="min-w-0 flex-1">
                    <h3 className="font-semibold">{thread.title}</h3>
                  </Link>
                  <TogglePublish entityType="forum" entityId={thread.id} published={thread.published} />
                </div>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{thread.content}</p>
                <div className="mt-2 text-xs text-zinc-400">{thread.createdAt.toLocaleDateString()}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
