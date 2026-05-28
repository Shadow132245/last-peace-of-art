import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/ui/markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { user: { select: { name: true } } },
  });

  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{post.user.name}</span>
        <span>{post.createdAt.toLocaleDateString()}</span>
      </div>
      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{tag}</span>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Markdown content={post.content} />
      </div>
    </article>
  );
}
