import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddFriendButton } from "@/components/friends/friend-button";

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
  const user = await findUser(username);

  if (!user) return { title: "User Not Found" };

  return {
    title: `${user.name} — Profile`,
    description: `${user.name}'s profile on Last Peace of Art.`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const found = await findUser(username);

  if (!found) notFound();

  const user = await prisma.user.findUnique({
    where: { id: found.id },
    include: {
      profile: true,
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
        <div
          className="mb-6 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
          style={{ height: bannerHeight }}
        >
          <img src={banner} alt="Banner" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mb-8 flex items-start gap-6">
        <div
          className="shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
          style={{ width: avatarSize, height: avatarSize }}
        >
          {avatar ? (
            <img src={avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-zinc-400">
              {user.name[0].toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.role === "founder" && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">FOUNDER</span>}
            {user.role === "admin" && <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">ADMIN</span>}
            {user.role === "bug_hunter" && <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">BUG HUNTER</span>}
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
          {currentSession && !isOwnProfile && (
            <div className="mt-4 flex gap-3">
              <Link
                href={`/dashboard/messages?userId=${user.id}`}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Send Message
              </Link>
              <AddFriendButton userId={user.id} />
            </div>
          )}
        </div>
      </div>

      {user.threads.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Threads ({user.threads.length})</h2>
          <div className="grid gap-3">
            {user.threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${thread.id}`}
                className="rounded-xl border border-zinc-200 p-4 transition-colors hover:border-amber-200 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{thread.pinned && "📌 "}{thread.title}</h3>
                  <span className="text-xs text-zinc-400">{thread._count.comments} comments</span>
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
      )}

      {user.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Projects ({user.projects.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {user.projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-transparent dark:shadow-none">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {user.posts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Posts ({user.posts.length})</h2>
          <div className="grid gap-4">
            {user.posts.map((post) => (
              <div key={post.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="font-semibold">{post.title}</h3>
                {post.excerpt && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {user.comments.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Recent Comments</h2>
          <div className="grid gap-3">
            {user.comments.map((comment) => (
              <div key={comment.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                {comment.thread && (
                  <Link href={`/forum/${comment.thread.id}`} className="mt-1 inline-block text-xs text-amber-600 hover:underline dark:text-amber-400">
                    on {comment.thread.title}
                  </Link>
                )}
                <p className="mt-1 text-xs text-zinc-400">{new Date(comment.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!user.threads.length && !user.projects.length && !user.posts.length && !user.comments.length && (
        <p className="text-zinc-400">This user hasn&apos;t published anything yet.</p>
      )}
    </div>
  );
}
