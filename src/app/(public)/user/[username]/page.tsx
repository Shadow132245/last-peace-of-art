import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findFirst({ where: { name: username } });

  if (!user) return { title: "User Not Found" };

  return {
    title: `${user.name} — Profile`,
    description: `${user.name}'s profile on Last Peace of Art.`,
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: { name: username },
    include: {
      profile: true,
      projects: { where: { published: true }, orderBy: { createdAt: "desc" } },
      posts: { where: { published: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{user.name}</h1>
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
      </div>

      {user.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Projects ({user.projects.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {user.projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {user.posts.length > 0 && (
        <section>
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

      {!user.projects.length && !user.posts.length && (
        <p className="text-zinc-400">This user hasn&apos;t published anything yet.</p>
      )}
    </div>
  );
}
