import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddFriendButton } from "@/components/friends/friend-button";
import { SafeImg, SafeBanner } from "@/components/ui/safe-image";
import { FadeInView } from "@/components/ui/fade-in-view";
import { getServerT } from "@/lib/server-i18n";
import { BadgeDisplay } from "@/components/badges/badge-display";

export const dynamic = "force-dynamic";

async function findUser(username: string) {
  let user = await prisma.user.findUnique({ where: { name: username } });
  if (!user) {
    user = await prisma.user.findFirst({
      where: { name: { mode: "insensitive", equals: username } },
    });
  }
  return user;
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  const user = await findUser(decoded);

  if (!user) {
    const { t } = await getServerT();
    return { title: t("profile.userNotFound") };
  }

  return {
    title: `${user.name} — Profile`,
    description: `${user.name}'s profile on Last Peace of Art.`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { t: pt, locale } = await getServerT();
  const { username } = await params;
  const decoded = decodeURIComponent(username);

  const found = await findUser(decoded);

  if (!found) notFound();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: found.id },
    include: {
      profile: true,
      badges: { include: { badge: true }, orderBy: { order: "asc" } },
      projects: { where: { published: true }, orderBy: { createdAt: "desc" } },
      posts: { where: { published: true }, orderBy: { createdAt: "desc" } },
      threads: {
        where: { published: true },
        include: { _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      comments: {
        include: { thread: { select: { title: true, id: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  const currentSession = await auth.api.getSession({ headers: await headers() });
  const isOwnProfile = currentSession?.user.id === user.id;

  const social = user.profile?.social ? (user.profile.social as Record<string, unknown>) : {};
  const banner = (social.banner as string) ?? null;
  const avatar = user.profile?.avatar ?? user.image;
  const avatarSize = (social.avatarSize as number) ?? 80;
  const bannerHeight = (social.bannerHeight as number) ?? 192;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {banner && (
        <FadeInView>
          <div
            className="mb-6 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
            style={{ height: bannerHeight }}
          >
            <SafeBanner src={banner} alt="Banner" className="h-full w-full object-cover" />
          </div>
        </FadeInView>
      )}

      <FadeInView>
        <div className="mb-8 flex items-start gap-6">
          <div
            className="shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
            style={{ width: avatarSize, height: avatarSize }}
          >
            {avatar ? (
              <SafeImg src={avatar} alt={user.name} className="h-full w-full object-cover" fallback={user.name[0].toUpperCase()} />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl text-zinc-400">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              {(() => {
                const roleStyles: Record<string, string> = {
                  founder: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                  moderator: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
                  premium: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
                  bug_hunter: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                };
                const userRoles = ((user.roles as string[]) ?? []).filter((r) => r !== "user");
                const displayRoles = userRoles.length ? userRoles : (user.role !== "user" ? [user.role] : []);
                return displayRoles.map((r) => (
                  <span key={r} className={`rounded px-2 py-0.5 text-xs font-semibold ${roleStyles[r] ?? ""}`}>{r.toUpperCase()}</span>
                ));
              })()}
              <span className="text-sm text-zinc-400">({user.points} pts - {user.rank})</span>
            </div>
            {user.profile?.bio && (
              <p className="mt-2 text-zinc-500 dark:text-zinc-400">{user.profile.bio}</p>
            )}
            {user.profile && user.profile.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.profile.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800">{skill}</span>
                ))}
              </div>
            )}
            {user.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {user.badges.map((ub) => (
                  <BadgeDisplay key={ub.id} badge={ub.badge} lang={locale} />
                ))}
              </div>
            )}
            {currentSession && !isOwnProfile && (
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/dashboard/messages?userId=${user.id}`}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {pt("profile.sendMessage")}
                </Link>
                <AddFriendButton userId={user.id} />
              </div>
            )}
          </div>
        </div>
      </FadeInView>

      {user.threads.length > 0 && (
        <FadeInView>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{pt("profile.threads").replace("{count}", String(user.threads.length))}</h2>
            <div className="grid gap-3">
              {user.threads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/forum/${thread.id}`}
                  className="rounded-xl border border-zinc-200 p-4 transition-colors hover:border-amber-200 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{thread.pinned && "📌 "}{thread.title}</h3>
                    <span className="text-xs text-zinc-400">{thread._count.comments} {pt("forum.comments")}</span>
                  </div>
                  {thread.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {thread.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] dark:bg-zinc-800">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        </FadeInView>
      )}

      {user.projects.length > 0 && (
        <FadeInView delay={0.1}>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{pt("profile.projects").replace("{count}", String(user.projects.length))}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {user.projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-transparent dark:shadow-none dark:hover:border-zinc-600"
                >
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{project.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </FadeInView>
      )}

      {user.posts.length > 0 && (
        <FadeInView delay={0.2}>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{pt("profile.posts").replace("{count}", String(user.posts.length))}</h2>
            <div className="grid gap-4">
              {user.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <h3 className="font-semibold">{post.title}</h3>
                  {post.excerpt && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          </section>
        </FadeInView>
      )}

      {user.comments.length > 0 && (
        <FadeInView delay={0.3}>
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{pt("profile.recentComments")}</h2>
            <div className="grid gap-3">
              {user.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                  {comment.thread && (
                    <Link href={`/forum/${comment.thread.id}`} className="mt-1 inline-block text-xs text-amber-600 hover:underline dark:text-amber-400">
                      {pt("profile.onComment").replace("{title}", comment.thread.title)}
                    </Link>
                  )}
                  <p className="mt-1 text-xs text-zinc-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeInView>
      )}

      {!user.threads.length && !user.projects.length && !user.posts.length && !user.comments.length && (
        <FadeInView>
          <p className="text-zinc-400">{pt("profile.noContent")}</p>
        </FadeInView>
      )}
    </div>
  );
}
