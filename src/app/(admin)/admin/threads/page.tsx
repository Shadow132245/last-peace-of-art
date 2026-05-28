import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import Link from "next/link";

export default async function AdminThreadsPage() {
  const threads = await prisma.thread.findMany({
    include: { user: { select: { name: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Threads</h1>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Comments</th>
              <th className="px-4 py-3 font-medium">Pinned</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {threads.map((thread) => (
              <tr key={thread.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="max-w-xs truncate px-4 py-3 font-medium">
                  <Link href={`/forum/${thread.id}`} className="hover:underline">{thread.title}</Link>
                </td>
                <td className="px-4 py-3 text-zinc-500">{thread.user.name}</td>
                <td className="px-4 py-3 text-zinc-500">{thread._count.comments}</td>
                <td className="px-4 py-3">{thread.pinned ? "📌" : "—"}</td>
                <td className="px-4 py-3 text-zinc-500">{thread.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <DeleteButton url={`/api/admin/threads/${thread.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {threads.length === 0 && <p className="mt-8 text-zinc-500 dark:text-zinc-400">No threads yet.</p>}
    </div>
  );
}
