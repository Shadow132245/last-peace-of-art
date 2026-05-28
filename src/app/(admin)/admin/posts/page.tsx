import { prisma } from "@/lib/db";
import { DeleteButton } from "../delete-button";
import { AdminPageHeader, AdminTable, AdminTableHead, AdminTableBody, AdminTableRow, AdminCell, AdminEmpty } from "@/components/ui/admin-page";
import { AdminPublishToggle } from "@/components/ui/admin-publish-toggle";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeader title="Posts" />
      <AdminTable>
        <AdminTableHead>
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {posts.map((post, i) => (
            <AdminTableRow key={post.id} index={i}>
              <AdminCell className="max-w-xs truncate font-medium">{post.title}</AdminCell>
              <AdminCell className="text-zinc-500">{post.user.name}</AdminCell>
              <AdminCell>
                {post.published ? (
                  <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Accepted</span>
                ) : (
                  <AdminPublishToggle entityType="posts" entityId={post.id} published={post.published} />
                )}
              </AdminCell>
              <AdminCell className="text-zinc-500">{post.views}</AdminCell>
              <AdminCell className="text-zinc-500">{post.createdAt.toLocaleDateString()}</AdminCell>
              <AdminCell>
                <DeleteButton url={`/api/admin/posts/${post.id}`} />
              </AdminCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
      {posts.length === 0 && <AdminEmpty message="No posts yet." />}
    </div>
  );
}
