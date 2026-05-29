import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { TogglePublish } from "@/components/ui/toggle-publish";
import { FadeInView } from "@/components/ui/fade-in-view";
import { StaggerList, StaggerItem } from "@/components/ui/stagger-list";
import { getServerT } from "@/lib/server-i18n";

export default async function PostsPage() {
  const { t } = await getServerT();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <FadeInView>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("dashboard.myPosts")}</h1>
          <Link
            href="/dashboard/posts/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {t("dashboard.newPostBtn")}
          </Link>
        </div>
      </FadeInView>

      {posts.length === 0 ? (
        <FadeInView><p className="text-zinc-500 dark:text-zinc-400">{t("dashboard.noPosts")}</p></FadeInView>
      ) : (
        <StaggerList className="grid gap-4">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate font-semibold">{post.title}</h3>
                      <TogglePublish entityType="posts" entityId={post.id} published={post.published} />
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">{post.excerpt}</p>
                    <p className="mt-1 text-xs text-zinc-400">{post.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
