import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Posts</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="max-w-xs truncate px-4 py-3 font-medium">{post.title}</td>
                <td className="px-4 py-3 text-zinc-500">{post.user.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500">{post.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <DeleteButton url={`/api/admin/posts/${post.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && <p className="mt-8 text-zinc-500 dark:text-zinc-400">No posts yet.</p>}
    </div>
  );
}
